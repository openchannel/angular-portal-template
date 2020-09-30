import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public accessToken: string;
  public refreshToken: string;

  constructor() {
    this.updateVariables();
  }

  persist(accessToken: string, refreshToken: string) {
    window.sessionStorage.setItem('accessToken', accessToken);
    window.sessionStorage.setItem('refreshToken', refreshToken);

    this.updateVariables();
  }

  updateAccessToken(accessToken: string) {
    window.sessionStorage.setItem('accessToken', accessToken);
    this.updateVariables();
  }

  isLoggedInUser() {
    return !!this.accessToken && !!this.refreshToken;
  }

  clearTokensInStorage(): void {
    window.sessionStorage.removeItem('accessToken');
    window.sessionStorage.removeItem('refreshToken');

    this.updateVariables();
  }

  private updateVariables(): void {
    this.accessToken = window.sessionStorage.getItem('accessToken');
    this.refreshToken = window.sessionStorage.getItem('refreshToken');
  }

}
