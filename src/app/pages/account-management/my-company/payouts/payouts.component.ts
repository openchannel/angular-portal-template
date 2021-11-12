import { Component, OnDestroy, OnInit } from '@angular/core';
import { StripeAccount, StripeService } from '@openchannel/angular-common-services';
import { Subject, throwError } from 'rxjs';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';
import { catchError, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-payouts',
    templateUrl: './payouts.component.html',
    styleUrls: ['./payouts.component.scss'],
})
export class PayoutsComponent implements OnInit, OnDestroy {
    stripeAccounts: StripeAccount[];
    connectedAccount: boolean | null = null;
    process = false;

    private loader: LoadingBarState;
    private $destroy: Subject<void> = new Subject();

    constructor(private stripeService: StripeService, public loadingBar: LoadingBarService) {}

    ngOnInit(): void {
        this.loader = this.loadingBar.useRef();
        this.setAccountState();
    }

    ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    setAccountState(): void {
        this.loader.start();

        this.stripeService
            .getConnectedAccounts()
            .pipe(
                catchError(err => {
                    this.loader.complete();
                    return throwError(err);
                }),
                takeUntil(this.$destroy),
            )
            .subscribe(res => {
                this.stripeAccounts = res.accounts;
                this.connectedAccount = !!this.stripeAccounts.length;
                this.loader.complete();
            });
    }

    changeAccountState(): void {
        if (this.connectedAccount) {
            this.disconnectAccount();
        } else {
            this.connectAccount();
        }
    }

    private connectAccount(): void {
        this.startProcessing();

        this.stripeService
            .connectAccount(window.location.href)
            .pipe(
                catchError(err => {
                    this.stopProcessing();
                    return throwError(err);
                }),
                takeUntil(this.$destroy),
            )
            .subscribe(res => {
                window.location.href = res.targetUrl;
            });
    }

    private disconnectAccount(): void {
        this.startProcessing();

        this.stripeService
            .disconnectAccount(this.stripeAccounts[0].stripeId)
            .pipe(
                catchError(err => {
                    this.stopProcessing();
                    return throwError(err);
                }),
                takeUntil(this.$destroy),
            )
            .subscribe(() => {
                this.stripeAccounts = [];
                this.connectedAccount = false;
                this.stopProcessing();
            });
    }

    private startProcessing(): void {
        this.process = true;
        this.loader.start();
    }

    private stopProcessing(): void {
        this.process = false;
        this.loader.complete();
    }
}
