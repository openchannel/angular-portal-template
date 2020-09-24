import {Injectable} from '@angular/core';
// import { Cookie } from 'ng2-cookies';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {environment} from '../../../environments/environment';

export class Foo {
    constructor(
        public id: number,
        public name: string) { }
}

@Injectable()
export class AppService {
    public clientId = '0oa11pl24mzaaTWK24x7';
    // public redirectUri = 'http://localhost:8089/';

    constructor(private http: HttpClient) {}

    retrieveToken(code) {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', this.clientId);
        // params.append('redirect_uri', this.redirectUri);
        params.append('code', code);

        const headers = new HttpHeaders({
            'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
            Authorization: 'Basic ' + btoa(this.clientId + ':K2ZLxiPS1Eq_Ai4TAE06FLEFIe5HZ1Xi32tpc3Ru')
        });
        this.http.post(environment.apiUrl + 'oauth/token', params.toString(), { headers })
            .subscribe(
                data => this.saveToken(data),
                err => alert('Invalid Credentials')
            );
    }

    saveToken(token) {
        const expireDate = new Date().getTime() + (1000 * token.expires_in);
        // Cookie.set("access_token", token.access_token, expireDate);
        localStorage.setItem('access_token', token.access_token);
        console.log('Obtained Access token');
        // window.location.href = 'http://localhost:8089';
    }

    // getResource(resourceUrl): Observable<any> {
    //     const headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8', Authorization: 'Bearer ' + Cookie.get('access_token')});
    //     return this.http.get(resourceUrl, { headers })
    //         .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    // }

    checkCredentials(): boolean {
        return !!localStorage.getItem('access_token');
    }

    logout() {
        // Cookie.delete('access_token');
        localStorage.removeItem('access_token');
        window.location.reload();
    }
}
