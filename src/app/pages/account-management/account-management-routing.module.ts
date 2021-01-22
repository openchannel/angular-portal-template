import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MyProfileComponent} from './my-profile/my-profile.component';
import {MyCompanyComponent} from './my-company/my-company.component';
import {AuthGuard} from '@core/guards/auth.guard';
import {NativeLoginGuard} from '@core/guards/native-login.guard';

const routes: Routes = [
  {path: 'profile', component: MyProfileComponent, canActivate: [AuthGuard, NativeLoginGuard], data: {title: 'My profile'}},
  {path: 'company', component: MyCompanyComponent, canActivate: [AuthGuard], data: {title: 'My company'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountManagementRoutingModule { }
