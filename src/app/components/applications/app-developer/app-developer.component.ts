import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AppListing,
  AppListMenuAction,
  AppsService,
  AppTypeModel,
  AppTypeService,
  AppVersionService,
  ChartLayoutTypeModel,
  ChartService,
  ChartStatisticFiledModel,
  ChartStatisticModel,
  ChartStatisticPeriodModel,
  CommonService,
  FullAppData,
  MarketService,
  SellerAppsWrapper,
} from 'oc-ng-common-service';
import {Router} from '@angular/router';
import {DialogService} from 'oc-ng-common-component';
import {NotificationService} from 'src/app/shared/custom-components/notification/notification.service';
import { Observable, of, Subject } from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppConfirmationModalComponent} from '../../../shared/modals/app-confirmation-modal/app-confirmation-modal.component';
import {ToastrService} from 'ngx-toastr';
import {LoaderService} from '../../../shared/services/loader.service';
import {map} from 'rxjs/operators';
import {takeUntil} from 'rxjs/operators';
import {MarketModel} from 'oc-ng-common-service/lib/model/market.model';

@Component({
  selector: 'app-app-developer',
  templateUrl: './app-developer.component.html',
  styleUrls: ['./app-developer.component.scss']
})
export class AppDeveloperComponent implements OnInit, OnDestroy {

  count;
  countText;

