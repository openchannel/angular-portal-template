import {Component, OnInit} from '@angular/core';
import {
  AppListing, AppListMenuAction, AppsService, AppVersionService,
  ChartLayoutTypeModel,
  ChartService,
  ChartStatisticFiledModel,
  ChartStatisticModel,
  ChartStatisticPeriodModel,
  CommonService, FullAppData,
  KeyValuePairMapper,
  SellerAppsWrapper
} from 'oc-ng-common-service';
import {Router} from '@angular/router';
import {DialogService} from 'oc-ng-common-component';
import {NotificationService} from 'src/app/shared/custom-components/notification/notification.service';
import {Subscription} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../../shared/modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-app-developer',
  templateUrl: './app-developer.component.html',
  styleUrls: ['./app-developer.component.scss']
})
export class AppDeveloperComponent implements OnInit {

  count;
  countText;
  // used to detect ghaph data change.
  random;
  chartStaticstics: KeyValuePairMapper[];

  isAppProcessing = false;
  isAppsLoading = true;
  applications = new SellerAppsWrapper();

  chartData: ChartStatisticModel = {
    data: null,
    periods: [
      {
        id: 'month',
        label: 'Monthly',
        active: true,
      }, {
        id: 'day',
        label: 'Daily'
      }
    ],
    fields: [
      {
        id: 'downloads',
        label: 'Downloads',
        active: true,
      }, {
        id: 'reviews',
        label: 'Reviews',
      }, {
        id: 'leads',
        label: 'Leads',
      }],
    layout: ChartLayoutTypeModel.standard
  };

  downloadUrl = './assets/img/cloud-download.svg';
  menuUrl = './assets/img/dots-hr-icon.svg';

  // Config for the App Version List component
  appListConfig: AppListing = {
    layout: 'table',
    data: {
      pages: 1,
      pageNumber: 0,
      list: [],
      count: 50
    },
    options: ['EDIT', 'PREVIEW', 'PUBLISH', 'SUSPEND', 'DELETE'],
    previewTemplate: ''
  };

  private requestsSubscriber: Subscription = new Subscription();

  constructor(public chartService: ChartService,
              public appService: AppsService,
              public appsVersionService: AppVersionService,
              public router: Router,
              private modalService: DialogService,
              private notificationService: NotificationService,
              private commonService: CommonService,
              private modal: NgbModal) {

  }

  ngOnInit(): void {
    this.updateChartData(this.chartData.periods[0], this.chartData.fields[0]);
    this.applications.list = [];
    this.commonService.scrollToFormInvalidField({form: null, adjustSize: 60});
    this.getApps(1);
  }

