import { Injectable } from '@angular/core';
import { HttpRequestService } from './http-request.service';
import { Observable } from 'rxjs';
import { UploadFileResponseModel } from '../models/upload-file-response-model';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { mergeMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  private tokenUrl = 'api/v1/guest/file-upload-token';

  constructor(private http: HttpClient) { }

  uploadToOpenchannel(file: FormData, isPrivate = true): Observable<any> {
    // let token =''
    let tokenRes = this.getToken().pipe(map(res => {
      let token = res['token'];
      return token;
    }), mergeMap(token => this.prepareUploadReq(token, file, isPrivate)));
    return tokenRes;
  }

  prepareUploadReq(token, file, isPrivate): Observable<any> {
    let query = '';
    if (isPrivate !== null) {
      query = `?isPrivate=${isPrivate}`;
    }
    let openchannelUrl = environment.openchannelUrl + '/v2/files';
    let options = {
      headers: new HttpHeaders({ 'Upload-Token': `${token}` }),
      reportProgress: true
    };
    const req = new HttpRequest('POST', `${openchannelUrl}${query}`, file, options);
    return this.http.request(req);
  }
  getToken() {
    const tokenUrl = environment.apiUrl + this.tokenUrl;
    return this.http.get(tokenUrl);
  }

  convertFileResponseToUploadFileModel(response: any) {
    let uploadFileRes = new UploadFileResponseModel();
    uploadFileRes.uploadDate = response.body.uploadDate;
    uploadFileRes.fileId = response.body.fileId;
    uploadFileRes.fileName = response.body.name;
    uploadFileRes.contentType = response.body.contentType;
    uploadFileRes.size = response.body.size;
    uploadFileRes.isPrivate = response.body.isPrivate;
    uploadFileRes.mimeCheck = response.body.mimeCheck;
    uploadFileRes.fileUrl = response.body.fileUrl;
    uploadFileRes.isError = response.body.isError;
    uploadFileRes.uploadProgress = 100;
    return uploadFileRes;
  }
}
