import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CamelcasePipe } from './camelcase.pipe';
import { FileSizePipe } from './file-size.pipe';
import { FormsModule } from '@angular/forms';
import { ImageFileValidatorDirective } from './image-file-validator.directive';
import { LoaderComponent } from './loader/loader.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
   declarations: [
      NotificationComponent,
      CamelcasePipe,
      ImageFileValidatorDirective,
      FileSizePipe,
      LoaderComponent
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
      FileSizePipe
   ]
})
export class CustomComponentsModule { }
