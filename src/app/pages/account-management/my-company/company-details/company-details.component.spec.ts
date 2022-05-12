import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyDetailsComponent } from './company-details.component';
import {
    mockAuthHolderService,
    mockDeveloperService,
    mockDeveloperTypeService,
    mockLoadingBarService,
    mockToastrService,
} from '../../../../../mock/providers.mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('CompanyComponent', () => {
    let component: CompanyDetailsComponent;
    let fixture: ComponentFixture<CompanyDetailsComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [CompanyDetailsComponent],
                providers: [
                    mockDeveloperService(),
                    mockDeveloperTypeService(),
                    mockAuthHolderService(),
                    mockToastrService(),
                    mockLoadingBarService(),
                ],
                imports: [RouterTestingModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(CompanyDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
