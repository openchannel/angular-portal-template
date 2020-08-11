import { Component, OnInit } from '@angular/core';
import { OauthService, SellerSignin, SellerService, AuthenticationService } from 'oc-ng-common-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  companyLogoUrl = "./assets/img/logo-company.png";
  signupUrl = "/signup";
  forgotPwdUrl = "/forgot-password";
  successLoginFwdUrl = "/app-developer";
  signIn = new SellerSignin();
  inProcess = false;
  isLoading = true;
  constructor(private oauthService : OauthService,private router: Router,private sellerService : SellerService,
    private authenticationService : AuthenticationService, private loaderService : LoaderService
  ) { }

  ngOnInit(): void {
    this.loaderService.showLoader("1");
      //localStorage.getItem("rememberMe") && localStorage.getItem("rememberMe")=='true' && 
      if (localStorage.getItem("access_token")) {
        this.authenticationService.saveUserprofileInformation(res => {
            this.isLoading = false;
            this.loaderService.closeLoader("1");
            this.router.navigateByUrl("/app-developer");
        },res => {
          this.isLoading = false;
          this.loaderService.closeLoader("1");
        });
      }else{
        this.isLoading = false;
        this.loaderService.closeLoader("1");
      }
  }

  login(event) {
    console.log(event);
    if(event === true){
      this.signIn.email = this.signIn.email;
      this.signIn.password = this.signIn.password;
      this.signIn.grant_type = "password";
      this.signIn.clientId = environment.client_id;
      this.signIn.clientSecret = environment.client_secret;
      this.inProcess = true;
      this.oauthService.signIn(this.signIn).subscribe(res => {
      this.authenticationService.saveUserAfterLoginSuccess(res,this.signIn);
      this.authenticationService.saveUserprofileInformation(res => {
        this.inProcess = false;
        this.router.navigateByUrl("/app-developer");
      });      
    },res => {
        this.inProcess = false;
      });
    }
  }

  //  /**
  //   *  Save user details after login successful.
  //   * @param res 
  //   */
  //  saveUserAfterLoginSuccess(res){
  //   localStorage.setItem("access_token",res.access_token);
  //   if(this.signIn.isChecked){
  //     localStorage.setItem("rememberMe","true");
  //   }else {
  //     localStorage.setItem("rememberMe","false");
  //   }
  //  }

  //  /**
  //   * This method is responsible for save user profile information. 
  //   */
  //  saveUserprofileInformation(){
  //     this.sellerService.getUserProfileDetails().subscribe(res => {
  //         if (res) {
  //           localStorage.setItem("email",res.email);
  //         }
  //         this.router.navigateByUrl(this.successLoginFwdUrl);
  //     },res => {
  //       this.inProcess = false;
  //     });
  //  }
}
