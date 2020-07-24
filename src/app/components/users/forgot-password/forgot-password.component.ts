import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../login/login.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  email: string;
  inProcess = false;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
  }

  forgotPassword(forgetPwdForm: NgForm): void {
    if (!forgetPwdForm.valid) {
      forgetPwdForm.control.markAllAsTouched();
      return;
    }
    this.inProcess = true;
    this.userService.forgotPassword(this.email).subscribe((res) => {
      this.inProcess = false;
      this.router.navigate(['/confirm-forgot-password']);
    },
      (err) => {
        // error message
        this.inProcess = false;
      });
  }
}
