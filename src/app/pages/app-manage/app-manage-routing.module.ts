import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { AppDeveloperComponent } from './app-developer/app-developer.component';
import { AppNewComponent } from './app-new/app-new.component';
import { AppDataChangesGuard } from './app-new/deactivation-guard';

const routes: Routes = [
    {
        path: '',
        component: AppDeveloperComponent,
        canActivate: [AuthGuard],
        data: { title: 'Manage apps' },
        children: [
            {
                path: 'create',
                component: AppNewComponent,
                canActivate: [AuthGuard],
                canDeactivate: [AppDataChangesGuard],
                data: { title: 'New app' },
            },
            {
                path: 'update/:appId/:versionId',
                component: AppNewComponent,
                canActivate: [AuthGuard],
                canDeactivate: [AppDataChangesGuard],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AppManageRoutingModule {}
