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
  menuItems: DropdownModel<string> [] = [];

  constructor(public router: Router,
              public authService: AuthHolderService,
              private logOutService: LogOutService) {
}

  ngOnInit(): void {
    this.isSSO = this.authService?.userDetails?.isSSO;
    this.generateDropdownMenuItems();
  }

  login() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.routerState.snapshot.url }});
  }

  onLogout() {
    this.logOutService.logOut();
  }

  generateDropdownMenuItems() {
    if (!this.isSSO) {
      this.menuItems.push({
        value: '/management/profile',
        label: 'My Profile'
      });
    }
    if (this.authService.userDetails.role === 'ADMIN') {
      this.menuItems.push({
        value: '/management/company',
        label: 'My Company'
      });
    }
  }

  onDropdownItemChose(item: DropdownModel<string>) {
    this.router.navigate([item.value]).then();
  }
}
