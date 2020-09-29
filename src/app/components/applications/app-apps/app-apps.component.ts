import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-apps-list',
    templateUrl: './app-apps.component.html',
    styleUrls: ['./app-apps.component.scss']
})
export class AppAppsComponent implements OnInit {

    constructor() {
    }

    tabs = [{
        text: 'Create app',
        id: 'id_create_app'
    }, {
        text: 'Apps list',
        id: 'id_apps_list'
    }];

    currentTab = this.tabs[0];
    updateAppList = false;

    ngOnInit(): void {
    }

    changeTabType(updateListData: boolean) {
        this.currentTab = this.tabs.filter(tab => tab !== this.currentTab)[0];
        if (updateListData) {
            this.updateAppList = this.currentTab.id === 'id_apps_list';
        } else {
            this.updateAppList = false;
        }
    }
}
