import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationsRoutingModule } from './applications-routing.module';
import {SharedModule} from '@shared/shared.module';
import {AppNewComponent} from './app-new/app-new.component';
import {
  OcFormComponentsModule,
  OcPortalComponentsModule,
} from '@openchannel/angular-common-components';


@NgModule({
  declarations: [
    AppNewComponent,
  ],
  imports: [
    CommonModule,
    ApplicationsRoutingModule,
    SharedModule,
    OcFormComponentsModule,
    OcPortalComponentsModule,
  ]
})
export class ApplicationsModule { }
