import { Component, OnInit } from '@angular/core';
import { KeyValuePairMapper, ChartService, SellerAppService, SellerAppsWrapper } from 'oc-ng-common-service';
import { Router } from '@angular/router';
import { OcPopupComponent, DialogService } from 'oc-ng-common-component';
import { NotificationService } from 'src/app/shared/custom-components/notification/notification.service';

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

  applications = new SellerAppsWrapper();
  fields = [];

  selectedChartField = "downloads";

  downloadUrl = "./assets/img/cloud-download.svg";
  menuUrl = "./assets/img/dots-hr-icon.svg";
  sortIcon = "./assets/img/dropdown-icon.svg";
  editIcon = "./assets/img/delete.svg";
  publishIcon = "./assets/img/publish.svg";

  menuItems = {
    menu: '',
    appId: '',
    version: ''
  };

  constructor(public chartService: ChartService, public appService: SellerAppService, public router: Router, private modalService: DialogService, private notificationService: NotificationService) {

    var downloadObj = {
      key: "Downloads",
      value: "downloads"
    }
    this.fields.push(downloadObj);
    var viewObj = {
      key: "Views",
      value: "views"
    }
    this.fields.push(viewObj);

  }

  ngOnInit(): void {
    this.getChartStatistics();
    this.getApps();
  }

  getValue(value) {
    return value;
  }


  getChartStatistics() {

    this.isChartProcessing = true;
    this.labels = [];
    this.dataSets = [];

    var obj = {
      period: this.period,
      field: this.selectedChartField,

    }
    this.chartService.getStats(obj).subscribe((res) => {

      this.chartStaticstics = res.data;
      this.chartStaticstics.forEach(c => {
        this.labels.push(c.key);
        this.dataSets.push(c.value);

      });
      this.count = res.count;
      this.random = Math.random();
      this.countText = 'Total ' + this.capitalizeFirstLetter(this.selectedChartField);

      this.isChartProcessing = false;

    }, (err) => {
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getApps() {
    this.isAppProcessing = true;
    this.appService.getApps().subscribe(res => {
      this.applications.list = res.list;
      this.isAppProcessing = false;
    })
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
      this.modalService.showConfirmDialog(OcPopupComponent as Component, "md", "warning", "confirm",
        "Cancel", "Delete", "Are you sure you want to delete this app?", "",
        "You can keep this app as draft", (res) => {
          this.appService.deleteApp(this.menuItems.appId).subscribe(res => {
            this.notificationService.showSuccess("Application deleted successfully");
            this.modalService.modalService.dismissAll();
            this.getApps();
          }, (err) => {
            this.modalService.modalService.dismissAll();
          });

        });
    } else if (this.menuItems.menu === 'suspend') {
      this.modalService.showConfirmDialog(OcPopupComponent as Component, "md", "warning", "confirm",
        "Cancel", "Suspend", "Are you sure you want to suspend this app?", "",
        "You can keep this app as draft", (res) => {

          let suspend = [{
            appId: this.menuItems.appId,
            version: this.menuItems.version
          }]
          this.appService.suspendApp(suspend).subscribe(res => {
            this.notificationService.showSuccess("Application suspended successfully");
            this.modalService.modalService.dismissAll();
            this.getApps();
          }, (err) => {
            this.modalService.modalService.dismissAll();
          });
        });
    } else if (this.menuItems.menu === 'publish') {
      this.modalService.showConfirmDialog(OcPopupComponent as Component, "md", "warning", "confirm",
        "Cancel", "Publish", "Are you sure you want to publish this app?", "",
        "You can keep this app as draft", (res) => {

          let publish = {
            appId: this.menuItems.appId,
            version: this.menuItems.version
          }
          this.appService.publishApp(publish).subscribe(res => {
            this.notificationService.showSuccess("Application published successfully");
            this.modalService.modalService.dismissAll();
            this.getApps();
          }, (err) => {
            this.modalService.modalService.dismissAll();
          });
        });
    } else if (this.menuItems.menu === 'edit') {
      this.router.navigateByUrl('edit-app/'+this.menuItems.appId);
    }
    console.log(this.menuItems);
  }

}
