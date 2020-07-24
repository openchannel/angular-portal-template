import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpRequestService } from './http-request.service';
import { UploadFileResponseModel } from '../models/upload-file-response-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'api/v1/user';

  constructor(private httpRequest: HttpRequestService) { }

  private updateUserDetails = new Subject<boolean>();
  userUpdate$ = this.updateUserDetails.asObservable();

  updateUserName(value: boolean) {
    this.updateUserDetails.next();
  }

  userProfile(): Observable<any> {
    return this.httpRequest.get(this.url + '/profile');
  }

  getUserFullName() {
    return localStorage.getItem('firstName') + ' ' + localStorage.getItem('lastName');
  }


  forgotPassword(email: String): Observable<any> {
    return this.httpRequest.post(this.url + '/forgot-password/' + email, null);
  }


  confirmForgotPassword(confirmForgotPassword: any) {
    return this.httpRequest.post(this.url + '/reset-password', confirmForgotPassword);
  }


  logOut() {
    return this.httpRequest.get(this.url + '/logout');
  }

  /**
   * This Service is responsible for fetch user profile information.
   */
  getUserProfile(): Observable<any> {
    return this.httpRequest.get(this.url + '/user-account', "true");
  }

  changePassword(changePassword: any) {
    return this.httpRequest.post(this.url + '/change-password', changePassword);
  }

  getOrganizationDetail(): Observable<any> {
    return this.httpRequest.get(this.url + '/organizations');
  }

  updateUserAccount(userAccount): Observable<any> {
    return this.httpRequest.post(this.url + '/user-account', userAccount, 'false');
  }

  inviteRegister(token): Observable<any> {
    return this.httpRequest.get(this.url + '/user-account/invite/by-token/' + token, "true");
  }


  verifyUser(verifyUserModel: any) {
    return this.httpRequest.post(this.url + '/verify-email', verifyUserModel);
  }


   saveUserInvite(body): Observable<any> {
    return this.httpRequest.post(this.url + '/user-account/invite', body);
  }

  deleteUserInvite(inviteId: string,category: string): Observable<any> {
    return this.httpRequest.delete(this.url + '/user-account?id-to-delete=' + inviteId + '&accountCategory=' + category);
  }

  deleteUser(developerAccountId: string, category: string): Observable<any> {
    return this.httpRequest.delete(this.url + '/user-account?id-to-delete=' + developerAccountId + '&accountCategory=' + category);
  }

  approveUser(requestId: string): Observable<any> {
    return this.httpRequest.post(this.url + '/user-account/approve-account-request?request-id=' + requestId,null);
  }

  rejectUser(requestId: string): Observable<any> {
    return this.httpRequest.post(this.url + '/user-account/reject-account-request?request-id=' + requestId,null);
  }

  updateRole(requestUpdateRole: any): Observable<any> {
    return this.httpRequest.post(this.url + '/user-account/update-role', requestUpdateRole);
  }

  addSignatureAuthority(addSignatureAuthorityObj: any): Observable<any> {
    return this.httpRequest.post(this.url + '/user-account/add-signature-authority', addSignatureAuthorityObj);
  }
  
  addDomain(domain) {
    return this.httpRequest.post(this.url + '/add-domain?domain=' + domain, null);
  }

  downloadFileDetails(fileId): Observable<UploadFileResponseModel> {
    return this.httpRequest.get(this.url + '/download-file' + '?fileId=' + fileId);
  }

  checkSignatureAuthority(accountId:any): Observable<any>{
    return this.httpRequest.get(this.url + '/user-account/get-signature-authority?accountId='+accountId); 
  }
}
