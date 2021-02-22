import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthHolderService, DropdownModel} from 'oc-ng-common-service';
import {LogOutService} from '@core/services/logout-service/log-out.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isSSO = false;
  isCollapsed = true;

  constructor(public router: Router,
              public authService: AuthHolderService,
              private logOutService: LogOutService) {
  }

  ngOnInit(): void {
    this.isSSO = this.authService?.userDetails?.isSSO;
  }

  login() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.routerState.snapshot.url }});
  }

  logout() {
    this.logOutService.logOut();
  }
}
