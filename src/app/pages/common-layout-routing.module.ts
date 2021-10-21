import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonLayoutComponent } from './common-layout.component';

const routes: Routes = [
    {
        path: '',
        component: CommonLayoutComponent,
        children: [
            {
                path: 'manage-apps',
                loadChildren: () => import('./app-manage/app-manage.module').then(m => m.AppManageModule),
            },
            {
                path: '',
                loadChildren: () => import('./account-management/account-management.module').then(m => m.AccountManagementModule),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CommonLayoutRoutingModule {}
