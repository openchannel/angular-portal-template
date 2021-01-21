import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpConfigInterceptor} from '@core/interceptors/httpconfig.interceptor';
import {LoaderComponent} from '@shared/components/loader/loader.component';
import {CustomHttpClientXsrfModule, OcCommonServiceModule} from 'oc-ng-common-service';
import {OAuthModule} from 'angular-oauth2-oidc';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
// tslint:disable-next-line:max-line-length
import {ToastrModule} from 'ngx-toastr';
import {TINYMCE_SCRIPT_SRC} from '@tinymce/tinymce-angular';
import {HttpErrorInterceptor} from '@core/interceptors/httperror.interceptor';
import {SharedModule} from '@shared/shared.module';
import {HomeComponent} from './pages/home/home.component';
import {environment} from '@env';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    OcCommonServiceModule.forRoot(environment),
    DragDropModule,
    OAuthModule.forRoot(),
    ToastrModule.forRoot(),
    CustomHttpClientXsrfModule.withOptions({headerName: 'X-CSRF-TOKEN', apiUrl: environment.apiUrl}),
    SharedModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true},
    {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'},
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    LoaderComponent,
  ],
})
export class AppModule {

}
