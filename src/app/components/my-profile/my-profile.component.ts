import {Component, OnInit} from '@angular/core';
import {SellerMyProfile} from 'oc-ng-common-service';
import {ActivatedRoute} from '@angular/router';

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
    pageId: 'profile',
    pageTitle: 'My Profile',
    placeholder: 'General'
  }, {
    pageId: 'password',
    pageTitle: 'My Profile',
    placeholder: 'Password'
  }];

  selectedPage = this.pages[0];

  myProfile = new SellerMyProfile();
  isProcessing = false;

  constructor(private activatedRoute: ActivatedRoute) {
  }


  ngOnInit(): void {
    this.initMainPage();
  }

  gotoPage(newPage: {pageId: string, pageTitle: string, placeholder: string}) {
    this.selectedPage = newPage;
  }

  goBack() {
    history.back();
  }

  private initMainPage() {
    const pageType  = this.activatedRoute.snapshot.paramMap.get('pageId');
    if (pageType) {
      const pageByUrl = this.pages.filter(page => page.pageId === pageType)[0];
      if (pageByUrl) {
        this.selectedPage = pageByUrl;
      }
    } else {
      this.selectedPage = this.pages[0];
    }
  }
}
