import {Injectable} from '@angular/core';
import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {Observable, of, throwError} from 'rxjs';
import {AuthService} from '../services/auth-service/auth.service';
import {GraphqlService} from '../../graphql-client/graphql-service/graphql.service';
import {LogOutService} from '../services/logout-service/log-out.service';
import {catchError, concatMap, take} from 'rxjs/operators';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private graph: GraphqlService, private logOutService: LogOutService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // get current access token value
    return next.handle(req).pipe(
        concatMap(event => {
          let needToAuthenticate = false;
          if (
              event.type === HttpEventType.Response &&
              event.status === 200 &&
              event.body &&
              Array.isArray(event.body.errors)
          ) {
            const errors = event.body.errors as any[];
            needToAuthenticate = !!errors.find(e => e.exception && e.exception.message === 'Access token is expired');
          }

          if (needToAuthenticate) {
            // update access token by logging in to your auth server using a refresh token
            if (this.authService.refreshToken) {
              return this.graph.refreshToken(this.authService.refreshToken).pipe(
                  take(1),
                  catchError(err => {
                      this.logOutService.logOut();
                      return throwError(err);
                  }),
                  concatMap(({data: {refreshToken: {accessToken: newAccessToken}}}) => {
                    if (newAccessToken) {
                      this.authService.updateAccessToken(newAccessToken);
                      return next.handle(req.clone({
                        setHeaders: {Authorization: `Bearer ${newAccessToken}`}
                      }));
                    } else {
                      this.logOutService.logOut();
                      // if logging in with refresh token failed to update access token, then can't help it...
                      // --- apollo-link does not understand return throwError('message') so just throw new error
                      throw new Error('Error getting access token after logging in with refresh token');
                    }
                  })
              );
            }
            this.logOutService.logOut();
            throw new Error('Error getting access token after logging in with refresh token');
          }
          return of(event);
        }),
    );
  }
}
