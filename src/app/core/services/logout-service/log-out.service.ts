import { Injectable } from '@angular/core';
import {first} from 'rxjs/operators';
import {OAuthService} from 'angular-oauth2-oidc';
import {Router} from '@angular/router';
import {AuthenticationService, AuthHolderService} from 'oc-ng-common-service';

@Injectable({
  providedIn: 'root'
})
export class LogOutService {

  constructor(private oAuthService: OAuthService,
              private authService: AuthHolderService,
              private authenticationService: AuthenticationService,
              private router: Router) { }

  logOut(): void {
    this.authenticationService.getLogOutConfig()
        .pipe(first())
        .subscribe(config => {
          if (config && config.endSessionEndpoint && this.oAuthService.getIdToken()) {
            this.oAuthService.configure({
              logoutUrl: config.endSessionEndpoint,
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
