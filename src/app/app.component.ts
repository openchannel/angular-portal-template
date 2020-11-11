import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {AuthenticationService} from 'oc-ng-common-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
  '[class.not-found]' : 'this.router.url.split("?")[0] == "/not-found"',
  '[class.my-applications]' : 'this.router.url.split("?")[0] == "/my-applications"'
  }
})

export class AppComponent implements OnInit {
  title = 'template3-portal-frontend';

  isLoadingCsrfToken = false;

  constructor(private router: Router,
              private authApiService: AuthenticationService) {

  }

  // temporary clearing sesson storage on application load, we might need to do auto login.
  ngOnInit() {
    this.isLoadingCsrfToken = true;
    this.authApiService.initCsrf()
        .pipe(first())
        .subscribe(() => this.isLoadingCsrfToken = false);
  }
}
