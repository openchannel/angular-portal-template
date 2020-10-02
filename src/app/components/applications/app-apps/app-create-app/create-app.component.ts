import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppsServiceImpl} from '../../../../core/services/apps-services/model/apps-service-impl';
import {FieldDefinition} from '../../../../core/services/apps-services/model/apps-model';
import {GraphqlService} from '../../../../graphql-client/graphql-service/graphql.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    existsAppsTypes: string [] = [];

    appDataFormGroup: FormGroup;
    appFields: {
        fields: FieldDefinition []
    };

    subscriptions: Subscription = new Subscription();
    lockSubmitButton = false;

    pageType: string;
    appId: string;
    appVersion: number;

    @Output()
    createdApp = new EventEmitter<boolean>();

    constructor(private appsService: AppsServiceImpl,
                private fb: FormBuilder,
                private graphqlService: GraphqlService,
                private router: Router,
                private activeRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.pageType = this.router.url.split('/')[2];
        this.initAppDataGroup();
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
                safeNames: ['', Validators.required]
            });
        }
    }

    customSearch = (text$: Observable<string>) =>
        text$.pipe(debounceTime(200), distinctUntilChanged(), switchMap(termDeveloperId =>
            this.graphqlService.getDevelopers(termDeveloperId, 1, 20).toPromise().then((developersResponse: any) => {
                const developers = developersResponse?.data?.getDevelopers?.list;
                if (developers?.length === 0) {
                    const normalizedDeveloperId = termDeveloperId.trim();
                    if (normalizedDeveloperId.length > 0) {
                        this.currentAppAction = this.appActions.find((e) => e.type === 'CREATE');
                        return [normalizedDeveloperId];
                    }
                } else {
                    this.currentAppAction = this.appActions.find((e) => e.type === 'SEARCH');
                    if (developers) {
                        return developers.map(developer => developer.developerId);
                    } else {
                        return [];
                    }
                }
            }).catch(error => {
                console.error('Can\'t get developers id' + JSON.stringify(error));
                return [];
            })
        ))

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
        this.currentAppsTypesItems = [];
        this.existsAppsTypes = [];
        this.subscriptions.add(this.graphqlService.getAppTypes(1, 100, true)
            .subscribe((appResponse: any) => {
                const appTypes = appResponse?.data?.getAppTypes?.list;
                if (appTypes && appTypes.length > 0) {
                    this.existsAppsTypes = appTypes;
                    this.currentAppsTypesItems = appTypes.map(app => app.id).filter(app => app && app.length > 0);
                }
            }, (error) => {
                console.error('Can\'t get all Apps : ' + JSON.stringify(error));
            }));
    }

    private getFieldsByAppType(appType: string): void {
        this.appFields = null;
        this.subscriptions.add(this.graphqlService.getAppType(appType)
            .subscribe((appTypeResponse: any) => {
                const fieldDefinitions = appTypeResponse?.data?.getAppType?.fieldDefinitions;
                if (fieldDefinitions && fieldDefinitions.length > 0) {
                    this.appFields = {
                        fields: fieldDefinitions
                    };
                }
            }, (error => {
                console.error('ERROR getFieldsByAppType : ' + JSON.stringify(error));
            })));
    }

    saveApp(fields: any): void {
        this.lockSubmitButton = true;
        if (this.pageType === 'create-app') {
            this.subscriptions.add(this.graphqlService.createApp(this.buildDataForSaving(fields))
              .subscribe((response) => {
                  this.lockSubmitButton = false;
                  this.router.navigate(['/app-list/list']).then();
              }, () => {
                  this.lockSubmitButton = false;
                  this.currentAppAction = this.appActions[0];
                  console.log('Can\'t save a new app.');
              }));
        } else {
            this.subscriptions.add(this.graphqlService.updateOneApp(this.appId, this.appVersion, this.buildDataForSaving(fields))
              .subscribe(
                response => {
                    if (response.data) {
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

    buildDataForSaving(fields: any): any {
        if (this.pageType === 'create-app') {
            const formGroupData = this.appDataFormGroup.value;
            return {
                type: formGroupData?.type,
                name: fields?.name,
                autoApprove: true,
                customData: {
                    ...fields
                }
            };
        } else {
            const dataToServer = {
                fields: [
                    {
                        id: 'name',
                        fieldValue: this.appDataFormGroup.get('name').value
                    },
                    {
                        id: 'safeNames',
                        fieldValue: this.appDataFormGroup.get('safeNames').value
                    }
                ]
            };

            Object.keys(fields).forEach(key => {
                const oneField = {
                    id: key,
                    fieldValue: fields[key]
                };
                dataToServer.fields.push(oneField);
            });
            return dataToServer;
        }
    }

    getAppData() {
        this.appId = this.activeRoute.snapshot.paramMap.get('appId');
        this.appVersion = Number(this.activeRoute.snapshot.paramMap.get('versionId'));
        this.subscriptions.add(this.graphqlService.oneApp(this.appId, this.appVersion).subscribe(
          (result: any) => {
              const data = result.data.oneApp;
              this.appDataFormGroup.get('name').setValue(data.name);
              this.appDataFormGroup.get('safeNames').setValue(data.safeNames);
              this.appFields = {
                  fields: data.customFields
                    .map(field => {
                        field.fieldDefinition.defaultValue = data.customAppData[field.fieldDefinition.id.replace('customData.', '')];
                        return field.fieldDefinition;
                    })
              };
          }
        ));
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
