import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OcCommonLibModule} from 'oc-ng-common-component';
import {LoaderComponent} from './components/loader/loader.component';
import {FormModalComponent} from './modals/form-modal/form-modal.component';
import {ConfirmationModalComponent} from './modals/confirmation-modal/confirmation-modal.component';
import {CamelCaseToNormalPipe} from './pipes/camel-case-to-normal.pipe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {AppConfirmationModalComponent} from './modals/app-confirmation-modal/app-confirmation-modal.component';
import {InviteUserModalComponent} from './modals/invite-user-modal/invite-user-modal.component';

@NgModule({
  declarations: [
    LoaderComponent,
    FormModalComponent,
    ConfirmationModalComponent,
    AppConfirmationModalComponent,
    ConfirmationModalComponent,
    FormModalComponent,
    InviteUserModalComponent,
    CamelCaseToNormalPipe,
  ],
  imports: [
    CommonModule,
    OcCommonLibModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
  ],
  exports: [
    OcCommonLibModule,
    LoaderComponent,
    CamelCaseToNormalPipe,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
