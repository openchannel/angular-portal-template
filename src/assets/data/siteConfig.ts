import {SiteConfig} from 'oc-ng-common-service';

export const siteConfig: SiteConfig = {
  title: 'App Portal',
  tagline: 'All the apps and integrations that you need',
  metaTags: [
    {name: 'author', content: 'OpenChannel'},
    {name: 'description', content: 'OpenChannel'},
    {name: 'generator', content: 'OpenChannel'}
  ],
  favicon: {
    href: 'assets/img/favicon.png',
    type: 'image/x-icon'
  }
};
