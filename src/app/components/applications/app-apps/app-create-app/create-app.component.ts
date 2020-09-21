import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';

@Component({
    selector: 'app-create-app',
    templateUrl: './create-app.component.html',
    styleUrls: ['./create-app.component.scss']
})
export class CreateAppComponent implements OnInit {

    constructor() {
    }

    @ViewChild('createNewAppIdTemplate')
    createNewAppIdTemplate: TemplateRef<any>;

    @ViewChild('showAppIdTemplate')
    showAppIdTemplate: TemplateRef<any>;

    allAppsId = ['tags', 'subjects', 'buttons'];

    currentTextAppId: string;
    currentAppsId = this.allAppsId;
    currentAppsIdTemplate = this.showAppIdTemplate;

    ngOnInit(): void {
    }


    updateNewAppName(newAppName: any) {
        this.currentTextAppId = newAppName;
    }

    onEmptyExistsItemsOfAllAppsId(currentAppsId: string[]) {
        if (currentAppsId.length === 0) {
            this.setCurrentApps(this.createNewAppIdTemplate, [this.currentTextAppId]);
        } else {
            this.setCurrentApps(this.showAppIdTemplate, this.allAppsId);
        }
    }

    setCurrentApps(appsTemplate: TemplateRef<any>, appsId: string []) {
        this.setCurrentAppsTemplate(appsTemplate);
        this.setCurrentAppsId(appsId);
    }

    setCurrentAppsTemplate(appsTemplate: TemplateRef<any>) {
        this.currentAppsIdTemplate = appsTemplate;
    }

    setCurrentAppsId(appsId: string []) {
        this.currentAppsId = appsId;
    }

    createNewAppId() {
        this.allAppsId.push(this.currentTextAppId);
        this.setCurrentApps(this.showAppIdTemplate, this.allAppsId);
    }
}
