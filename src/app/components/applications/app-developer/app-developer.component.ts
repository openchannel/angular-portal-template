import { Component, OnInit } from '@angular/core';
import { KeyValuePairMapper, ChartService, AppService, Application } from 'oc-ng-common-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-developer',
  templateUrl: './app-developer.component.html',
  styleUrls: ['./app-developer.component.scss']
})
export class AppDeveloperComponent implements OnInit {

  labels = [];
  dataSets = [];
  count = 40;

  radioGrp: string[];
  modelText = 'month';

  chartStaticstics: KeyValuePairMapper[];
  chartProcessing = false;
  isProcessing = false;

  appList = new Application();
  fields = [];

  selectedChartField = "downloads";

  constructor(public chartService: ChartService, public appService: AppService, public router: Router) {

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

    this.chartProcessing = true;
    this.labels = [];
    this.dataSets = [];

    var obj = {
      period: this.modelText,
      field: this.selectedChartField,

    }
    this.chartService.getStats(obj).subscribe((res) => {

      this.count = res.count;
      this.chartStaticstics = res.data;
      this.chartStaticstics.forEach(c => {
        this.labels.push(c.key);
        this.dataSets.push(c.value);

      });

      this.chartProcessing = false;
      //console.log('labels ', this.labels);
      //console.log('datasets ', this.dataSets);

    }, (err) => {
    });
  }

  getApps() {
    this.isProcessing = true;
    this.appService.getApps().subscribe(res => {
      console.log(res);
      this.appList.appList = res.list;
      console.log(this.appList);
      this.isProcessing = false;
    })
  }

  newApp() {
    this.router.navigateByUrl('app-new')
  }
}
