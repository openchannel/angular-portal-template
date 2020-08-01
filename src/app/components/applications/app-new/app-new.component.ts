import { Component, OnInit } from '@angular/core';
import { FileDetails,SellerAppDetailsModel, SellerAppCustomDataModel } from 'oc-ng-common-service';
import { DomSanitizer } from '@angular/platform-browser';
import FroalaEditor from 'froala-editor';
import { CommonService } from 'src/app/shared/services/common-service';
import { NotificationService } from 'src/app/shared/custom-components/notification/notification.service';
import { SellerAppService } from 'oc-ng-common-service'

@Component({
  selector: 'app-app-new',
  templateUrl: './app-new.component.html',
  styleUrls: [
    './app-new.component.scss']
})
export class AppNewComponent implements OnInit {

  icons: FileDetails[] = [];
  productImages: FileDetails[] = [];

  appDetails:SellerAppDetailsModel = new SellerAppDetailsModel();
  videoUrl = '';
  
  defaultFileIconUrl = "https://drive.google.com/u/0/uc?id=1vDDzbS--o_UIgXFE_LmMfVmSAKuprCyb&export=download";
  appCategories = ["cat1","cat2","cat3"];
  selectedCats:string[] = [];

  isSaveInPrcess = false;

  constructor(public sanitizer: DomSanitizer,
    private commonservice: CommonService,
    private notificationService : NotificationService,
    private sellerAppService : SellerAppService) { }

  ngOnInit(): void {
    this.appDetails.customData = new SellerAppCustomDataModel();
    this.appDetails.customData.category = [];
    this.appDetails.customData.product__images=[];
    FroalaEditor.DefineIcon('alert', {NAME: 'info'});
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
    if(this.appDetails.customData.video__url && this.appDetails.customData.video__url.trim().length>0 &&
      this.appDetails.customData.video__url.indexOf('v=')> -1){
      var video_id = this.appDetails.customData.video__url.split('v=')[1];
      video_id = video_id.indexOf('&')>-1? video_id.split('&')[0]:video_id;
      this.videoUrl = "https://www.youtube.com/embed/" + video_id;
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
    }
    return "";
  }
  
  saveNewApp(){
    let iconFile = (this.icons && this.icons.length > 0)? this.icons[0] : null;
    if(iconFile){
      this.appDetails.customData.icon = iconFile.fileUrl;
    }
    let productImages = (this.productImages && this.productImages.length>0) ? this.productImages : null;
    if(productImages && productImages.length>0){
      let productImages = this.productImages.map(pImage => pImage.fileUrl);
      this.appDetails.customData.product__images = productImages;
    }
    this.isSaveInPrcess = true;
    this.sellerAppService.saveApplication(this.appDetails).subscribe((res) => {
      this.isSaveInPrcess = false;
    },(err) => {
      this.isSaveInPrcess = false;
    });
  }

  /**
   * This method is callback method in case we need to handle callback of category Add event.
   */
  updateCategory(){
  }

  /**
   * This method is used to submit the new app.
   * 
   * @param form 
   */
  submitApp(form){
    if (!form.valid) {
      form.control.markAllAsTouched();
      try {
        this.commonservice.scrollToFormInvalidField({ form: form, adjustSize: 60 });
      } catch (error) {
        this.notificationService.showError([{ "message": "Please fill all required fields." }]);
      }
      return;
    }
    this.sellerAppService.submitApplication(this.appDetails).subscribe((res) => {
      this.isSaveInPrcess = false;
    },(err) => {
      this.isSaveInPrcess = false;
    });
  }

  
}
