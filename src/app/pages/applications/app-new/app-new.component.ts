import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    AppsService,
    AppStatusValue,
    AppTypeService,
    AppVersionResponse,
    AppVersionService,
    ChartService,
    CreateAppModel,
    TitleService,
    TypeModel,
    UpdateAppVersionModel,
} from '@openchannel/angular-common-services';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConfirmationModalComponent } from '@shared/modals/app-confirmation-modal/app-confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AppTypeFieldModel, AppTypeModel, FullAppData } from '@openchannel/angular-common-components';
import { get } from 'lodash';

@Component({
    selector: 'app-app-new',
    templateUrl: './app-new.component.html',
    styleUrls: ['./app-new.component.scss'],
})
export class AppNewComponent implements OnInit, OnDestroy {
    currentAppsTypesItems: AppTypeModel[] = [];

    appTypeFormGroup: FormGroup;
    appFields: TypeModel<AppTypeFieldModel>;
    savedFields: TypeModel<AppTypeFieldModel>;
    generatedForm: FormGroup | FormArray;

    draftSaveInProcess = false;
    submitInProcess = false;

    pageTitle: 'Create app' | 'Edit app';
    pageType: string;
    appId: string;
    appVersion: number;
    parentApp: FullAppData;
    setFormErrors = false;
    disableOutgo = false;
    // chart variables
    currentStep = 1;

    private appTypePageNumber = 1;
    private appTypePageLimit = 100;
    // data from the form component
    private appFormData: any;
    private destroy$: Subject<void> = new Subject();
    private loader: LoadingBarState;

    private readonly compatibleTypesCollections = [
        ['richText', 'longText', 'text', 'email', 'url'],
        ['emailAddress', 'websiteUrl'],
        ['singleImage', 'singleFile'],
        ['multiImage', 'multiFile'],
    ];

    constructor(
        private router: Router,
        private appsService: AppsService,
        private fb: FormBuilder,
        private appVersionService: AppVersionService,
        private appTypeService: AppTypeService,
        private activeRoute: ActivatedRoute,
        private modal: NgbModal,
        private loadingBar: LoadingBarService,
        private titleService: TitleService,
        private toaster: ToastrService,
    ) {}

