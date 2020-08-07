import { Component, OnInit } from '@angular/core';
import { KeyValuePairMapper, SellerAppsWrapper, ChartService, SellerAppService, AppStatusDetails, SellerAppDetailsModel } from 'oc-ng-common-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-app',
  templateUrl: './edit-app.component.html',
  styleUrls: ['./edit-app.component.scss']
})
export class EditAppComponent implements OnInit {
  labels = [];
  dataSets = [];
  count;

  period = 'month';

  isChartProcessing = false;
  isAppProcessing = false;

  fields = [];

  selectedChartField = "downloads";

  downloadUrl = "./assets/img/cloud-download.svg";
  menuUrl = "./assets/img/dots-hr-icon.svg";
  sortIcon = "./assets/img/dropdown-icon.svg";

  appStatus = new AppStatusDetails();
  
  appDetails = new SellerAppDetailsModel();

  constructor(public chartService: ChartService, 
    public appService: SellerAppService, 
    public router: Router) {
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
    this.appStatus.appCategory=["Communication", "Featured","Essential Apps"];
    this.appStatus.appStatus="Draft";
    this.appStatus.appName="Unicorn";
    this.appStatus.appDescription="Collaborate with teammates anytime, anywhere";
    this.appStatus.appLogoUrl="https://drive.google.com/u/0/uc?id=1KipwDw0K8xJC_StaAhsyDTEgcAoVHqDp&export=download";
    this.appStatus.appSavedDate=1596811383535;
    this.getChartStatistics();
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
      res.data.forEach(c => {
        this.labels.push(c.key);
        this.dataSets.push(c.value);
      });

      this.isChartProcessing = false;

    }, (err) => {
    });
  }

  gotoAppsList(){
    this.router.navigate(['./app-developer']);
  }

  cancelNewApp(){
    this.router.navigate(['./app-developer']);
  }
}
