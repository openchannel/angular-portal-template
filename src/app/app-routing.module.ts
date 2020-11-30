import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonLayoutComponent} from './layouts/common-layout/common-layout.component';
import {AppDeveloperComponent} from './components/applications/app-developer/app-developer.component';
import {AppNewComponent} from './components/applications/app-new/app-new.component';
import {MyProfileComponent} from './components/my-profile/my-profile.component';
import {LoginComponent} from './components/login/login.component';
import {AuthGuard} from './_guards/auth.guard';
import {ActivationComponent} from './components/activation/activation.component';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {SignupComponent} from './components/signup/signup.component';
import {ForgotPasswordComponent} from './components/users/forgot-password/forgot-password.component';
import {ResendActivationComponent} from './components/resend-activation/resend-activation.component';
import {NativeLoginGuard} from './_guards/native-login.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'activate', component: ActivationComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'resend-activation', component: ResendActivationComponent},
  {path: '', component: LoginComponent},
  {
    path: '',
    component: CommonLayoutComponent,

    children: [
      {path: 'app-developer', component: AppDeveloperComponent, canActivate: [AuthGuard]},
      {path: 'app-new', component: AppNewComponent, canActivate: [AuthGuard]},
      {path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard, NativeLoginGuard]},
      {path: 'edit-app/:appId/version/:versionId', component: AppNewComponent, canActivate: [AuthGuard]},
    ]
  },
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
