import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    AppResponse,
    AppsService,
    AppStatusValue,
    AppTypeFieldModelResponse,
    AppTypeService,
    AppVersionResponse,
    AppVersionService,
    CreateAppModel,
    StripeService,
    TitleService,
    TypeModel,
    UpdateAppVersionModel,
} from '@openchannel/angular-common-services';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of, Subject, Subscription, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';
import { LoadingBarService } from '@ngx-loading-bar/core';
import {
    AppFormField,
    AppTypeFieldModel,
    AppTypeModel,
    FullAppData,
    OcConfirmationModalComponent,
} from '@openchannel/angular-common-components';
import { get, isEqual } from 'lodash';
import { HttpHeaders } from '@angular/common/http';
import { PricingFormService } from './pricing-form.service';
import { pricingConfig } from '../../../../assets/data/siteConfig';
import { StripeAccountsService } from '@core/services/stripe-accounts.service';
import { AppManageModalService } from '@core/services/app-manage-modal-service/app-manage-modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

export type pageDestination = 'edit' | 'create';
@Component({
    selector: 'app-app-new',
    templateUrl: './app-new.component.html',
    styleUrls: ['./app-new.component.scss'],
})
export class AppNewComponent implements OnInit, OnDestroy {
    currentAppsTypesItems: AppTypeModel[] = [];
    appTypesFetched: boolean = false;

    appTypeFormGroup: FormGroup;
    appTypeFormControl: AbstractControl;
    appFields: TypeModel<AppTypeFieldModel>;
    savedFields: TypeModel<AppTypeFieldModel>;
    generatedForm: FormGroup | FormArray;

    draftSaveInProcess = false;
    submitInProcess = false;
    currentStep = 1;

    pageTitle: 'Create app' | 'Edit app';
    pageType: pageDestination;
    appId: string;
    appVersion: number;
    parentApp: FullAppData;
    appDataForInvalidAppType: AppVersionResponse;
    setFormErrors = false;
    disableOutgo = false;
    // chart variables
    count;
    countText;
    downloadUrl = './assets/img/cloud-download.svg';

