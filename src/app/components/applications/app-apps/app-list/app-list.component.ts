import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationModalComponent} from '../../../../shared/modals/confirmation-modal/confirmation-modal.component';
import {AppStatus, AppVersionService, FullAppData, Page} from 'oc-ng-common-service';
import {debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';
import {FormControl} from '@angular/forms';


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
    query: '{\'$or\':[{\'status.value\':{\'$in\':[\'inReview\',\'pending\']}},'
        + '{\'parent.status.value\':\'approved\', \'isLive\':true},'
        + '{\'parent.status.value\':\'suspended\',\'isLive\':true}]}'
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
    query: '{\'status.value\':\'approved\',\'isLive\':true}'
  }, {
    display: 'Suspended',
    id: 'suspended',
    query: '{\'status.value\':\'suspended\',\'isLive\':true}'
  }];

  currentTab = this.tabs[0];
  displayMenu: {
    appId: string;
    version: number;
  };

  searchTextControl = new FormControl('');
  searchByFields = ['appId', 'name', 'type'];

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
    this.subscriptions.add(this.searchTextControl.valueChanges
    .pipe(debounceTime(200), filter(text => text && text.length > 0), distinctUntilChanged())
    .subscribe(searchText => {
      this.subscriptions.add(this.appVersionService.getAppsVersionsBySearchText(
          this.pageNumber, this.pageSize, null, this.currentTab.query, searchText, this.searchByFields)
      .subscribe(appsResponse => this.updateCurrentApps(appsResponse), error => {
        console.error('getAppsVersionsBySearchText', error);
      }));
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getAllApps(): void {
    this.displayMenu = null;
    this.currentApps = [];
    this.subscriptions.add(this.appVersionService.getAppsVersions(
        this.pageNumber, this.pageSize, null, this.currentTab.query).subscribe(appsResponse => {
      this.updateCurrentApps(appsResponse);
    }, (err) => console.error('ERROR Get all apps.', err)));
  }

  private updateCurrentApps(appsResponse: Page<FullAppData>): void {
    if (appsResponse && appsResponse?.list) {
      this.currentApps = appsResponse.list;
    }
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
    this.searchTextControl.setValue('');
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

  showDropdownMenuByApp(app: FullAppData): void {
      if (this.displayMenu && this.displayMenu.appId === app.appId && this.displayMenu.version === app.version) {
        this.displayMenu = null;
      } else {
        this.displayMenu = {
          appId: app.appId,
          version: app.version
        };
      }
  }

  deleteSelectedApp(app: FullAppData) {
    const modalRef = this.modal.open(ConfirmationModalComponent);

    modalRef.componentInstance.modalText = 'Are you sure you want to delete this app?';
    modalRef.componentInstance.action = 'Delete';
    modalRef.componentInstance.buttonText = 'DELETE';

    modalRef.result.then(res => {
      if (res && res === 'success') {
        this.subscriptions.add(this.appVersionService.deleteAppVersion(app.appId, app.version).subscribe(result => {
          this.getAllApps();
        }, error => console.error('Can\'t remove app', app.appId, app.version, error)));
      }
    });
  }
}
