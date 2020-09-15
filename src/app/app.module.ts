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
import { DatePipe } from '@angular/common';
import { SignupComponent } from './components/signup/signup.component';
import { OcCommonServiceModule } from 'oc-ng-common-service';
import { OcCommonLibModule } from 'oc-ng-common-component';
import { AppStoreComponent } from './components/applications/app-store/app-store.component';
import { AppListComponent } from './components/applications/app-list/app-list.component';
import { AppDetailComponent } from './components/applications/app-detail/app-detail.component';
import { AppDeveloperComponent } from './components/applications/app-developer/app-developer.component';
import { AppNewComponent } from './components/applications/app-new/app-new.component';
import { environment } from 'src/environments/environment';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js//plugins/code_view.min.js';
import { GeneralProfileComponent } from './components/my-profile/general/general-profile.component';
import { ChangePasswordComponent } from './components/my-profile/change-password/change-password.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { EditAppDetailComponent } from './components/applications/edit-app-detail/edit-app-detail.component';
import { EditAppComponent } from './components/applications/edit-app/edit-app.component';
import { ActivationComponent } from './components/activation/activation.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { FormListGeneratorComponent } from './components/applications/app-store/form-list-generator/form-list-generator.component';
import { FormModalComponent } from './shared/modals/form-modal/form-modal.component';

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
    AppListComponent,
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
    FormModalComponent
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
    OcCommonLibModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
  { provide: NgbDateAdapter, useClass: CustomAdapter }, DatePipe],
  bootstrap: [AppComponent],
  entryComponents: [LoaderComponent, FormModalComponent],
})
export class AppModule {

}
