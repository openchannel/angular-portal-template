import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password.component';
import { mockNativeLoginService, mockToastrService } from '../../../../mock/providers.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { MockOcResetPasswordComponent } from '../../../../mock/components.mock';

describe('ResetPasswordComponent', () => {
    let component: ResetPasswordComponent;
    let fixture: ComponentFixture<ResetPasswordComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ResetPasswordComponent, MockOcResetPasswordComponent],
                providers: [mockNativeLoginService(), mockToastrService()],
                imports: [RouterTestingModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ResetPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
