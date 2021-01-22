import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthHolderService} from 'oc-ng-common-service';


@Injectable({providedIn: 'root'})
export class NativeLoginGuard implements CanActivate {
  constructor(private router: Router,
              private authService: AuthHolderService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.userDetails && !this.authService.userDetails.isSSO) {
      return true;
    } else {
      this.router.navigate(['/app/manage']);
      return false;
    }

  }
}
