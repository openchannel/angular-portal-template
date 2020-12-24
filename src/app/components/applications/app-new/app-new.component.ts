import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AppsService,
  AppTypeModel,
  AppTypeService,
  AppVersionService,
  FullAppData,
  SellerAppDetailsModel,
  TitleService,
} from 'oc-ng-common-service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppTypeFieldModel} from 'oc-ng-common-service/lib/model/app-type-model';
import {Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {CreateAppModel, UpdateAppVersionModel} from 'oc-ng-common-service/lib/model/app-data-model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppConfirmationModalComponent} from '../../../shared/modals/app-confirmation-modal/app-confirmation-modal.component';
import {LoaderService} from '../../../shared/services/loader.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-app-new',
  templateUrl: './app-new.component.html',
  styleUrls: [
    './app-new.component.scss'],
})
export class AppNewComponent implements OnInit, OnDestroy {

  constructor(private router: Router,
              private appsService: AppsService,
              private fb: FormBuilder,
              private appVersionService: AppVersionService,
              private appTypeService: AppTypeService,
              private activeRoute: ActivatedRoute,
              private modal: NgbModal,
              private loader: LoaderService,
              private titleService: TitleService,
              private toaster: ToastrService) {
  }

  appDetails = new SellerAppDetailsModel();

  appActions = [{
    type: 'SEARCH',
    description: 'Developer ID : ',
  }, {
    type: 'CREATE',
    description: 'Create new Developer with ID : ',
  }];

  currentAppAction = this.appActions[0];
  currentAppsTypesItems: AppTypeModel [] = [];

  appDataFormGroup: FormGroup;
  appFields: {
    fields: AppTypeFieldModel []
  };
  savedFields: {
    fields: AppTypeFieldModel []
  };
  generatedForm: FormGroup;

  lockSubmitButton = true;

  pageTitle: 'Create app' | 'Edit app';
  pageType: string;
  appId: string;
  appVersion: number;
  setFormErrors = false;
  disableOutgo = false;

