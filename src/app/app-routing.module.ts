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
import { InvitedSignupComponent } from './components/invited-signup/invited-signup.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent, data: {title: 'Login'}},
  {path: 'signup', component: SignupComponent, data: {title: 'Sign up'}},
  {path: 'activate', component: ActivationComponent, data: {title: 'Activation'}},
  {path: 'reset-password', component: ResetPasswordComponent, data: {title: 'Reset password'}},
  {path: 'forgot-password', component: ForgotPasswordComponent, data: {title: 'Forgot password'}},
  {path: 'resend-activation', component: ResendActivationComponent, data: {title: 'Resend activation'}},
  {path: 'invite/:token', component: InvitedSignupComponent},
  {path: '', component: LoginComponent, data: {title: 'Login'}},
  {
    path: '',
    component: CommonLayoutComponent,

    children: [
      {path: 'app-developer', component: AppDeveloperComponent, canActivate: [AuthGuard], data: {title: 'Developer portal'}},
      {path: 'app-new', component: AppNewComponent, canActivate: [AuthGuard], data: {title: 'New app'}},
      {path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard], data: {title: 'My profile'}},
      {path: 'my-profile/:pageId', component: MyProfileComponent, canActivate: [AuthGuard]},
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
