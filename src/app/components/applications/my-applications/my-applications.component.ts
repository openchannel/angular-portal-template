import { Component, OnInit } from '@angular/core';
import { MyApplicationsService } from 'src/app/shared/services/my-applications.service';
import { DialogService } from 'src/app/shared/services/dialog.service'
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ApplicationService } from 'src/app/shared/services/application.service';
import { UserService } from 'src/app/shared/services/user.service';
// import { stat } from 'fs';
import { DatePipe } from '@angular/common';
import { NotificationService } from 'src/app/shared/custom-components/notification/notification.service';
import { CommonService } from 'src/app/shared/services/common-service';

@Component({
  selector: 'app-my-applications',
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent implements OnInit {

  myApplications;
  isLoading = true;
  isUserAdmin = false;
  applicationDetails;
  // priceModelWrapper: PriceModalWrapper;
  userDetails;
  
  constructor(private myApplicationService: MyApplicationsService,
    private dialogService: DialogService,
    private authService: AuthenticationService,
    private appDetailsService: ApplicationService,
    private userService: UserService, public datepipe: DatePipe,
    private router: Router,
    private notificationService: NotificationService,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.isUserAdmin = this.authService.isUserAdmin();
    this.getAllMyApps();
    // this.priceModelWrapper = new PriceModalWrapper();
    this.getUserDetails();
  }

  getAllMyApps() {
    this.myApplicationService.findAllMyApps("true").subscribe((res) => {
      this.myApplications = res;
      this.setDefaultCollablsable();      
      this.isLoading = false;
      this.commonService.scrollToFormInvalidField({ form: null, adjustSize: 60 });
    }, (err) => {

    }, () => {

    });
  }
  /**
   * this menthod is to show addons expanded by default
   */
  setDefaultCollablsable(){
    if(this.myApplications.requestedApps){
      this.myApplications.requestedApps.forEach(app => {
        app.isCollapsed = false;
      });            
    } 
    if(this.myApplications.activeApps){
      this.myApplications.activeApps.forEach(app => {
        app.isCollapsed = false;
      });
    }     
    if(this.myApplications.uninstalledApps){
      this.myApplications.uninstalledApps.forEach(app => {
        app.isCollapsed = false;
      });            
    }
  }

  getPendingStatus1(ownership): string {
    let pendingStatus = "Requested";
    if (ownership && ownership.ownershipStatus &&
      ownership.customData && ownership.customData.deployment) {
      if (ownership.ownershipStatus == 'active' &&
        (!ownership.customData.deployment.subscribe ||
          ownership.customData.deployment.subscribe !== 'success')) {
        pendingStatus = "Subscribed";
      }
      else if (ownership.ownershipStatus == 'active' &&
        (!ownership.customData.deployment.install ||
          ownership.customData.deployment.install != 'success')) {
        pendingStatus = "Deploying";
      }
    }
    return pendingStatus;
  }

  // getUsersListMessage(appUsers, maxChars?:number): string {
  //   let usersListMessage = "No other user asked to subscribe";
  //   if (appUsers && appUsers.length > 0) {
  //     if (appUsers.length == 1) {
  //       usersListMessage = appUsers[0];
  //     }
  //     else if (appUsers.length == 2) {
  //       usersListMessage = appUsers[0] + " and " + appUsers[1];
  //     }
  //     else {
  //       let cnt = (appUsers.length - 2);
  //       usersListMessage = appUsers[0] + ", " + appUsers[1] + " and " + cnt + (cnt == 1 ? " other" : " others");
  //     }
  //     usersListMessage += " asked to subscribe";
  //   }
  //   return this.ellepsisPipe.transform(usersListMessage, maxChars ? maxChars : 58);
  // }


  cancelRequest(requestId, appId) {
    this.dialogService.showDialog("Cancel Request",
      "Are you sure you want to cancel this <strong> Request </strong> ?", "", "Cancel", "Yes", (res) => {
        this.myApplicationService.cancelRequest(requestId, appId).subscribe((res) => {
          this.getAllMyApps();
          this.dialogService.modalService.dismissAll();
        });
      });

  }

  redirectToAppDetails(safeName) {
    this.router.navigate(['application-detail/', safeName]);
  }

  viewAddonDetails(appSafeName, addonSafeName){
    // this.router.navigate(['application-detail/', appSafeName]);
    this.router.navigate(['/application-detail/' + appSafeName], { queryParams: { type: 'addon','addon-name': addonSafeName} });
  }
  gotoInstructionForUse(appSafeName) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['application-detail/', appSafeName])
    );
    window.open(url, '_blank');
  }

  // gotoTraining(appSafeName){
  //   const url = this.router.serializeUrl(
  //     this.router.createUrlTree(['application-detail/',appSafeName])
  //   );
  //   window.open(url, '_blank');
  // }

  // gotoReview(appSafeName){
  //   const url = this.router.serializeUrl(
  //     this.router.createUrlTree(['application-detail/',appSafeName])
  //   );
  //   window.open(url, '_blank');
  // }

  // deploymentSetting(application, status?) {
  //   let priceModelWrapper = new PriceModalWrapper();
  //   priceModelWrapper.applicationName = application.applicationName;
  //   priceModelWrapper.appId = application.appId;
  //   priceModelWrapper.isPatch = true;
  //   priceModelWrapper.version = this.getVersion(application, true);
  //   if (application.ownershipDetails && application.ownershipDetails.customData &&
  //     application.ownershipDetails.customData.environments) {
  //     priceModelWrapper.selectedEnvironments =
  //       Object.values(application.ownershipDetails.customData.environments).map(val => val["type"]);
  //   }

  //   priceModelWrapper.ownershipId = application.ownershipDetails ? application.ownershipDetails.ownershipId : null;
  //   priceModelWrapper.modelId = application.ownershipDetails ? application.ownershipDetails.model ? application.ownershipDetails.model.modelId : null : null;
  //   const index: number = this.userDetails.hostingPlatform.findIndex(({ name }) => name === application.hostingPlatform);
  //   if (index != -1) {
  //     priceModelWrapper.environments = this.userDetails.hostingPlatform[index].environments;
  //   }

  //   if (status) {
  //     priceModelWrapper.isPatch = false;
  //     priceModelWrapper.pageStatus = "my-apps";
  //   }

  //   if (application.status === 'Deploying') {
  //     priceModelWrapper.deployeReadMode = true;
  //   }
  //   if (priceModelWrapper.environments && priceModelWrapper.environments.length > 0) {
  //     this.dialogService.openModalRef(SubscribeDeployComponent as Component, priceModelWrapper, "deployee", (res) => {

  //       this.myApplications = res;

  //     });
  //   } else {
  //     this.notificationService.showError([{ error: "Hosting platform of application does not match to your profile!" }]);
  //   }
  // }

  // subscriptionSettings(application, status?) {
  //   this.isLoading = true;
  //   const priceModel = Object.assign([], application.appPricingModels)

  //   let priceModelWrapper = this.prepareModel(priceModel);
  //   priceModelWrapper.termsFile = application.licenseUrl;
  //   priceModelWrapper.applicationName = application.applicationName;
  //   priceModelWrapper.appId = application.appId;
  //   priceModelWrapper.isPatch = true;
  //   priceModelWrapper.ownershipId = application.ownershipDetails ? application.ownershipDetails.ownershipId : null;
  //   priceModelWrapper.modelId = application.ownershipDetails ? application.ownershipDetails.model ? application.ownershipDetails.model.modelId : null : null;

  //   if (status) {
  //     priceModelWrapper.isPatch = false;
  //     priceModelWrapper.pageStatus = "my-apps";
  //   }
  //   // this.dialogService.openModalRef(SubscribeDeployComponent as Component, priceModelWrapper, "subscribe", (res) => {
  //   //   this.myApplications = res;
  //   //   // this.getOwnership(res);

  //   // });
  //   this.isLoading = false;
  // }

  // prepareModel(pricingModelArr): PriceModalWrapper {
  //   let priceModelWrapper = new PriceModalWrapper();
  //   priceModelWrapper.tierBasedSubscriptionModelArr = [];
  //   for (let i = 0; i < pricingModelArr.length; i++) {
  //     // let model =  Object.assign({}, pricingModelArr[i]);
  //     let model = JSON.parse(JSON.stringify(pricingModelArr[i]));
  //     if (model && model.type) {

  //       if (model.trial && model.trial === 90) {
  //         priceModelWrapper.is90DaysTrial = true;
  //       }
  //       if (model.type === 'single') {
  //         priceModelWrapper.pricingModel = model;
  //         priceModelWrapper.pricingModel.price = (model.price) / 100;
  //         priceModelWrapper.selectedModel = "oneTimePurchase";
  //         // this.tmpModelVal = this.oneTimeOfferingModel;
  //         continue;
  //       } else if (model.type === 'recurring' && model.subtype === 'usage') {
  //         model.price = model.price / 100;
  //         model.customData.volume__from = model.customData.volume__from / 100;
  //         model.customData.volume__to = model.customData.volume__to / 100;
  //         priceModelWrapper.tierBasedSubscriptionModelArr.push(model);
  //         priceModelWrapper.selectedModel = "tierBasedSubscription";
  //         // this.tmpModelVal = this.tierBasedSubscriptionModelArr;
  //         continue;
  //       } else if (model.type === 'recurring' && model.billingPeriod === 'annually') {
  //         priceModelWrapper.pricingModel.price = (model.price) / 100;
  //         priceModelWrapper.selectedModel = "fixedSubscriptionFee";
  //         // this.tmpModelVal = this.fixedSubscriptionModel;
  //         continue;
  //       }
  //     }
  //   }
  //   return priceModelWrapper;
  // }

  getUserDetails() {
    this.userService.getOrganizationDetail().subscribe(res => {
      this.userDetails = res;
      // const index: number = user.hostingPlatform.findIndex(({ name }) => name === this.applicationDetails.appDetails.customData.hosting__platform);
      // if (index != -1) {
      //   this.priceModelWrapper.environments = user.hostingPlatform[index].environments;
      // }
    });
  }

  goToAppPage(appSafeName, scrollType, page: boolean) {
    // // const url = this.router.serializeUrl(
    //   this.router.navigate(['/application-detail/'+appSafeName], { queryParams: { type: 'support' } });
    // // );
    // // window.open(url, '_blank');

    if (!page) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['application-detail/' + appSafeName], { queryParams: { type: scrollType } })
      );
      window.open(url, '_blank');
    } else {
      this.router.navigate(['/application-detail/' + appSafeName], { queryParams: { type: scrollType } });
    }
  }

  gotoUseLicenseAgreement(app) {

    if (app.licenseUrl) {
      this.commonService.downloadFile(app.licenseUrl);
    }
  }

  backToApplications() {
    this.router.navigate(['applications']);
  }

  isEmptyMyapps() {
    let isEmpty = false;
    if (!this.myApplications || ((!this.myApplications.requestedApps || this.myApplications.requestedApps.length == 0)
      && (!this.myApplications.activeApps || this.myApplications.activeApps.length == 0)
      && (!this.myApplications.uninstalledApps || this.myApplications.uninstalledApps.length == 0))) {
      isEmpty = true;
    }
    return isEmpty;
  }

  getVersion(app, deploy?) {
    if (app.majorVersion == null || app.minorVersion == null || app.revision == null) {
      if (deploy) {
        return "";
      }
      return "n/a";
    }
    return app.majorVersion + "." + app.minorVersion + "." + app.revision;

  }

  getPendingStatusDetails(app) {
    let statusMsg = "";
    if (app.status === 'Requested') {
      let requestedDate = this.datepipe.transform(new Date(app.lastRequestedDate), 'dd MMM yyyy');
      statusMsg = "Last requested on " + requestedDate;
    }
    if (app.status === 'Deploying' || app.status === 'Subscribed') {
      // let submittedDate = this.datepipe.transform(new Date(app.createdDate), 'dd MMM yyyy');
      let submittedDate = new Date(app.createdDate);
      if (app.subscriptionTime) {
        submittedDate = new Date(app.subscriptionTime);
      }
      let foratedDate = this.datepipe.transform(submittedDate, 'dd MMM yyyy');
      if (app.appPricingModels && app.appPricingModels.length > 0) {
        let appPriceModel = app.appPricingModels[0];
        if (appPriceModel.type === 'free') {
          appPriceModel = app.appPricingModels.length > 1 ? app.appPricingModels[1] : appPriceModel
        }
        if (appPriceModel.type === 'single') {
          statusMsg = "A single subscription submitted on " + foratedDate;
        } else if (appPriceModel.type === 'recurring' && appPriceModel.subtype === 'usage') {
          statusMsg = "A yearly tiered subscription submitted on " + foratedDate;
        } else if (appPriceModel.type === 'recurring' && appPriceModel.billingPeriod === 'annually') {
          statusMsg = "A yearly recurring subscription submitted on " + foratedDate;
        } else if (appPriceModel.type === 'free') {
          statusMsg = "A free subscription submitted on " + foratedDate;
        }
      }
    }
    return statusMsg;
  }

  getActiveStatusDetails1(app) {
    let statusMsg = "";
    if (app) {
      if (app.ownershipDetails && app.ownershipDetails.ownershipType &&
        app.ownershipDetails.ownershipType === 'trial' && app.ownershipDetails.ownershipStatus === "active"
      ) {
        let days = app.ownershipDetails.model ? app.ownershipDetails.model.trial : 0;
        statusMsg = days + " days trial ends on ";
        if (app.expiryDate) {
          let trialExpires = this.datepipe.transform(new Date(app.expiryDate), 'dd MMM yyyy');
          statusMsg += trialExpires;
        }
      } else if (app.ownershipDetails && app.ownershipDetails.ownershipType &&
        (app.ownershipDetails.ownershipType === 'full' || app.ownershipDetails.ownershipType === 'subscription')
        && app.ownershipDetails.ownershipStatus === "active") {
        if (app.appUsers && app.lastRequestedDate) {
          let lastReqDate = this.datepipe.transform(new Date(app.lastRequestedDate), 'dd MMM yyyy');
          statusMsg = "Last requested on " + lastReqDate;
        }
      }
    }
    return statusMsg;
  }

  getActiveStausLine(app) {
    let statusMsg = "";
    if (app) {
      if (app.status === 'Active') {
        let deployedDate = new Date(app.createdDate);
        if (app.subscriptionTime) {
          deployedDate = new Date(app.subscriptionTime);
        }
        let formatedDate = this.datepipe.transform(deployedDate, 'dd MMM yyyy');
        statusMsg = "Deployed on " + formatedDate;
      } else {
        if (app.ownershipDetails && app.ownershipDetails.ownershipType) {
          if (app.ownershipDetails.ownershipType === 'trial') {
            let days = app.ownershipDetails.model ? app.ownershipDetails.model.trial : 0;
            statusMsg = days + " days trial ends on ";
            if (app.expiryDate) {
              let trialExpires = this.datepipe.transform(new Date(app.expiryDate), 'dd MMM yyyy');
              statusMsg += trialExpires;
            }
          } else {
            // let days = app.ownershipDetails.model ? app.ownershipDetails.model.trial : 0;
            let daysDiff = -1
            if (app && app.expiryDate) {
              daysDiff = (app.expiryDate - new Date().getTime()) / (1000 * 3600 * 24);
            }
            if (daysDiff > -1) {
              statusMsg = daysDiff.toFixed() + " days subscription ends on ";
              if (app.expiryDate) {
                let trialExpires = this.datepipe.transform(new Date(app.expiryDate), 'dd MMM yyyy');
                statusMsg += trialExpires;
              }
            }
          }
        }
      }
    }
    return statusMsg;
  }

  getActiveStatusDetails2(app) {
    let statusMsg = "";
    let daysDiff = -1
    if (app && app.expiryDate && app.ownershipStatus !== 'uninstalled') {
      daysDiff = (app.expiryDate - new Date().getTime()) / (1000 * 3600 * 24);
    }
    if (daysDiff > -1 && daysDiff < 90) {
    //  statusMsg = this.getUsersListMessage(app.appUsers);
    } else {
      let deployedDate = new Date(app.createdDate);
      if (app.subscriptionTime) {
        deployedDate = new Date(app.subscriptionTime);
      }
      let formatedDate = this.datepipe.transform(deployedDate, 'dd MMM yyyy');
      statusMsg = "Deployed on " + formatedDate;
    }
    return statusMsg;
  }

  isApproachingEnd(app) {
    let isEnding = false;
    if (app && app.expiryDate && app.ownershipStatus !== 'uninstalled') {
      let daysDiff = (app.expiryDate - new Date().getTime()) / (1000 * 3600 * 24);
      if (daysDiff < 90) {
        isEnding = true;
      }
    }
    return isEnding;
  }

  isCanceledXDaysRemaining(app) {
    let isCanceled = false;
    let currentTime = new Date().getTime();
    if (app && app.expiryDate && app.expiryDate > currentTime && app.status != 'Cancelled'
      && app.ownershipStatus === 'uninstalled') {
      isCanceled = true;
    }
    return isCanceled;
  }

  getInactiveStausLine(app) {
    let statusMsg = "";
    let suspendedDate;
    let uninstalledDate;
    if (app.suspendedDate) {
      suspendedDate = new Date(app.suspendedDate);
    }
    if (app.uninstalledDate) {
      uninstalledDate = new Date(app.uninstalledDate);
    }
    if (app.status === 'Suspended') {
      let formatedDate = suspendedDate ? this.datepipe.transform(suspendedDate, 'dd MMM yyyy') : "-";
      statusMsg = "Suspended on " + formatedDate;
    } else {
      let formatedDate = uninstalledDate ? this.datepipe.transform(uninstalledDate, 'dd MMM yyyy') : "-";
      statusMsg = "Uninstalled on " + formatedDate;
    }
    return statusMsg;
  }

  changeCollapse(app) {
    app.isCollapsed = !app.isCollapsed;  
  }

}
