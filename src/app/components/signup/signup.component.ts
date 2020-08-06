import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {SellerSignup, SellerService, AuthenticationService, OauthService, SellerSignin } from 'oc-ng-common-service';
import { NotificationService } from 'src/app/shared/custom-components/notification/notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


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
  inProcess = false;
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
  constructor(private sellerService : SellerService,private notificationService: NotificationService,private router: Router,private authenticationService: AuthenticationService,private oauthService: OauthService ) {
     this.signupModel = new SellerSignup();
   }

  ngOnInit(): void {
 
  }
  
  signup(event) {
    if(event === true){
      this.requestObj.developerAccount.name = this.signupModel.uname;
      this.requestObj.developer.name = this.signupModel.company;
      this.requestObj.developerAccount.email = this.signupModel.email;
      this.requestObj.extra.password = this.signupModel.password;
      this.inProcess = true;
      this.sellerService.signup(this.requestObj).subscribe(res => {
        this.inProcess =false;
        this.notificationService.showSuccess("Your account is created successfully!");
        this.router.navigateByUrl("/activate");
      },res => {
        this.inProcess =false;
      });
    }    
  }
}
