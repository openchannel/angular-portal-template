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
import {ConfirmationModalComponent} from '../../../shared/modals/confirmation-modal/confirmation-modal.component';
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
  currentAppsTypesItems: string [] = [];

  appDataFormGroup: FormGroup;
  appFields: {
    fields: AppTypeFieldModel []
  };
  generatedForm: FormGroup;

  lockSubmitButton = true;

  pageTitle: 'Submit New App' | 'Edit App';
  pageType: string;
  appId: string;
  appVersion: number;
  setFormErrors = false;

  private appTypePageNumber = 1;
  private appTypePageLimit = 100;
  // data from the form component
  private appFormData: any;
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.pageType = this.router.url.split('/')[1];
    this.initAppDataGroup();
    this.pageTitle = this.getPageTitleByPage(this.pageType);
    if (this.pageType === 'app-new') {
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
    if (this.pageType === 'app-new') {
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
    const modalRef = this.modal.open(ConfirmationModalComponent);

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
      this.lockSubmitButton = true;
      if (this.pageType === 'app-new') {
        this.subscriptions.add(this.appsService.createApp(this.buildDataForCreate(this.appFormData))
        .subscribe((appResponse) => {
          if (appResponse) {
            if (saveType === 'submit') {
              this.subscriptions.add(this.appsService.publishAppByVersion(appResponse.appId, {
                version: appResponse.version,
                autoApprove: true,
              }).subscribe(() => {
                this.lockSubmitButton = false;
                this.router.navigate(['/app-developer']).then();
              }, error => console.error('request publishAppByVersion', error)));
            } else {
              this.router.navigate(['/app-developer']).then();
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
        .updateAppByVersion(this.appId, this.appVersion, this.buildDataForUpdate(this.appFormData, saveType === 'draft'))
        .subscribe(
            response => {
              if (response) {
                this.lockSubmitButton = false;
                this.router.navigate(['/app-developer']).then();
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


  buildDataForUpdate(fields: any, asDraft?: boolean) {
    const dataToServer: UpdateAppVersionModel = {
      name: this.appDataFormGroup.get('name').value,
      approvalRequired: asDraft ? asDraft : false,
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
            this.router.navigate(['/app-developer']).then();
          }));
        } else {
          this.loader.closeLoader('2');
          console.error('request getAppByVersion : empty response');
          this.router.navigate(['/app-developer']).then();
        }
      }, error => {
        console.error('request getAppByVersion', error);
        this.loader.closeLoader('2');
        this.router.navigate(['/app-developer']).then();
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
      .subscribe(type => {
        if (type) {
          this.getFieldsByAppType(type);
        } else {
          this.appFields = null;
        }
      }, () => this.appFields = null));
  }

  private getAllAppTypes(): void {
    this.loader.showLoader('1');
    this.subscriptions.add(this.appTypeService.getAppTypes(this.appTypePageNumber, this.appTypePageLimit)
      .subscribe(appTypesResponse => {
        if (appTypesResponse?.list) {
          this.currentAppsTypesItems = appTypesResponse.list
            .map(app => app.appTypeId)
            .filter(app => app && app.length > 0);
          this.loader.closeLoader('1');
        } else {
          this.loader.closeLoader('1');
          this.router.navigate(['/app-developer']).then();
          this.currentAppsTypesItems = [];
        }
      }, (error) => {
        this.currentAppsTypesItems = [];
        this.loader.closeLoader('1');
        this.router.navigate(['/app-developer']).then();
        console.error('Can\'t get all Apps : ' + JSON.stringify(error));
      }));
  }

  private getFieldsByAppType(appType: string): void {
    this.appFields = null;
    this.subscriptions.add(this.appTypeService.getOneAppType(appType)
      .subscribe((appTypeResponse: any) => {
        if (appTypeResponse) {
          this.appFields = {
            fields: this.mapAppTypeToFields(appTypeResponse),
          };
        }
      }, (error => {
        console.error('ERROR getFieldsByAppType : ' + JSON.stringify(error));
      })));
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

  private getPageTitleByPage(currentPage: string): 'Submit New App' | 'Edit App' {
    if ('app-new' === currentPage) {
      return 'Submit New App';
    }
    return 'Edit App';
  }

  private checkDataValidityRedirect(): void {
    this.subscriptions.add(this.activeRoute.queryParams.subscribe(param => {
      if (param.formStatus && param.formStatus === 'invalid') {
        this.setFormErrors = true;
      }
    }));
  }

  private isValidAppName() {
    const name = this.generatedForm.get('name');
    if (name) {
      name.markAsTouched();
    }
    return name.valid;
  }
}
