import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpRequestService } from './http-request.service';
import { AppListRequest } from '../models/app-list-request';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {


    private url = 'api/v1/guest/apps';

    constructor(private httpRequest: HttpRequestService) { }

    private textFilterRemoved = new Subject<boolean>();
    textFilterRemoved$ = this.textFilterRemoved.asObservable();

    removeTextFilter(mission: boolean) {
        this.textFilterRemoved.next(mission);
    }

    getFilters(): Observable<any> {
        return this.httpRequest.get(this.url + '/filter', 'true');
    }

    getSortBy(): Observable<any> {
        return this.httpRequest.get(this.url + '/sort', 'true');
    }

    getApps(appListRequest: AppListRequest): Observable<any> {
        if (appListRequest.text) {
            return this.httpRequest.get(this.url + '/search', 'true', appListRequest);
        }
        return this.httpRequest.get(this.url + '/', 'true', appListRequest);
    }

}
