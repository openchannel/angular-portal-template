import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoaderService} from 'src/app/shared/services/loader.service';
import {OAuthService} from 'angular-oauth2-oidc';
import {JwksValidationHandler} from 'angular-oauth2-oidc-jwks';
import {AppService} from '../../core/api/app.service';
import {GraphqlService} from "../../graphql-client/graphql-service/graphql.service";
import {AuthService} from "../../core/services/auth-service/auth.service";

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
  authConfig: any;

  constructor(private oauthService: OAuthService, private appService: AppService, private router: Router,
              private authService: AuthService, private loaderService: LoaderService,
              private route: ActivatedRoute,
              private graphqlService: GraphqlService
  ) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.oauthService.hasValidAccessToken();

    this.graphqlService.getAuthConfig().subscribe(({data: {authConfig}}) => {
        this.authConfig = authConfig;

        this.oauthService.configure({
          ...authConfig,
          redirectUri: authConfig.redirectUri || window.location.origin
        });

        this.oauthService.tokenValidationHandler = new JwksValidationHandler();
        this.oauthService.loadDiscoveryDocumentAndTryLogin({
          onTokenReceived: receivedTokens => {

            this.graphqlService.loginUser(receivedTokens.idToken).subscribe(({data: {loginOrRegisterUser: user}}) => {
              this.authService.persist(user.accessToken, user.refreshToken);
              this.router.navigate(['/app-store']);
            });

            this.tokenInfo = JSON.stringify(receivedTokens, null, 4);
          }
        });

      }, err => console.error("getAuthConfig", err),
      () => this.isLoading = false);

  }

  login() {
    this.oauthService.initLoginFlow();
  }

}
