import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationModalComponent} from '../../../../shared/modals/confirmation-modal/confirmation-modal.component';
import {AppStatus, AppVersionService, FullAppData} from 'oc-ng-common-service';


@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.scss']
})
export class AppListComponent implements OnInit, OnDestroy {

  constructor(
      private appVersionService: AppVersionService,
      private modal: NgbModal) {
  }

  currentApps: FullAppData[];

  tabs = [{
    display: 'All',
    id: 'all',
    query: '{\'status.value\':{\'$in\':[\'pending\', \'inReview\', \'approved\',\'suspended\']}}'
  }, {
    display: 'Pending',
    id: 'pending',
    query: '{\'status.value\':\'pending\'}'
  }, {
    display: 'In Review',
    id: 'inReview',
    query: '{\'status.value\':\'inReview\'}'
  }, {
    display: 'Approved',
    id: 'approved',
    query: '{\'status.value\':\'approved\'}'
  }, {
    display: 'Suspended',
    id: 'suspended',
    query: '{\'status.value\':\'suspended\'}'
  }];

  currentTab = this.tabs[0];
  displayMenuIndx: string;

  searchText = '';

  subscriptions: Subscription = new Subscription();

  private pageNumber = 1;
  private pageSize = 100;

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
    this.currentApps = [];
    this.subscriptions.add(this.appVersionService.getAppsVersions(this.pageNumber, this.pageSize, null, this.currentTab.query)
    .subscribe((appsResponse) => {
      const apps = appsResponse?.list;
      if (apps) {
        this.currentApps = apps;
      }
    }, (err) => console.error('ERROR Get all apps.', err)));
  }

  getTotalResultMessage(): string {
    const size = this.currentApps.length;
    if (size === 1) {
      return `( Result : ${size} )`;
    } else if (size > 1) {
      return `( Results : ${size} )`;
    }
    return '';
  }

  setNewApp(tabId: string): void {
    this.searchText = null;
    this.currentTab = this.tabs.find((e) => e.id === tabId);
    this.getAllApps();
  }

  getBackgroundColor(appStatus: AppStatus): string {
    if (appStatus?.value) {
      switch (appStatus.value) {
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

  getStatusMessage(appStatus: AppStatus): string {
    if (appStatus?.value) {
      switch (appStatus?.value) {
        case 'approved':
        case 'pending':
        case 'suspended':
        case 'rejected':
          return appStatus.value.toUpperCase();
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
      console.log('delete app : ' + res);
      if (res && res === 'success') {
        // this.graphqlClient.deleteApp(appId).subscribe(result => {
        //     this.getAllApps();
        // });
      }
    });
  }
}
