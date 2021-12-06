import { Injectable } from '@angular/core';
import { StripeService } from '@openchannel/angular-common-services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class StripeAccountsService {
    constructor(private stripeService: StripeService) {}

    getIsAccountConnected(): Observable<boolean> {
        return this.stripeService.getConnectedAccounts().pipe(map(res => !!res.accounts.length));
    }
}
