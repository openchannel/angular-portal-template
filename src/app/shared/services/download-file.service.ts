import { Injectable } from '@angular/core';
import { HttpRequestService } from './http-request.service';
import { Observable } from 'rxjs';
import { UploadFileResponseModel } from '../models/upload-file-response-model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {
  private url = 'api/v1/user/download-file';

  constructor(private httpRequest: HttpRequestService, private http: HttpClient) { }

  downloadFileDetails(fileId): Observable<UploadFileResponseModel> {
    return this.httpRequest.get(this.url + '?fileId=' + fileId);
  }

  // downloadFileFromUrl(fileUrl): Observable<any>{
  //   return this.http.get(fileUrl, {responseType: "blob"});
  // }
}
