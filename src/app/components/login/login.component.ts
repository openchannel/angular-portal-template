import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoaderService} from 'src/app/shared/services/loader.service';
import {OAuthService} from 'angular-oauth2-oidc';
import {JwksValidationHandler} from 'angular-oauth2-oidc-jwks';
import {AppService} from '../../core/api/app.service';
import {AuthService} from '../../core/services/auth-service/auth.service';
import {Subscription} from 'rxjs';
import {AuthConfig, LoginRequest} from '../../core/services/auth-service/model/auth-model';

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
  inProcess = false;
  isLoading = true;
  //todo remove
  tokenInfo: string;

  // todo add ts type
  authConfig: AuthConfig;

  private formSubscription: Subscription = new Subscription();

  constructor(private oauthService: OAuthService, private appService: AppService, private router: Router,
              private authService: AuthService, private loaderService: LoaderService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.oauthService.hasValidAccessToken();
    this.formSubscription.add(this.authService.getAuthConfig().subscribe(authConfig => {

        this.authConfig = authConfig;
        this.oauthService.configure({
          ...authConfig,
          redirectUri: authConfig.redirectUri || window.location.origin
        });

        this.oauthService.tokenValidationHandler = new JwksValidationHandler();
        this.oauthService.loadDiscoveryDocumentAndTryLogin({
          onTokenReceived: receivedTokens => {

            const loginRequest: LoginRequest = {
              idToken: receivedTokens.idToken
            };
            this.authService.loginUser(loginRequest).subscribe(loginResponse => {
              this.authService.persist(loginResponse.accessToken, loginResponse.refreshToken);
              this.authService.testSetAuthJwtToken(loginResponse.accessToken);
              this.router.navigate(['/app-store']);
            });

            this.tokenInfo = JSON.stringify(receivedTokens, null, 4);
          }
        });

      }, err => console.error('getAuthConfig', err),
      () => this.isLoading = false));
  }

  login() {
    this.oauthService.initLoginFlow();
  }

}
