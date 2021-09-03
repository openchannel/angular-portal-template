import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpConfigInterceptor } from '@core/interceptors/httpconfig.interceptor';
import { CustomHttpClientXsrfModule, NetlifyPrerenderModule, OcCommonServiceModule } from '@openchannel/angular-common-services';
import { OAuthModule } from 'angular-oauth2-oidc';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToastrModule } from 'ngx-toastr';
import { TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { HttpErrorInterceptor } from '@core/interceptors/httperror.interceptor';
import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from './pages/home/home.component';
import { environment } from '@env';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { FileUploaderService, OcMarketComponentsModule } from '@openchannel/angular-common-components';
import { FileService } from '@core/services/file.service';
import { OcAppsSearchService } from '@core/services/oc-apps-search.service';
import { AppsSearchService } from '@openchannel/angular-common-components/src/lib/form-components';

function getApiUrl(): string {
    if (environment.enableProxy) {
        return `${window.origin}/client-api/`;
    }
    return environment.apiUrl;
}

export const OC_API_URL = getApiUrl();

@NgModule({
    declarations: [AppComponent, HomeComponent, NotFoundComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        HttpClientModule,
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        OcCommonServiceModule.forRoot(OC_API_URL),
        DragDropModule,
        OAuthModule.forRoot(),
        ToastrModule.forRoot(),
        CustomHttpClientXsrfModule.withOptions({ headerName: 'X-CSRF-TOKEN', apiUrl: OC_API_URL }),
        NetlifyPrerenderModule.withOptions(),
        SharedModule,
        LoadingBarModule,
        OcMarketComponentsModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
        { provide: FileUploaderService, useClass: FileService },
        { provide: AppsSearchService, useClass: OcAppsSearchService },
    ],
    bootstrap: [AppComponent],
    entryComponents: [],
})
export class AppModule {}
