import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyProfileComponent } from './my-profile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockPageTitleComponent } from '../../../../mock/components.mock';

describe('MyProfileComponent', () => {
    let component: MyProfileComponent;
    let fixture: ComponentFixture<MyProfileComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [MyProfileComponent, MockPageTitleComponent],
                imports: [RouterTestingModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(MyProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
