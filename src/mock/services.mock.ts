import { asyncScheduler, Observable, of, Subject } from 'rxjs';
import { Page } from '@openchannel/angular-common-services';
import { observeOn } from 'rxjs/operators';
import { InviteUserModel } from '@openchannel/angular-common-services/lib/model/api/invite-user.model';

class MockPagination<T> {
    private values: T[];
    constructor(values: T[]) {
        this.values = values || [];
    }
    getByPaginate(page: number, size: number): Page<T> {
        const normalizedPageNumber = page || 1; // min page number is 1
        const normalizedSizeNumber = size || 100; // max page size is 100

        let result: T[];
        if (normalizedPageNumber === 1) {
            result = this.values.slice(0, normalizedSizeNumber);
        } else {
            result = this.values.slice(
                normalizedPageNumber * normalizedSizeNumber - 1,
                (normalizedPageNumber + 1) * normalizedSizeNumber - 1,
            );
        }

        return {
            count: this.values.length,
            list: result,
            pages: Math.ceil(this.values.length / normalizedSizeNumber),
            pageNumber: normalizedPageNumber,
        };
    }
}

export class MockSiteConfigService {
    static PAGE_CONFIG = {
        title: 'string',
        tagline: 'string',
        metaTags: [],
        favicon: {
            href: 'string',
            type: 'string',
        },
    };
    siteConfig = MockSiteConfigService.PAGE_CONFIG;

    getSiteConfigAsObservable(): Observable<any> {
        return of(MockSiteConfigService.PAGE_CONFIG);
    }

    initSiteConfiguration(config: any): void {
        // do nothing.
    }
}

export class MockTitleService {
    setSpecialTitle(): void {
        // do nothing.
    }
}

export class MockAuthenticationService {
    tryLoginByRefreshToken(): Observable<any> {
        return of('1');
    }

    initCsrf(): Observable<any> {
        return of('1');
    }

    getAuthConfig(): Observable<any> {
        return of('1');
    }

    verifyCode(...args: any): Observable<any> {
        return of({});
    }

    login(...args: any): Observable<any> {
        return of({}).pipe(observeOn(asyncScheduler));
    }
}

export class MockToastrService {
    success(): void {
        // do nothing.
    }
    error(): void {
        // do nothing.
    }
}

export class MockAuthHolderService {
    static MOCK_HAS_ANY_PERMISSION_RESPONSE = true;
    readonly REFRESH_TOKEN_KEY = 'refreshToken';

    userDetails = {
        isSSO: false,
    };

    hasAnyPermission(): boolean {
        return MockAuthHolderService.MOCK_HAS_ANY_PERMISSION_RESPONSE;
    }

    persist(...args: any): void {
        // do nothing
    }

    isLoggedInUser(...args: any): boolean {
        return true;
    }

    refreshToken(): string {
        return this.REFRESH_TOKEN_KEY;
    }
}

export class MockInviteUserService {
    userInvites: MockPagination<InviteUserModel>;

    mockInviteUserModelGoodResponse = {
        userInviteId: '123123wwq2131',
        userInviteTemplateId: '123123wwq2131',
        userId: '123123wwq2131',
        userAccountId: '123123wwq2131',
        email: '123',
        expireDate: 2133123123,
        expireSeconds: 2133123123132,
        createdDate: 2133123123132,
        subject: '123',
        body: '123',
        name: '123',
        type: '123',
        customData: '123',
        token: '123',
        lastSent: 2133123123132,
        roles: ['user'],
        permissions: ['user'],
    };

    constructor(userInvites?: InviteUserModel[]) {
        this.userInvites = new MockPagination<InviteUserModel>(userInvites);
    }

    sendUserInvite(): Observable<any> {
        return of(1);
    }

    deleteUserInvite(inviteId: string): Observable<any> {
        return of({});
    }

    getUserInvites(pageNumber?: number, limit?: number, sort?: string, query?: string): Observable<Page<InviteUserModel>> {
        return of(this.userInvites.getByPaginate(pageNumber, limit));
    }

    getDeveloperInvites(...args: any): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }

    getDeveloperInviteInfoByToken(...args: any): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }

    getUserInviteInfoByToken(userToken: string): Observable<any> {
        return of(this.mockInviteUserModelGoodResponse);
    }
}

