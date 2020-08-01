import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {SellerSignup, SellerService } from 'oc-ng-common-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  loginUrl = "/login";
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
  constructor(private sellerService : SellerService) {
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
        console.log(res);
      });
    }
  }

  createApiRequestObj(signupModel:SellerSignup){     
    console.log("sign up modal => "+JSON.stringify(signupModel));
    this.requestObj.developer.name = signupModel.company;
    this.requestObj.developerAccount.name = signupModel.uname;
    this.requestObj.developerAccount.email = signupModel.email;
    this.requestObj.extra.password = signupModel.password;
    console.log("request obj => "+JSON.stringify(this.requestObj));
  }

}
