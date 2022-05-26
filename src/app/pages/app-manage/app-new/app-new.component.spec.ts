import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppNewComponent } from './app-new.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
    mockAppManageModalService,
    mockAppsService,
    mockAppTypeService,
    mockAppVersionService,
    mockLoadingBarService,
    mockNgbModal,
    mockStripeAccountsService,
    mockStripeService,
    mockTitleService,
    mockToastrService,
} from '../../../../mock/providers.mock';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MockAppChartComponent,
    MockButtonComponent,
    MockFormComponent,
    MockOcErrorComponent,
    MockOcLabelComponent,
    MockOcSelectComponent,
    MockPageTitleComponent,
} from '../../../../mock/components.mock';

describe('AppNewComponent', () => {
    let component: AppNewComponent;
    let fixture: ComponentFixture<AppNewComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [
                    AppNewComponent,
                    MockAppChartComponent,
                    MockOcSelectComponent,
                    MockOcLabelComponent,
                    MockOcErrorComponent,
                    MockPageTitleComponent,
                    MockFormComponent,
                    MockButtonComponent,
                ],
                providers: [
                    mockAppsService(),
                    mockAppVersionService(),
                    mockLoadingBarService(),
                    mockTitleService(),
                    mockToastrService(),
                    mockStripeService(),
                    mockStripeAccountsService(),
                    mockNgbModal(),
                    mockAppManageModalService(),
                    mockAppTypeService(),
                    FormBuilder,
                ],
                imports: [RouterTestingModule, ReactiveFormsModule, FormsModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AppNewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
