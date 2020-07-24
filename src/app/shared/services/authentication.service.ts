import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpRequestService } from './http-request.service';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private url = 'oauth/token';

  private jwtHelper = new JwtHelperService();

  constructor(private httpRequest: HttpRequestService, private userService: UserService, private router: Router) { }


  login(body: any): Observable<any> {
    const pbody = new HttpParams()
      .set('username', btoa(body.username))
      .set('password', body.password)
      .set('grant_type', 'password');

    const headers = {
      Authorization: 'Basic ' + btoa(environment.client_id + ':' + environment.client_secret),
      'Content-type': 'application/x-www-form-urlencoded'
    };

    return this.httpRequest.login(this.url, pbody, headers);
  }

  ssoLogin(token: string): Observable<any> {
    return this.httpRequest.get('authenticate?token=' + token, 'false');
  }

  /**
   *  Saved the logged In user profile information.
   */
  saveLoggedInUserProfile(callback?) {
    this.userService.userProfile().subscribe((res) => {
      localStorage.setItem('firstName', res.firstName);
      localStorage.setItem('lastName', res.lastName);
      localStorage.setItem('email', res.email);
      localStorage.setItem('organizationName', res.organizationName);
      if(callback){
        callback();
      }else{
        this.navigateAfterLogin();
      }      
    });
  }

  navigateAfterLogin(): void {

    //  this.router.navigateByUrl('/applications');
    this.router.navigate(['/applications']);
    // var role = this.getUserAuthorities();
    // this.router.navigateByUrl('/');
    // switch (role) {
    // }
  }

  persist(loginResponse: any): void {
    const decodedToken = this.jwtHelper.decodeToken(loginResponse.access_token);
    localStorage.setItem('access_token', loginResponse.access_token);
    localStorage.setItem('username', decodedToken.user_name);
    localStorage.setItem('authorities', decodedToken.authorities);
  }

  isLoggedIn() {
    if (localStorage.getItem('username')) {
      return true;
    }
    return false;
  }

  getUsername() {
    return localStorage.getItem('username')
  }

  getCurrentUserName() {
    return localStorage.getItem("firstName") + " " + localStorage.getItem("lastName");
  }

 
  getOrganizationName() {
    return localStorage.getItem("organizationName");
  }

  getUserAuthorities(): string {
    return localStorage.getItem('authorities');
  }
  
  isUserGeneral(){
    var role = localStorage.getItem("authorities");
    if (role && role === Role.USER_GENERAL) {
      return true;
    }
    return false;
  }
  
  isUserAdmin(): boolean {
    var role = localStorage.getItem("authorities");
    if(role && role === Role.USER_ADMIN){
        return true;
    }
    return false;
  }
  

}
