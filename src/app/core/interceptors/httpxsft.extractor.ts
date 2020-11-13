import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpXsrfTokenExtractor} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MemoryStorageService} from '../services/storage-variables/memory-storage.service';

@Injectable()
export class HttpXsrfExtractor implements HttpInterceptor {

  constructor(private tokenExtractor: HttpXsrfTokenExtractor,
              private memoryStorage: MemoryStorageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(map(event => {
      if (event instanceof HttpResponse) {
        const xsrfToken = event.headers.get('X-XSRF-TOKEN');
        if (xsrfToken) {
          this.memoryStorage.setXsrfToken(xsrfToken);
        }
      }
      return event;
    }));
  }
}
