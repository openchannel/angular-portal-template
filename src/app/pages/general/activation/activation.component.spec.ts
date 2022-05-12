import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivationComponent } from './activation.component';
import { mockNativeLoginService, mockToastrService } from '../../../../mock/providers.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { MockOcActivationComponent } from '../../../../mock/components.mock';

describe('ActivationComponent', () => {
    let component: ActivationComponent;
    let fixture: ComponentFixture<ActivationComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ActivationComponent, MockOcActivationComponent],
                providers: [mockNativeLoginService(), mockToastrService()],
                imports: [RouterTestingModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