    modelFormArray: FormArray;
    private planTypeSubscription: Subscription;

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
        private appManageModalService: AppManageModalService,
        private loadingBar: LoadingBarService,
        private titleService: TitleService,
        private toaster: ToastrService,
        private stripeService: StripeService,
        private stripeAccountsService: StripeAccountsService,
        private pricingFormService: PricingFormService,
        private modal: NgbModal,
    ) {}

    ngOnInit(): void {
        this.loader = this.loadingBar.useRef();
        this.pageType = this.router.url.split('/')[2] as pageDestination;
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
        this.router.navigate(['manage-apps']).then();
    }

    initAppDataGroup(): void {
        this.appTypeFormGroup = this.fb.group({
            type: ['', Validators.required],
        });
        this.appTypeFormControl = this.appTypeFormGroup.get('type');
    }

    // getting app data from the form on form changing
    onFormDataUpdated(fields: any): void {
        if (pricingConfig.enablePricingForm && fields?.model) {
            fields.model = this.pricingFormService.normalizePricingData(fields.model, false);
        }
        this.appFormData = fields;
    }

    openConfirmationModal(): void {
        if (this.generatedForm) {
            this.generatedForm.markAllAsTouched();
            if (!(this.generatedForm.invalid || this.submitInProcess || this.draftSaveInProcess)) {
                // when page type is 'edit' and app status is 'pending', we will hide 'Save as draft' button.
                this.appManageModalService
                    .openModalWithDraftAndSubmitButtons(!this.hasPageAndAppStatus('edit', 'pending'))
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(result => this.saveApp(result));
            }
        }
    }

    openConnectStripeModal(): void {
        if (this.modal.hasOpenModals()) {
            return;
        }

        const modalRef = this.modal.open(OcConfirmationModalComponent, { size: 'md' });

        modalRef.componentInstance.modalTitle = 'Stripe account required';
        modalRef.componentInstance.modalText = 'Connect your Stripe account to receive payments for your apps';
        modalRef.componentInstance.buttonText = 'Connect Stripe';
        modalRef.componentInstance.cancelButtonText = 'Cancel';

        modalRef.result.then(
            res => {
                if (res) {
                    this.connectStripeAccount();
                }
            },
            () => {},
        );
    }

    connectStripeAccount(): void {
        // Window should be opened right after user interaction (button click), because some browsers
        // will prevent opening window in async block
        const stripeWindow = window.open();

        this.stripeService
            .connectAccount(this.stripeAccountsService.getStripeUrlRedirect())
            .pipe(
                takeUntil(this.destroy$),
                catchError(err => {
                    stripeWindow.close();
                    return throwError(err);
                }),
            )
            .subscribe(res => {
                stripeWindow.location.href = res.targetUrl;
            });
    }

    // saving app to the server
    saveApp(saveType: 'submit' | 'draft'): void {
        this.getIsPlanTypeCorrect()
            .pipe(takeUntil(this.destroy$))
            .subscribe(isPlanTypeCorrect => {
                if (isPlanTypeCorrect) {
                    const isDraft = saveType === 'draft';
                    const isSubmit = saveType === 'submit';
                    if (
                        !this.draftSaveInProcess &&
                        !this.submitInProcess &&
                        ((isDraft && this.isValidAppName()) || (isSubmit && this.generatedForm?.valid))
                    ) {
                        this.disableOutgo = true;
                        this.draftSaveInProcess = isDraft;
                        this.submitInProcess = isSubmit;

                        if (this.pageType === 'create') {
                            this.saveNewApp(saveType);
                        } else {
                            this.updateApp(saveType);
                        }
                    }
                }
            });
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
                    this.router.navigate(['/manage-apps']).then();
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
            type: this.appTypeFormControl.value?.appTypeId || null,
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
                        if (pricingConfig.enablePricingForm) {
                            this.checkPlanTypeOnEditApp();
                        }

                        this.appTypeService
                            .getOneAppType(this.parentApp.type, new HttpHeaders({ 'x-handle-error': '404' }))
                            .pipe(takeUntil(this.destroy$))
                            .subscribe(
                                appType => {
                                    this.appTypeFormControl.setValue(appType);
                                    this.addListenerAppTypeField();

                                    this.setAppFieldsByType(appType.fields, appVersion);

                                    this.checkDataValidityRedirect();
                                    this.loader.complete();
                                },
                                () => {
                                    this.appDataForInvalidAppType = appVersion;
                                    this.addListenerAppTypeField();

                                    if (this.currentAppsTypesItems.length === 1) {
                                        this.appTypeFormControl.setValue(this.currentAppsTypesItems[0]);
                                    } else {
                                        this.setInvalidAppTypeError(true);
                                    }

                                    this.loader.complete();
                                },
                            );
                    } else {
                        this.loader.complete();
                        this.router.navigate(['/manage-apps']).then();
                    }
                },
                () => {
                    this.loader.complete();
                    this.router.navigate(['/manage-apps']).then();
                },
            );
    }

    setGeneratedForm(form: FormGroup | FormArray): void {
        this.generatedForm = form;
        if (this.setFormErrors) {
            this.generatedForm.markAllAsTouched();
        }

        if (pricingConfig.enablePricingForm) {
            this.setModelFormArray();
            this.subscribeToPlanTypeChange();
        }
    }

    hasPageAndAppStatus(pageType: pageDestination, appStatus: AppStatusValue): boolean {
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
        this.router.navigate(['/manage-apps']).then();
    }

    private getNotFreePlanItemsIndexes(): number[] {
        return this.modelFormArray.value.reduce((indexes, model, index) => {
            if (model.type !== 'free') {
                indexes.push(index);
            }

            return indexes;
        }, []);
    }

    private getIsPlanTypeCorrect(): Observable<boolean> {
        if (!pricingConfig.enablePricingForm) {
            return of(true);
        }

        const isNotFreePlan = this.modelFormArray.value.some(model => model.type !== 'free');
        if (!isNotFreePlan) {
            return of(true);
        }

        return this.stripeAccountsService.getIsAccountConnected().pipe(
            tap(isAccountConnected => {
                if (!isAccountConnected) {
                    this.setFreePlanType();
                    this.openConnectStripeModal();
                }
            }),
            takeUntil(this.destroy$),
        );
    }

    private checkPlanTypeOnEditApp(): void {
        const isNotFreePlan = this.parentApp.model.some(model => model.type !== 'free');
        if (isNotFreePlan) {
            this.pricingFormService.setCanModelBeChanged(true);
        }
    }

    private setFreePlanType(): void {
        setTimeout(() => {
            const notFreeItemsIndexes = this.getNotFreePlanItemsIndexes();

            this.pricingFormService.setCanModelBeChanged(true);

            // We need to set edit because functionality of setting model according to type
            // is in dropdownForm component, but in edit mode this component is not rendered
            if (pricingConfig.enableMultiPricingForms) {
                this.pricingFormService.setDFAItemsEditMode.next(notFreeItemsIndexes);
            }

            this.modelFormArray.controls.forEach(control => {
                control.get('type')?.setValue('free');
            });

            // Update form in model DFA
            if (pricingConfig.enableMultiPricingForms) {
                this.pricingFormService.updateDFAItems.next(notFreeItemsIndexes);
            }

            this.pricingFormService.setCanModelBeChanged(false);
        }, 0);
    }

    private triggerPlanTypeChange(): void {
        this.modelFormArray.setValue(this.modelFormArray.value);
    }

    private subscribeToPlanTypeChange(): void {
        this.planTypeSubscription?.unsubscribe();

        this.planTypeSubscription = this.modelFormArray?.valueChanges
            .pipe(
                // Wait for next change detection cycle, so the new value will be stable
                debounceTime(0),
                distinctUntilChanged(isEqual),
                filter(values => values.some(value => value?.type && value.type !== 'free')),
                switchMap(() => {
                    this.loader.start();
                    return this.stripeAccountsService.getIsAccountConnected().pipe(
                        finalize(() => {
                            this.loader.complete();
                        }),
                    );
                }),
                takeUntil(this.destroy$),
            )
            .subscribe(isStripeAccountConnected => {
                if (!isStripeAccountConnected) {
                    this.setFreePlanType();
                    this.openConnectStripeModal();
                } else {
                    this.pricingFormService.setCanModelBeChanged(true);
                    this.triggerPlanTypeChange();
                }
            });
    }

    private setModelFormArray(): void {
        const wizardEnabled = this.generatedForm instanceof FormArray;

        if (wizardEnabled) {
            const lastControlIndex = (this.generatedForm as FormArray).controls.length - 1;
            this.modelFormArray = this.generatedForm.controls[lastControlIndex]?.get('model');
        } else {
            this.modelFormArray = this.generatedForm.get('model') as FormArray;
        }
    }

    private setInvalidAppTypeError(value: boolean): void {
        this.appTypeFormControl.markAsTouched();
        this.appTypeFormControl.setErrors({ invalidAppType: value });
        if (!value) {
            const modifiedErrors = Object.keys(this.appTypeFormControl.errors).filter(err => err !== 'invalidAppType');
            this.appTypeFormControl.setErrors(modifiedErrors);
        }
    }

    private setAppFieldsByType(appTypeFields: AppTypeFieldModelResponse[], appData: AppVersionResponse): void {
        this.appFields = {
            fields: this.injectPricingFormToAppFields(this.mapFields(appTypeFields, appData), appData),
        };
    }

    private addListenerAppTypeField(): void {
        this.appTypeFormControl.valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe(
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
                        this.appTypesFetched = true;
                        this.currentAppsTypesItems = appTypesResponse.list;
                        if (this.pageType === 'create' && this.currentAppsTypesItems && this.currentAppsTypesItems.length > 0) {
                            this.appTypeFormControl.setValue(this.currentAppsTypesItems[0]);
                        }
                        this.loader.complete();
                    } else {
                        this.loader.complete();
                        this.router.navigate(['/manage-apps']).then();
                        this.currentAppsTypesItems = [];
                    }
                },
                () => {
                    this.currentAppsTypesItems = [];
                    this.loader.complete();
                    this.router.navigate(['/manage-apps']).then();
                },
            );
    }

    private getFieldsByAppType(appType: string): void {
        this.appTypeService
            .getOneAppType(appType)
            .pipe(takeUntil(this.destroy$))
            .subscribe((appTypeResponse: any) => {
                if (appTypeResponse) {
                    // If app doesn't have correct type and user chooses type for the first time in EDIT mode
                    if (this.appDataForInvalidAppType) {
                        this.setAppFieldsByType(appTypeResponse.fields, this.appDataForInvalidAppType);
                        this.appDataForInvalidAppType = null;
                        this.setInvalidAppTypeError(null);
                    } else {
                        this.mergeWithSaveData(this.appFormData, this.mapFields(appTypeResponse.fields));
                    }
                }
            });
    }

    private mergeWithSaveData(savedData: any, newFields: AppTypeFieldModel[]): void {
        if (savedData && this.savedFields) {
            this.mergeField(this.savedFields.fields, newFields, savedData);
        }
        this.appFields = {
            fields: this.injectPricingFormToAppFields(newFields, savedData),
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
            console.log('The "name" field not found. Please check dashboard settings.');
            return false;
        }
        for (let i = 0; i < this.generatedForm.controls.length; i++) {
            const nameFormControl = this.generatedForm.controls[i].get('name');
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
                if (this.hasPageAndAppStatus('edit', 'approved')) {
                    this.toaster.success('New app version created and saved as draft');
                } else {
                    this.toaster.success('App has been saved as draft');
                }
                break;
            }
            case 'submit':
                if (this.hasPageAndAppStatus('edit', 'approved')) {
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

    private saveNewApp(saveType: 'submit' | 'draft'): void {
        this.appsService
            .createApp(this.buildDataForCreate(this.appFormData))
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                appResponse => {
                    if (saveType === 'submit') {
                        this.publishApp(appResponse.appId, appResponse.version);
                    } else {
                        this.draftSaveInProcess = false;
                        this.router.navigate(['/manage-apps']).then(() => {
                            this.showSuccessToaster(saveType);
                        });
                    }
                },
                () => {
                    this.draftSaveInProcess = false;
                    this.submitInProcess = false;
                },
            );
    }

    private updateApp(saveType: 'submit' | 'draft'): void {
        this.appVersionService
            .updateAppByVersion(this.appId, this.appVersion, this.buildDataForUpdate(this.appFormData))
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                response => {
                    if (saveType === 'submit' && this.parentApp.status.value !== 'pending') {
                        this.publishApp(response.appId, response.version);
                    } else {
                        this.draftSaveInProcess = false;
                        this.showSuccessToaster(saveType);
                        this.router.navigate(['/manage-apps']).then();
                    }
                },
                () => {
                    this.draftSaveInProcess = false;
                    this.submitInProcess = false;
                },
            );
    }

    private injectPricingFormToAppFields(formFields: AppFormField[], appData?: AppResponse): AppFormField[] {
        if (pricingConfig.enablePricingForm) {
            return this.pricingFormService.injectPricingFormToAppFields(pricingConfig.enableMultiPricingForms, formFields, appData);
        }
        return formFields;
    }
}
