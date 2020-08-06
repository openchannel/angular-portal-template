import { Component, OnInit } from '@angular/core';
import { KeyValuePairMapper, ChartService, SellerAppService, SellerAppsWrapper } from 'oc-ng-common-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-developer',
  templateUrl: './app-developer.component.html',
  styleUrls: ['./app-developer.component.scss']
})
export class AppDeveloperComponent implements OnInit {

  labels = [];
  dataSets = [];
  count;

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

  constructor(public chartService: ChartService, public appService: SellerAppService, public router: Router) {

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

      this.count = res.count;
      this.chartStaticstics = res.data;
      this.chartStaticstics.forEach(c => {
        this.labels.push(c.key);
        this.dataSets.push(c.value);

      });

      this.isChartProcessing = false;

    }, (err) => {
    });
  }

  getApps() {
    this.isAppProcessing = true;
    this.appService.getApps().subscribe(res => {
      this.applications.list = res.list;
      this.isAppProcessing = false;
    })
  }

  newApp() {
    this.router.navigateByUrl('app-new')
  }
}
