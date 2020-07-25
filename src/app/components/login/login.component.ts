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

  signupUrl = "/signup";
  forgotPwdUrl = "/forgot-password";

  constructor(private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  login(event) {
    console.log(event);
    if (event === true) {
      //api code 
    }
  }

}
