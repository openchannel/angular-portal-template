import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { AppDeveloperComponent } from './app-developer/app-developer.component';

const routes: Routes = [
  {
    path: '',
    component: AppDeveloperComponent,
    canActivate: [AuthGuard],
    data: {title: 'Manage apps'}
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppManageRoutingModule { }
