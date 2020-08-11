import { Component, OnInit } from '@angular/core';
import { KeyValuePairMapper, SellerAppsWrapper, ChartService, SellerAppService, AppStatusDetails, SellerAppDetailsModel, SellerAppCustomDataModel } from 'oc-ng-common-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-app',
  templateUrl: './edit-app.component.html',
  styleUrls: ['./edit-app.component.scss']
})
export class EditAppComponent implements OnInit {
  labels = [];
  dataSets = [];
  count;

  appId:string;
  period = 'month';

  isChartProcessing = false;
  isAppProcessing = true;

  fields = [];

  selectedChartField = "downloads";

  downloadUrl = "./assets/img/cloud-download.svg";
  menuUrl = "./assets/img/dots-hr-icon.svg";
  sortIcon = "./assets/img/dropdown-icon.svg";

  appStatus = new AppStatusDetails();
  
  appDetails = new SellerAppDetailsModel();

  constructor(public chartService: ChartService, 
    public appService: SellerAppService, 
    public router: Router,
    private route: ActivatedRoute) {
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
    this.appId = this.route.snapshot.paramMap.get('appId');
    this.getChartStatistics();
    this.getAppById();
  }
  getChartStatistics() {

    this.isChartProcessing = true;
    this.labels = [];
    this.dataSets = [];

    var obj = {
      period: this.period,
      field: this.selectedChartField,
      query:"{appId:"+this.appId+"}"
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

  getAppById(){
    this.appService.getAppById(this.appId,'true').subscribe((res) => {
      this.setAppDetailsAndAppStatus(res);
      this.isAppProcessing=false;
    });
  }

  setAppDetailsAndAppStatus(appRes){
    this.appDetails=new SellerAppDetailsModel();
    this.appDetails.appId = appRes.appId;
    this.appDetails.name = appRes.name;
    let customData = new SellerAppCustomDataModel();
    customData.category= appRes.customData.category;
    customData.icon=appRes.customData.icon;
    customData.product__images = appRes.customData.product__images;
    customData.summary=appRes.customData.summary;
    customData.video__url=appRes.customData.video__url;
    customData.website__url=appRes.customData.website__url;
    customData.summary__plain__text=appRes.customData.summary__plain__text;
    if(appRes.customData.icon__file){
      customData.icon__file=[appRes.customData.icon__file];
      customData.icon__file[0].fileUploadProgress=100;
    }
    if(appRes.customData.product__images__file){
      customData.product__image__file=appRes.customData.product__images__file;
      customData.product__image__file.forEach((pFile) => {
        pFile.fileUploadProgress=100;
      });
    }
    this.appDetails.customData=customData;

    this.appStatus = new AppStatusDetails();
    this.appStatus.appCategory=appRes.customData.category;
    this.appStatus.appDescription=appRes.customData.summary__plain__text;
    this.appStatus.appLogoUrl=appRes.customData.icon;
    this.appStatus.appName=appRes.name;
    this.appStatus.appSavedDate=appRes.status?.lastUpdated;
    this.appStatus.appStatus=appRes.status?.value;
  }
}
