import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppNewComponent } from './app-new/app-new.component';
import { AppDataChangesGuard } from './app-new/deactivation-guard';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApplicationsRoutingModule {}
