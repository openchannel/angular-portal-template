# template3-portal-frontend

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Contact](#contact)

<!-- ABOUT THE PROJECT -->
## About The Project

It is Frontend for Developer marketplace.

Functional for Developer :
 - SSO sign in by Okta | Google
 - work with Apps.
 - view stats about Apps.
 - create form submissions.

### Built With
* [Bootstrap](https://getbootstrap.com) v. 4.4.1
* [Angular](https://angular.io) v. 9.1.1

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

Install support elements: <br>
   * Node & npm [https://www.digitalocean.com/community/tutorials/node-js-ubuntu-18-04-ru](https://www.digitalocean.com/community/tutorials/node-js-ubuntu-18-04-ru)
   
### Installation

1. Install NPM packages
```
   npm install
```

2. Optional. Dependency with oc-ng-common-service.
```
npm install file:<absolute path to common service project dist/oc-ng-common-service>
```

3. Optional. Dependency with oc-ng-common-components.
```
npm install file:<absolute path to common component project dist/oc-ng-common-components>
```

<!-- USAGE EXAMPLES -->
### Usage

####  Run project with the remote site configs :
1. Update hosts:
   * Open file :<br>
    ```/etc/hosts```
   * Add to file two lines:<br>
     ``
     127.0.0.1 stage1-local-template-portal.openchannel.io
     ``<br>
     ``
     127.0.0.1 dev1-local-template-portal.openchannel.io
     ``
2. Run project:
   * Run project with the stage1 environment:<br>
   ``
   sudo npm run start-stage1
   ``
   * Run project with the dev1 environment:<br>
   ``
   sudo npm run start-dev1
   ``

#### Run project with the local site configs :

1. Run <font color="red">ONE</font> of this :
    * Project with the Okta SSO <br>
       ``npm run start-okta``
    * Project with Google SSO <br>
      ``npm run start-google``

## Documentation Compodoc
Compodoc show project structure. (modules, components, routes and etc.)

* Install NPM packages :<br>
  ``npm install``

* Generate Documentation :<br>

  ``npm run create-compodoc``

* Run Compodoc :<br>

  ``npm run start-compodoc``
  
* Documentation [http://localhost:8803](http://localhost:8803)

## Contact

Project Link: [https://bitbucket.org/openchannel/template3-portal-frontend/branch/master](https://bitbucket.org/openchannel/template3-portal-frontend/branch/master)

