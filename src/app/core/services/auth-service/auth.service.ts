import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {AuthConfig, LoginRequest, LoginResponse} from './model/auth-model';

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

  public getAuthConfig(): Observable<AuthConfig> {
    return this.http.get(`${environment.apiUrl}/v2/auth/config`, { withCredentials: true });
  }

  public initCsrf(): Observable<any> {
    return this.http.get( `${environment.apiUrl}/init/csrf`, {withCredentials: true});
  }

  public loginUser(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post(`${environment.apiUrl}/v2/auth/login`, loginRequest, {withCredentials: true});
  }
}
