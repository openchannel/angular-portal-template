import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    AuthenticationService,
    DeveloperAccountTypeModel,
    DeveloperAccountTypesService,
    InviteDeveloperModel,
    InviteUserService,
    NativeLoginService,
} from '@openchannel/angular-common-services';
import { Subject } from 'rxjs';
import { filter, finalize, map, takeUntil } from 'rxjs/operators';
import { merge } from 'lodash';
import { LogOutService } from '@core/services/logout-service/log-out.service';
import { AppFormField, OcEditUserFormConfig, OcEditUserResult } from '@openchannel/angular-common-components';
import { OcEditUserTypeService } from '@core/services/user-type-service/user-type.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-invited-signup',
    templateUrl: './invited-signup.component.html',
    styleUrls: ['./invited-signup.component.scss'],
})
export class InvitedSignupComponent implements OnInit, OnDestroy {
    private readonly formConfigsWithoutTypeData: OcEditUserFormConfig[] = [
        {
            name: 'Default',
            account: {
                type: 'default',
                typeData: null,
                includeFields: ['name', 'email', 'username', 'customData.company'],
            },
        },
        {
            name: 'My custom 123321',
            account: {
                type: 'custom-account-type',
                typeData: null,
                includeFields: ['name', 'username', 'email', 'customData.about-me'],
            },
        },
        {
            name: 'Not existing type',
            account: {
                type: 'not-existing-type',
                typeData: null,
                includeFields: ['name', 'username', 'email'],
            },
        },
    ];
    private readonly formConfigsWithoutTypeDataDefault: OcEditUserFormConfig[] = [
        {
            name: 'default',
            account: { type: 'default', typeData: null, includeFields: ['name', 'email'] },
        },
    ];
    private readonly fieldsIdsToDisable = ['email', 'customData.company'];

    developerInviteData: InviteDeveloperModel;
    isExpired = false;
    formConfigs: OcEditUserFormConfig[];
    formConfigsLoading = true;
    showSignupFeedbackPage = false;

    inProcess = false;

    private destroy$: Subject<void> = new Subject<void>();
    private loaderBar: LoadingBarState;

    // prettier-ignore
    constructor( // NOSONAR
        private activeRouter: ActivatedRoute,
        private router: Router,
        private inviteUserService: InviteUserService,
        private typeService: DeveloperAccountTypesService,
        private nativeLoginService: NativeLoginService,
        private logOutService: LogOutService,
        private authService: AuthenticationService,
        private loadingBarService: LoadingBarService,
        private ocEditUserTypeService: OcEditUserTypeService,
        private toaster: ToastrService,
    ) {}

    ngOnInit(): void {
        this.loaderBar = this.loadingBarService.useRef();
        this.checkSSO();
        this.getInviteDetails();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.loaderBar.complete();
    }

    getFormConfigs(developerAccountTypeId: string): void {
        if (developerAccountTypeId) {
            // Make form config according to type passed from invite data
            this.typeService
                .getAccountType(developerAccountTypeId)
                .pipe(
                    map(type => this.mapDeveloperAccountTypeToFormConfigs(type)),
                    map(formConfigs => this.getFormConfigsWithConfiguredFields(formConfigs)),
                    finalize(() => {
                        this.loaderBar.complete();
                        this.formConfigsLoading = false;
                    }),
                    takeUntil(this.destroy$),
                )
                .subscribe(formConfigs => {
                    this.formConfigs = formConfigs;
                });
        } else {
            // Make form config according to config property (formConfigsWithoutTypeData or formConfigsWithoutTypeDataDefault)
            this.ocEditUserTypeService
                .injectTypeDataIntoConfigs(this.formConfigsWithoutTypeData || this.formConfigsWithoutTypeDataDefault, false, true)
                .pipe(
                    map(formConfigs => this.getFormConfigsWithConfiguredFields(formConfigs)),
                    finalize(() => {
                        this.loaderBar.complete();
                        this.formConfigsLoading = false;
                    }),
                    takeUntil(this.destroy$),
                )
                .subscribe(formConfigs => {
                    this.formConfigs = formConfigs;
                });
        }
    }

    // Get invitation details
    getInviteDetails(): void {
        this.loaderBar.start();
        const userToken = this.activeRouter.snapshot.params.token;

        if (userToken) {
            this.inviteUserService
                .getDeveloperInviteInfoByToken(userToken)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    response => {
                        this.developerInviteData = response;
                        if (new Date(this.developerInviteData.expireDate) < new Date()) {
                            this.isExpired = true;
                            this.loaderBar.complete();
                        } else {
                            this.getFormConfigs(this.developerInviteData.type);
                        }
                    },
                    () => {
                        this.toaster.error('Invite has been deleted');
                        this.loaderBar.complete();
                        this.router.navigate(['']).then();
                    },
                );
        } else {
            this.loaderBar.complete();
            this.router.navigate(['']).then();
        }
    }

    // Register invited developer and delete invite on success
    submitForm(developerData: OcEditUserResult): void {
        if (developerData && !this.inProcess) {
            this.loaderBar.start();
            this.inProcess = true;
            const request = merge(this.developerInviteData, developerData.account);

            this.nativeLoginService
                .signupByInvite({
                    userCustomData: request,
                    inviteToken: this.developerInviteData.token,
                })
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    () => {
                        this.logOutService
                            .logOut()
                            .pipe(
                                finalize(() => {
                                    this.inProcess = false;
                                    this.showSignupFeedbackPage = true;
                                    this.loaderBar.complete();
                                }),
                                takeUntil(this.destroy$),
                            )
                            .subscribe();
                    },
                    () => {
                        this.inProcess = false;
                        this.loaderBar.complete();
                    },
                );
        }
    }

    private getConfiguredFields(fields: AppFormField[]): AppFormField[] {
        return fields?.map(field => this.disableField(this.injectInviteDataToField(field)));
    }

    private injectInviteDataToField(field: AppFormField): AppFormField {
        if (!field.id.includes('customData') && this.developerInviteData[field.id]) {
            field.defaultValue = this.developerInviteData[field.id];
        } else if (field.id.includes('company')) {
            field.defaultValue = this.developerInviteData.customData?.company;
        }

        return field;
    }

    private disableField(field: AppFormField): AppFormField {
        if (this.fieldsIdsToDisable.includes(field.id)) {
            field.attributes.disabled = true;
        }

        return field;
    }

    private getFormConfigsWithConfiguredFields(formConfigs: OcEditUserFormConfig[]): OcEditUserFormConfig[] {
        return formConfigs.map(item => {
            return {
                ...item,
                account: {
                    ...item.account,
                    typeData: {
                        ...item.account.typeData,
                        fields: this.getConfiguredFields(item.account.typeData.fields),
                    },
                },
            };
        });
    }

    private mapDeveloperAccountTypeToFormConfigs(developerAccountType: DeveloperAccountTypeModel): OcEditUserFormConfig[] {
        return [
            {
                name: '',
                account: {
                    type: developerAccountType.developerAccountTypeId,
                    typeData: { ...developerAccountType },
                    includeFields: developerAccountType.fields?.map(field => field.id),
                },
            },
        ];
    }

    private checkSSO(): void {
        this.authService
            .getAuthConfig()
            .pipe(
                map(value => !!value),
                filter(isSSO => isSSO),
                takeUntil(this.destroy$),
            )
            .subscribe(() => {
                this.router.navigate(['login']).then();
            });
    }
}
