import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/template/header/header.component';
import { FooterComponent } from './shared/template/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { HttpConfigInterceptor } from './core/interceptors/httpconfig.interceptor';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/users/forgot-password/forgot-password.component';
import { CustomComponentsModule } from './shared/custom-components/custom-components.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomAdapter } from './core/datepicker-adapter';
import { LoaderComponent } from './shared/custom-components/loader/loader.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ApplicationsComponent } from './components/applications/applications/applications.component';
import { ApplicationDetailComponent } from './components/applications/application-detail/application-detail.component';
import { MyApplicationsComponent } from './components/applications/my-applications/my-applications.component';
import { MyProfileComponent } from './components/profile/my-profile/my-profile.component';
import { ChangePasswordComponent } from './components/profile/change-password/change-password.component';
import { SsoLoginComponent } from './components/sso-login/sso-login.component';
import { DatePipe } from '@angular/common';
import { SignupComponent } from './components/signup/signup.component';
import { NewAppComponent } from './components/applications/new-app/new-app.component';
import { OcCommonServiceModule } from 'oc-ng-common-service';
import { OcCommonLibModule } from 'oc-ng-common-component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CommonLayoutComponent,
    LoginComponent,
    ForgotPasswordComponent,
    NotFoundComponent,
    ApplicationsComponent,
    ApplicationDetailComponent,
    SignupComponent,
    MyApplicationsComponent,
    MyProfileComponent,
    ChangePasswordComponent,
    SsoLoginComponent,
    SignupComponent,
    NewAppComponent
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
    NgSelectModule,
    OcCommonServiceModule,
    OcCommonLibModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
  { provide: NgbDateAdapter, useClass: CustomAdapter }, DatePipe],
  bootstrap: [AppComponent],
  entryComponents: [LoaderComponent],
})
export class AppModule { }
