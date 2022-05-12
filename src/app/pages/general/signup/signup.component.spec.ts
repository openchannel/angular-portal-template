import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { mockEditUserTypeService, mockLoadingBarService, mockNativeLoginService } from '../../../../mock/providers.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MockSignupCustom } from '../../../../mock/components.mock';

describe('SignupComponent', () => {
    let component: SignupComponent;
    let fixture: ComponentFixture<SignupComponent>;
    let router;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [SignupComponent, MockSignupCustom],
                providers: [mockNativeLoginService(), mockLoadingBarService(), mockEditUserTypeService()],
                imports: [RouterTestingModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        router = TestBed.inject(Router);
        jest.spyOn(router, 'getCurrentNavigation').mockReturnValueOnce({ extras: { state: { message: 'msg' } } } as any);
        fixture = TestBed.createComponent(SignupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
