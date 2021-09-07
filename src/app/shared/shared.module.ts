import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcCommonLibModule } from '@openchannel/angular-common-components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppConfirmationModalComponent } from './modals/app-confirmation-modal/app-confirmation-modal.component';
import { PermissionDirective } from './directive/permission.directive';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [AppConfirmationModalComponent, PermissionDirective, PageTitleComponent],
    imports: [CommonModule, OcCommonLibModule, ReactiveFormsModule, FormsModule, NgbModule, RouterModule],
    exports: [OcCommonLibModule, FormsModule, ReactiveFormsModule, PermissionDirective, PageTitleComponent],
})
export class SharedModule {}
