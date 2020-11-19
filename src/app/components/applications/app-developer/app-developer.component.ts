import {Component, OnInit} from '@angular/core';
import {
  ChartLayoutTypeModel,
  ChartService,
  ChartStatisticFiledModel,
  ChartStatisticModel,
  ChartStatisticPeriodModel,
  CommonService,
  KeyValuePairMapper,
  SellerAppService,
  SellerAppsWrapper
} from 'oc-ng-common-service';
import {Router} from '@angular/router';
import {DialogService, OcPopupComponent} from 'oc-ng-common-component';
import {NotificationService} from 'src/app/shared/custom-components/notification/notification.service';

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
  sortIcon = './assets/img/dropdown-icon.svg';

  menuItems = {
    menu: '',
    appId: '',
    version: '',
    hasChild: false
  };

  constructor(public chartService: ChartService, public appService: SellerAppService, public router: Router,
              private modalService: DialogService, private notificationService: NotificationService,
              private commonservice: CommonService) {

  }

  ngOnInit(): void {
    this.updateChartData(this.chartData.periods[0], this.chartData.fields[0]);
    this.applications.list = [];
    this.commonservice.scrollToFormInvalidField({form: null, adjustSize: 60});
    this.getApps('true');
  }

  updateChartData = (period: ChartStatisticPeriodModel, field: ChartStatisticFiledModel) => {
    const dateEnd = new Date();
    const dateStart = this.getDateStartByCurrentPeriod(dateEnd, period);

    this.chartService.getTimeSeries(period.id, field.id, dateStart.getTime(), dateEnd.getTime())
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
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getApps(loader, callback?) {
    this.isAppProcessing = true;
    this.appService.getApps(loader).subscribe(res => {
      this.applications.list = res.list;
      this.isAppProcessing = false;
      this.isAppsLoading = false;
      if (callback) {
        callback();
      }
    }, (res) => {
      this.isAppProcessing = false;
      this.isAppsLoading = false;
      if (callback) {
        callback();
      }
    });
  }

  newApp() {
    this.router.navigateByUrl('app-new');
  }

  menuchange(event) {

    this.menuItems = event;
    if (this.menuItems.menu === 'delete') {
      let deleteMessage = this.menuItems?.hasChild ? 'Are you sure you want to delete <br> this app and all it\'s versions?' :
          'Are you sure you want to delete <br> this app version?';
      this.modalService.showConfirmDialog(OcPopupComponent as Component, 'lg', 'warning', 'confirm',
          'Cancel', 'Delete', deleteMessage, '',
          'This action is terminal and cannot be reverted', (res) => {
            this.appService.deleteApp(this.menuItems.appId, this.menuItems.version).subscribe(res => {
            }, (err) => {
              this.modalService.modalService.dismissAll();
            });

          });
    } else if (this.menuItems.menu === 'suspend') {

      let suspend = [{
        appId: this.menuItems.appId,
        version: this.menuItems.version
      }];
      this.appService.suspendApp(suspend).subscribe(res => {
      }, (err) => {
      });
      // });
    } else if (this.menuItems.menu === 'submit') {
      this.modalService.showConfirmDialog(OcPopupComponent as Component, 'lg', 'warning', 'confirm',
          'Cancel', 'Submit', 'Are you sure you want to <br> submit this app?', '',
          'This action is terminal and cannot be reverted', (res) => {

            let submit = {
              appId: this.menuItems.appId,
              version: this.menuItems.version
            };
            this.appService.submitApp(submit).subscribe(res => {
            }, (err) => {
              this.modalService.modalService.dismissAll();
            });
          });
    } else if (this.menuItems.menu === 'edit') {
      this.router.navigateByUrl('edit-app/' + this.menuItems.appId + '/version/' + this.menuItems.version);
    } else if (this.menuItems.menu === 'unsuspend') {

      let unsuspend = [{
        appId: this.menuItems.appId,
        version: this.menuItems.version
      }];
      this.appService.unsuspendApp(unsuspend).subscribe(res => {
        this.getApps('true', (res) => {
          this.notificationService.showSuccess('Application unsuspended successfully');
        });
      }, (err) => {
      });
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
