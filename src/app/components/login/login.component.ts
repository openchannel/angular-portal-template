import { Component, OnInit } from '@angular/core';
import { OauthService, SellerSignin, SellerService, AuthenticationService } from 'oc-ng-common-service';
import { environment } from 'src/environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import { LoaderService } from 'src/app/shared/services/loader.service';
import {AuthConfig, OAuthService, OAuthStorage} from 'angular-oauth2-oidc';
import {JwksValidationHandler} from 'angular-oauth2-oidc-jwks';
import {AppService} from '../../core/api/app.service';

export const authConfig: AuthConfig = {
  issuer: 'https://dev-587258.okta.com',
  redirectUri: window.location.origin,
  clientId: '0oa11492lhqJkCy7r4x7',
  // requestAccessToken: true,
  // responseType: 'code',
  // openUri: (value: string) => console.log(value),
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  companyLogoUrl = './assets/img/logo-company.png';
  signupUrl = '/signup';
  forgotPwdUrl = '/forgot-password';
  successLoginFwdUrl = '/app-developer';
  signIn = new SellerSignin();
  inProcess = false;
  isLoading = true;
  constructor(private oauthService: OAuthService, private appService: AppService, private router: Router,
              private authenticationService: AuthenticationService, private loaderService: LoaderService, private route: ActivatedRoute
  ) {
    // console.log(window.location.origin);
    // console.log(this.oauthService.getAccessToken());
    // console.log(this.oauthService.getRefreshToken());
    // console.log(this.oauthService.getIdToken());
    // console.log(this.oauthService.authorizationHeader());
    // this.oauthService.loadUserProfile().then(value => console.log(value));
  }

  ngOnInit(): void {
    // console.log(this.oauthService.getAccessToken());
    // console.log(this.oauthService.authorizationHeader());
    // // this.oauthService.logOut();
    this.isLoading = false;
    // console.log(this.oauthService.hasValidAccessToken());
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(value => {
      // if (this.oauthService.hasValidIdToken()) {
      //   this.router.navigateByUrl('/app-developer');
      // }
      console.log(value);
      this.appService.initToken();
    });
    // if (this.appService.checkCredentials()) {
    //   this.router.navigateByUrl('/app-developer');
    // }
    // const code = this.route.snapshot.queryParamMap.get('code');
    // console.log(code);
    // if (code) {
    //   this.appService.retrieveToken(code);
    // }
    // this.loaderService.showLoader('1');
    //   // localStorage.getItem("rememberMe") && localStorage.getItem("rememberMe")=='true' &&
    // if (localStorage.getItem('access_token')) {
    //     this.authenticationService.saveUserprofileInformation(res => {
    //         this.isLoading = false;
    //         this.loaderService.closeLoader('1');
    //         this.router.navigateByUrl('/app-developer');
    //     }, res => {
    //       this.isLoading = false;
    //       this.loaderService.closeLoader('1');
    //     });
    //   } else {
    //     this.isLoading = false;
    //     this.loaderService.closeLoader('1');
    //   }
  }

  login() {
    // this.oauthService.openUri = (value: string) => console.log(value);

    this.oauthService.initImplicitFlow();
    // this.storage.
    // window.location.href = `${authConfig.issuer}/oauth2/v1/authorize?response_type=code&client_id=${authConfig.clientId}&redirect_uri=${authConfig.redirectUri}&scope=openid%20profile&state=1134123412`;
  }

  get givenName() {
    // const claims = this.oauthService.getIdentityClaims();
    // if (!claims) {
    //   return null;
    // }
    // return claims['name'];
    return null;
  }

}
