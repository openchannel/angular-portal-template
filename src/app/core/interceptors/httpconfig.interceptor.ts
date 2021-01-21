import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';

import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {OcErrorService} from 'oc-ng-common-component';
import {map} from 'rxjs/operators';
import {AuthHolderService} from 'oc-ng-common-service';
import {LoaderService} from '@shared/services/loader.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService,
              private router: Router,
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

    if (this.authHolderService.accessToken) {
      request = HttpConfigInterceptor.addToken(request, this.authHolderService.accessToken);
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.loaderService.closeLoader(event.url);
        }
        return event;
      }));
  }
}
