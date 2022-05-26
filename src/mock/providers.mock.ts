import { Provider } from '@angular/core';
import {
    AppsService,
    AuthenticationService,
    AuthHolderService,
    InviteUserService,
    NativeLoginService,
    SiteConfigService,
    StripeService,
    TitleService,
    UsersService,
    AppVersionService,
    DeveloperRoleService,
    DeveloperService,
    PrerenderRequestsWatcherService,
    ChartService,
    DeveloperTypeService,
    DeveloperAccountService,
    DeveloperAccountTypesService,
    AppTypeService,
    MarketService,
} from '@openchannel/angular-common-services';
import { InviteUserModel } from '@openchannel/angular-common-services/lib/model/api/invite-user.model';
import { ToastrService } from 'ngx-toastr';
import {
    MockAppsService,
    MockAuthenticationService,
    MockAuthHolderService,
    MockCmsContentService,
    MockEditUserTypeService,
    MockInviteUserService,
    MockLoadingBarService,
    MockLogOutService,
    MockNativeLoginService,
    MockOAuthService,
    MockSiteConfigService,
    MockStripeService,
    MockTitleService,
    MockToastrService,
    MockUsersService,
    MockAppVersionService,
    MockDeveloperRoleService,
    MockDeveloperService,
    MockPrerenderRequestsWatcherService,
    MockChartService,
    MockDeveloperTypeService,
    MockStripeAccountsService,
    MockDeveloperAccountService,
    MockDeveloperAccountTypesService,
    MockAppTypeService,
    MockMarketService,
    MockAppManageModalService,
} from './services.mock';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MockNgbModal } from './components.mock';
import { OcEditUserTypeService } from '@core/services/user-type-service/user-type.service';
import { CmsContentService } from '@core/services/cms-content-service/cms-content-service.service';
import { LogOutService } from '@core/services/logout-service/log-out.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { StripeAccountsService } from '@core/services/stripe-accounts.service';
import { AppManageModalService } from '@core/services/app-manage-modal-service/app-manage-modal.service';

export function mockUserServiceProvider(): Provider {
    return { provide: UsersService, useClass: MockUsersService };
}

export function mockInviteUserServiceProvider(userInvites?: InviteUserModel[]): Provider {
    return { provide: InviteUserService, useFactory: () => new MockInviteUserService(userInvites) };
}

export function mockToastrService(): Provider {
    return { provide: ToastrService, useClass: MockToastrService };
}

export function mockLoadingBarService(): Provider {
    return { provide: LoadingBarService, useClass: MockLoadingBarService };
}

export function mockNgbModal(): Provider {
    return { provide: NgbModal, useClass: MockNgbModal };
}

export function mockNativeLoginService(): Provider {
    return { provide: NativeLoginService, useClass: MockNativeLoginService };
}

export function mockEditUserTypeService(): Provider {
    return { provide: OcEditUserTypeService, useClass: MockEditUserTypeService };
}

export function mockAuthenticationService(): Provider {
    return { provide: AuthenticationService, useClass: MockAuthenticationService };
}

export function mockSiteConfigService(): Provider {
    return { provide: SiteConfigService, useClass: MockSiteConfigService };
}

export function mockAppsService(): Provider {
    return { provide: AppsService, useClass: MockAppsService };
}

export function mockTitleService(): Provider {
    return { provide: TitleService, useClass: MockTitleService };
}

export function mockCmsContentService(): Provider {
    return { provide: CmsContentService, useClass: MockCmsContentService };
}

export function mockLogOutService(): Provider {
    return { provide: LogOutService, useClass: MockLogOutService };
}

export function mockAuthHolderService(): Provider {
    return { provide: AuthHolderService, useClass: MockAuthHolderService };
}

export function mockOAuthService(): Provider {
    return { provide: OAuthService, useClass: MockOAuthService };
}

export function mockAppVersionService(): Provider {
    return { provide: AppVersionService, useClass: MockAppVersionService };
}

export function mockStripeService(): Provider {
    return { provide: StripeService, useClass: MockStripeService };
}

export function mockStripeAccountsService(): Provider {
    return { provide: StripeAccountsService, useClass: MockStripeAccountsService };
}

export function mockDeveloperRoleService(): Provider {
    return { provide: DeveloperRoleService, useClass: MockDeveloperRoleService };
}

export function mockDeveloperTypeService(): Provider {
    return { provide: DeveloperTypeService, useClass: MockDeveloperTypeService };
}

export function mockAppTypeService(): Provider {
    return { provide: AppTypeService, useClass: MockAppTypeService };
}

export function mockDeveloperAccountService(): Provider {
    return { provide: DeveloperAccountService, useClass: MockDeveloperAccountService };
}

export function mockDeveloperAccountTypesService(): Provider {
    return { provide: DeveloperAccountTypesService, useClass: MockDeveloperAccountTypesService };
}

export function mockDeveloperService(): Provider {
    return { provide: DeveloperService, useClass: MockDeveloperService };
}

export function mockPrerenderRequestsWatcherService(): Provider {
    return { provide: PrerenderRequestsWatcherService, useClass: MockPrerenderRequestsWatcherService };
}

export function mockChartService(): Provider {
    return { provide: ChartService, useClass: MockChartService };
}

export function mockMarketService(): Provider {
    return { provide: MarketService, useClass: MockMarketService };
}

export function mockAppManageModalService(): Provider {
    return { provide: AppManageModalService, useClass: MockAppManageModalService };
}
