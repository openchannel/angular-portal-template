import { Component, OnInit } from '@angular/core';
import {Router, RouterStateSnapshot} from '@angular/router';
import {AuthHolderService} from 'oc-ng-common-service';
import {LogOutService} from '@core/services/logout-service/log-out.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isSSO = false;

  constructor(public router: Router,
              public authService: AuthHolderService,
              private logOutService: LogOutService) {
}

  ngOnInit(): void {
    this.isSSO = this.authService?.userDetails?.isSSO;
  }

  logout() {
    this.logOutService.logOut();
  }

  login() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.routerState.snapshot.url }});
  }

  get initials(): string {
    if (this.authService.userDetails) {
      const splitName = this.authService.getUserName().split(' ');
      return splitName[0].substring(0, 1) + splitName[splitName.length - 1].substring(0, 1);
    } else {
      return '';
    }
  }

}
