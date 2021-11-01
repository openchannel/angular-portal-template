import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthHolderService } from '@openchannel/angular-common-services';

@Injectable({ providedIn: 'root' })
export class NativeLoginGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthHolderService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.authService.userDetails?.isSSO) {
            return true;
        } else {
            if (this.authService.isLoggedInUser()) {
                this.router.navigate(['/manage-apps']).then();
            }
            return false;
        }
    }
}
