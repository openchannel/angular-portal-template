import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { mockAuthHolderService, mockCmsContentService, mockSiteConfigService, mockTitleService } from '../../../mock/providers.mock';
import { MockAppGetStartedComponent, MockButtonComponent } from '../../../mock/components.mock';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [HomeComponent, MockButtonComponent, MockAppGetStartedComponent],
                providers: [
                    mockAuthHolderService(),
                    mockTitleService(),
                    mockSiteConfigService(),
                    mockSiteConfigService(),
                    mockCmsContentService(),
                ],
                imports: [RouterTestingModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
