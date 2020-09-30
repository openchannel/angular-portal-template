import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-apps-list',
    templateUrl: './app-apps.component.html',
    styleUrls: ['./app-apps.component.scss']
})
export class AppAppsComponent implements OnInit {

    constructor(private router: Router) {
    }

    tabs = [{
        text: 'Apps list',
        link: 'app-list/create-app'
    }, {
        text: 'Create app',
        link: 'app-list/list'
    }];

    currentTab = this.tabs[0];

    ngOnInit(): void {
    }

    changeTabType() {
        this.currentTab = this.tabs.filter(tab => tab !== this.currentTab)[0];
        this.router.navigate([this.currentTab.link]).then();
    }
}
