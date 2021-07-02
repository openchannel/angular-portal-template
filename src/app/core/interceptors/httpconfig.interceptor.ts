import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { OcErrorService } from '@openchannel/angular-common-components';
import { AuthHolderService } from '@openchannel/angular-common-services';
import { environment } from '@env';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    private readonly proxyApiUrl = environment.apiUrl;

    constructor(private router: Router,
                private errorService: OcErrorService,
                private authHolderService: AuthHolderService) {
    }

    public static addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.authHolderService.accessToken && request.url?.startsWith(this.proxyApiUrl)) {
            request = HttpConfigInterceptor.addToken(request, this.authHolderService.accessToken);
        }

        return next.handle(request);
    }
}
