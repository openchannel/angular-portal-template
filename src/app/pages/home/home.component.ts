import { Component, OnInit } from '@angular/core';
import { AuthHolderService, SiteConfigService, TitleService } from '@openchannel/angular-common-services';
import { Router } from '@angular/router';
import { CmsContentService } from '@core/services/cms-content-service/cms-content-service.service';

interface CMSData {
    pageInfoTitle: string;
    pageInfoSubtext: string;
    bottomCalloutHeader: string;
    bottomCalloutImageURL: string;
    bottomCalloutDescription: string;
    bottomCalloutButtonText: string;
    bottomCalloutButtonLocation: string;
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    cmsData: CMSData = {
        pageInfoTitle: '',
        pageInfoSubtext: '',
        bottomCalloutHeader: '',
        bottomCalloutImageURL: '',
        bottomCalloutDescription: '',
        bottomCalloutButtonText: '',
        bottomCalloutButtonLocation: '',
    };

    constructor(
        private authHolderService: AuthHolderService,
        private titleService: TitleService,
        private siteService: SiteConfigService,
        private cmsService: CmsContentService,
        public router: Router,
    ) {}

    ngOnInit(): void {
        this.setTagLineToPageTitleService();
        this.initCMSData();
    }

    initCMSData(): void {
        this.cmsService
            .getContentByPaths({
                pageInfoTitle: 'big-hero.title',
                pageInfoSubtext: 'big-hero.subtext',
                bottomCalloutHeader: 'content-callout.title',
                bottomCalloutImageURL: 'content-callout.image',
                bottomCalloutDescription: 'content-callout.body',
                bottomCalloutButtonText: 'content-callout.button.text',
                bottomCalloutButtonLocation: 'content-callout.button.location',
            })
            .subscribe(content => (this.cmsData = content as CMSData));
    }

    setTagLineToPageTitleService(): void {
        this.siteService
            .getSiteConfigAsObservable()
            .subscribe(config => this.titleService.setSpecialTitle(config.tagline, true));
    }
}