  updateChartData = (period: ChartStatisticPeriodModel, field: ChartStatisticFiledModel) => {
    const dateEnd = new Date();
    const dateStart = this.getDateStartByCurrentPeriod(dateEnd, period);

    this.requestsSubscriber.add(this.chartService.getTimeSeries(period.id, field.id, dateStart.getTime(), dateEnd.getTime())
    .subscribe((chartResponse) => {
      this.count = 0;
      if (chartResponse) {
        let labelsDataX: string[];
        if (period.id === 'month') {
          labelsDataX = chartResponse.map(chart => new Date(chart[0]).toLocaleDateString('default', {month: 'short'}));
        } else {
          labelsDataX = chartResponse.map(chart => new Date(chart[0])).map(date => {
            return `${date.toLocaleDateString('default', {month: 'short'})} ${date.getDate()}`;
          });
        }
        this.chartData.data = {
          labelsX: labelsDataX,
          labelsY: chartResponse.map(chart => chart[1])
        };
        chartResponse.forEach(chart => this.count += chart[1]);
      } else {
        this.chartData.data = null;
      }
      this.random = Math.random();
      this.countText = `Total ${field.label}`;
    }, (error) => {
      console.error('Can\'t get Time Series', error);
    }));
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getApps(page: number): void {
    this.isAppProcessing = true;
    const sort = '{"created":1}';
    const query = '{"isLatestVersion": true}';

    if (this.appListConfig.data && this.appListConfig.data.count !== 0 && this.appListConfig.data.pageNumber < page) {
      this.requestsSubscriber.add(this.appsVersionService.getAppsVersions(page, 10, sort, query)
        .subscribe(response => {
          this.appListConfig.data.pageNumber = response.pageNumber;
          this.appListConfig.data.pages = response.pages;
          this.appListConfig.data.count = response.count;
          if (page === 1 ) {
            this.appListConfig.data.list = this.getAppsChildren(response.list, sort);
          } else {
            this.appListConfig.data.list = [...this.appListConfig.data.list,
              ...this.getAppsChildren(response.list, sort)];
          }
          this.isAppProcessing = false;
        }, () => {
          this.appListConfig.data.list = [];
          this.isAppProcessing = false;
        }));
    }
  }

  getAppsChildren(parentList: FullAppData [], sort: string): FullAppData [] {
    const parentIds: string [] = [];
    const parents = [...parentList];
    let allChildren: FullAppData [];

    parents.forEach(parent => {
      parentIds.push(parent.appId);
    });
    const query = '{"$and":[{"appId":{"$in":["' + parentIds.join('","') + '"]}' +
      '},{"status.value":{"$in":["inReview","pending"]},' +
      ' "parent.status":{"$exists":true}}]}';

    this.requestsSubscriber.add(this.appsVersionService.getAppsVersions(1, 200, sort, query)
      .subscribe(response => {
        allChildren = response.list;
        parents.forEach(parent => {
          parent.children = allChildren.filter(child => child.appId === parent.appId);
        });
      }));

    return parents;
  }

  catchMenuAction(menuEvent: AppListMenuAction): void {
    switch (menuEvent.action) {
      case 'EDIT':
        this.router.navigate(['/edit-app', menuEvent.appId, 'version', menuEvent.appVersion]).then();
        break;
      case 'DELETE':
        const modalDelRef = this.modal.open(ConfirmationModalComponent);

        modalDelRef.componentInstance.type = 'delete';
        modalDelRef.componentInstance.modalText = 'Delete this app from the marketplace now?';
        modalDelRef.componentInstance.modalTitle = 'Delete app';
        modalDelRef.componentInstance.buttonText = 'Yes, delete it';

        modalDelRef.result.then(res => {
          if (res && res === 'success') {
            if (menuEvent.isChild) {
              this.requestsSubscriber.add(this.appsVersionService
                .deleteAppVersion(menuEvent.appId, menuEvent.appVersion)
                .subscribe( resp => {
                  if (resp.code && resp.code !== 200) {
                    // todo error toaster with resp.message should be here
                  } else {
                    this.appListConfig.data.pageNumber = 0;
                    this.getApps(1);
                  }
                }));
            } else {
              this.requestsSubscriber.add(this.appService.deleteApp(menuEvent.appId)
                .subscribe(resp => {
                  if (resp.code && resp.code !== 200) {
                    // todo error toaster with resp.message should be here
                  } else {
                    this.appListConfig.data.pageNumber = 0;
                    this.getApps(1);
                  }
                }));
            }
          }
        });
        break;
      case 'PUBLISH':
        const modalRef = this.modal.open(ConfirmationModalComponent);

        modalRef.componentInstance.type = 'simple';
        modalRef.componentInstance.modalText = 'Submit This App To The Marketplace Now?';
        modalRef.componentInstance.modalTitle = 'Submit app';
        modalRef.componentInstance.buttonText = 'Yes, submit it';

        modalRef.result.then(res => {
          if (res && res === 'success') {
            this.requestsSubscriber.add(this.appService.publishAppByVersion(menuEvent.appId, {
              version: menuEvent.appVersion, autoApprove: true})
              .subscribe((resp) => {
                if (resp.code && resp.code !== 200) {
                  // todo error toaster with resp.message should be here
                } else {
                  this.appListConfig.data.pageNumber = 0;
                  this.getApps(1);
                }
              }));
          }
        });
        break;
      case 'PREVIEW':
        break;
      case 'SUSPEND':
        if (this.appListConfig.data.list
          .find(app => app.appId === menuEvent.appId).status.value === 'approved') {
          const modalSuspendRef = this.modal.open(ConfirmationModalComponent);

          modalSuspendRef.componentInstance.type = 'suspend';
          modalSuspendRef.componentInstance.modalText = 'Suspend this app from the marketplace now?';
          modalSuspendRef.componentInstance.modalTitle = 'Suspend app';
          modalSuspendRef.componentInstance.buttonText = 'Yes, suspend it';

          modalSuspendRef.result.then(res => {
            if (res && res === 'success') {
              this.requestsSubscriber.add(
                this.appService.changeAppStatus(menuEvent.appId, menuEvent.appVersion, 'suspended')
                .subscribe(resp => {
                  if (resp.code && resp.code !== 200) {
                    // todo error toaster with resp.message should be here
                  } else {
                    this.appListConfig.data.pageNumber = 0;
                    this.getApps(1);
                  }
                }));
            }
          });
        }
        break;
    }
  }

  getDateStartByCurrentPeriod(dateEnd: Date, period: ChartStatisticPeriodModel): Date {
    const dateStart = new Date(dateEnd);
    if (period?.id === 'month') {
      dateStart.setFullYear(dateEnd.getFullYear() - 1);
    } else if (period?.id === 'day') {
      dateStart.setTime(dateStart.getTime() - 31 * 24 * 60 * 60 * 1000);
    } else {
      dateStart.setMonth(dateStart.getTime() - 31 * 24 * 60 * 60 * 1000);
      console.error('Not implement chart period.');
    }
    return dateStart;
  }
}
