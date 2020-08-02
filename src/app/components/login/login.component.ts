import { Component, OnInit } from '@angular/core';
import { OauthService, SellerSignin } from 'oc-ng-common-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signupUrl = "/signup";
  forgotPwdUrl = "/forgot-password";
  successLoginFwdUrl = "/app-developer";
  signIn = new SellerSignin();

  constructor(private oauthService : OauthService,private router: Router
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem("rememberMe") && localStorage.getItem("rememberMe")=='true') {
        this.router.navigateByUrl(this.successLoginFwdUrl);        
    }
  }

  login(event) {
    console.log(event);
    if(event.submitter){
      this.signIn.email = this.signIn.email;
      this.signIn.password = this.signIn.password;
      this.signIn.grant_type = "password";
      this.signIn.clientId = environment.client_id;
      this.signIn.clientSecret = environment.client_secret;
      this.oauthService.signIn(this.signIn).subscribe(res => {
      this.saveUserAfterLoginSuccess(res);
      this.router.navigateByUrl(this.successLoginFwdUrl);
      });
    }
  }

   /**
    *  Save user details after login successful
    * @param res 
    */
   saveUserAfterLoginSuccess(res){
    localStorage.setItem("access_token",res.access_token);
    if(this.signIn.isChecked){
      localStorage.setItem("rememberMe","true");
    }else {
      localStorage.setItem("rememberMe","false");
    }
   }
}
