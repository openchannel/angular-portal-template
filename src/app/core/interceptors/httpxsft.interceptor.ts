import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MemoryStorageService} from '../services/storage-variables/memory-storage.service';

@Injectable()
export class HttpXsrfInterceptor implements HttpInterceptor {

  private readonly headerName = 'X-XSRF-TOKEN';

    constructor(private memoryStorage: MemoryStorageService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const xsrfToken = this.memoryStorage.getXsrfToken();
        if (xsrfToken && !req?.headers?.has(this.headerName)) {
            req = req.clone({headers: req.headers.set(this.headerName, xsrfToken)
            });
        }
        return next.handle(req);
    }
}
