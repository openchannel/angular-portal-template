import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { mockAuthHolderService, mockCmsContentService, mockSiteConfigService, mockTitleService } from '../../../mock/providers.mock';
import { MockAppGetStartedComponent, MockButtonComponent } from '../../../mock/components.mock';
import { CmsContentService } from '@core/services/cms-content-service/cms-content-service.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

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
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should pass all variables to oc-app-get-started', () => {
        const router = TestBed.inject(Router);
        const cmsService = TestBed.inject(CmsContentService);
        const mockedResult = {
            pageInfoTitle: 'Your App Directory',
            pageInfoSubtext: 'A default design template for implementing your app directory with OpenChannel',
            bottomCalloutHeader: 'List your app in our app directory',
            bottomCalloutDescription: 'Register as an app developer and submit your app easily with our Developer Portal',
            bottomCalloutButtonText: 'Get started as an app developer',
            bottomCalloutButtonLocation: '',
            bottomCalloutImageURL: 'assets/img/get-started.svg',
        };

        jest.spyOn(cmsService, 'getContentByPaths').mockReturnValue(of(mockedResult));
        jest.spyOn(router, 'navigate');
        component.initCMSData();

        fixture.detectChanges();

        const ocAppGetStarted = fixture.debugElement.query(By.directive(MockAppGetStartedComponent)).componentInstance;
        expect(ocAppGetStarted.getStartedHeader).toBe(mockedResult.bottomCalloutHeader);
        expect(ocAppGetStarted.getStartedImage).toBe(mockedResult.bottomCalloutImageURL);
        expect(ocAppGetStarted.getStartedDescription).toBe(mockedResult.bottomCalloutDescription);
        expect(ocAppGetStarted.getStartedButtonText).toBe(mockedResult.bottomCalloutButtonText);
        expect(ocAppGetStarted.getStartedHeadingTag).toBe('h2');

        ocAppGetStarted.getStarted.emit(true);

        expect(router.navigate).toBeCalledWith([mockedResult.bottomCalloutButtonLocation]);
    });
});
