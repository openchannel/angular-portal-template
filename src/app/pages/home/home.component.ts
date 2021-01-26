import { Component, OnInit } from '@angular/core';
import { AuthHolderService } from 'oc-ng-common-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private authHolderService: AuthHolderService,
              private router: Router) { }

  ngOnInit() {
    if (this.authHolderService.isLoggedInUser()) {
      this.router.navigate(['/app/manage']).then();
    }
  }

  getStartedRedirect() {
    this.router.navigate(['signup']).then();
  }
}
