import {Injectable} from '@angular/core';
// import { Cookie } from 'ng2-cookies';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {environment} from '../../../environments/environment';
import {OAuthService} from 'angular-oauth2-oidc';

export class Foo {
  constructor(
    public id: number,
    public name: string) {
  }
}

@Injectable()
export class AppService {
  public clientId = '0oa11pl24mzaaTWK24x7';

  constructor(private http: HttpClient, private oauthService: OAuthService) {
  }

  retrieveToken(code) {
    const params = new URLSearchParams();

    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization: 'Basic ' + btoa(this.clientId + ':K2ZLxiPS1Eq_Ai4TAE06FLEFIe5HZ1Xi32tpc3Ru')
    });
    this.http.post(environment.apiUrl + 'login', params.toString(), {headers})
      .subscribe(
        data => this.saveToken(data),
        err => alert('Invalid Credentials')
      );
  }

  saveToken(token) {
    const expireDate = new Date().getTime() + (1000 * token.expires_in);
    localStorage.setItem('access_token', token.access_token);
  }

  checkCredentials(): boolean {
    return !!localStorage.getItem('access_token');
  }

  logout() {
    // Cookie.delete('access_token');
    localStorage.removeItem('access_token');
    window.location.reload();
  }

  initToken() {
    const headers = new HttpHeaders({
      Authorization: this.oauthService.getIdToken(),
    });

    this.http.post(environment.apiUrl + 'login', null, {headers})
      .subscribe(
        data => this.saveToken(data),
        err => console.error('Invalid Credentials')
      );
  }
}
