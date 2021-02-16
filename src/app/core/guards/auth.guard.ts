import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from 'oc-ng-common-service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private authService: AuthenticationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.tryLoginByRefreshToken()
    .pipe(tap(isLogged => {
      if (!isLogged) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      }
    }));
  }
}
