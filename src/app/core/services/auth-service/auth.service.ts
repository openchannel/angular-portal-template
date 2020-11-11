import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public accessToken: string;
  public refreshToken: string;

  constructor(private http: HttpClient) {
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

  public testGetAuthJwtToken(): string {
    return window.localStorage.getItem('TEST_JWT_TOKEN');
  }

  public testSetAuthJwtToken(jwtToken: string): void {
    window.localStorage.setItem('TEST_JWT_TOKEN', jwtToken);
  }
}

