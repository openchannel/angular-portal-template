import { Component, OnInit } from '@angular/core';
import { CmsContentService } from '@core/services/cms-content-service/cms-content-service.service';

interface FooterColumn {
    label: string;
    location: string;
    items: FooterRow[];
}

interface FooterRow {
    label: string;
    location: string;
}

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
    cmsData = {
        logoImageURL: '',
        columnsDFA: [] as FooterColumn[],
        copyrightText: '',
        copyrightLinkText: '',
        copyrightLinkUrl: '',
    };

    currentYear: number;

    constructor(private cmsService: CmsContentService) {}

    ngOnInit(): void {
        this.initCMSData();
        this.currentYear = new Date().getFullYear();
    }

    initCMSData(): void {
        this.cmsService
            .getContentByPaths({
                logoImageURL: 'default-footer.logo',
                columnsDFA: 'default-footer.menu.items',
                copyrightText: 'footer-copyright-text',
                copyrightLinkText: 'footer-copyright-link-text',
                copyrightLinkUrl: 'footer-copyright-link-url',
            })
            .subscribe(content => {
                this.cmsData.logoImageURL = content.logoImageURL as string;
                this.cmsData.columnsDFA = content.columnsDFA as FooterColumn[];
                this.cmsData.copyrightText = content.copyrightText as string;
                this.cmsData.copyrightLinkText = content.copyrightLinkText as string;
                this.cmsData.copyrightLinkUrl = content.copyrightLinkUrl as string;
            });
    }
}
