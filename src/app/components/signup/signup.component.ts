import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {SellerSignup, SellerService } from 'oc-ng-common-service';
import { NotificationService } from 'src/app/shared/custom-components/notification/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  loginUrl = "/login";
  companyLogoUrl = "./assets/img/logo-company.png";
  termsAndConditionPageUrl = "https://my.openchannel.io/terms-of-service";
  dataProcessingPolicyUrl = "https://my.openchannel.io/data-processing-policy";

  signupModel :SellerSignup;
  requestObj : any =  {
    "developer":{
      "name": ""
  },
  "developerAccount":{
      "name":"",
      "email":""
  },
  "extra":{
      "password": ""
  }
  }; 
  constructor(private sellerService : SellerService,private notificationService: NotificationService,private router: Router) {
     this.signupModel = new SellerSignup();
   }

  ngOnInit(): void {
 
  }
  
  signup(event) {
    console.log(event.submitter);
    if(event.submitter){
      this.requestObj.developerAccount.name = event.submitter.form[0].value;
      this.requestObj.developer.name = event.submitter.form[1].value;
      this.requestObj.developerAccount.email = event.submitter.form[2].value;
      this.requestObj.extra.password = event.submitter.form[3].value;
      this.sellerService.signup(this.requestObj).subscribe(res => {
        this.notificationService.showSuccess("Your account is created successfully!");
        this.router.navigateByUrl(this.loginUrl);
      });
    }
  }

}
