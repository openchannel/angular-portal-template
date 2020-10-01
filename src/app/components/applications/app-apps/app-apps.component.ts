import {Component, OnInit} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-apps-list',
    templateUrl: './app-apps.component.html',
    styleUrls: ['./app-apps.component.scss']
})
export class AppAppsComponent implements OnInit {

    constructor(private router: Router) {
    }

    public currentPage: string;
    public tabs = [{
        id: 'list',
        text: 'Create app',
        link: 'app-list/create-app'
    }, {
        id: 'create-app',
        text: 'Apps list',
        link: 'app-list/list'
    }, {
        id: 'edit-app',
        text: 'Apps list',
        link: 'app-list/list'
    }];

    ngOnInit(): void {
        this.getActivePage();
    }

    getActivePage() {
        this.currentPage = this.router.url.split('/')[2];
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.currentPage = this.router.url.split('/')[2];
            }
        });
    }

    changeTabType(): void {
        this.router.navigate([this.tabs.find(tab => tab.id === this.currentPage).link]).then();
    }

    buttonText(): string {
        return this.tabs.find(tab => tab.id === this.currentPage).text;
    }
}
