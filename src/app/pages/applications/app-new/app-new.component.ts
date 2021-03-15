import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AppsService,
  AppStatusValue,
  AppTypeFieldModel,
  AppTypeModel,
  AppTypeService,
  AppVersionService,
  ChartLayoutTypeModel,
  ChartOptionsChange,
  ChartService,
  ChartStatisticModel,
  CreateAppModel,
  FullAppData,
  TitleService,
  UpdateAppVersionModel,
} from 'oc-ng-common-service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppConfirmationModalComponent} from '@shared/modals/app-confirmation-modal/app-confirmation-modal.component';
import {ToastrService} from 'ngx-toastr';
import {LoadingBarState} from '@ngx-loading-bar/core/loading-bar.state';
import {LoadingBarService} from '@ngx-loading-bar/core';

@Component({
  selector: 'app-app-new',
  templateUrl: './app-new.component.html',
  styleUrls: [
    './app-new.component.scss'],
})
export class AppNewComponent implements OnInit, OnDestroy {

  chartData: ChartStatisticModel = {
    data: null,
    periods: [
      {
        id: 'month',
        label: 'Monthly',
        active: true,
      }, {
        id: 'day',
        label: 'Daily'
      }
    ],
    fields: [
      {
        id: 'downloads',
        label: 'Downloads',
        active: true,
      }, {
        id: 'reviews',
        label: 'Reviews',
      }, {
        id: 'leads',
        label: 'Leads',
      }, {
        id: 'views',
        label: 'Views'
      }],
    layout: ChartLayoutTypeModel.standard
  };

  currentAppsTypesItems: AppTypeModel [] = [];

