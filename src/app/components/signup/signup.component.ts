import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { signupModel } from 'src/app/shared/models/signup-model';
import { SignupService } from 'src/app/shared/services/signup.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserServiceService } from 'oc-ng-common-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  loginUrl = "/login";

  constructor(private signupService: SignupService, private userService: UserServiceService) { }

  ngOnInit(): void {
  }

  signup(event) {
    console.log(event);
    if (event === true) {
      console.log(this.userService.getUsers());
    }
  }

}
