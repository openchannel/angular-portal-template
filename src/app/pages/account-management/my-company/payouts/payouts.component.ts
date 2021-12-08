import { Component, OnDestroy, OnInit } from '@angular/core';
import { StripeAccount, StripeService } from '@openchannel/angular-common-services';
import { Observable, Subject, throwError } from 'rxjs';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { StripeAccountsService } from '@core/services/stripe-accounts.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

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

    constructor(
        private stripeService: StripeService,
        private loadingBar: LoadingBarService,
        private stripeAccountsService: StripeAccountsService,
        private toaster: ToastrService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.loader = this.loadingBar.useRef();
        this.getIsShowSuccessConnectMsg().subscribe(isShowSuccessConnectMsg => {
            this.removeQueryParams();
            this.setAccountState(isShowSuccessConnectMsg);
        });
    }

    ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    setAccountState(isShowSuccessOperationMsg: boolean = false): void {
        this.loader.start();

        this.stripeService
            .getConnectedAccounts()
            .pipe(
                catchError(err => {
                    this.stopProcessing();
                    return throwError(err);
                }),
                takeUntil(this.$destroy),
            )
            .subscribe(res => {
                this.stripeAccounts = res.accounts;
                this.connectedAccount = !!this.stripeAccounts.length;
                if (isShowSuccessOperationMsg) {
                    this.showSuccessOperationMsg();
                }
                this.stopProcessing();
            });
    }

    changeAccountState(): void {
        if (this.connectedAccount) {
            this.disconnectAccount();
        } else {
            this.connectAccount();
        }
    }

    private getIsShowSuccessConnectMsg(): Observable<boolean> {
        return this.activatedRoute.queryParams.pipe(
            map(queryParams => {
                return !!queryParams[this.stripeAccountsService.SHOW_SUCCESS_MSG_QUERY_PARAM];
            }),
        );
    }

    private removeQueryParams(): void {
        this.router.navigate([], { replaceUrl: true }).then();
    }

    private showSuccessOperationMsg(): void {
        if (this.connectedAccount) {
            this.toaster.success('Stripe account has been connected successfully!');
        } else {
            this.toaster.success('Stripe account has been disconnected successfully!');
        }
    }

    private connectAccount(): void {
        this.startProcessing();

        this.stripeAccountsService
            .getIsAccountConnected()
            .pipe(
                catchError(err => {
                    this.stopProcessing();
                    return throwError(err);
                }),
                tap(isAccountConnected => {
                    if (isAccountConnected) {
                        this.setAccountState();
                        this.loader.complete();
                    }
                }),
                filter(isAccountConnected => !isAccountConnected),
                switchMap(() => this.stripeService.connectAccount(this.stripeAccountsService.getStripeUrlRedirect())),
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
                    this.setAccountState();
                    this.loader.complete();
                    return throwError(err);
                }),
                takeUntil(this.$destroy),
            )
            .subscribe(() => {
                this.setAccountState(true);
                this.loader.complete();
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