  private appTypePageNumber = 1;
  private appTypePageLimit = 100;
  // data from the form component
  private appFormData: any;
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.pageType = this.router.url.split('/')[1];
    this.initAppDataGroup();
    this.pageTitle = this.getPageTitleByPage(this.pageType);
    if (this.pageType === 'create') {
      this.addListenerAppTypeField();
      this.getAllAppTypes();
    } else {
      this.getAppData();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initAppDataGroup(): void {
    if (this.pageType === 'create') {
      this.appDataFormGroup = this.fb.group({
        type: ['', Validators.required],
      });
    } else {
      this.appDataFormGroup = this.fb.group({
        name: ['', Validators.required],
        safeName: ['', Validators.required],
      });
    }
  }

  // getting app data from the form on form changing
  getAppFormData(fields: any): void {
    this.appFormData = fields;
  }

  openConfirmationModal(): void {
    const modalRef = this.modal.open(AppConfirmationModalComponent);

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

  // saving app to the server
  saveApp(saveType: 'submit' | 'draft'): void {
    if (this.isValidAppName()) {
      this.disableOutgo = true;
      this.lockSubmitButton = true;
      if (this.pageType === 'create') {
        this.subscriptions.add(this.appsService.createApp(this.buildDataForCreate(this.appFormData))
        .subscribe((appResponse) => {
          if (appResponse) {
            if (saveType === 'submit') {
              this.publishApp(saveType, appResponse.appId, appResponse.version);
            } else {
              this.showSuccessToaster(saveType);
              this.router.navigate(['/manage']).then();
            }
          } else {
            console.error('Can\'t save a new app. Empty response.');
          }
        }, () => {
          this.lockSubmitButton = false;
          this.currentAppAction = this.appActions[0];
          console.log('Can\'t save a new app.');
        }));
      } else {
        this.subscriptions.add(this.appVersionService
        .updateAppByVersion(this.appId, this.appVersion, this.buildDataForUpdate(this.appFormData))
        .subscribe(
          response => {
            if (response) {
              this.publishApp(saveType, response.appId, response.version);
            } else {
              this.lockSubmitButton = false;
              this.currentAppAction = this.appActions[0];
              console.log('Can\'t update app.');
            }
          }, () => {
            this.lockSubmitButton = false;
            this.currentAppAction = this.appActions[0];
            console.log('Can\'t update app.');
          },
        ));
      }
    }
  }

  publishApp(saveType: 'submit' | 'draft', appId: string, appVersion: number) {
    this.subscriptions.add(this.appsService.publishAppByVersion(appId, {
      version: appVersion,
      autoApprove: false,
    }).subscribe(() => {
      this.lockSubmitButton = false;
      this.showSuccessToaster(saveType);
      this.router.navigate(['/manage']).then();
    }, error => {
      console.error('request publishAppByVersion', error);
      this.lockSubmitButton = false;
    }));
  }

  buildDataForCreate(fields: any): CreateAppModel {

    const customDataValue = {...fields};
    delete customDataValue.name;
    const formGroupData = this.appDataFormGroup.value;
    return {
      name: fields?.name ? fields.name : null,
      type: formGroupData?.type ? formGroupData.type : null,
      customData: customDataValue,
    };
  }

  buildDataForUpdate(fields: any) {
    const dataToServer: UpdateAppVersionModel = {
      name: this.appDataFormGroup.get('name').value,
      approvalRequired: true,
      customData: {...fields},
    };
    return dataToServer;
  }

  getAppData() {
    this.appId = this.activeRoute.snapshot.paramMap.get('appId');
    this.appVersion = Number(this.activeRoute.snapshot.paramMap.get('versionId'));
    this.loader.showLoader('2');
    this.subscriptions.add(this.appVersionService.getAppByVersion(this.appId, this.appVersion).subscribe(
      (appVersion) => {
        if (appVersion) {
          this.titleService.setSubtitle(appVersion.name);

          this.subscriptions.add(this.appTypeService.getOneAppType(appVersion.type).subscribe((appType) => {
            this.appDataFormGroup.get('name').setValue(appVersion.name);
            this.appDataFormGroup.get('safeName').setValue(appVersion.safeName);
            this.appFields = {
              fields: this.mapAppTypeFields(appVersion, appType),
            };
            this.checkDataValidityRedirect();
            this.loader.closeLoader('2');
          }, error => {
            console.error('request getOneAppType', error);
            this.loader.closeLoader('2');
            this.router.navigate(['/manage']).then();
          }));
        } else {
          this.loader.closeLoader('2');
          console.error('request getAppByVersion : empty response');
          this.router.navigate(['/manage']).then();
        }
      }, error => {
        console.error('request getAppByVersion', error);
        this.loader.closeLoader('2');
        this.router.navigate(['/manage']).then();
      },
    ));
  }

  getAppFormStatus(status: boolean): void {
    this.lockSubmitButton = status;
  }

  getCreatedForm(form: FormGroup): void {
    this.generatedForm = form;
  }

  private addListenerAppTypeField(): void {
    this.subscriptions.add(this.appDataFormGroup.get('type').valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((type: AppTypeModel) => {
        if (this.appFields) {
          this.savedFields = this.appFields;
          this.appFields = null;
        }
        if (type) {
          this.getFieldsByAppType(type.appTypeId);
        }
      }, () => this.appFields = null));
  }

  private getAllAppTypes(): void {
    this.loader.showLoader('1');
    this.subscriptions.add(this.appTypeService.getAppTypes(this.appTypePageNumber, this.appTypePageLimit)
      .subscribe(appTypesResponse => {
        if (appTypesResponse?.list) {
          this.currentAppsTypesItems = appTypesResponse.list;
          if (this.currentAppsTypesItems && this.currentAppsTypesItems.length > 0) {
            this.appDataFormGroup.get('type').setValue(this.currentAppsTypesItems[0]);
          }
          this.loader.closeLoader('1');
        } else {
          this.loader.closeLoader('1');
          this.router.navigate(['/manage']).then();
          this.currentAppsTypesItems = [];
        }
      }, (error) => {
        this.currentAppsTypesItems = [];
        this.loader.closeLoader('1');
        this.router.navigate(['/manage']).then();
        console.error('Can\'t get all Apps : ' + JSON.stringify(error));
      }));
  }

  private getFieldsByAppType(appType: string): void {
    this.subscriptions.add(this.appTypeService.getOneAppType(appType)
      .subscribe((appTypeResponse: any) => {
        if (appTypeResponse) {
          this.mergeWithSaveData(this.appFormData, this.mapAppTypeToFields(appTypeResponse));
        }
      }, (error => {
        console.error('ERROR getFieldsByAppType : ' + JSON.stringify(error));
      })));
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
        const newField = newFields.find(value => value.id === originalField.id && value.type === originalField.type);
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

  private mapAppTypeFields(appVersionModel: FullAppData, appTypeModel: AppTypeModel): AppTypeFieldModel [] {
    if (appVersionModel && appTypeModel) {
      const defaultValues = new Map(Object.entries(appVersionModel?.customData ? appVersionModel.customData : {}));
      if (appTypeModel?.fields) {
        return appTypeModel.fields
          .filter(field => field?.id).filter(filed => filed.id.includes('customData.'))
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
    this.subscriptions.add(this.activeRoute.queryParams.subscribe(param => {
      if (param.formStatus && param.formStatus === 'invalid') {
        this.setFormErrors = true;
      }
    }));
  }

  private isValidAppName() {
    return this.isValidAndTouch(this.appDataFormGroup, 'name')
        || this.isValidAndTouch(this.generatedForm, 'name');
  }

  private isValidAndTouch(form: FormGroup, key: string): boolean {
    const controlName = form?.get(key);
    if (controlName) {
      controlName.markAsTouched();
      return controlName.valid;
    }
    return false;
  }
  private showSuccessToaster(saveType: 'submit' | 'draft') {
    if (saveType === 'draft') {
      this.toaster.success('App has been saved as draft');
    }
  }

  isOutgoAllowed() {
    if (this.disableOutgo) {
      return true;
    }
    return !(this.generatedForm && this.generatedForm.dirty || this.appDataFormGroup.dirty);
  }
}
