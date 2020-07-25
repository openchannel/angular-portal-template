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

  signupUrl = "/signup";
  loginUrl = "/login"
  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
  }

  resetPwd(event) {
    console.log(event);
    if (event === true) {
      //api code 
    }
  }


}
