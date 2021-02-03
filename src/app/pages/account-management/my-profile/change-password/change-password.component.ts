import {Component, OnInit} from '@angular/core';
import {NativeLoginService} from 'oc-ng-common-service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {

  isSaveInProcess = false;

  formPasswordDefinition = {
    fields: [{
      id: 'password',
      label: 'Current Password',
      type: 'password',
      attributes: [],
    }, {
      id: 'newPassword',
      label: 'New Password',
      type: 'password',
      attributes: [],
    }],
  };

  public passwordFormGroup: FormGroup;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private toasterService: ToastrService,
              private nativeLoginService: NativeLoginService) {
  }

  ngOnInit(): void {

  }

  changePassword(): void {
    if (this.passwordFormGroup) {
      this.passwordFormGroup.markAllAsTouched();
    }
    if (this.passwordFormGroup?.invalid) {
      return;
    }
    this.isSaveInProcess = true;
    this.nativeLoginService.changePassword(this.passwordFormGroup.value)
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      for (const controlKey of Object.keys(this.passwordFormGroup.controls)) {
        const control = this.passwordFormGroup.controls[controlKey];
        control.reset();
        control.setErrors(null);
      }
      this.toasterService.success('Password has been updated');
    }, () => {
      this.isSaveInProcess = false;
    }, () => {
      this.isSaveInProcess = false;
    });
  }

  setPasswordFormGroup(passwordGroup: FormGroup) {
    this.passwordFormGroup = passwordGroup;
    // clear validation for current user password
    this.passwordFormGroup.controls.password.clearValidators();
    this.passwordFormGroup.controls.password.setValidators(Validators.required);
    this.passwordFormGroup.controls.password.updateValueAndValidity();
  }
}
