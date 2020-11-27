import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthHolderService} from 'oc-ng-common-service';
import {LogOutService} from '../../../core/services/logout-service/log-out.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  sellerName: string = null;
  constructor(public router: Router,
              private authService: AuthHolderService,
              private logOutService: LogOutService) {
     this.displayUserInfo();
  }

  ngOnInit(): void {
  }


  displayUserInfo() {
    const claims = this.authService.accessToken;
    if (claims) {
      this.sellerName = claims;
    }
  }

  logout() {
    this.logOutService.logOut();
  }

}
