import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserServiceService } from 'oc-ng-common-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  loginUrl = "/login";

  constructor(private userService: UserServiceService) { }

  ngOnInit(): void {
  }

  signup(event) {
    console.log(event);
    if (event === true) {
      console.log(this.userService.getUsers());
    }
  }

}
