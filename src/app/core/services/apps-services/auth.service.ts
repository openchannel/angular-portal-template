import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public accessToken: string;
  public refreshToken: string;

  constructor() {
    this.accessToken = window.sessionStorage.getItem("accessToken");
    this.refreshToken = window.sessionStorage.getItem("refreshToken");
  }

  persist(accessToken: string, refreshToken: string) {
    window.sessionStorage.setItem("accessToken", this.accessToken);
    window.sessionStorage.setItem("refreshToken", this.refreshToken);

    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }


  isLoggedInUser() {
    return !!this.accessToken && !!this.refreshToken
  }

}
