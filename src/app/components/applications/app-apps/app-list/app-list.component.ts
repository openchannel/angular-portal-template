import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {GraphqlService} from '../../../../graphql-client/graphql-service/graphql.service';
import {AppItem} from './model/app-item.model';
import {Subscription} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../../../shared/modals/confirmation-modal/confirmation-modal.component';


@Component({
    selector: 'app-app-list',
    templateUrl: './app-list.component.html',
    styleUrls: ['./app-list.component.scss']
})
export class AppListComponent implements OnInit, OnDestroy {

    constructor(private graphqlClient: GraphqlService,
                private modal: NgbModal) {
    }

    apps: AppItem[];

    filteredApps: AppItem[];
    tabs = [{
        display: 'All',
        id: 'all'
    }, {
        display: 'Pending',
        id: 'pending'
    }, {
        display: 'In Review',
        id: 'inReview'
    }, {
        display: 'Approved',
        id: 'approved'
    }, {
        display: 'Suspended',
        id: 'suspended'
    }];

    currentTab = this.tabs[0];
    displayMenuIndx: string;

    searchText = '';

    subscriptions: Subscription = new Subscription();

    @Input()
    set updateAppList(update: boolean) {
        if (update) {
            this.getAllApps();
        }
    }

    ngOnInit(): void {
        this.getAllApps();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getAllApps(): void {
        this.apps = [];
        this.subscriptions.add(this.graphqlClient.getAllApps().subscribe((response: { data: { allApps: AppItem[] } }) => {
            if (response && response.data && response.data.allApps) {
                this.apps = response.data.allApps;
            }
        }, () => console.log('ERROR Get all apps.')));
    }

    getTotalResultMessage(): string {
        const size = this.apps.length;
        if (size === 1) {
            return `( Result : ${size} )`;
        } else if (size > 1) {
            return `( Results : ${size} )`;
        }
        return '';
    }

    getAvailableApps() {
        return this.simpleNameFilter(this.simpleTabFilter(this.apps));
    }

    simpleNameFilter(appItems: AppItem[]): AppItem[] {
        if (this.searchText) {
            const normalizedSearchText = this.searchText.trim().toLowerCase();
            if (normalizedSearchText) {
                return this.filteredApps = appItems.filter(app => app.name && app.name.toLowerCase().includes(normalizedSearchText));
            }
        }
        return appItems;
    }

    simpleTabFilter(appItems: AppItem[]) {
        return appItems.filter(app => this.currentTab.id === 'all' || this.currentTab.id === app.status);
    }

    setNewApp(tabId: string): void {
        this.getAllApps();
        this.searchText = null;
        this.currentTab = this.tabs.find((e) => e.id === tabId);
    }

    getBackgroundColor(appStatus: string): string {
        if (appStatus) {
            switch (appStatus) {
                case 'approved':
                    return 'back-color-green';
                case 'inReview':
                    return 'back-color-purple';
                case 'pending':
                    return 'back-color-blue';
                case 'suspended':
                    return 'back-color-yellow';
                case 'rejected':
                    return 'back-color-red';
            }
        }
        console.error('Incorrect application status!');
        return 'back-color-red';
    }

    getStatusMessage(appStatus: string): string {
        if (appStatus) {
            switch (appStatus) {
                case 'approved':
                case 'pending':
                case 'suspended':
                case 'rejected':
                    return appStatus.toUpperCase();
                case 'inReview':
                    return 'IN REVIEW';
            }
        }
        console.error('Incorrect application status!');
        return 'STATUS';
    }

    showDropdownMenuByIndx(id) {
        if (this.displayMenuIndx === id) {
            this.displayMenuIndx = null;
        } else {
            this.displayMenuIndx = id;
        }
    }

    deleteSelectedApp(appId: string) {
        const modalRef = this.modal.open(ConfirmationModalComponent);

        modalRef.componentInstance.modalText = 'Are you sure you want to delete this app?';
        modalRef.componentInstance.action = 'Delete';
        modalRef.componentInstance.buttonText = 'DELETE';

        modalRef.result.then(res => {
            if (res && res === 'success') {
                console.log(res);
                this.graphqlClient.deleteApp(appId).subscribe(result => {
                    this.getAllApps();
                });
            }
        });
    }
}
