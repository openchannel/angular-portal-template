import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../login/login.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  signupUrl = "/signup";
  loginUrl = "/login"
  constructor() { }

  ngOnInit(): void {
  }

  resetPwd(event) {
    console.log(event);
    if (event === true) {
      //api code 
    }
  }


}
