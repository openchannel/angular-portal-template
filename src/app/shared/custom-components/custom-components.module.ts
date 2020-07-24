import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntputErrorsComponent } from './intput-errors/intput-errors.component';
import { EmailValidatorDirective } from './email-validator.directive';
import { WebsiteValidatorDirective } from './website-validator.directive';
import { NotificationComponent } from './notification/notification.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropDirective } from './drag-drop.directive';
import { CamelcasePipe } from './camelcase.pipe';
import { AutofocusDirective } from './autofocus.directive';
import { WhiteSpaceValidatorDirective } from './white-space-validator';
import { FileSizePipe } from './file-size.pipe';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from './dialog/dialog.component';
import { ImageFileValidatorDirective } from './image-file-validator.directive';
import { PasswordToggleDirective } from './password-toggle.directive';
import { ExpiredDateValidatorDirective } from './expired-date-validator.directive';
import { LoaderComponent } from './loader/loader.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ScrollSpyDirective } from './scroll-spy.directive';
import { DomainValidatorDirective } from './domain-validator.directive';
import { PhoneNumberValidatorDirective } from './phone-number-validator.directive';

@NgModule({
   declarations: [
      IntputErrorsComponent,
      EmailValidatorDirective,
      WebsiteValidatorDirective,
      DragDropDirective,
      NotificationComponent,
      CamelcasePipe,
      AutofocusDirective,
      DialogComponent,
      ImageFileValidatorDirective,
      FileSizePipe,
      PasswordToggleDirective,
      DomainValidatorDirective,
      ExpiredDateValidatorDirective,
      WhiteSpaceValidatorDirective,
      LoaderComponent,
      ImageUploadComponent,
      FileUploadComponent,
      ScrollSpyDirective,
      PhoneNumberValidatorDirective
   ],
   imports: [
      CommonModule,
      NgbModule,
      FormsModule,
      ImageCropperModule
   ],
   exports: [
      IntputErrorsComponent,
      EmailValidatorDirective,
      WebsiteValidatorDirective,
      LoaderComponent,
      DragDropDirective,
      NotificationComponent,
      AutofocusDirective,
      ImageFileValidatorDirective,
      FileSizePipe,
      PasswordToggleDirective,
      DomainValidatorDirective,
      ExpiredDateValidatorDirective,
      WhiteSpaceValidatorDirective,
      ImageUploadComponent,
      FileUploadComponent,
      ScrollSpyDirective,
      PhoneNumberValidatorDirective
   ]
})
export class CustomComponentsModule { }
