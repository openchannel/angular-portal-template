import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SellerService } from 'oc-ng-common-service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../login/login.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  signupUrl = "/signup";
  loginUrl = "/login";
  companyLogoUrl = "./assets/img/logo-company.png";
  forgotPasswordDoneIconPath = "./assets/img/forgot-password-complete-icon.svg";
  forgotPwdPageState: boolean = true;
  constructor(private sellerService: SellerService,private router: Router) { }

  ngOnInit(): void {
  }

  resetPwd(event) {
    console.log(event);
    if (event.submitter) {
      var email = event.submitter.form[0].value;
      if (email && email!="") {
        this.sellerService.resetForgotPassword(email).subscribe(res => {
          this.forgotPwdPageState = false; 
      });  
      }else {
          this.router.navigateByUrl(this.loginUrl);
      }
    }
  }


}
