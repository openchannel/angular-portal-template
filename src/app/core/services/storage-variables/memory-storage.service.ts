import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MemoryStorageService {

  constructor() {
  }

  private xsrfToken: string;

  public getXsrfToken(): string {
    return this.xsrfToken;
  }

  public setXsrfToken(xsrfToken: string): void {
    this.xsrfToken = xsrfToken;
  }
}
