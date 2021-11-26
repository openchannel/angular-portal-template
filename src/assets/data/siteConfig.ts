import { MetaTagsPageConfig, SiteConfig} from '@openchannel/angular-common-services';
import { PricingFormConfig } from '../../app/pages/app-manage/app-new/pricing-form.service';

export const metaTags: MetaTagsPageConfig = {
    defaultMetaTags: [
        { name: 'author', content: 'OpenChannel' },
        { name: 'generator', content: 'OpenChannel' },
        { name: 'og:url', definitionPath: 'windowUrl' },
    ],
    pages: [],
};

export const siteConfig: SiteConfig = {
    title: '',
    tagline: 'All the apps and integrations that you need',
    metaTags: [],
    favicon: {
        href: '',
        type: 'image/x-icon',
    },
};

export const pricingConfig: PricingFormConfig = {
    enablePricingForm: false,
    enableMultiPricingForms: false,
};
