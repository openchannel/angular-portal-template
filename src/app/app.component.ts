import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
  '[class.not-found]' : 'this.router.url.split("?")[0] == "/not-found"',
  '[class.my-applications]' : 'this.router.url.split("?")[0] == "/my-applications"'
  }
})

export class AppComponent {
  title = 'template3-portal-frontend';

  isLoadingCsrfToken = false;

  constructor(private router: Router, private http: HttpClient){

  }

  // temporary clearing sesson storage on application load, we might need to do auto login.
  ngOnInit() {
    this.isLoadingCsrfToken = true;
    this.http.get( `${environment.apiUrl}init-csrf`, {withCredentials: true})
        .pipe(first())
        .subscribe(() => this.isLoadingCsrfToken = false);
  }

}