export class MockUsersService {
    static MOCK_USER_COMPANY_RESPONSE = {
        userId: '644d352b-7be2-4b3e-8ee3-967f89d2bef0',
        accountCount: 1,
        created: 1640798413377,
        customData: {},
        name: 'weyen25008@ehstock.com',
        type: 'default',
        ownedApps: [
            {
                appId: '600eef7a7ec0f53371d1caab',
                userId: '644d352b-7be2-4b3e-8ee3-967f89d2bef0',
                date: 1640798459500,
                developerId: '49f5edfb-d7c0-46a5-800c-b371e00840e4',
                expires: 1643476998869,
                model: {
                    license: 'single',
                    feePayer: 'marketplace',
                    billingPeriod: 'monthly',
                    modelId: '600eef7a7ec0f53371d1caa9',
                    price: 400,
                    commission: 0,
                    currency: 'USD',
                    modelType: null,
                    type: 'recurring',
                    trial: 0,
                    billingPeriodUnit: 1,
                },
                ownershipId: '61cc98fb2d13e52f69319dc4',
                ownershipStatus: 'cancelled',
                ownershipType: 'subscription',
                productKey: '60UF0-NSKZP-U5C2H-8Z1P6-2D8Q5',
                trialType: null,
                type: null,
            },
        ],
    };

    static MOCK_USER_TYPE_DEFINITION_RESPONSE = {
        userTypeId: 'default',
        createdDate: 1614619741673,
        description: null,
        label: 'Default',
        fields: [
            {
                attributes: {
                    maxChars: null,
                    required: true,
                    minChars: null,
                },
                id: 'name',
                label: 'Company',
                type: 'text',
            },
        ],
    };

    getUserCompany(): Observable<any> {
        return of(MockUsersService.MOCK_USER_COMPANY_RESPONSE);
    }

    getUserTypeDefinition(): Observable<any> {
        return of(MockUsersService.MOCK_USER_TYPE_DEFINITION_RESPONSE);
    }

    updateUserCompany(): Observable<any> {
        return of(1).pipe(observeOn(asyncScheduler));
    }
}

export class MockPrerenderRequestsWatcherService {
    setPrerenderStatus(ready: boolean): void {
        // do nothing.
    }
    create404MetaTag(): void {
        // do nothing.
    }
    remove404MetaTag(): void {
        // do nothing.
    }
}

export class MockLoadingBarState {
    complete(): void {
        // do nothing.
    }
    start(): void {
        // do nothing.
    }
    stop(): void {
        // do nothing.
    }
}

export class MockLoadingBarService {
    useRef(): MockLoadingBarState {
        return new MockLoadingBarState();
    }
}

export class MockAppsService {
    static MOCK_APP = {
        allow: {},
        access: [],
        created: 1639656082091,
        rating: 425,
        restrict: {},
        submittedDate: 1639656081882,
        type: 'downloadable',
        version: 1,
        lastUpdated: 1639656081714,
        name: 'API Plus Connect',
        attributes: {},
        customData: {
            summary: '',
            images: [],
            description: '',
            categories: ['Developer Tools', 'File Management'],
        },
        developerId: 'erp-above',
        isLive: true,
        reviewCount: 2,
        appId: '61bb2a918e9d83275b715c7b',
        model: [
            {
                license: 'single',
                modelId: '61bb2a918e9d83275b715c79',
                price: 0,
                currency: 'USD',
                modelType: null,
                type: 'free',
                trial: 0,
            },
        ],
        safeName: ['api-plus-connect'],
        status: {
            lastUpdated: 1639656081951,
            reason: '',
            modifiedBy: 'administrator',
            value: 'approved',
        },
    };

    static MOCK_APPS_PAGE = {
        count: 1,
        pages: 1,
        pageNumber: 1,
        list: [MockAppsService.MOCK_APP, MockAppsService.MOCK_APP, MockAppsService.MOCK_APP],
    };

    getApps(): Observable<any> {
        return of(MockAppsService.MOCK_APPS_PAGE);
    }

    searchApp(): Observable<any> {
        return of('1');
    }

    getAppBySafeName(...args: any): Observable<any> {
        return of(MockAppsService.MOCK_APP);
    }
}

export class MockCmsContentService {
    getContentDefault(): any {
        return of('1');
    }

    getContentFromAPI(): Observable<any> {
        return of('1');
    }

    getContentByPaths(...args: any): Observable<any> {
        return of(args);
    }
}

export class MockNativeLoginService {
    signup(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }

    changePassword(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }

    signupByInvite(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }

    sendActivationCode(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }

    signIn(...args: any): Observable<any> {
        return of({});
    }

    activate(): Observable<any> {
        return of(null).pipe(observeOn(asyncScheduler));
    }

