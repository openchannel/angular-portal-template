import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../shared/services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const userAuthorities = this.authenticationService.getUserAuthorities();

        // registration page accessible only when not logged in
        if (!this.authenticationService.isLoggedIn() && state.url === '/account-request') {
            return true;
        } else if (this.authenticationService.isLoggedIn() && state.url === '/account-request') {
            this.router.navigate(['/']);
            return false;
        }

        if (userAuthorities) {
            // check if route is restricted by role
            if (route.data.roles && route.data.roles.indexOf(userAuthorities) === -1) {
                this.router.navigate(['/']);
                return false;
            }
            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        return false;
    }
}