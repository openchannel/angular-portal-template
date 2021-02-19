import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationsRoutingModule } from './applications-routing.module';
import {SharedModule} from '@shared/shared.module';
import {AppNewComponent} from './app-new/app-new.component';
import {AppDeveloperComponent} from './app-developer/app-developer.component';
import {
  OcFormComponentsModule,
  OcPortalComponentsModule,
} from 'oc-ng-common-component';


@NgModule({
  declarations: [
    AppNewComponent,
    AppDeveloperComponent,
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
