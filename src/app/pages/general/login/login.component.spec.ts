import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
    mockAuthenticationService,
    mockAuthHolderService,
    mockCmsContentService,
    mockLoadingBarService,
    mockNativeLoginService,
    mockOAuthService,
    mockToastrService,
} from '../../../../mock/providers.mock';
import { MockOcLoginComponent } from '../../../../mock/components.mock';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [LoginComponent, MockOcLoginComponent],
                providers: [
                    mockLoadingBarService(),
                    mockAuthHolderService(),
                    mockOAuthService(),
                    mockNativeLoginService(),
                    mockToastrService(),
                    mockCmsContentService(),
                    mockAuthenticationService(),
                ],
                imports: [RouterTestingModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
