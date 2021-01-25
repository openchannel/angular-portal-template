import {Component, OnDestroy} from '@angular/core';
import {NativeLoginService, SellerActivation, UsersService} from 'oc-ng-common-service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-activation',
    templateUrl: './activation.component.html',
    styleUrls: ['./activation.component.scss'],
})
export class ActivationComponent implements OnDestroy {

    companyLogoUrl = './assets/img/logo-company.png';
    signupUrl = '/signup';
    resendActivationUrl = '/resend-activation';
    inProcess = false;

    activationModel = new SellerActivation();

    private destroy$: Subject<void> = new Subject();

    constructor(private nativeLoginService: NativeLoginService,
                private router: Router,
                private route: ActivatedRoute,
                private toaster: ToastrService) {
        this.activationModel.code = this.route.snapshot.queryParamMap.get('token');
    }

    activate(event) {
        if (event === true) {
            this.inProcess = true;
            this.nativeLoginService.activate(this.activationModel.code)
                .pipe(takeUntil(this.destroy$))
                .subscribe(res => {
                        this.toaster.success('Account successfully activated!');
                        this.inProcess = false;
                        this.router.navigate(['login']);
                    },
                    error => {
                        this.inProcess = false;
                    },
                );
        }

    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
