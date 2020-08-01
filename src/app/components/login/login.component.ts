import { Component, OnInit } from '@angular/core';
import { OauthService, SellerSignin } from 'oc-ng-common-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signupUrl = "/signup";
  forgotPwdUrl = "/forgot-password";
  signIn = new SellerSignin();

  constructor(private oauthService : OauthService
  ) { }

  ngOnInit(): void {
  }

  login(event) {
    console.log(event);
    if(event.submitter){
      this.signIn.email = event.submitter.form[0].value;
      this.signIn.password = event.submitter.form[1].value;
      this.signIn.grant_type = "password";
      this.signIn.clientId = environment.client_id;
      this.signIn.clientSecret = environment.client_secret;
      this.oauthService.signIn(this.signIn).subscribe(res => {
          console.log(res);
      });
    }
  }

}
