import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonLayoutComponent} from './layouts/common-layout/common-layout.component';
import {AppStoreComponent} from './components/applications/app-store/app-store.component';
import {AppDetailComponent} from './components/applications/app-detail/app-detail.component';
import {AppDeveloperComponent} from './components/applications/app-developer/app-developer.component';
import {AppAppsComponent} from './components/applications/app-apps/app-apps.component';
import {AppNewComponent} from './components/applications/app-new/app-new.component';
import {MyProfileComponent} from './components/my-profile/my-profile.component';
import {LoginComponent} from './components/login/login.component';
import {AuthGuard} from './_guards/auth.guard';
import { AppListComponent } from './components/applications/app-apps/app-list/app-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  {
    path: '',
    component: CommonLayoutComponent,

    children: [
      {path: 'app-store', component: AppStoreComponent, canActivate: [AuthGuard]},
      {path: 'app-detail', component: AppDetailComponent, canActivate: [AuthGuard]},
      {path: 'app-developer', component: AppDeveloperComponent, canActivate: [AuthGuard]},
      {path: 'app-list', component: AppAppsComponent, canActivate: [AuthGuard], children: [
          {path: 'list', component: AppListComponent, canActivate: [AuthGuard]},
        ]},
      {path: 'app-new', component: AppNewComponent, canActivate: [AuthGuard]},
      {path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard]},
      {path: 'edit-app/:appId/version/:versionId', component: AppNewComponent, canActivate: [AuthGuard]},
    ]
  },
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
