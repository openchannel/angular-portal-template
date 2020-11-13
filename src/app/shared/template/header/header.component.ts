import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {LogOutService} from '../../../core/services/logout-service/log-out.service';
import {AuthService} from '../../../core/services/auth-service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  sellerName: string = null;
  constructor(public router: Router,
              private authService: AuthService,
              private logOutService: LogOutService) {
 //   console.log("header component loaded.");
     this.displayUserInfo();
}

  ngOnInit(): void {
  }


  displayUserInfo() {
      // if (localStorage.getItem('email')) {
      //   this.sellerName = localStorage.getItem('email');
      // }

    const claims = this.authService.accessToken;
    if (claims) {
      this.sellerName = claims;
    }
  }

  logout() {
    this.logOutService.logOut();
  }

}
