# Template3-portal-frontend

## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Contact](#contact)

## About The Project

The goal of a portal template site is to give partners a dashboard where they can manage, create and submit applications to the marketplace.

This is a Frontend for Developer marketplace.

Functional for Developer:
- SSO sign in by Okta | Google
- work with applications.
- view application statistics.
- create form submissions.

### Built With
- [Bootstrap](https://getbootstrap.com) v. 4.4.1
- [Angular](https://angular.io) v. 11.2.3

## Getting Started
   
### Installation

- Install [node.js and npm](https://linuxize.com/post/how-to-install-node-js-on-ubuntu-18.04/):
```
sudo apt install nodejs
```
- Install the [Angular CLI](https://angular.io/cli) using the npm package manager:
```
npm install -g @angular/cli
```
- Install NPM packages
```
npm install
```
- Optional. Dependency with @openchannel/angular-common-services.
```
npm install file:<absolute path to common service project dist/angular-common-services>
```
- Optional. Dependency with @openchannel/angular-common-components.
```
npm install file:<absolute path to common component project dist/angular-common-components>
```

### Usage

#### Run project with the remote site configs (dev1, stage1):

- Open file:
```
/etc/hosts
```
- Add to file two lines:
```
127.0.0.1 stage1-local-template-portal.openchannel.io
127.0.0.1 dev1-local-template-portal.openchannel.io
```
- Run project with the stage1 environment:
```
sudo npm run start-stage1
```
- Run project with the dev1 environment:
```
sudo npm run start-dev1
```

####  Run project with the Moesif plugin for Chrome:

- Install [Moesif](https://chrome.google.com/webstore/detail/moesif-origin-cors-change/digfbfaphojjndkpccljibejjbppifbc/related) CORS plugin for Chrome
- Submit your work email address there
- Open advanced settings
- Fill in the 'Request Headers' field:
```
https://stage1-local-template-portal.openchannel.io/
```
or:
```
https://dev1-local-template-portal.openchannel.io/
```
- Fill in the 'Response headers' field:
```
http://localhost:4200/
```
- Run project using:
```
sudo ng serve
```

####  Run project with the remote site configs (us1):
Note: replace <font color="red">YOUR_SITE_DOMAIN</font> with your market domain.

- Open file:
```
/etc/hosts
```
- Add to file this line:
```
127.0.0.1 YOUR_SITE_DOMAIN
```
- Run project with the us1 environment:
```
sudo npm run start-us1 YOUR_SITE_DOMAIN
```

#### Run project with the local site configs:

##### Run <font color="red">ONE</font> of this:

- Project with the Okta SSO
```
npm run start-okta
```
- Project with Google SSO
```
npm run start-google
```

## Documentation Compodoc
Compodoc shows project structure. (modules, components, routes etc.)

- Install NPM packages:
```
npm install
```
- Generate Documentation:
```
npm run create-compodoc
```
- Run Compodoc:
```
npm run start-compodoc
```

Documentation [http://localhost:8803](http://localhost:8803)

### Sonarcloud code quality badge

SonarCloud Quality Gate Status [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=openchannel_template3-portal-frontend&metric=alert_status&token=3be31c8f86a9d425e8a04bb3c1e624897c81eb62)](https://sonarcloud.io/dashboard?id=openchannel_template3-portal-frontend)

## Contact

Project Link: [https://bitbucket.org/openchannel/template3-portal-frontend/branch/master](https://bitbucket.org/openchannel/template3-portal-frontend/branch/master)

## Designs

Project Designs: [https://app.zeplin.io/project/5fad60184ae36d25530c9843/screen/60547f8a946c301f466e61f1](https://app.zeplin.io/project/5fad60184ae36d25530c9843/screen/60547f8a946c301f466e61f1)
