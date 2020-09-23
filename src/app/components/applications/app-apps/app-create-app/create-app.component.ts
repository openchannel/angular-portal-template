import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppsServiceImpl} from '../../../../core/services/apps-services/model/apps-service-impl';
import {AppField} from '../../../../core/services/apps-services/model/apps-model';

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
    currentAppsTypes: string [] = [];

    appDataGroup: FormGroup;
    appFields: AppField[];
    subscriptions: Subscription [] = [];

    constructor(private appsService: AppsServiceImpl,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.initAppDataGroup();
        this.getAllAppTypes();
        this.getFieldsByAppType('test');
    }

    initAppDataGroup(): void {
        this.appDataGroup = this.fb.group({
            appId: ['', Validators.required],
            appType: ['', Validators.required]
        });
    }

    customSearch = (text$: Observable<string>) =>
        text$.pipe(debounceTime(200), distinctUntilChanged(), switchMap(termDeveloperId =>
            this.appsService.getDevelopersById(termDeveloperId, 1, 100).toPromise().then(developersResponse => {
                if (developersResponse?.list.length === 0) {
                    const normalizedDeveloperId = termDeveloperId.trim();
                    if (normalizedDeveloperId.length > 0) {
                        this.currentAppAction = this.appActions.find((e) => e.type === 'CREATE');
                        return [normalizedDeveloperId];
                    }
                } else {
                    this.currentAppAction = this.appActions.find((e) => e.type === 'SEARCH');
                    return developersResponse.list.map(developer => developer.developerId);
                }
            }).catch(error => {
                console.error('Can\'t get developers id' + JSON.stringify(error));
                return [];
            })
        ));

    getAllAppTypes(): void {
        this.subscriptions.push(this.appsService.getApps(1, 100).subscribe(appResponse => {
            if (appResponse.list) {
                this.currentAppsTypes = appResponse.list.map(app => app.label);
            } else {
                this.currentAppsTypes = [];
            }
        }, (error) => {
            console.error('Can\'t get all Apps : ' + JSON.stringify(error));
            this.currentAppsTypes = [];
        }));
    }

    getFieldsByAppType(appType: string) {
        this.subscriptions.push(this.appsService.getFieldsByAppType(appType).subscribe((fieldsResponse) => {
                console.log('all fields : ' + JSON.stringify(fieldsResponse.list));
            }, (error => {
                console.error('ERROR getFieldsByAppType : ' + JSON.stringify(error));
            })));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
