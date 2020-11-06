import {Component, OnInit} from '@angular/core';
import {SellerSignup} from 'oc-ng-common-service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  loginUrl = '/login';
  activationUrl = '/activate';
  companyLogoUrl = './assets/img/logo-company.png';
  termsAndConditionPageUrl = 'https://my.openchannel.io/terms-of-service';
  dataProcessingPolicyUrl = 'https://my.openchannel.io/data-processing-policy';
  forgotPasswordDoneIconPath = './assets/img/forgot-password-complete-icon.svg';
  showSignupFeedbackPage: boolean = false;
  inProcess = false;
  signupUrl = '/signup';
  signupModel: SellerSignup;
  requestObj: any = {
    'developer': {
      'name': ''
    },
    'developerAccount': {
      'name': '',
      'email': ''
    },
    'extra': {
      'password': ''
    }
  };

  constructor( private router: Router) {
    this.signupModel = new SellerSignup();
  }

  ngOnInit(): void {

  }

  signup(event) {
  }
}
