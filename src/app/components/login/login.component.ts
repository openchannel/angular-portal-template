import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { LoginModel } from 'src/app/shared/models/login-model';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginModel = new LoginModel();
  inProcess = false;
  constructor(private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  doLogin(loginForm: NgForm): void {
    if (!loginForm.valid) {
      loginForm.control.markAllAsTouched();
      return;
    }
    this.inProcess = true;
    this.authenticationService.login(this.loginModel).subscribe((res) => {
      this.authenticationService.persist(res);
      if (this.authenticationService.isLoggedIn()) {
        this.authenticationService.saveLoggedInUserProfile();
      }
    },
      (res) => {
        // handle error response
        this.inProcess = false;
      });

  }

}
