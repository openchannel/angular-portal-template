import { Component, OnInit } from '@angular/core';
import { FileDetails, SellerAppDetailsModel, SellerAppCustomDataModel } from 'oc-ng-common-service';
import { DomSanitizer } from '@angular/platform-browser';
import FroalaEditor from 'froala-editor';
import { CommonService } from 'src/app/shared/services/common-service';
import { NotificationService } from 'src/app/shared/custom-components/notification/notification.service';
import { SellerAppService } from 'oc-ng-common-service'
import { DialogService } from 'src/app/shared/services/dialog.service';
import { OcPopupComponent } from 'oc-ng-common-component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-new',
  templateUrl: './app-new.component.html',
  styleUrls: [
    './app-new.component.scss']
})
export class AppNewComponent implements OnInit {

  icons: FileDetails[] = [];
  productImages: FileDetails[] = [];

  appDetails: SellerAppDetailsModel = new SellerAppDetailsModel();
  videoUrl = '';

  defaultFileIconUrl = "./assets/img/app-icon.svg";
  closeIconUrl = "./assets/img/close-icon.svg";
  addIconUrl = "./assets/img/add-icon.svg";
  uploadIconUrl = "./assets/img/upload-icon.svg";

  appCategories = [{ key: "Assembly", value: "Assembly" }, { key: "Communication", value: "Communication" }];
  selectedCats: string[] = [];

  isSaveInPrcess = false;
  isFormSubmitted = false;
  customMsg = false;
  iconMsg  = false;

  completeIconUrl = "./assets/img/app-icon.svg";
  uploadingIconUrl = "./assets/img/uploading-icon.svg";

  constructor(public sanitizer: DomSanitizer,
    private commonservice: CommonService,
    private notificationService: NotificationService,
    private sellerAppService: SellerAppService,
    private dialogService: DialogService,
    private router: Router) { }

  ngOnInit(): void {
    this.appDetails.customData = new SellerAppCustomDataModel();
    this.appDetails.customData.category = [];
    this.appDetails.customData.product__images = [];
    FroalaEditor.DefineIcon('alert', { NAME: 'info' });
    FroalaEditor.RegisterCommand('alert', {
      title: 'Hello',
      focus: false,
      undo: false,
      refreshAfterCallback: false,

      callback: () => {
        alert('Hello!');
      }
    });
    this.getyouTubeId();
  }

  getValue(value) {
    return value;
  }

  getyouTubeId() {
    if (this.appDetails.customData.video__url && this.appDetails.customData.video__url.trim().length > 0 &&
      this.appDetails.customData.video__url.indexOf('v=') > -1) {
      var video_id = this.appDetails.customData.video__url.split('v=')[1];
      video_id = video_id.indexOf('&') > -1 ? video_id.split('&')[0] : video_id;
      this.videoUrl = "https://www.youtube.com/embed/" + video_id;
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
    }
    return "";
  }

  saveNewApp(newAppform) {
    if (!newAppform.controls.appName.valid) {
      newAppform.controls.appName.markAsTouched();
      try {
        this.commonservice.scrollToFormInvalidField({ form: newAppform, adjustSize: 60 });
      } catch (error) {
        this.notificationService.showError([{ "message": "Please fill all required fields." }]);
      }
      return;
    }
    this.prepareFinalData();
    this.isSaveInPrcess = true;
    this.sellerAppService.saveApplication(this.appDetails).subscribe((res) => {
      this.isSaveInPrcess = false;
      this.router.navigate(['./app-developer']);
      this.notificationService.showSuccess("Application saved successfully");
    }, (err) => {
      this.isSaveInPrcess = false;
    });
  }

  prepareFinalData() {
    let iconFile = (this.icons && this.icons.length > 0) ? this.icons[0] : null;
    if (iconFile) {
      this.appDetails.customData.icon = iconFile.fileUrl;
    }
    let productImages = (this.productImages && this.productImages.length > 0) ? this.productImages : null;
    if (productImages && productImages.length > 0) {
      let productImages = this.productImages.map(pImage => pImage.fileUrl);
      this.appDetails.customData.product__images = productImages;
    }
    this.appDetails.customData.category = this.selectedCats;
  }

  /**
   * This method is callback method in case we need to handle callback of category Add event.
   */
  updateCategory() {
  }

  /**
   * This method is used to submit the new app.
   * 
   * @param form 
   */
  submitApp(form) {
    this.isFormSubmitted = true;
    this.prepareFinalData();
    if (!this.productImages || this.productImages.length < 1) {
      this.customMsg = true;
    }

    if(!this.icons || this.icons.length < 1) {
      this.iconMsg = true;
    }
    if (!form.valid) {
      form.control.markAllAsTouched();
      try {
        this.commonservice.scrollToFormInvalidField({ form: form, adjustSize: 60 });
      } catch (error) {
        this.notificationService.showError([{ "message": "Please fill all required fields." }]);
      }
      return;
    }



    this.dialogService.showConfirmPopup(OcPopupComponent as Component, "Warning",
      "secondary", "Save as Draft", "Confirm",
      "Submit this app to the Marketplace now?", "", "You can keep this app as draft", () => {
        this.sellerAppService.submitApplication(this.appDetails).subscribe((res) => {
          this.isSaveInPrcess = false;
          this.dialogService.modalService.dismissAll();
          this.router.navigate(['./app-developer']);
          this.notificationService.showSuccess("Application submitted successfully");
        }, (err) => {
          this.isSaveInPrcess = false;
          this.dialogService.modalService.dismissAll();
        });
      }, () => {
        this.saveNewApp(form);
        this.dialogService.modalService.dismissAll();
      });
  }

  public options: Object = {
    charCounterCount: false,
    toolbarButtons: ['paragraphStyle', 'bold', 'italic', 'strikeThrough', 'textColor', 'backgroundColor', 'insertLink', 'formatOL', 'formatUL', 'outdent', 'indent', 'codeView'],
    toolbarButtonsXS: ['paragraphStyle', 'bold', 'italic', 'strikeThrough', 'textColor', 'backgroundColor', 'insertLink', 'formatOL', 'formatUL', 'outdent', 'indent', 'codeView'],
    toolbarButtonsSM: ['paragraphStyle', 'bold', 'italic', 'strikeThrough', 'textColor', 'backgroundColor', 'insertLink', 'formatOL', 'formatUL', 'outdent', 'indent', 'codeView'],
    toolbarButtonsMD: ['paragraphStyle', 'bold', 'italic', 'strikeThrough', 'textColor', 'backgroundColor', 'insertLink', 'formatOL', 'formatUL', 'outdent', 'indent', 'codeView'],
    key: 'wFE7nG5G4G3H4A9C5eMRPYf1h1REb1BGQOQIc2CDBREJImA11C8D6B5B1G4F3F2F3C7',
    attribution: false,
    quickInsertTags: []

  };


  cancelNewApp() {
    this.router.navigate(['./app-developer']);
  }

  updateProductFiles(productImages) {
    console.log("Updated : " + productImages);
  }

  changeCustomMsg($event) {

      this.customMsg = $event;

    console.log('Custom message    ', this.customMsg);
  }

}
