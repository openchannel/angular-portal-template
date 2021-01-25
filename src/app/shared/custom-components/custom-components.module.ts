import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileSizePipe } from './file-size.pipe';
import { FormsModule } from '@angular/forms';
import { ImageFileValidatorDirective } from './image-file-validator.directive';
import { ImageCropperModule } from 'ngx-image-cropper';
import { OcCommonLibModule } from 'oc-ng-common-component';

@NgModule({
   declarations: [
      NotificationComponent,
      ImageFileValidatorDirective,
      FileSizePipe,
   ],
   imports: [
      CommonModule,
      NgbModule,
      FormsModule,
      ImageCropperModule,
      OcCommonLibModule
   ],
   exports: [
      NotificationComponent,
      ImageFileValidatorDirective,
      FileSizePipe
   ]
})
export class CustomComponentsModule { }
