import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthHolderService} from 'oc-ng-common-service';


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private authService: AuthHolderService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // registration page accessible only when not logged in
    console.log("GUARD", state.url, this.authService.isLoggedInUser());

    if (this.authService.isLoggedInUser()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }

  }
}
