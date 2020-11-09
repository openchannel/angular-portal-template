import {Component, OnInit} from '@angular/core';
import {AuthenticationService, SellerActivation, SellerService, SellerSignin} from 'oc-ng-common-service';
import {Router} from '@angular/router';
import {NotificationService} from 'src/app/shared/custom-components/notification/notification.service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {

  constructor(private sellerService: SellerService, private authenticationService: AuthenticationService, private router: Router, private notificationService: NotificationService) {
  }

  companyLogoUrl = './assets/img/logo-company.png';
  signupUrl = '/signup';
  activationUrl = '';
  inProcess = false;

  activationModel = new SellerActivation();
  signInModel = new SellerSignin();

  ngOnInit(): void {
  }

  activate(event) {
  }

}
