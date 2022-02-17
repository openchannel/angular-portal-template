import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessLevel, AuthenticationService, AuthHolderService, Permission, PermissionType } from '@openchannel/angular-common-services';
import { LogOutService } from '@core/services/logout-service/log-out.service';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CmsContentService } from '@core/services/cms-content-service/cms-content-service.service';
import { get } from 'lodash';

interface HeaderItemDFA {
    label: string;
    location: string;
    authorized: boolean;
}

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
    readonly companyPermissions: Permission[] = [
        {
            type: PermissionType.ORGANIZATIONS,
            access: [AccessLevel.MODIFY, AccessLevel.READ],
        },
        {
            type: PermissionType.ACCOUNTS,
            access: [AccessLevel.READ, AccessLevel.MODIFY],
        },
    ];

    isSSO = false;
    isSsoConfigExist = true;
    isCollapsed = true;
    isMenuCollapsed = true;

    cmsData = {
        headerItemsDFA: [] as HeaderItemDFA[],
        secondaryItemsDFA: [] as HeaderItemDFA[],
        headerLogoURL: '',
    };

    private destroy$: Subject<void> = new Subject();

    constructor(
        public router: Router,
        public authHolderService: AuthHolderService,
        private openIdAuthService: AuthenticationService,
        private logOutService: LogOutService,
        private cmsService: CmsContentService,
    ) {}

    ngOnInit(): void {
        this.isSSO = this.authHolderService?.userDetails?.isSSO;

        this.openIdAuthService
            .getAuthConfig()
            .pipe(
                takeUntil(this.destroy$),
                map(value => !!value),
            )
            .subscribe(authConfigExistence => (this.isSsoConfigExist = authConfigExistence));

        this.initCMSData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    logout(): void {
        this.logOutService.logOutAndRedirect('/');
    }

    closedMenu(): void {
        this.isMenuCollapsed = true;
        this.isCollapsed = true;
    }

    checkIncludesUrl(url1: string, url2?: string): boolean {
        return this.router.url.includes(url1) || (url2 && this.router.url.includes(url2));
    }

    initCMSData(): void {
        this.cmsService
            .getContentByPaths({
                headerLogoURL: 'default-header.logo',
                headerItemsDFA: 'default-header.menu.items',
            })
            .subscribe(content => {
                this.cmsData.headerLogoURL = content.headerLogoURL || get(this.cmsService.getContentDefault(), 'default-header.logo');
                this.cmsData.headerItemsDFA = (content.headerItemsDFA as HeaderItemDFA[]) || [];
            });
    }
}
