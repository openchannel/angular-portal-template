# Template3-portal-frontend
 [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=openchannel_template3-portal-frontend&metric=alert_status&token=3be31c8f86a9d425e8a04bb3c1e624897c81eb62)](https://sonarcloud.io/dashboard?id=openchannel_template3-portal-frontend)
 [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=openchannel_template3-portal-frontend&metric=coverage&token=3be31c8f86a9d425e8a04bb3c1e624897c81eb62)](https://sonarcloud.io/dashboard?id=openchannel_template3-portal-frontend)

## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Installation](#installation)
* [Usage](#usage)
* [Contact](#contact)

## About The Project

The goal of a portal template site is to give partners a dashboard where they can manage, create and submit applications to the marketplace.

This is a Frontend for Developer marketplace.

Functional for Developer:
- Native or SSO login.
- Work with applications (create, update, change app status).
- View application statistics.
- Updating profile and organization data.
- Managing developers from your organization. Invite new developers.

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

## Usage

#### Run project with the remote site configs (dev1, stage1):

- Open file:
```
/etc/hosts
```
- Add to file two lines:
```
127.0.0.1 stage1-template-portal.openchannel.io
127.0.0.1 dev1-template-portal.openchannel.io
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
- Fill in the 'Access-Control-Allow-Credentials'<br>
``
  true
``
- Fill in the 'Response headers' field: <br>
``
  http://localhost:4200
``
- Fill in the 'Request Headers' field:<br>
  Example for dev1 environment: <br>
``
  https://dev1-template-portal.openchannel.io
``<br>
  Example for stage1 environment: <br>
  ``
  https://stage1-template-portal.openchannel.io
  ``<br>
- Then start project with command:<br>
  Example for dev1 environment: <br>
``
 ng serve -c dev1
``<br>
  Example for stage1 environment: <br>
``
  ng serve -c stage1
``

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

## Contact

Website: [https://openchannel.io](https://openchannel.io)

## Designs

App Store Designs: [https://support.openchannel.io/guides/app-store-designs/](https://support.openchannel.io/guides/app-store-designs/)
