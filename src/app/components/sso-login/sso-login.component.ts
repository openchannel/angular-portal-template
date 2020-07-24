import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-sso-login',
  templateUrl: './sso-login.component.html',
  styleUrls: ['./sso-login.component.scss']
})
export class SsoLoginComponent implements OnInit {
  inProcess: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, 
    private loaderService : LoaderService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // Defaults to 0 if no query param provided.
      let token = params['token'];
      this.login(token);
    }
    );
  }

  login(token) {
    this.loaderService.showLoader("1");
    this.authenticationService.ssoLogin(token).subscribe(res => {

      this.authenticationService.persist(res);
      if (this.authenticationService.isLoggedIn()) {
        this.authenticationService.saveLoggedInUserProfile(res1 => {
          this.loaderService.closeLoader("1");
          window.location.href = res.redirect;
        });        
      }else{
        this.loaderService.closeLoader("1");
      }      
    },
      (res) => {
        this.loaderService.closeLoader("1");
      });
  }

}
