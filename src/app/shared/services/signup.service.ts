import { Injectable } from '@angular/core';
import { HttpRequestService } from './http-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {


  private url = 'api/v1/user';
  constructor(private httpRequest: HttpRequestService) { }

  validateAndRetrieveAllUsers(email:string) : Observable<any>{
    return this.httpRequest.get(this.url+"/validate-and-retrieve-domains?emailId="+email);
  }

  registerAccount(accountRegisterForm): Observable<any>{
    return this.httpRequest.post(this.url+"/request-account",accountRegisterForm);
  }}