  appTypeFormGroup: FormGroup;
  appFields: {
    fields: AppTypeFieldModel []
  };
  savedFields: {
    fields: AppTypeFieldModel []
  };
  generatedForm: FormGroup;

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
  count;
  countText;
  downloadUrl = './assets/img/cloud-download.svg';

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
    ['multiImage', 'multiFile']
  ];

  constructor(private router: Router,
              private appsService: AppsService,
              private fb: FormBuilder,
              private appVersionService: AppVersionService,
              private appTypeService: AppTypeService,
              private activeRoute: ActivatedRoute,
              private modal: NgbModal,
              private loadingBar: LoadingBarService,
              private titleService: TitleService,
              private toaster: ToastrService,
              public chartService: ChartService) {
  }

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
      this.updateChartData({
        period: this.chartData.periods[0],
        field: this.chartData.fields[0]
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initAppDataGroup(): void {
    this.appTypeFormGroup = this.fb.group({
      type: ['', Validators.required],
    });
  }

  // getting app data from the form on form changing
  getAppFormData(fields: any): void {
    this.appFormData = fields;
  }

  openConfirmationModal(): void {
    if (this.generatedForm) {
      this.generatedForm.markAllAsTouched();

      if (!(this.generatedForm.invalid || this.submitInProcess || this.draftSaveInProcess)) {

        const modalRef = this.modal.open(AppConfirmationModalComponent, {size: 'md'});

        modalRef.componentInstance.modalTitle = 'Submit app';
        modalRef.componentInstance.modalText = 'Submit this app to the marketplace now?';
        modalRef.componentInstance.type = 'submission';
        modalRef.componentInstance.buttonText = 'Yes, submit it';
        modalRef.componentInstance.cancelButtonText = 'Save as draft';

        modalRef.result.then(res => {
          if (res && res === 'success') {
            this.saveApp('submit');
          } else if (res && res === 'draft') {
            this.saveApp('draft');
          }
        });
      }
    }
  }

  // saving app to the server
  saveApp(saveType: 'submit' | 'draft'): void {
    if ((!this.draftSaveInProcess && !this.submitInProcess)
        && ((saveType === 'draft' && this.isValidAppName()) || (saveType === 'submit' && this.generatedForm?.valid))) {

      this.disableOutgo = true;
      this.draftSaveInProcess = saveType === 'draft';
      this.submitInProcess = saveType === 'submit';

      if (this.pageType === 'create') {
        this.appsService.createApp(this.buildDataForCreate(this.appFormData))
          .pipe(takeUntil(this.destroy$))
          .subscribe((appResponse) => {
          if (appResponse) {
            if (saveType === 'submit') {
              this.publishApp(appResponse.appId, appResponse.version);
            } else {
              this.draftSaveInProcess = false;
              this.router.navigate(['/app/manage']).then(() => {
                this.showSuccessToaster(saveType);
              });
            }
          } else {
            this.draftSaveInProcess = false;
            this.submitInProcess = false;
          }
        }, () => {
          this.draftSaveInProcess = false;
          this.submitInProcess = false;
        });
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
                this.router.navigate(['/app/manage']).then();
              }
            } else {
              this.draftSaveInProcess = false;
              this.submitInProcess = false;
            }
          }, () => {
            this.draftSaveInProcess = false;
            this.submitInProcess = false;
          },
        );
      }
    }
  }

  publishApp(appId: string, appVersion: number) {
    this.appsService.publishAppByVersion(appId, {
      version: appVersion,
      autoApprove: false,
    }).pipe(takeUntil(this.destroy$))
      .subscribe(() => {
      this.submitInProcess = false;
      this.showSuccessToaster('submit');
      this.router.navigate(['/app/manage']).then();
    }, () => {
      this.submitInProcess = false;
    });
  }

  buildDataForCreate(fields: any): CreateAppModel {

    const customDataValue = {...fields};
    const name = customDataValue?.name ? customDataValue?.name : null;
    delete customDataValue.name;
    const appTypeId = this.appTypeFormGroup.value?.type?.appTypeId;
    return {
      name,
      type: appTypeId ? appTypeId : null,
      customData: customDataValue,
    };
  }

  buildDataForUpdate(fields: any): UpdateAppVersionModel {
    const appData = this.buildDataForCreate(fields);
    return {
      ...appData,
      customData: appData.customData,
      approvalRequired: true,
    };
  }

  getAppData() {
    this.appId = this.activeRoute.snapshot.paramMap.get('appId');
    this.appVersion = Number(this.activeRoute.snapshot.paramMap.get('versionId'));

    this.loader.start();

    this.appVersionService.getAppByVersion(this.appId, this.appVersion).pipe(takeUntil(this.destroy$))
      .subscribe(
      (appVersion) => {
        if (appVersion) {
          this.parentApp = appVersion;
          this.titleService.setSpecialTitle(appVersion.name);

          this.appTypeService.getOneAppType(appVersion.type).pipe(takeUntil(this.destroy$))
           .subscribe((appType) => {

            this.appTypeFormGroup.get('type').setValue(appType);
            this.addListenerAppTypeField();

            this.appFields = {
              fields: this.mapAppTypeFields(appVersion, appType),
            };
            this.checkDataValidityRedirect();
            this.loader.complete();
          }, () => {
            this.loader.complete();
            this.router.navigate(['/app/manage']).then();
          });
        } else {
          this.loader.complete();
          this.router.navigate(['/app/manage']).then();
        }
      }, () => {
        this.loader.complete();
        this.router.navigate(['/app/manage']).then();
      },
    );
  }

  setGeneratedForm(form: FormGroup): void {
    this.generatedForm = form;
    if (this.setFormErrors) {
      this.generatedForm.markAllAsTouched();
    }
  }

  updateChartData(chartOptions: ChartOptionsChange): void {
    const dateEnd = new Date();
    const dateStart = this.chartService.getDateStartByCurrentPeriod(dateEnd, chartOptions.period);

    this.loader.start();
    this.chartService.getTimeSeries(chartOptions.period.id, chartOptions.field.id, dateStart.getTime(), dateEnd.getTime(), this.appId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((chartData) => {
        this.count = 0;
        this.chartData = {
          ...this.chartData,
          data: chartData
        };
        this.count += chartData.labelsY.reduce((a, b) => a + b);
        this.countText = `Total ${chartOptions.field.label}`;
        this.loader.complete();
      }, () => {
        this.loader.complete();
      });
  }

  private addListenerAppTypeField(): void {
    this.appTypeFormGroup.get('type').valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((type: AppTypeModel) => {
        if (this.appFields) {
          this.savedFields = this.appFields;
          this.appFields = null;
        }
        if (type) {
          this.getFieldsByAppType(type.appTypeId);
        }
      }, () => {
        this.appFields = null;
      });
  }

  private getAllAppTypes(): void {
    this.loader.start();
    this.appTypeService.getAppTypes(this.appTypePageNumber, this.appTypePageLimit)
      .pipe(takeUntil(this.destroy$))
      .subscribe(appTypesResponse => {
        if (appTypesResponse?.list) {
          this.currentAppsTypesItems = appTypesResponse.list;
          if (this.pageType === 'create' && this.currentAppsTypesItems && this.currentAppsTypesItems.length > 0) {
            this.appTypeFormGroup.get('type').setValue(this.currentAppsTypesItems[0]);
          }
          this.loader.complete();
        } else {
          this.loader.complete();
          this.router.navigate(['/app/manage']).then();
          this.currentAppsTypesItems = [];
        }
      }, () => {
        this.currentAppsTypesItems = [];
        this.loader.complete();
        this.router.navigate(['/app/manage']).then();
      });
  }

  private getFieldsByAppType(appType: string): void {
    this.appTypeService.getOneAppType(appType)
      .pipe(takeUntil(this.destroy$))
      .subscribe((appTypeResponse: any) => {
        if (appTypeResponse) {
          this.mergeWithSaveData(this.appFormData, this.mapAppTypeToFields(appTypeResponse));
        }
      });
  }

  private mergeWithSaveData(savedData: any, newFields: AppTypeFieldModel[]) {
    if (savedData && this.savedFields) {
      this.mergeField(this.savedFields.fields, newFields, savedData);
    }
    this.appFields = {
      fields: newFields,
    };
  }

  private mergeField(originalFields: AppTypeFieldModel[], newFields: AppTypeFieldModel[], savedData: any) {
    if (savedData) {
      originalFields.forEach(originalField => {
        const newField = newFields.find(value => value.id === originalField.id && this.testCompatible(value.type, originalField.type));
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

  private mapAppTypeFields(appVersionModel: FullAppData, appTypeModel: AppTypeModel): AppTypeFieldModel [] {
    if (appVersionModel && appTypeModel) {
      const defaultValues = new Map(Object.entries({...appVersionModel, ...appVersionModel.customData}));
      if (appTypeModel?.fields) {
        return appTypeModel.fields
          .filter(field => field?.id)
          .map(field => this.mapRecursiveField(field, defaultValues));
      }
    }
    return [];
  }

  private mapRecursiveField(field: AppTypeFieldModel, defaultValues?: Map<string, any>): AppTypeFieldModel {
    if (field) {
      // map field Id
      if (field?.id) {
        field.id = field.id.replace('customData.', '');
        // set default value if present
        if (defaultValues) {
          const defaultValue = defaultValues.get(field.id);
          if (defaultValue) {
            field.defaultValue = defaultValue;
          }
        }
      }
      // map options
      if (field?.options) {
        field.options = this.mapOptions(field);
      }
      // map other fields
      if (field?.fields) {
        field.fields.forEach(child => this.mapRecursiveField(child, defaultValues));
        field.subFieldDefinitions = field.fields;
        field.fields = null;
      }
    }
    return field;
  }

  private mapAppTypeToFields(appTypeModel: AppTypeModel): AppTypeFieldModel [] {
    if (appTypeModel && appTypeModel?.fields) {
      return appTypeModel.fields.map(field => this.mapRecursiveField(field));
    }
    return [];
  }

  private mapOptions(appTypeFiled: AppTypeFieldModel): string [] {
    const newOptions = [];
    appTypeFiled.options.forEach(o => newOptions.push(o?.value ? o.value : o));
    return newOptions;
  }

  private getPageTitleByPage(currentPage: string): 'Create app' | 'Edit app' {
    if ('create' === currentPage) {
      return 'Create app';
    }
    return 'Edit app';
  }

  private checkDataValidityRedirect(): void {
    this.activeRoute.queryParams.pipe(takeUntil(this.destroy$))
      .subscribe(param => {
      if (param.formStatus && param.formStatus === 'invalid') {
        this.setFormErrors = true;
      }
    });
  }

  private isValidAppName(): boolean {
    const controlName = this.generatedForm?.get('name');
    if (controlName) {
      controlName.markAsTouched();
      return controlName.valid;
    }
    return false;
  }

  private showSuccessToaster(saveType: 'submit' | 'draft') {
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

  hasPageAndAppStatus(pageType: 'update' | 'create', appStatus: AppStatusValue) {
    return this.pageType === pageType && this.parentApp && this.parentApp?.status?.value === appStatus;
  }

  isOutgoAllowed() {
    if (this.disableOutgo) {
      return true;
    }
    return !(this.generatedForm && this.generatedForm.dirty);
  }
}
