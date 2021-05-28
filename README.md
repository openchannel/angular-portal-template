# Template3-portal-frontend

## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Installation](#installation)
  * [Configure dashboard](#configure-dashboard)
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

### Configure dashboard
- dev1 on the [https://dev1-dashboard.openchannel.io/](https://dev1-dashboard.openchannel.io/)
- stage1 on the [https://stage1-dashboard.openchannel.io/](https://stage1-dashboard.openchannel.io/)
- us1(production) on the [https://us1-dashboard.openchannel.io/](https://us1-dashboard.openchannel.io/)


Step 1. Setup OAuth
  - Google [guide](https://developers.google.com/identity/protocols/oauth2/openid-connect) 
  - Okta guide : [guide](https://developer.okta.com/docs/guides/implement-oauth-for-okta/overview)

Step 2. (#type).
  - Follow the link to the dashboard and sign in.
  - On the left sidebar menu, find 'Settings' and open.
  - Then open 'Field Settings'.
  - You must create a new types for tabs:  
      *'USER'  
      *'USER ACCOUNT'  
      *'DEVELOPER'  
      *'DEVELOPER ACCOUNT'  
    
Step 3. (#roles)
  - Follow the link to the dashboard and sign in.
  - On the left sidebar menu, find 'Developers' and open.
  - Then open 'Roles' and click by 'ADD ROLE.
  - Fill name.
  - Then click by 'ADD PERMISSIONS'
  - Select all available permissions.
  - Save.

Step 4. Creating site template, it is portal or market.
  - Follow the link to the dashboard and sign in.
  - On the left sidebar menu, find 'Sites' and open.
  - Click by 'CREATE SITE'.
  - In the opened modal fill fields :  
         1) Name* - just site name.  
         2) Type* - now has two parameters ('Self Hosted' and 'Fully Hosted')  
            Self Hosted - the site will be created from scratch.  
            Fully Hosted - you already have your site and want to link it by site domain.  
         3) Template* ('Self Hosted') - select your template type: portal(for developers) or market(for users)
    
Step 5. Configure site authorization type SSO or Native login.
  - Follow the link to the dashboard and sign in.  
  - On the left sidebar menu find 'Sites' and open.  
  - Find your site and open. (This page configures your site)  
  - Find and click by 'SSO'.  
  - Find and click by 'ADD IDENTITY CONFIGURATION'.  
    >Google config  
    *Name : Google  
    *Validation Mode : Authorization Code  
    *Client ID : 45823498-349823hfjnlfna98r722903470.apps.googleusercontent.com   
    *Client Secret : AGSdaskjqASJFnsdfal  
    *Issuer : https://accounts.google.com   
    *Grant Type : authorization_code  
    *Scope : openid profile email  
    *Classification : USER | DEVELOPER  
    *Developer Organization Type (#type): admin  
    *Developer Account Type (#type): admin  
    *Developer Account Roles (#roles):dev-admin  
    >>Google claims mappings :  
    *accountId : {{sub}}  
    *organizationName : {{use your custom JWT claim or for test '{{aud}}'  
    *email : {{email}}  
    *name : {{given_name}} {{family_name}}  
    *username : {{name}}  
    *organizationId :{{aud}}  

    >Okta config  
    *Name : Okta  
    *Validation Mode : Authorization Code 
         Note: ('Authorization Code' - signup used special endpoints, but 'Introspect' 
    and 'Public key' use all CAP endpoints)  
    *Client ID : OAuth clientId  
    *Client Secret : OAuth client secret  
    *Issuer : https://dev-2468217.okta.com (use your ID into domain)  
    *Grant Type : authorization_code  
    *Scope : openid profile email  
    *Classification : USER | DEVELOPER  
    *Developer Organization Type (#type): default  
    *Developer Account Type (#type): default  
    *Developer Account Roles (#roles): dev-admin  
    >>Okta claims mappings :  
    *accountId : {{sub}}  
    *organizationId : {{idp}}  
    *organizationName : {{name}}-company  
    *email : {{email}}  
    *name : {{name}}  
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

####  Run project with the Moesif plugin for Chrome (dev1, stage1, us1):

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
  ``  
  *Or just set url from your site:  
  ``
  https://my-site-portal-or-market.io
  ``
- Then start project with command:<br>
  Example for dev1 environment: <br>
``
 ng serve -c dev1
``<br>
  Example for stage1 environment: <br>
``
  ng serve -c stage1
``  
  Example for us1 environment: <br>
  ``
  ng serve -c production
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

### Sonarcloud code quality badge

SonarCloud Quality Gate Status [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=openchannel_template3-portal-frontend&metric=alert_status&token=3be31c8f86a9d425e8a04bb3c1e624897c81eb62)](https://sonarcloud.io/dashboard?id=openchannel_template3-portal-frontend)

## Contact

Project Link: [https://bitbucket.org/openchannel/template3-portal-frontend/branch/master](https://bitbucket.org/openchannel/template3-portal-frontend/branch/master)

## Designs

Project Designs: [https://app.zeplin.io/project/5fad60184ae36d25530c9843/screen/60547f8a946c301f466e61f1](https://app.zeplin.io/project/5fad60184ae36d25530c9843/screen/60547f8a946c301f466e61f1)
