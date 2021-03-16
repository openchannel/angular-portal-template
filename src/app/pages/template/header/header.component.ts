import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AccessLevel, AuthenticationService, AuthHolderService, Permission, PermissionType} from 'oc-ng-common-service';
import {LogOutService} from '@core/services/logout-service/log-out.service';
import {map, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isSSO = false;
  isSsoConfigExist = true;
  isCollapsed = true;
  isMenuCollapsed = true;

  readonly companyPermissions: Permission[] = [
    {
      type: PermissionType.ORGANIZATIONS,
      access: [AccessLevel.MODIFY]
    }
  ];

  private destroy$: Subject<void> = new Subject();

  constructor(public router: Router,
              public authService: AuthHolderService,
              private openIdAuthService: AuthenticationService,
              private logOutService: LogOutService) {
  }

  ngOnInit(): void {
    this.isSSO = this.authService?.userDetails?.isSSO;

    this.openIdAuthService.getAuthConfig()
        .pipe(
            takeUntil(this.destroy$),
            map(value => !!value))
        .subscribe((authConfigExistence) => this.isSsoConfigExist = authConfigExistence);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.logOutService.logOut();
  }

  closedMenu() {
    this.isMenuCollapsed = true;
    this.isCollapsed = true;
  }

  checkIncludesUrl(url1, url2?) {
    return this.router.url.includes(url1) || (url2 && this.router.url.includes(url2));
  }
}
