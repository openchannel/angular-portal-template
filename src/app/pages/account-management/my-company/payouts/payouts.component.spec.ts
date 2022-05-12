import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutsComponent } from './payouts.component';
import { mockLoadingBarService, mockStripeAccountsService, mockStripeService, mockToastrService } from '../../../../../mock/providers.mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('PayoutsComponent', () => {
    let component: PayoutsComponent;
    let fixture: ComponentFixture<PayoutsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PayoutsComponent],
            providers: [mockStripeService(), mockLoadingBarService(), mockToastrService(), mockStripeAccountsService()],
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PayoutsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
