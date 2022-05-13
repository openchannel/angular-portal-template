import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyProfileComponent } from './my-profile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockAppChangePasswordComponent, MockAppGeneralProfileComponent, MockPageTitleComponent } from '../../../../mock/components.mock';

describe('MyProfileComponent', () => {
    let component: MyProfileComponent;
    let fixture: ComponentFixture<MyProfileComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [MyProfileComponent, MockPageTitleComponent, MockAppGeneralProfileComponent, MockAppChangePasswordComponent],
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
