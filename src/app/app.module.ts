import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbDateAdapter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './shared/template/header/header.component';
import {FooterComponent} from './shared/template/footer/footer.component';
import {HomeComponent} from './components/home/home.component';
import {HttpConfigInterceptor} from './core/interceptors/httpconfig.interceptor';
import {CommonLayoutComponent} from './layouts/common-layout/common-layout.component';
import {LoginComponent} from './components/login/login.component';
import {ForgotPasswordComponent} from './components/users/forgot-password/forgot-password.component';
import {CustomComponentsModule} from './shared/custom-components/custom-components.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {CustomAdapter} from './core/datepicker-adapter';
import {LoaderComponent} from './shared/custom-components/loader/loader.component';
import {DatePipe} from '@angular/common';
import {SignupComponent} from './components/signup/signup.component';
import {OcCommonServiceModule} from 'oc-ng-common-service';
import {AppStoreComponent} from './components/applications/app-store/app-store.component';
import {AppAppsComponent} from './components/applications/app-apps/app-apps.component';
import {AppDetailComponent} from './components/applications/app-detail/app-detail.component';
import {AppDeveloperComponent} from './components/applications/app-developer/app-developer.component';
import {AppNewComponent} from './components/applications/app-new/app-new.component';
import {environment} from 'src/environments/environment';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js//plugins/code_view.min.js';
import {GeneralProfileComponent} from './components/my-profile/general/general-profile.component';
import {ChangePasswordComponent} from './components/my-profile/change-password/change-password.component';
import {MyProfileComponent} from './components/my-profile/my-profile.component';
import {EditAppDetailComponent} from './components/applications/edit-app-detail/edit-app-detail.component';
import {EditAppComponent} from './components/applications/edit-app/edit-app.component';
import {ActivationComponent} from './components/activation/activation.component';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {FormListGeneratorComponent} from './components/applications/app-store/form-list-generator/form-list-generator.component';
import {FormModalComponent} from './shared/modals/form-modal/form-modal.component';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {ApolloClientOptions, DefaultOptions, InMemoryCache} from '@apollo/client/core';
import {OAuthModule} from 'angular-oauth2-oidc';
import {AppService} from './core/api/app.service';
import {AppListComponent} from './components/applications/app-apps/app-list/app-list.component';
import {CreateAppComponent} from './components/applications/app-apps/app-create-app/create-app.component';
import {OcCommonLibModule} from 'oc-ng-common-component';
import {AppsServiceImpl} from './core/services/apps-services/model/apps-service-impl';
import {MockAppsService} from './core/services/apps-services/mock-apps-service/mock-apps-service.service';
import {ConfirmationModalComponent} from './shared/modals/confirmation-modal/confirmation-modal.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CamelCaseToNormalPipe} from './shared/custom-components/camel-case-to-normal.pipe';
import {SubmissionsTableComponent} from './components/applications/app-store/form-list-generator/submissions-table/submissions-table.component';
import {SubmissionsDataViewModalComponent} from './shared/modals/submissions-data-view-modal/submissions-data-view-modal.component';
import {AuthService} from './core/services/auth-service/auth.service';
import {setContext} from '@apollo/client/link/context';
import {HttpXsrfInterceptor} from './core/interceptors/httpxsft.interceptor';
import {HttpXsrfExtractor} from './core/interceptors/httpxsft.extractor';

export function createApollo(httpLink: HttpLink, authService: AuthService): ApolloClientOptions<any> {

  const httpLinkUri = httpLink.create({uri: environment.graphqlUrl, withCredentials: true});

  const defaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  };

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = authService.accessToken;
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

  return {
    link: authLink.concat(httpLinkUri),
    cache: new InMemoryCache(),
    defaultOptions
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CommonLayoutComponent,
    LoginComponent,
    ForgotPasswordComponent,
    SignupComponent,
    SignupComponent,
    AppStoreComponent,
    AppAppsComponent,
    AppDetailComponent,
    AppDeveloperComponent,
    AppNewComponent,
    GeneralProfileComponent,
    ChangePasswordComponent,
    MyProfileComponent,
    EditAppDetailComponent,
    EditAppComponent,
    ActivationComponent,
    ResetPasswordComponent,
    FormListGeneratorComponent,
    SubmissionsTableComponent,
    SubmissionsDataViewModalComponent,
    FormModalComponent,
    AppListComponent,
    CreateAppComponent,
    CreateAppComponent,
    ConfirmationModalComponent,
    CamelCaseToNormalPipe,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    FormsModule,
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CustomComponentsModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    NgSelectModule,
    OcCommonServiceModule.forRoot(environment),
    ReactiveFormsModule,
    OcCommonLibModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DragDropModule,
    OAuthModule.forRoot(),
    HttpClientXsrfModule.withOptions({ cookieName: 'XSRF-TOKEN' })
  ],
  providers: [
   { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
   { provide: HTTP_INTERCEPTORS, useClass: HttpXsrfInterceptor, multi: true },
   { provide: HTTP_INTERCEPTORS, useClass: HttpXsrfExtractor, multi: true },
   { provide: NgbDateAdapter, useClass: CustomAdapter },
   {
     provide: APOLLO_OPTIONS,
     useFactory: createApollo,
     deps: [HttpLink, AuthService],
   },
    {provide: AppsServiceImpl, useClass: MockAppsService},
   DatePipe,
   AppService],
  bootstrap: [AppComponent],
  entryComponents: [
    SubmissionsDataViewModalComponent,
    LoaderComponent,
    FormModalComponent,
    ConfirmationModalComponent,
  ],
})
export class AppModule {

}
