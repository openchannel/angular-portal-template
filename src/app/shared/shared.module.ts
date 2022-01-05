import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcCommonLibModule } from '@openchannel/angular-common-components';
import { OcPortalComponentsModule } from '@openchannel/angular-common-components/src/lib/portal-components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PermissionDirective } from './directive/permission.directive';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { RouterModule } from '@angular/router';
import { AppChartComponent } from '@shared/components/app-chart/app-chart.component';

@NgModule({
    declarations: [PermissionDirective, PageTitleComponent, AppChartComponent],
    imports: [CommonModule, OcCommonLibModule, ReactiveFormsModule, FormsModule, NgbModule, RouterModule, OcPortalComponentsModule],
    exports: [OcCommonLibModule, FormsModule, ReactiveFormsModule, PermissionDirective, PageTitleComponent, AppChartComponent],
})
export class SharedModule {}
