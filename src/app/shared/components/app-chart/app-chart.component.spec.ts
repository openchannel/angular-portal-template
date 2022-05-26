import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppChartComponent } from './app-chart.component';
import { mockAppsService, mockAppVersionService, mockChartService, mockLoadingBarService } from '../../../../mock/providers.mock';
import { MockOcChartComponent } from '../../../../mock/components.mock';

describe('AppChartComponent', () => {
    let component: AppChartComponent;
    let fixture: ComponentFixture<AppChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppChartComponent, MockOcChartComponent],
            providers: [mockLoadingBarService(), mockAppsService(), mockChartService(), mockAppVersionService()],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
