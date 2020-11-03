import {Component, OnInit} from '@angular/core';
import {ChartService, CommonService, KeyValuePairMapper, SellerAppService, SellerAppsWrapper} from 'oc-ng-common-service';
import {Router} from '@angular/router';
import {DialogService, OcPopupComponent} from 'oc-ng-common-component';
import {NotificationService} from 'src/app/shared/custom-components/notification/notification.service';

@Component({
  selector: 'app-app-developer',
  templateUrl: './app-developer.component.html',
  styleUrls: ['./app-developer.component.scss']
})
export class AppDeveloperComponent implements OnInit {

  labels = [];
  dataSets = [];
  count;
  countText;
  //used to detect ghaph data change.
  random;
  period = 'month';

  chartStaticstics: KeyValuePairMapper[];
  isChartProcessing = false;
  isAppProcessing = false;
  isAppsLoading = true;
  isChartLoading = true;
  applications = new SellerAppsWrapper();
  fields = [];

  selectedChartField = 'downloads';

  downloadUrl = './assets/img/cloud-download.svg';
  menuUrl = './assets/img/dots-hr-icon.svg';
  sortIcon = './assets/img/dropdown-icon.svg';

  menuItems = {
    menu: '',
    appId: '',
    version: '',
    hasChild: false
  };

  private statsStartTime = {
    month: (date: Date): Date => {
      const dateEnd = new Date(date.getTime());
      dateEnd.setFullYear(date.getFullYear() - 1);
      return dateEnd;
    },
    day: (date: Date): Date => {
      const dateEnd = new Date(date.getTime());
      dateEnd.setMonth(date.getDay() - 31);
      return dateEnd;
    }
  };

  constructor(public chartService: ChartService, public appService: SellerAppService, public router: Router,
              private modalService: DialogService, private notificationService: NotificationService,
              private commonservice: CommonService) {

    var downloadObj = {
      key: 'Downloads',
      value: 'downloads'
    };
    this.fields.push(downloadObj);
    var viewObj = {
      key: 'Views',
      value: 'views'
    };
    this.fields.push(viewObj);

  }

  ngOnInit(): void {
    this.applications.list = [];
    this.commonservice.scrollToFormInvalidField({form: null, adjustSize: 60});
    this.getChartStatistics();
    this.getApps('true');
  }

  getValue(value) {
    return value;
  }


  getChartStatistics() {

    this.isChartProcessing = true;
    this.labels = [];
    this.dataSets = [];
    this.count = 0;
    const dateEnd = new Date();
    const dateStart = this.getDateStartByCurrentPeriod(dateEnd);

    this.chartService.getTimeSeries(this.period, this.selectedChartField, dateStart.getTime(), dateEnd.getTime())
    .subscribe((chartResponse) => {
      const normalizeChart = chartResponse = chartResponse?.length ? chartResponse : [];
      this.labels = normalizeChart.map(chart => new Date(chart[0]).toISOString().substring(0, 10));
      this.dataSets = normalizeChart.map(chart => chart[1]);
      normalizeChart.forEach(chart => this.count += chart[1]);
      this.random = Math.random();
      this.countText = `Total ${this.capitalizeFirstLetter(this.selectedChartField)}`;
      this.isChartProcessing = false;
      this.isChartLoading = false;
    }, (error) => {
      this.isChartLoading = false;
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

  changeField(value) {
    this.selectedChartField = value;
    this.getChartStatistics();
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
              // this.getApps('false', (res) => {
              //   this.notificationService.showSuccess("Application deleted successfully");
              //   this.modalService.modalService.dismissAll();
              // });
            }, (err) => {
              this.modalService.modalService.dismissAll();
            });

          });
    } else if (this.menuItems.menu === 'suspend') {
      // this.modalService.showConfirmDialog(OcPopupComponent as Component, "lg", "warning", "confirm",
      //   "Cancel", "Suspend", "Are you sure you want to <br> suspend this app?", "",
      //   "This action is terminal and cannot be reverted", (res) => {

      let suspend = [{
        appId: this.menuItems.appId,
        version: this.menuItems.version
      }];
      this.appService.suspendApp(suspend).subscribe(res => {
        // this.getApps('true', (res) => {
        //   this.notificationService.showSuccess("Application suspended successfully");
        //   // this.modalService.modalService.dismissAll();
        // });
      }, (err) => {
        // this.modalService.modalService.dismissAll();
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
              // this.getApps('false', (res) => {
              //   this.notificationService.showSuccess("Application submitted successfully");
              //   this.modalService.modalService.dismissAll();
              // });
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
          // this.modalService.modalService.dismissAll();
        });
      }, (err) => {
        // this.modalService.modalService.dismissAll();
      });
      // });
    }
  }

  private getDateStartByCurrentPeriod(dateEnd: Date): Date {
    const dateStart = new Date(dateEnd);
    if (this.period === 'month') {
      dateStart.setFullYear(dateEnd.getFullYear() - 1);
    } else if (this.period === 'day') {
      dateStart.setTime(dateStart.getTime() - 31 * 24 * 60 * 60 * 1000);
    } else {
      dateStart.setMonth(dateStart.getTime() - 31 * 24 * 60 * 60 * 1000);
      console.error('Not implement chart period.');
    }
    return dateStart;
  }


}
