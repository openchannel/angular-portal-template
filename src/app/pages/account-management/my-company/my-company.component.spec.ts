import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { MyCompanyComponent } from './my-company.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import {
    MockAppCompanyComponent,
    MockAppPayoutsComponent,
    MockManagementComponent,
    MockModalInviteUserModel,
    MockOcInviteModalComponent,
    MockPageTitleComponent,
    MockRoutingComponent,
} from 'mock/components.mock';
import {
    mockAuthHolderService,
    mockDeveloperRoleService,
    mockDeveloperService,
    mockInviteUserServiceProvider,
    mockNgbModal,
    mockSiteConfigService,
    mockToastrService,
} from '../../../../mock/providers.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';

jest.mock('@openchannel/angular-common-components', () => ({
    ModalInviteUserModel: jest.fn().mockImplementation(() => MockModalInviteUserModel),
    OcInviteModalComponent: jest.fn().mockImplementation(() => MockOcInviteModalComponent),
}));

describe('MyCompanyComponent', () => {
    let component: MyCompanyComponent;
    let fixture: ComponentFixture<MyCompanyComponent>;
    let router: Router;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [
                    MyCompanyComponent,
                    MockPageTitleComponent,
                    MockAppCompanyComponent,
                    MockManagementComponent,
                    MockAppPayoutsComponent,
                    MockRoutingComponent,
                ],
                imports: [
                    RouterTestingModule.withRoutes([
                        {
                            path: 'not-existing-page',
                            component: MockRoutingComponent,
                        },
                        {
                            path: 'my-company/new-page',
                            component: MockRoutingComponent,
                        },
                    ]),
                    HttpClientTestingModule,
                ],
                providers: [
                    mockNgbModal(),
                    mockToastrService(),
                    mockAuthHolderService(),
                    mockDeveloperService(),
                    mockDeveloperRoleService(),
                    mockSiteConfigService(),
                    mockInviteUserServiceProvider([]),
                ],
            }).compileComponents();
            router = TestBed.inject(Router);
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(MyCompanyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('initMainPage method should set first item of the currentPages to selectedPage if current url is not equal to any currentPages urls', fakeAsync(() => {
        router.navigate(['not-existing-page']);
        tick();

        (component as any).initMainPage();
        expect(component.selectedPage).toEqual(component.currentPages[0]);
    }));

    it('initMainPage method should set correct item of the currentPages to selectedPage if current url is equal to one of the currentPages urls', fakeAsync(() => {
        const newPage = {
            pageId: 'new-page',
            placeholder: 'New Page',
            routerLink: '/my-company/new-page',
            permissions: [],
        };

        component.currentPages.push(newPage);
        router.navigate([newPage.routerLink]);
        tick();

        (component as any).initMainPage();
        expect(component.selectedPage).toEqual(newPage);

        component.currentPages.pop();
    }));

    it('should call initProfile method in ngOnInit', () => {
        jest.spyOn(component as any, 'initProfile');

        // tslint:disable-next-line:no-lifecycle-call
        component.ngOnInit();

        expect((component as any).initProfile).toHaveBeenCalled();
    });

    it('goToPage method should set new selectedPage', () => {
        const newPage = {
            pageId: 'new-page',
            placeholder: 'New Page',
            routerLink: '/my-company/new-page',
            permissions: [],
        };
        jest.spyOn((component as any).location, 'replaceState');

        component.selectedPage = null;

        component.gotoPage(newPage);

        expect(component.selectedPage).toEqual(newPage);
        expect((component as any).location.replaceState).toHaveBeenCalledWith(newPage.routerLink);
    });

    it('goBack method should call history.back method', () => {
        history.back = jest.fn();

        component.goBack();

        expect(history.back).toHaveBeenCalled();
    });

    it('openInviteModal method should call modal.open method', () => {
        jest.spyOn((component as any).modal, 'open');

        component.openInviteModal();

        expect((component as any).modal.open).toHaveBeenCalled();
    });

    it('goBack method should be called when app-page-title emits navigateClick', () => {
        jest.spyOn(component, 'goBack');

        const pageTitleDE = fixture.debugElement.query(By.directive(MockPageTitleComponent));
        pageTitleDE.triggerEventHandler('navigateClick', {});

        expect(component.goBack).toHaveBeenCalled();
    });

    it('should pass "Invite a member" to app-page-title buttonText if selectedPage is a profile page', () => {
        component.selectedPage = component.pages[1];
        fixture.detectChanges();

        const pageTitleInstance = fixture.debugElement.query(By.directive(MockPageTitleComponent)).componentInstance;
        expect(pageTitleInstance.buttonText).toBe('Invite a member');
    });

    it('should pass null to app-page-title buttonText if selectedPage is not a profile page', () => {
        component.selectedPage = component.pages[0];
        fixture.detectChanges();

        const pageTitleInstance = fixture.debugElement.query(By.directive(MockPageTitleComponent)).componentInstance;
        expect(pageTitleInstance.buttonText).toBeNull();
    });

    it('openInviteModal method should be called when app-page-title emits buttonClick', () => {
        jest.spyOn(component, 'openInviteModal');

        const pageTitleDE = fixture.debugElement.query(By.directive(MockPageTitleComponent));
        pageTitleDE.triggerEventHandler('buttonClick', {});
    });

    it('should render li items for each currentPages item', () => {
        component.currentPages = [
            {
                pageId: 'new-page',
                placeholder: 'New Page',
                routerLink: '/my-company/new-page',
                permissions: [],
            },
        ];
        component.selectedPage = {
            pageId: 'new-page',
            placeholder: 'New Page',
            routerLink: '/my-company/new-page',
            permissions: [],
        };

        fixture.detectChanges();

        const pagesItems = fixture.debugElement.queryAll(By.css('ul li'));
        expect(component.currentPages.length).toBe(pagesItems.length);
    });

    it('should check link work in template', () => {
        jest.spyOn(component, 'gotoPage');
        component.currentPages = [
            {
                pageId: 'new-page',
                placeholder: 'New Page',
                routerLink: '/my-company/new-page',
                permissions: [],
            },
        ];
        component.selectedPage = {
            pageId: 'new-page',
            placeholder: 'New Page',
            routerLink: '/my-company/new-page',
            permissions: [],
        };

        fixture.detectChanges();

        const pageLinkElement = fixture.debugElement.query(By.css('ul li a')).nativeElement;

        expect(pageLinkElement.classList.contains('active-link')).toBeTruthy();
        expect(pageLinkElement.textContent.trim()).toBe(component.currentPages[0].placeholder.trim());

        pageLinkElement.click();

        expect(component.gotoPage).toHaveBeenCalledWith(component.currentPages[0]);
    });

    it('should render correct page according to selectedPage.pageId', () => {
        component.currentPages = [
            {
                pageId: 'new-page',
                placeholder: 'New Page',
                routerLink: '/my-company/new-page',
                permissions: [],
            },
        ];
        component.selectedPage = {
            pageId: 'new-page',
            placeholder: 'New Page',
            routerLink: '/my-company/new-page',
            permissions: [],
        };

        fixture.detectChanges();

        const management = fixture.debugElement.query(By.directive(MockManagementComponent));

        expect(management).toBeNull();
    });
});
