import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    AuthenticationService,
    DeveloperAccountService,
} from '@openchannel/angular-common-services';
import { takeUntil, tap } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { FormGroup } from '@angular/forms';
import { OcEditUserFormConfig, OcEditUserResult, OCOrganization } from '@openchannel/angular-common-components';
import { OcEditUserTypeService } from '@core/services/user-type-service/user-type.service';

@Component({
    selector: 'app-general-profile',
    templateUrl: './general-profile.component.html',
    styleUrls: ['./general-profile.component.scss']
})
export class GeneralProfileComponent implements OnInit, OnDestroy {

    private readonly formConfigsWithoutTypeData: OcEditUserFormConfig [] = [
        {
            name: 'Default',
            account: {
                type: 'default',
                typeData: null,
                includeFields: ['name', 'email']
            },
            organization: null
        },
        {
            name: 'Custom',
            account: {
                type: 'custom-account-type',
                typeData: null,
                includeFields: ['name', 'username', 'email', 'customData.about-me']
            },
            organization: null
        }
    ];

    public formConfigsLoaded = false;
    public formConfigs: OcEditUserFormConfig[];
    public formAccountData: OCOrganization;

    public inSaveProcess = false;

    public formGroup: FormGroup;
    public resultData: OcEditUserResult;

    private loader: LoadingBarState;
    private $destroy = new Subject<void>();

    constructor(private developerService: DeveloperAccountService,
                private authService: AuthenticationService,
                public loadingBar: LoadingBarService,
                private ocTypeService: OcEditUserTypeService,
                private toasterService: ToastrService) {
    }

    ngOnInit(): void {
        this.loader = this.loadingBar.useRef();
        this.initDefaultFormConfig();
    }

    ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.unsubscribe();
        if (this.loader) {
            this.loader.complete();
        }
    }

    private initDefaultFormConfig(): void {
        this.loader.start();
        forkJoin({
            accountData: this.developerService.getAccount(),
            formConfigs: this.ocTypeService.injectTypeDataIntoConfigs(
              this.formConfigsWithoutTypeData, false, true)
        }).subscribe(result => {
            this.loader.complete();
            this.formAccountData = result.accountData;
            this.formConfigs = result.formConfigs;
            this.formConfigsLoaded = true;
        }, () => this.loader.complete());
    }

    public saveUserData(): void {
        this.formGroup.markAllAsTouched();

        const accountData = this.resultData?.account;
        if (!this.inSaveProcess && accountData) {

            this.loader.start();
            this.inSaveProcess = true;

            this.developerService.updateAccountFields(accountData)
              .pipe(
                tap(() => this.toasterService.success('Your profile has been updated')),
                takeUntil(this.$destroy)
              ).subscribe(() => {
                this.inSaveProcess = false;
                this.loader.complete();
            }, () => {
                this.inSaveProcess = false;
                this.loader.complete();
            });
        }
    }
}