    resetPassword(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }
    sendResetCode(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }
}

export class MockEditUserTypeService {
    static MOCK_FORM_CONFIGS_RESPONSE = [
        {
            name: 'Default',
            organization: {
                type: 'default',
                typeData: {
                    userTypeId: 'default',
                    fields: [
                        {
                            attributes: {
                                required: false,
                            },
                            id: 'name',
                            label: 'Company Name',
                            type: 'text',
                        },
                    ],
                    createdDate: 1639656055769,
                    description: '',
                    label: 'Default',
                },
                includeFields: ['name', 'customData.company'],
            },
            account: {
                type: 'default',
                typeData: {
                    fields: [
                        {
                            attributes: {
                                required: false,
                            },
                            id: 'name',
                            label: 'Name',
                            type: 'text',
                        },
                        {
                            attributes: {
                                required: true,
                            },
                            id: 'email',
                            label: 'Email',
                            type: 'emailAddress',
                        },
                        {
                            attributes: {
                                required: false,
                            },
                            id: 'username',
                            label: 'Username',
                            type: 'text',
                        },
                    ],
                    createdDate: 1639656055763,
                    description: '',
                    userAccountTypeId: 'default',
                    label: 'Default',
                },
                includeFields: ['name', 'email'],
            },
            fieldsOrder: ['name', 'email', 'org--name', 'password'],
        },
    ];

    injectTypeDataIntoConfigs(): Observable<any> {
        return of(MockEditUserTypeService.MOCK_FORM_CONFIGS_RESPONSE);
    }
}

export class MockLoginRequest {
    idToken: string;
    accessToken: string;

    constructor(idToken: string, accessToken: string) {
        this.idToken = idToken;
        this.accessToken = accessToken;
    }
}

export class MockAppVersionService {
    getAppByVersion(): Observable<any> {
        return of({}).pipe(observeOn(asyncScheduler));
    }

    getAppsVersions(): Observable<any> {
        return of({}).pipe(observeOn(asyncScheduler));
    }

    deleteAppVersion(): Observable<any> {
        return of({}).pipe(observeOn(asyncScheduler));
    }
}

export class MockOAuthService {
    events: Subject<any> = new Subject<any>();
    state = {};

    logOut(...args: any): void {
        // do nothing
    }

    loadDiscoveryDocumentAndLogin(...args: any): Promise<any> {
        return Promise.resolve({});
    }

    configure(...args: any): void {
        // do nothing
    }

    getIdToken(): string {
        return '';
    }

    getAccessToken(): string {
        return '';
    }
}

export class MockLogOutService {
    removeSpecificParamKeyFromTheUrlForSaml2Logout(): void {
        // do nothing
    }
    logOutAndRedirect(): void {
        // do nothing
    }

    logOut(): Observable<any> {
        return of('1');
    }
}

export class MockStripeAccountsService {
    getIsAccountConnected(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }
    getStripeUrlRedirect(): string {
        return '1';
    }
}

export class MockStripeService {
    getTaxesAndPayment(...args: any): Observable<any> {
        return of('1');
    }

    makePurchase(...args: any): Observable<any> {
        return of('1');
    }
}

export class MockDeveloperRoleService {
    getDeveloperRoles(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }
}

export class MockDeveloperTypeService {
    getDeveloperType(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }
}

export class MockAppTypeService {
    getAppTypes(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }

    getOneAppType(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }
}

export class MockMarketService {
    getCurrentMarket(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }
}

export class MockAppManageModalService {
    openModalWithCancelAndSubmitButtons(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }

    openModalWithCancelAndSuspendButtons(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }
}

export class MockDeveloperAccountTypesService {
    getAccountType(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }
}

export class MockDeveloperAccountService {
    getDeveloperAccounts(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }

    deleteDeveloperAccount(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }

    updateAccountFieldsForAnotherUser(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }
}

export class MockDeveloperService {
    getDeveloper(): Observable<any> {
        return of('1').pipe(observeOn(asyncScheduler));
    }
}

export class MockChartService {
    getDateStartByCurrentPeriod(...args: any): Date {
        return new Date();
    }

    getTimeSeries(): Observable<any> {
        return of('1');
    }
}

export const createMockedBrowserStorage = () => {
    let store = {};

    return {
        getItem(key: string): any {
            return store[key] || null;
        },
        setItem(key: string, value: any): void {
            store[key] = value.toString();
        },
        removeItem(key: string): void {
            delete store[key];
        },
        clear(): void {
            store = {};
        },
    };
};
