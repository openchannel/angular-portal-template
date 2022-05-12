import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvitedSignupComponent } from './invited-signup.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
    mockAuthenticationService,
    mockDeveloperAccountTypesService,
    mockDeveloperTypeService,
    mockInviteUserServiceProvider,
    mockLoadingBarService,
    mockLogOutService,
    mockNativeLoginService,
    mockToastrService,
} from '../../../../mock/providers.mock';
import { MockSignupCustom } from '../../../../mock/components.mock';

describe('InvitedSignupComponent', () => {
    let component: InvitedSignupComponent;
    let fixture: ComponentFixture<InvitedSignupComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [InvitedSignupComponent, MockSignupCustom],
                providers: [
                    mockInviteUserServiceProvider(),
                    mockNativeLoginService(),
                    mockLogOutService(),
                    mockLoadingBarService(),
                    mockToastrService(),
                    mockAuthenticationService(),
                    mockDeveloperTypeService(),
                    mockDeveloperAccountTypesService(),
                ],
                imports: [RouterTestingModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(InvitedSignupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
