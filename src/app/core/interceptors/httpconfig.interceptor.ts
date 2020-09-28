import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {Observable} from 'rxjs';
import {NotificationService} from 'src/app/shared/custom-components/notification/notification.service';
import {LoaderService} from 'src/app/shared/services/loader.service';
import {Router} from '@angular/router';
import {OcErrorService} from 'oc-ng-common-component';
import {environment} from '../../../environments/environment';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService, private loaderService: LoaderService,
              private router: Router, private errorService: OcErrorService, private oauthService: OAuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // request = request.clone({ headers: request.headers.set('Authorization', environment.auth) });

    // const header = this.oauthService.authorizationHeader();
    // if (header) {
    //   request = request.clone({
    //     setHeaders: {
    //       Authorization: header,
    //     }
    //   });
    // }

    return next.handle(request);
  }

  // handleValidationError(validationErrorList: any[]) {
  //   if (validationErrorList[0].field) {
  //     this.errorService.setServerErrorList(validationErrorList);
  //   } else {
  //     this.notificationService.showError(validationErrorList);
  //   }
  // }
}
