
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/users/forgot-password/forgot-password.component';
import { SignupComponent } from './components/signup/signup.component';
import { AppStoreComponent } from './components/applications/app-store/app-store.component';
import { AppDetailComponent } from './components/applications/app-detail/app-detail.component';
import { AppDeveloperComponent } from './components/applications/app-developer/app-developer.component';
import { AppListComponent } from './components/applications/app-list/app-list.component';
import { AppNewComponent } from './components/applications/app-new/app-new.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { EditAppComponent } from './components/applications/edit-app/edit-app.component';
import { ActivationComponent } from './components/activation/activation.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  //{
  //   path: '', redirectTo: '', pathMatch: 'full', component: CommonLayoutComponent, children: [
  //     { path: '', component: HomeComponent }
  //   ]
  // },
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'activate', component: ActivationComponent},
  {
    path: '', component: CommonLayoutComponent, children: [
      { path: 'app-store', component: AppStoreComponent, canActivate: [AuthGuard]},
      { path: 'app-detail', component: AppDetailComponent, canActivate: [AuthGuard]},
      { path: 'app-developer', component: AppDeveloperComponent, canActivate: [AuthGuard]},
      { path: 'app-list', component: AppListComponent, canActivate: [AuthGuard]},
      { path: 'app-new', component: AppNewComponent, canActivate: [AuthGuard]},
      { path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard]},
      { path: 'edit-app/:appId/version/:versionId', component: EditAppComponent, canActivate: [AuthGuard]},
      

    ]
  },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
