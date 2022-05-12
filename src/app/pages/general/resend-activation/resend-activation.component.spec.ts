import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResendActivationComponent } from './resend-activation.component';
import { mockNativeLoginService, mockToastrService } from '../../../../mock/providers.mock';
import { RouterTestingModule } from '@angular/router/testing';
import {MockResendActivation} from "../../../../mock/components.mock";

describe('ResendActivationComponent', () => {
    let component: ResendActivationComponent;
    let fixture: ComponentFixture<ResendActivationComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ResendActivationComponent, MockResendActivation],
                providers: [mockNativeLoginService(), mockToastrService()],
                imports: [RouterTestingModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ResendActivationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
