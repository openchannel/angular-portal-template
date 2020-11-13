import { Injectable } from '@angular/core';
import {first} from 'rxjs/operators';
import {OAuthService} from 'angular-oauth2-oidc';
import {GraphqlService} from '../../../graphql-client/graphql-service/graphql.service';
import {AuthService} from '../auth-service/auth.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogOutService {

  constructor(private oAuthService: OAuthService,
              private graph: GraphqlService,
              private authService: AuthService,
              private router: Router) { }

  logOut(): void {
    this.graph.getLogOutConfig()
        .pipe(first())
        .subscribe(({data: {logOutConfig: {endSessionEndpoint: logoutUrl}}}) => {
          if (logoutUrl && this.oAuthService.getIdToken()) {
            this.oAuthService.configure({
              logoutUrl,
              postLogoutRedirectUri: window.location.origin,
            });
            this.authService.clearTokensInStorage();
            this.oAuthService.logOut();
          } else {
              this.internalLogout();
          }
        }, error => this.internalLogout());
  }

  private internalLogout(): void {
      this.authService.clearTokensInStorage();
      this.router.navigateByUrl('/login');
  }
}
