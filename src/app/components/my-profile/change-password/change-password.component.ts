import {Component, OnInit} from '@angular/core';
import {ChangePasswordRequest, UsersService} from 'oc-ng-common-service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {

  isSaveInProcess = false;
  changePassModel: ChangePasswordRequest;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private toasterService: ToastrService,
              private usersService: UsersService) {
  }

  ngOnInit(): void {
  }

  changePassword(form: NgForm): void {
    if (!form.valid) {
      return;
    }
    this.isSaveInProcess = true;
    this.usersService.changePassword(form.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        for (const controlKey of Object.keys(form.form.controls)) {
          const control = form.form.controls[controlKey];
          control.reset();
          control.setErrors(null);
        }

        this.toasterService.success('Password has been updated');
      }, (err) => {
        this.isSaveInProcess = false;
      }, () => {
        this.isSaveInProcess = false;
      });
  }
}