    ngOnInit(): void {
        this.loader = this.loadingBar.useRef();
        this.pageType = this.router.url.split('/')[2];
        this.pageTitle = this.getPageTitleByPage(this.pageType);

        this.initAppDataGroup();
        this.getAllAppTypes();

        if (this.pageType === 'create') {
            this.addListenerAppTypeField();
        } else {
            this.getAppData();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onCancelClick(): void {
        this.router.navigate(['manage']).then();
    }

    initAppDataGroup(): void {
        this.appTypeFormGroup = this.fb.group({
            type: ['', Validators.required],
        });
    }

    // getting app data from the form on form changing
    onFormDataUpdated(fields: any): void {
        this.appFormData = fields;
    }

    openConfirmationModal(): void {
        if (this.generatedForm) {
            this.generatedForm.markAllAsTouched();
            if (!(this.generatedForm.invalid || this.submitInProcess || this.draftSaveInProcess)) {
                const modalRef = this.modal.open(AppConfirmationModalComponent, { size: 'md' });

                modalRef.componentInstance.modalTitle = 'Submit app';
                modalRef.componentInstance.modalText = 'Submit this app to the marketplace now?';
                modalRef.componentInstance.type = 'submission';
                modalRef.componentInstance.buttonText = 'Yes, submit it';
                modalRef.componentInstance.cancelButtonText = 'Save as draft';
                if (this.hasPageAndAppStatus('update', 'pending')) {
                    modalRef.componentInstance.showCancel = false;
                }
                modalRef.result.then(
                    res => {
                        if (res && res === 'success') {
                            this.saveApp('submit');
                        } else if (res && res === 'draft') {
                            this.saveApp('draft');
                        }
                    },
                    () => {},
                );
            }
        }
    }

    // saving app to the server
    saveApp(saveType: 'submit' | 'draft'): void {
        if (
            !this.draftSaveInProcess &&
            !this.submitInProcess &&
            ((saveType === 'draft' && this.isValidAppName()) || (saveType === 'submit' && this.generatedForm?.valid))
        ) {
            this.disableOutgo = true;
            this.draftSaveInProcess = saveType === 'draft';
            this.submitInProcess = saveType === 'submit';

            if (this.pageType === 'create') {
                this.appsService
                    .createApp(this.buildDataForCreate(this.appFormData))
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(
                        appResponse => {
                            if (appResponse) {
                                if (saveType === 'submit') {
                                    this.publishApp(appResponse.appId, appResponse.version);
                                } else {
                                    this.draftSaveInProcess = false;
                                    this.router.navigate(['/manage']).then(() => {
                                        this.showSuccessToaster(saveType);
                                    });
                                }
                            } else {
                                this.draftSaveInProcess = false;
                                this.submitInProcess = false;
                            }
                        },
                        () => {
                            this.draftSaveInProcess = false;
                            this.submitInProcess = false;
                        },
                    );
            } else {
                this.appVersionService
                    .updateAppByVersion(this.appId, this.appVersion, this.buildDataForUpdate(this.appFormData))
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(
                        response => {
                            if (response) {
                                if (saveType === 'submit' && this.parentApp.status.value !== 'pending') {
                                    this.publishApp(response.appId, response.version);
                                } else {
                                    this.draftSaveInProcess = false;
                                    this.showSuccessToaster(saveType);
                                    this.router.navigate(['/manage']).then();
                                }
                            } else {
                                this.draftSaveInProcess = false;
                                this.submitInProcess = false;
                            }
                        },
                        () => {
                            this.draftSaveInProcess = false;
                            this.submitInProcess = false;
                        },
                    );
            }
        }
    }

    publishApp(appId: string, appVersion: number): void {
        this.appsService
            .publishAppByVersion(appId, {
                version: appVersion,
                autoApprove: false,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                () => {
                    this.submitInProcess = false;
                    this.showSuccessToaster('submit');
                    this.router.navigate(['/manage']).then();
                },
                () => {
                    this.submitInProcess = false;
                },
            );
    }

    buildDataForCreate(fields: any): CreateAppModel {
        return {
            ...fields,
            name: fields.name || null,
            type: this.appTypeFormGroup.value?.type?.appTypeId || null,
        };
    }

    buildDataForUpdate(fields: any): UpdateAppVersionModel {
        return {
            customData: null, // required model field.
            ...this.buildDataForCreate(fields),
            approvalRequired: true,
        };
    }

    getAppData(): void {
        this.appId = this.activeRoute.snapshot.paramMap.get('appId');
        this.appVersion = Number(this.activeRoute.snapshot.paramMap.get('versionId'));

        this.loader.start();

        this.appVersionService
            .getAppByVersion(this.appId, this.appVersion)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                appVersion => {
                    if (appVersion) {
                        this.parentApp = appVersion as FullAppData;
                        this.titleService.setSpecialTitle(this.parentApp.name);

                        this.appTypeService
                            .getOneAppType(this.parentApp.type)
                            .pipe(takeUntil(this.destroy$))
                            .subscribe(
                                appType => {
                                    this.appTypeFormGroup.get('type').setValue(appType);
                                    this.addListenerAppTypeField();

                                    this.appFields = {
                                        fields: this.mapFields(appType.fields, appVersion),
                                    };

                                    this.checkDataValidityRedirect();
                                    this.loader.complete();
                                },
                                () => {
                                    this.loader.complete();
                                    this.router.navigate(['/manage']).then();
                                },
                            );
                    } else {
                        this.loader.complete();
                        this.router.navigate(['/manage']).then();
                    }
                },
                () => {
                    this.loader.complete();
                    this.router.navigate(['/manage']).then();
                },
            );
    }

    setGeneratedForm(form: FormGroup | FormArray): void {
        this.generatedForm = form;
        if (this.setFormErrors) {
            this.generatedForm.markAllAsTouched();
        }
    }

    hasPageAndAppStatus(pageType: 'update' | 'create', appStatus: AppStatusValue): boolean {
        return this.pageType === pageType && this.parentApp?.status?.value === appStatus;
    }

    hasParentAppStatus(appStatus: AppStatusValue): boolean {
        return this.parentApp?.parent?.status?.value === appStatus;
    }

    isOutgoAllowed(): boolean {
        if (this.disableOutgo) {
            return true;
        }
        return !(this.generatedForm && this.generatedForm.dirty);
    }

    goToAppManagePage(): void {
        this.router.navigate(['/manage']).then();
    }

    private addListenerAppTypeField(): void {
        this.appTypeFormGroup
            .get('type')
            .valueChanges.pipe(debounceTime(200), distinctUntilChanged())
            .subscribe(
                (type: AppTypeModel) => {
                    if (this.appFields) {
                        this.savedFields = this.appFields;
                        this.appFields = null;
                    }
                    if (type) {
                        this.getFieldsByAppType(type.appTypeId);
                    }
                },
                () => {
                    this.appFields = null;
                },
            );
    }

    private getAllAppTypes(): void {
        this.loader.start();
        this.appTypeService
            .getAppTypes(this.appTypePageNumber, this.appTypePageLimit)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                appTypesResponse => {
                    if (appTypesResponse?.list) {
                        this.currentAppsTypesItems = appTypesResponse.list;
                        if (this.pageType === 'create' && this.currentAppsTypesItems && this.currentAppsTypesItems.length > 0) {
                            this.appTypeFormGroup.get('type').setValue(this.currentAppsTypesItems[0]);
                        }
                        this.loader.complete();
                    } else {
                        this.loader.complete();
                        this.router.navigate(['/manage']).then();
                        this.currentAppsTypesItems = [];
                    }
                },
                () => {
                    this.currentAppsTypesItems = [];
                    this.loader.complete();
                    this.router.navigate(['/manage']).then();
                },
            );
    }

    private getFieldsByAppType(appType: string): void {
        this.appTypeService
            .getOneAppType(appType)
            .pipe(takeUntil(this.destroy$))
            .subscribe((appTypeResponse: any) => {
                if (appTypeResponse) {
                    this.mergeWithSaveData(this.appFormData, this.mapFields(appTypeResponse.fields));
                }
            });
    }

    private mergeWithSaveData(savedData: any, newFields: AppTypeFieldModel[]): void {
        if (savedData && this.savedFields) {
            this.mergeField(this.savedFields.fields, newFields, savedData);
        }
        this.appFields = {
            fields: newFields,
        };
    }

    private mergeField(originalFields: AppTypeFieldModel[], newFields: AppTypeFieldModel[], savedData: any): void {
        if (savedData) {
            originalFields.forEach(originalField => {
                const newField = newFields.find(
                    value => value.id === originalField.id && this.testCompatible(value.type, originalField.type),
                );
                if (newField && savedData[newField.id]) {
                    if (newField.fields && newField.fields.length > 0) {
                        this.mergeField(originalField.fields, newField.fields, savedData[newField.id]);
                    } else {
                        newField.defaultValue = savedData[newField.id];
                    }
                }
            });
        }
    }

    private testCompatible(oldType: string, newType: string): boolean {
        if (oldType === newType) {
            return true;
        }

        for (const compatibleTypes of this.compatibleTypesCollections) {
            if (compatibleTypes.filter(type => type === oldType || type === newType).length === 2) {
                return true;
            }
        }

        return false;
    }

    private getPageTitleByPage(currentPage: string): 'Create app' | 'Edit app' {
        if (currentPage === 'create') {
            return 'Create app';
        }
        return 'Edit app';
    }

    private checkDataValidityRedirect(): void {
        this.activeRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(param => {
            if (param.formStatus && param.formStatus === 'invalid') {
                this.setFormErrors = true;
            }
        });
    }

    private isValidAppName(): boolean {
        if (this.generatedForm instanceof FormGroup) {
            const controlName = this.generatedForm.get('name');
            if (controlName) {
                controlName.markAsTouched();
                return controlName.valid;
            }
        }
        for (let i = 0; i < this.generatedForm.controls.length; i++) {
            const nameFormControl = (this.generatedForm.controls[i] as AbstractControl).get('name');
            if (nameFormControl) {
                nameFormControl.markAsTouched();
                if (nameFormControl.valid) {
                    return true;
                } else {
                    this.currentStep = i + 1;
                    return false;
                }
            }
        }
    }

    private showSuccessToaster(saveType: 'submit' | 'draft'): void {
        switch (saveType ? saveType : '') {
            case 'draft': {
                if (this.hasPageAndAppStatus('update', 'approved')) {
                    this.toaster.success('New app version created and saved as draft');
                } else {
                    this.toaster.success('App has been saved as draft');
                }
                break;
            }
            case 'submit':
                if (this.hasPageAndAppStatus('update', 'approved')) {
                    this.toaster.success('New app version has been submitted for approval');
                } else {
                    this.toaster.success('App has been submitted for approval');
                }
                break;
            default:
                console.error('Incorrect save type : ', saveType);
        }
    }

    private mapFields(definitionFields: AppTypeFieldModel[], value?: FullAppData | AppVersionResponse): AppTypeFieldModel[] {
        if (!definitionFields) {
            return definitionFields;
        }

        definitionFields.forEach(field => {
            // normalize field options.
            if (field.options) {
                field.options = this.mapOptions(field);
            }

            const userValue: any = value ? get(value, field.id) : undefined;

            if (field.fields) {
                // set DFA values.
                if (Array.isArray(userValue) && userValue.length > 0) {
                    field.defaultValue = userValue;
                }
                // map DFA fields with default values.
                this.mapFields(field.fields);
            } else if (userValue !== undefined) {
                field.defaultValue = userValue;
            }
        });

        return definitionFields;
    }

    private mapOptions(appTypeFiled: AppTypeFieldModel): string[] {
        const newOptions = [];
        appTypeFiled.options.forEach(o => newOptions.push(o?.value !== undefined ? o.value : o));
        return newOptions;
    }
}
