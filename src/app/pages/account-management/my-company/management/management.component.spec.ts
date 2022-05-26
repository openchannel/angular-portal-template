import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManagementComponent } from './management.component';
import {
    mockAuthHolderService,
    mockDeveloperAccountService,
    mockDeveloperRoleService,
    mockInviteUserServiceProvider,
    mockLoadingBarService,
    mockNgbModal,
    mockToastrService,
    mockUserServiceProvider,
} from '../../../../../mock/providers.mock';
import { MockOcMenuUserGridComponent } from '../../../../../mock/components.mock';

describe('ManagementComponent', () => {
    let component: ManagementComponent;
    let fixture: ComponentFixture<ManagementComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ManagementComponent, MockOcMenuUserGridComponent],
                providers: [
                    mockLoadingBarService(),
                    mockUserServiceProvider(),
                    mockInviteUserServiceProvider(),
                    mockDeveloperRoleService(),
                    mockToastrService(),
                    mockNgbModal(),
                    mockAuthHolderService(),
                    mockDeveloperAccountService(),
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
