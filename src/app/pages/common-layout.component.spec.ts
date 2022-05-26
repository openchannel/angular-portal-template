import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonLayoutComponent } from './common-layout.component';
import { MockAppFooterComponent, MockAppHeaderComponent } from '../../mock/components.mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('CommonLayoutComponent', () => {
    let component: CommonLayoutComponent;
    let fixture: ComponentFixture<CommonLayoutComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [CommonLayoutComponent, MockAppHeaderComponent, MockAppFooterComponent],
                imports: [RouterTestingModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(CommonLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
