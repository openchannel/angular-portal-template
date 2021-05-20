import { Component, OnInit } from '@angular/core';
import {AuthHolderService, SiteConfigService, TitleService} from '@openchannel/angular-common-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private authHolderService: AuthHolderService,
              private router: Router,
              private titleService: TitleService,
              private siteService: SiteConfigService) { }

  ngOnInit() {
    this.titleService.setSpecialTitle(this.siteService.siteConfig.tagline, true);
    if (this.authHolderService.isLoggedInUser()) {
      this.router.navigate(['/manage']).then();
    }
  }

  getStartedRedirect() {
    this.router.navigate(['signup']).then();
  }
}
