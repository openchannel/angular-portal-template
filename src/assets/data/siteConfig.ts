import { MetaTagsPageConfig, PaymentsGateways, SiteConfig } from '@openchannel/angular-common-services';

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
    paymentsEnabled: true,
    paymentsGateway: PaymentsGateways.STRIPE,
};
