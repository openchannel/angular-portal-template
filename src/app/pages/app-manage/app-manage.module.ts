import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManageRoutingModule } from './app-manage-routing.module';
import { AppDeveloperComponent } from './app-developer/app-developer.component';
import { OcPortalComponentsModule } from 'oc-ng-common-component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    AppDeveloperComponent,
  ],
  imports: [
    CommonModule,
    AppManageRoutingModule,
    OcPortalComponentsModule,
    SharedModule,
  ]
})
export class AppManageModule { }
