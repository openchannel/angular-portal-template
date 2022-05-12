import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChangePasswordComponent } from './change-password.component';
import { mockAuthHolderService, mockNativeLoginService, mockToastrService } from '../../../../../mock/providers.mock';
import { MockButtonComponent, MockFormComponent } from '../../../../../mock/components.mock';

describe('ChangePasswordComponent', () => {
    let component: ChangePasswordComponent;
    let fixture: ComponentFixture<ChangePasswordComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ChangePasswordComponent, MockFormComponent, MockButtonComponent],
                providers: [mockToastrService(), mockNativeLoginService(), mockAuthHolderService()],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ChangePasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
