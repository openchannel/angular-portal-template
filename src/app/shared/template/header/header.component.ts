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

  constructor(public router: Router,
              public authService: AuthHolderService,
              private logOutService: LogOutService) {
}

  ngOnInit(): void {
  }

  logout() {
    this.logOutService.logOut();
  }

  get initials(): string {
    return this.authService.userDetails ? this.authService.getUserName().split(' ').map(value => value.substring(0, 1)).join('') : '';
  }

}
