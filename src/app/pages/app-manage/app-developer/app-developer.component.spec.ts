import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppDeveloperComponent } from './app-developer.component';
import {
    mockAppManageModalService,
    mockAppsService,
    mockAppTypeService,
    mockAppVersionService,
    mockLoadingBarService,
    mockMarketService,
    mockNgbModal,
    mockToastrService,
} from '../../../../mock/providers.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { MockAppChartComponent, MockAppTableComponent, MockPageTitleComponent } from '../../../../mock/components.mock';

describe('AppDeveloperComponent', () => {
    let component: AppDeveloperComponent;
    let fixture: ComponentFixture<AppDeveloperComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AppDeveloperComponent, MockPageTitleComponent, MockAppChartComponent, MockAppTableComponent],
                providers: [
                    mockAppsService(),
                    mockAppVersionService(),
                    mockAppTypeService(),
                    mockToastrService(),
                    mockNgbModal(),
                    mockMarketService(),
                    mockLoadingBarService(),
                    mockAppManageModalService(),
                ],
                imports: [RouterTestingModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AppDeveloperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
