import { Injectable } from '@angular/core';
import { HttpRequestService } from './http-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyApplicationsService {
  
  private url = 'api/v1/guest/apps';
  
  constructor(private httpRequest: HttpRequestService) { }

  findAllMyApps(loader?: string): Observable<any>{
    return this.httpRequest.get(this.url+'/my-applications',loader);
  }

  cancelRequest(requestId,appId): Observable<any>{
    return this.httpRequest.delete(this.url+'/request/'+requestId+"?appId="+appId);
  }
}
