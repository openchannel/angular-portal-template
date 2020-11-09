import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GraphqlService} from '../../../../graphql-client/graphql-service/graphql.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AppsService, AppTypeModel, AppTypeService, AppVersionService, FullAppData} from 'oc-ng-common-service';
import {AppTypeFieldModel} from 'oc-ng-common-service/lib/model/app-type-model';
import {CreateAppModel, UpdateAppVersionModel} from 'oc-ng-common-service/lib/model/app-data-model';

@Component({
  selector: 'app-create-app',
  templateUrl: './create-app.component.html',
  styleUrls: ['./create-app.component.scss']
})
export class CreateAppComponent implements OnInit, OnDestroy {

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
  lockSubmitButton = false;

  pageTitle: 'New App' | 'Edit App';
  pageType: string;
  appId: string;
  appVersion: number;

  private appTypePageNumber = 1;
  private appTypePageLimit = 100;

  @Output()
  createdApp = new EventEmitter<boolean>();

  constructor(private appsService: AppsService,
              private fb: FormBuilder,
              private graphqlService: GraphqlService,
              private appVersionService: AppVersionService,
              private appTypeService: AppTypeService,
              private router: Router,
              private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.pageType = this.router.url.split('/')[2];
    this.initAppDataGroup();
    this.pageTitle = this.getPageTitleByPage(this.pageType);
    if (this.pageType === 'create-app') {
      this.addListenerAppTypeField();
      this.getAllAppTypes();
    } else {
      this.getAppData();
    }
  }

  initAppDataGroup(): void {
    if (this.pageType === 'create-app') {
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

  saveApp(fields: any): void {
    this.lockSubmitButton = true;
    if (this.pageType === 'create-app') {
      this.subscriptions.add(this.appsService.createApp(this.buildDataForCreate(fields))
      .subscribe((appResponse) => {
        if (appResponse) {
          this.subscriptions.add(this.appsService.publishAppByVersion(appResponse.appId, {
            version: appResponse.version,
            autoApprove: true
          }).subscribe((emptyResponse) => {
            this.lockSubmitButton = false;
            this.router.navigate(['/app-list/list']).then();
          }, error => console.error('request publishAppByVersion', error)));
        } else {
          console.error('Can\'t save a new app. Empty response.');
        }
      }, () => {
        this.lockSubmitButton = false;
        this.currentAppAction = this.appActions[0];
        console.log('Can\'t save a new app.');
      }));
    } else {
      this.subscriptions.add(this.appVersionService.updateAppByVersion(this.appId, this.appVersion, this.buildDataForUpdate(fields))
      .subscribe(
          response => {
            if (response) {
              this.lockSubmitButton = false;
              this.router.navigate(['/app-list/list']).then();
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

  buildDataForUpdate(fields: any) {
    const dataToServer: UpdateAppVersionModel = {
      name: this.appDataFormGroup.get('name').value,
      approvalRequired: false,
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
              this.router.navigate(['/app-list/list']).then();
            }));
          } else {
            console.error('request getAppByVersion : empty response');
            this.router.navigate(['/app-list/list']).then();
          }
        }, error => {
          console.error('request getAppByVersion', error);
          this.router.navigate(['/app-list/list']).then();
        }
    ));
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

  private getPageTitleByPage(currentPage: string): 'New App' | 'Edit App' {
    if ('create-app' === currentPage) {
      return 'New App';
    }
    return 'Edit App';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