  isAppProcessing = false;
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
      }, {
        id: 'views',
        label: 'Views'
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
    options: ['EDIT', 'PREVIEW', 'SUBMIT', 'SUSPEND', 'DELETE'],
    previewTemplate: ''
  };

  appSorting: any = {
    created: 1
  };

  private destroy$: Subject<void> = new Subject();

  constructor(public chartService: ChartService,
              public appService: AppsService,
              public appsVersionService: AppVersionService,
              public router: Router,
              private modalService: DialogService,
              private notificationService: NotificationService,
              private commonService: CommonService,
              private modal: NgbModal,
              private toaster: ToastrService,
              private appTypeService: AppTypeService,
              private marketService: MarketService,
              private loader: LoaderService) {

  }

  ngOnInit(): void {
    this.updateChartData(this.chartData.periods[0], this.chartData.fields[0]);
    this.applications.list = [];
    this.commonService.scrollToFormInvalidField({form: null, adjustSize: 60});
    this.getApps(1);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.loader.closeLoader('loadApps');
    this.loader.closeLoader('chartLoader');
  }

  updateChartData = (period: ChartStatisticPeriodModel, field: ChartStatisticFiledModel) => {
    const dateEnd = new Date();
    const dateStart = this.getDateStartByCurrentPeriod(dateEnd, period);
    this.loader.showLoader('chartLoader');
    this.chartService.getTimeSeries(period.id, field.id, dateStart.getTime(), dateEnd.getTime())
      .pipe(takeUntil(this.destroy$))
      .subscribe((chartData) => {
        this.count = 0;
        this.chartData = {
          ...this.chartData,
          data: chartData
        };
        this.count += chartData.labelsY.reduce((a, b) => a + b);
        this.countText = `Total ${field.label}`;
        this.loader.closeLoader('chartLoader');
      }, (error) => {
        console.error('Can\'t get Time Series', error);
        this.loader.closeLoader('chartLoader');
      });
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getApps(page: number): void {
    this.loader.showLoader('loadApps');
    this.isAppProcessing = true;
    const sort = JSON.stringify(this.appSorting);

    const query = {
      $or: [
        {
          'status.value': {$in: ['inReview', 'pending', 'inDevelopment', 'rejected']},
          'parent.status': {
            $exists: false,
          },
        },
        {
          'parent.status.value': 'approved',
          isLive: true,
        },
        {
          'parent.status.value': 'suspended',
          isLive: true,
        },
      ],
    };

    this.getPreviewAppUrl().pipe(takeUntil(this.destroy$)).subscribe(url => url);

    if (this.appListConfig.data && this.appListConfig.data.count !== 0 && this.appListConfig.data.pageNumber < page) {
     this.appsVersionService.getAppsVersions(page, 10, sort, JSON.stringify(query))
       .pipe(takeUntil(this.destroy$))
       .subscribe(response => {
          this.appListConfig.data.pageNumber = response.pageNumber;
          this.appListConfig.data.pages = response.pages;
          this.appListConfig.data.count = response.count;

          const parentList = response.list;
          parentList.map(value => {
            value.status = value.parent && value.parent.status ? value.parent.status : value.status;
          });

          if (page === 1) {
            this.appListConfig.data.list = this.getAppsChildren(parentList, sort);
          } else {
            this.appListConfig.data.list = [...this.appListConfig.data.list,
              ...this.getAppsChildren(parentList, sort)];
          }
          this.isAppProcessing = false;
          this.loader.closeLoader('loadApps');
        }, () => {
          this.appListConfig.data.list = [];
          this.isAppProcessing = false;
          this.loader.closeLoader('loadApps');
        });
    } else {
      this.loader.closeLoader('loadApps');
    }
  }

  getAppsChildren(parentList: FullAppData [], sort: string): FullAppData [] {
    const parents = [...parentList];
    let allChildren: FullAppData [];

    const parentIds: string[] = parents.map(parent => parent.appId);
    if (parentIds.length > 0) {
      const childQuery = {
        'status.value': {
          $in: ['inReview', 'pending', 'inDevelopment'],
        },
        appId: {
          $in: parentIds,
        },
        'parent.status': {
          $exists: true,
        },
      };

      this.appsVersionService.getAppsVersions(1, 200, sort, JSON.stringify(childQuery))
        .pipe(takeUntil(this.destroy$))
        .subscribe(response => {
          allChildren = response.list;
          parents.forEach(parent => {
            parent.children = allChildren.filter(child => child.appId === parent.appId);
          });
          this.loader.closeLoader('loadApps');
        });
    }

    return parents;
  }

  catchMenuAction(menuEvent: AppListMenuAction): void {
    switch (menuEvent.action) {
      case 'PREVIEW':
        this.getPreviewAppUrl().pipe(takeUntil(this.destroy$))
          .subscribe(previewUrl => {
          if (previewUrl) {
            window.open(previewUrl
            .replace('{appId}', menuEvent.appId)
            .replace('{version}', `${menuEvent.appVersion}`));
          } else {
            this.toaster.warning('Please Please set the preview App URL.');
          }
        }, () => this.toaster.warning('Please Please set the preview App URL.'));
        break;
      case 'EDIT':
        this.router.navigate(['/update', menuEvent.appId, menuEvent.appVersion], {queryParams: {formStatus: 'invalid'}}).then();
        break;
      case 'DELETE':
        const modalDelRef = this.modal.open(AppConfirmationModalComponent);

        modalDelRef.componentInstance.type = 'delete';
        modalDelRef.componentInstance.modalText = 'Delete this app from the marketplace now?';
        modalDelRef.componentInstance.modalTitle = 'Delete app';
        modalDelRef.componentInstance.buttonText = 'Yes, delete it';

        modalDelRef.result.then(res => {
          if (res && res === 'success') {
            if (menuEvent.isChild) {
              this.appsVersionService
                .deleteAppVersion(menuEvent.appId, menuEvent.appVersion)
                .pipe(takeUntil(this.destroy$))
                .subscribe( resp => {
                  if (resp.code && resp.code !== 200) {
                    this.toaster.error(resp.message);
                  } else {
                    this.appListConfig.data.pageNumber = 0;
                    this.toaster.success('Your app has been deleted');
                    this.getApps(1);
                  }
                });
            } else {
              this.appService.deleteApp(menuEvent.appId)
                .pipe(takeUntil(this.destroy$))
                .subscribe(resp => {
                  if (resp.code && resp.code !== 200) {
                    this.toaster.error(resp.message);
                  } else {
                    this.appListConfig.data.pageNumber = 0;
                    this.toaster.success('Your app has been deleted');
                    this.getApps(1);
                  }
                });
            }
          }
        });
        break;
      case 'SUBMIT':
        this.submitApp(menuEvent);
        break;
      case 'SUSPEND':
        if (this.appListConfig.data.list
          .find(app => app.appId === menuEvent.appId).status.value === 'approved') {
          const modalSuspendRef = this.modal.open(AppConfirmationModalComponent);

          modalSuspendRef.componentInstance.type = 'suspend';
          modalSuspendRef.componentInstance.modalText = 'Suspend this app from the marketplace now?';
          modalSuspendRef.componentInstance.modalTitle = 'Suspend app';
          modalSuspendRef.componentInstance.buttonText = 'Yes, suspend it';

          modalSuspendRef.result.then(res => {
            if (res && res === 'success') {
              this.appService.changeAppStatus(menuEvent.appId, menuEvent.appVersion, 'suspended')
              .pipe(takeUntil(this.destroy$))
              .subscribe(resp => {
                if (resp.code && resp.code !== 200) {
                  this.toaster.error(resp.message);
                } else {
                  this.appListConfig.data.pageNumber = 0;
                  this.toaster.success('Your app has been suspended');
                  this.getApps(1);
                }
              });
            }
          });
        }
        break;
    }
  }

  private submitApp(menuEvent: AppListMenuAction) {
    const modalRef = this.modal.open(AppConfirmationModalComponent);

    modalRef.componentInstance.type = 'simple';
    modalRef.componentInstance.modalText = 'Submit This App To The Marketplace Now?';
    modalRef.componentInstance.modalTitle = 'Submit app';
    modalRef.componentInstance.buttonText = 'Yes, submit it';

    modalRef.result.then(res => {
      if (res && res === 'success') {
        this.loader.showLoader('submitApp');

        this.appService.publishAppByVersion(menuEvent.appId, {
          version: menuEvent.appVersion, autoApprove: false,
        })
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
              this.loader.closeLoader('submitApp');

              this.appListConfig.data.pageNumber = 0;
              this.toaster.success('Your app has been submitted for approval');
              this.getApps(1);
            },
            err => {
              this.loader.closeLoader('submitApp');

              if (err.status === 400) {
                this.router.navigate(['/update', menuEvent.appId, menuEvent.appVersion],
                  {queryParams: {formStatus: 'invalid'}})
                  .then(() => {
                    this.toaster.info('Fill out all mandatory fields before submitting');
                  });
              } else {
                this.toaster.error(err.message);
              }
            });
      }
    });
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

  changeSorting(sortSettings) {
    if (sortSettings.by === 'status') {
      this.appSorting = {
        'status.value': sortSettings.ascending ? 1 : -1
      };
    } else {
      this.appSorting = {
        [sortSettings.by]: sortSettings.ascending ? 1 : -1
      };
    }
    this.appListConfig.data.count = 50;
    this.appListConfig.data.pageNumber = 0;
    this.getApps(1);
  }

  private getPreviewAppUrl(): Observable<string> {
    if (!this.appListConfig?.previewTemplate) {
      return this.marketService.getCurrentMarket()
      .pipe(map((marketSettings: MarketModel) => {
        this.appListConfig.previewTemplate = marketSettings.previewAppUrl;
        return marketSettings.previewAppUrl;
      }));
    } else {
      return of(this.appListConfig.previewTemplate);
    }
  }
}
