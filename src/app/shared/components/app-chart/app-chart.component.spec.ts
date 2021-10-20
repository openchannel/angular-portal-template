import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppChartComponent } from './app-chart.component';

describe('AppChartComponent', () => {
    let component: AppChartComponent;
    let fixture: ComponentFixture<AppChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppChartComponent],
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
