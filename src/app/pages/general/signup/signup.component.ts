import {Component, OnInit} from '@angular/core';
import {NativeLoginService, UserRegistrationModel} from 'oc-ng-common-service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  loginUrl = '/login';
  activationUrl = '/activate';
  companyLogoUrl = './assets/img/logo-company-2x.png';
  termsAndConditionPageUrl = 'https://my.openchannel.io/terms-of-service';
  dataProcessingPolicyUrl = 'https://my.openchannel.io/data-processing-policy';
  forgotPasswordDoneIconPath = './assets/img/forgot-password-complete-icon.svg';
  showSignupFeedbackPage = false;
  inProcess = false;
  signupUrl = '/signup';
  signupModel: UserRegistrationModel = new UserRegistrationModel();

  constructor(private nativeLoginService: NativeLoginService) {
  }

  ngOnInit(): void {
  }

  onSignup(event) {
    if (event === true) {
      this.inProcess = true;
      this.nativeLoginService.signup(this.signupModel).subscribe(res => {
        this.inProcess = false;
        this.showSignupFeedbackPage = true;
      }, res => {
        this.inProcess = false;
      });
    }
  }
}
