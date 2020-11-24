import {Component, OnInit} from '@angular/core';
import {SellerMyProfile} from 'oc-ng-common-service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  pages = [{
    pageId: 'company',
    pageTitle: 'My Company',
    placeholder: 'Company details'
  }, {
    pageId: 'changePassword',
    pageTitle: 'My Profile',
    placeholder: 'General'
  }, {
    pageId: 'myProfile',
    pageTitle: 'My Profile',
    placeholder: 'Password'
  }];

  selectedPage = this.pages[0];

  myProfile = new SellerMyProfile();
  isProcessing = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  gotoPage(newPage: {pageId: string, pageTitle: string, placeholder: string}) {
    this.selectedPage = newPage;
  }

  goBack() {
    history.back();
  }
}
