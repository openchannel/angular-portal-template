import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppsService, AppTypeModel, AppTypeService, AppVersionService, FullAppData, SellerAppDetailsModel} from 'oc-ng-common-service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppTypeFieldModel} from 'oc-ng-common-service/lib/model/app-type-model';
import {Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {CreateAppModel, UpdateAppVersionModel} from 'oc-ng-common-service/lib/model/app-data-model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationModalComponent} from '../../../shared/modals/confirmation-modal/confirmation-modal.component';
import {ToastService} from 'oc-ng-common-component';

@Component({
  selector: 'app-app-new',
  templateUrl: './app-new.component.html',
  styleUrls: [
    './app-new.component.scss']
})
export class AppNewComponent implements OnInit, OnDestroy {

  constructor(private router: Router,
              private appsService: AppsService,
              private fb: FormBuilder,
              private appVersionService: AppVersionService,
              private appTypeService: AppTypeService,
              private activeRoute: ActivatedRoute,
              private toastService: ToastService,
              private modal: NgbModal) {
  }

  appDetails = new SellerAppDetailsModel();

  appActions = [{
    type: 'SEARCH',
    description: 'Developer ID : '
  }, {
    type: 'CREATE',
    description: 'Create new Developer with ID : '
  }];

  currentAppAction = this.appActions[0];
  currentAppsTypesItems: string [] = [];

  appDataFormGroup: FormGroup;
  appFields: {
    fields: AppTypeFieldModel []
  };

  subscriptions: Subscription = new Subscription();
  lockSubmitButton = true;

  pageTitle: 'Submit New App' | 'Edit App';
  pageType: string;
  appId: string;
  appVersion: number;

  private appTypePageNumber = 1;
  private appTypePageLimit = 100;
  // data from the form component
  private appFormData: any;

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
        type: ['', Validators.required]
      });
    } else {
      this.appDataFormGroup = this.fb.group({
        name: ['', Validators.required],
        safeName: ['', Validators.required]
      });
    }
  }

  // getting app data from the form on form changing
  getAppFormData(fields: any): void {
    this.appFormData = fields;
  }

  openConfirmationModal(): void {
    const modalRef = this.modal.open(ConfirmationModalComponent);

    modalRef.componentInstance.modalText = 'Submit This App \n' +
        'To The Marketplace Now?';
    modalRef.componentInstance.type = 'submission';
    modalRef.componentInstance.buttonText = 'Submit';

    modalRef.result.then(res => {
      if (res && res === 'success') {
        this.saveApp(true, true);
      } else if (res === 'draft') {
        this.saveApp(false, false);
      }
    });
  }

  // saving app to the server
  saveApp(publishApp: boolean, autoApprove: boolean): void {
    this.lockSubmitButton = true;
    if (this.pageType === 'app-new') {
      this.subscriptions.add(this.appsService.createApp(this.buildDataForCreate(this.appFormData))
      .subscribe((appResponse) => {
        if (appResponse) {
          if (publishApp) {
            this.publishApp(appResponse.appId, appResponse.version, true);
          } else {
            this.router.navigate(['/app-developer']).then(() => {
              this.toastService.show(`App has been saved as ${this.statusForUser(appResponse)}`, {delay: 5000, type: 'success'});
            });
          }
        } else {
          this.lockSubmitButton = false;
          console.error('Can\'t save a new app. Empty response.');
        }
      }, () => {
        this.lockSubmitButton = false;
        this.currentAppAction = this.appActions[0];
        console.log('Can\'t save a new app.');
      }));
    } else {
      this.subscriptions.add(this.appVersionService
      .updateAppByVersion(this.appId, this.appVersion, this.buildDataForUpdate(autoApprove, this.appFormData))
      .subscribe(appResponse => {
            if (appResponse) {
              if (publishApp) {
                this.publishApp(appResponse.appId, appResponse.version, true);
              } else {
                this.lockSubmitButton = false;
                this.router.navigate(['/app-developer']).then(() => {
                  this.toastService.show(`App has been saved as ${this.statusForUser(appResponse)}`, {delay: 5000, type: 'success'});
                });
              }
            } else {
              this.lockSubmitButton = false;
              this.currentAppAction = this.appActions[0];
              console.log('Can\'t update app.');
            }
          }, () => {
            this.lockSubmitButton = false;
            this.currentAppAction = this.appActions[0];
            console.log('Can\'t update app.');
          }
      ));
    }
  }

  publishApp(appId: string, appVersion: number, autoApprove: boolean) {
    this.subscriptions.add(this.appsService.publishAppByVersion(appId, {
      version: appVersion,
      autoApprove
    }).subscribe((emptyResponse) => {
      this.lockSubmitButton = false;
      this.router.navigate(['/app-developer']).then();
    }, error => {
      this.lockSubmitButton = false;
      console.error('request publishAppByVersion', error);
    }));
  }

  buildDataForCreate(fields: any): CreateAppModel {

    const customDataValue = {...fields};
    delete customDataValue.name;
    const formGroupData = this.appDataFormGroup.value;
    return {
      name: fields?.name ? fields.name : null,
      type: formGroupData?.type ? formGroupData.type : null,
      customData: customDataValue
    };
  }

  buildDataForUpdate(autoApprove: boolean, fields: any) {
    const dataToServer: UpdateAppVersionModel = {
      name: this.appDataFormGroup.get('name').value,
      approvalRequired: !autoApprove,
      customData: {...fields}
    };
    return dataToServer;
  }

  getAppData() {
    this.appId = this.activeRoute.snapshot.paramMap.get('appId');
    this.appVersion = Number(this.activeRoute.snapshot.paramMap.get('versionId'));

    this.subscriptions.add(this.appVersionService.getAppByVersion(this.appId, this.appVersion).subscribe(
        (appVersion) => {
          if (appVersion) {
            this.subscriptions.add(this.appTypeService.getOneAppType(appVersion.type).subscribe((appType) => {
              this.appDataFormGroup.get('name').setValue(appVersion.name);
              this.appDataFormGroup.get('safeName').setValue(appVersion.safeName);
              this.appFields = {
                fields: this.mapAppTypeFields(appVersion, appType)
              };
            }, error => {
              console.error('request getOneAppType', error);
              // this.router.navigate(['/app-developer']).then();
            }));
          } else {
            console.error('request getAppByVersion : empty response');
            // this.router.navigate(['/app-developer']).then();
          }
        }, error => {
          console.error('request getAppByVersion', error);
          // this.router.navigate(['/app-developer']).then();
        }
    ));
  }

  getAppFormStatus(status: boolean): void {
    this.lockSubmitButton = status;
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
    this.subscriptions.add(this.appTypeService.getAppTypes(this.appTypePageNumber, this.appTypePageLimit)
    .subscribe(appTypesResponse => {
      if (appTypesResponse?.list) {
        this.currentAppsTypesItems = appTypesResponse.list
        .map(app => app.appTypeId)
        .filter(app => app && app.length > 0);
      } else {
        this.currentAppsTypesItems = [];
      }
    }, (error) => {
      this.currentAppsTypesItems = [];
      console.error('Can\'t get all Apps : ' + JSON.stringify(error));
    }));
  }

  private getFieldsByAppType(appType: string): void {
    this.appFields = null;
    this.subscriptions.add(this.appTypeService.getOneAppType(appType)
    .subscribe((appTypeResponse: any) => {
      if (appTypeResponse) {
        this.appFields = {
          fields: this.mapAppTypeToFields(appTypeResponse)
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

  private statusForUser(appData: FullAppData): string  {
    const status = appData?.status?.value;
    if (status) {
      switch (status) {
        case 'approved':
        case 'pending':
        case 'suspended':
        case 'rejected':
          return status;
        case 'inReview':
          return 'in review';
        case 'inDevelopment':
          return 'draft';
      }
    }
    return '';
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
}
