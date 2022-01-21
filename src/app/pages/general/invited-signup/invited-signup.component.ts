import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    AuthenticationService,
    DeveloperAccountTypesService,
    InviteDeveloperModel,
    InviteUserService,
    NativeLoginService,
} from '@openchannel/angular-common-services';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, finalize, map, takeUntil } from 'rxjs/operators';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { merge } from 'lodash';
import { LogOutService } from '@core/services/logout-service/log-out.service';
import { AppFormField } from '@openchannel/angular-common-components';

@Component({
    selector: 'app-invited-signup',
    templateUrl: './invited-signup.component.html',
    styleUrls: ['./invited-signup.component.scss'],
})
export class InvitedSignupComponent implements OnInit, OnDestroy {
    developerInviteData: InviteDeveloperModel;
    isExpired = false;
    formConfig: any;
    formResultData: any;
    inProcess = false;
    termsControl = new FormControl(false, Validators.requiredTrue);

    private signUpGroup: FormGroup;

    private destroy$: Subject<void> = new Subject<void>();

    private loader: LoadingBarState;

    private passwordField = {
        id: 'password',
        label: 'Password',
        type: 'password',
        attributes: { required: true },
    };

    constructor(
        private activeRouter: ActivatedRoute,
        private router: Router,
        private inviteUserService: InviteUserService,
        private typeService: DeveloperAccountTypesService,
        private nativeLoginService: NativeLoginService,
        private logOutService: LogOutService,
        private loadingBar: LoadingBarService,
        private authService: AuthenticationService,
    ) {}

    ngOnInit(): void {
        this.loader = this.loadingBar.useRef();
        this.loader.start();
        this.checkSSO();
        this.getInviteDetails();
    }

    ngOnDestroy(): void {
        if (this.loader) {
            this.loader.stop();
        }
    }

    // making form config according to form type
    getFormType(type: string): void {
        if (type) {
            this.typeService
                .getAccountType(type)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    resp => {
                        this.formConfig = {
                            fields: this.mapDataToField(resp.fields),
                        };
                        this.loader.stop();
                    },
                    () => this.loader.stop(),
                );
        } else {
            this.formConfig = {
                fields: [
                    {
                        id: 'name',
                        label: 'Name',
                        type: 'text',
                        attributes: { required: false },
                        defaultValue: this.developerInviteData?.name,
                    },
                    {
                        id: 'email',
                        label: 'Email',
                        type: 'emailAddress',
                        attributes: { required: true },
                        defaultValue: this.developerInviteData?.email,
                    },
                    this.passwordField,
                ],
            };
            this.loader.stop();
        }
    }

    // getting invitation details
    getInviteDetails(): void {
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
                            this.loader.stop();
                        } else {
                            this.getFormType(this.developerInviteData.type);
                        }
                    },
                    () => {
                        this.router.navigate(['']).then();
                    },
                );
        } else {
            this.router.navigate(['']).then();
        }
    }

    mapDataToField(fields: AppFormField[]): AppFormField[] {
        const mappedFields = fields.map(field => {
            if (!field.id.includes('customData') && this.developerInviteData[field.id]) {
                field.defaultValue = this.developerInviteData[field.id];
            } else if (field.id.includes('company')) {
                field.defaultValue = this.developerInviteData.customData?.company;
            }
            return field;
        });
        mappedFields.push(this.passwordField);

        return mappedFields;
    }

    // getting generated form group for disabling special fields
    setCreatedForm(form: FormGroup): void {
        form.get('email').disable();
        const companyControlKey = Object.keys(form.controls).find(key => key.includes('company'));
        if (companyControlKey) {
            form.controls[companyControlKey].disable();
        }
        this.signUpGroup = form;
        // add terms control into signup form
        this.signUpGroup.addControl('terms', this.termsControl);
    }

    // register invited user and deleting invite on success
    submitForm(): void {
        this.signUpGroup.markAllAsTouched();
        if (this.signUpGroup.valid && !this.inProcess) {
            this.inProcess = true;

            const request = merge(this.developerInviteData, this.formResultData);
            delete request.terms;

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
                                    this.router.navigate(['signup'], { state: { showSignupFeedbackPage: true } }).then();
                                }),
                                takeUntil(this.destroy$),
                            )
                            .subscribe();
                    },
                    () => {
                        this.inProcess = false;
                    },
                );
        }
    }

    setFormData(resultData: any): void {
        this.formResultData = resultData;
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
