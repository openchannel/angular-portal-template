
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/users/forgot-password/forgot-password.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ApplicationsComponent } from './components/applications/applications/applications.component';
import { MyApplicationsComponent } from './components/applications/my-applications/my-applications.component';
import { SignupComponent } from './components/signup/signup.component';
import { NewAppComponent } from './components/applications/new-app/new-app.component';
import { ApplicationDetailComponent } from './components/applications/application-detail/application-detail.component';

const routes: Routes = [
  {
    path: '', redirectTo: '', pathMatch: 'full', component: CommonLayoutComponent, children: [
      { path: '', component: HomeComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '', component: CommonLayoutComponent, children: [
      { path: 'not-found', component: NotFoundComponent },
      { path: 'applications', component: ApplicationsComponent },
      { path: 'my-applications', component: MyApplicationsComponent },
      { path: 'application/:appName', component: ApplicationDetailComponent },
      { path: 'new-app', component: NewAppComponent }
    ]
  },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
