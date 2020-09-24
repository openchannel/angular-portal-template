import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {OAuthService} from 'angular-oauth2-oidc';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  sellerName: string = null;
  constructor(public router: Router,
              private oauthService: OAuthService) {
 //   console.log("header component loaded.");
     this.displayUserInfo();
}

  ngOnInit(): void {
  }


  displayUserInfo() {
      // if (localStorage.getItem('email')) {
      //   this.sellerName = localStorage.getItem('email');
      // }

    const claims = this.oauthService.getIdentityClaims();
    if (claims) {
      this.sellerName = claims['name'];
    }
  }

  logout() {
    this.oauthService.logOut();
    this.router.navigateByUrl('/login');
  }

}
