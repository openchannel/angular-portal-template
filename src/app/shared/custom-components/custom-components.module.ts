import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CamelcasePipe } from './camelcase.pipe';
import { FileSizePipe } from './file-size.pipe';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from './dialog/dialog.component';
import { ImageFileValidatorDirective } from './image-file-validator.directive';
import { LoaderComponent } from './loader/loader.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FileUploadComponent } from './file-upload/file-upload.component';

@NgModule({
   declarations: [
      NotificationComponent,
      CamelcasePipe,
      DialogComponent,
      ImageFileValidatorDirective,
      FileSizePipe,
      LoaderComponent,
      ImageUploadComponent,
      FileUploadComponent,
   ],
   imports: [
      CommonModule,
      NgbModule,
      FormsModule,
      ImageCropperModule
   ],
   exports: [
      LoaderComponent,
      NotificationComponent,
      ImageFileValidatorDirective,
      FileSizePipe,
      ImageUploadComponent,
      FileUploadComponent,
   ]
})
export class CustomComponentsModule { }
