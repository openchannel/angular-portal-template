import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signupUrl = "/signup";
  forgotPwdUrl = "/forgot-password";

  constructor(
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
