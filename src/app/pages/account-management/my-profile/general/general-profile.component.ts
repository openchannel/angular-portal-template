import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  DeveloperAccount,
  DeveloperAccountService,
  DeveloperAccountTypesService,
  TypeMapperUtils,
  TypeModel,
  UserTypeFieldModel,
} from 'oc-ng-common-service';
import {mergeMap, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {LoadingBarState} from '@ngx-loading-bar/core/loading-bar.state';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-general-profile',
  templateUrl: './general-profile.component.html',
  styleUrls: ['./general-profile.component.scss'],
})
export class GeneralProfileComponent implements OnInit, OnDestroy {

  public inProcess = false;

  public formConfig: TypeModel<UserTypeFieldModel>;
  defaultFormConfig: TypeModel<UserTypeFieldModel> = {
    fields: [{
      id: 'name',
      label: 'Name',
      type: 'text',
      attributes: {required: true},
    }, {
      id: 'email',
      label: 'Email',
      type: 'emailAddress',
      attributes: {required: true},
    }],
  };

  private account: DeveloperAccount;
  private accountForm: FormGroup;
  private accountResult: any;
  private isValidAccountType = false;

  private loader: LoadingBarState;
  private $destroy = new Subject<void>();

  constructor(private developerService: DeveloperAccountService,
              private accountTypeService: DeveloperAccountTypesService,
              public loadingBar: LoadingBarService,
              private toasterService: ToastrService) {
  }

  ngOnInit(): void {
    this.loader = this.loadingBar.useRef();
    this.initProfileDetails();
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  public setCreatedForm(accountForm: FormGroup): void {
    this.accountForm = accountForm;
  }

  public setResultData(accountData: any): void {
    this.accountResult = accountData;
  }

  public saveAccountData(): void {
    this.accountForm?.markAllAsTouched();
    if (this.accountForm?.valid && this.accountResult && !this.inProcess) {
      this.inProcess = true;
      this.developerService.updateAccountFields(TypeMapperUtils.buildDataForSaving({
        ...this.accountResult,
        ...(this.isValidAccountType ? {type: this.account.type} : {})
      })).pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.toasterService.success('Your profile has been updated');
        this.inProcess = false;
      }, () => {
        this.inProcess = false;
      });
    }
  }

  private initProfileDetails(): void {
    this.loader.start();
    this.developerService.getAccount()
    .pipe(
        takeUntil(this.$destroy),
        tap(account => this.account = account),
        mergeMap(account => this.accountTypeService.getAccountType(account.type)))
    .subscribe(definition => {
      this.isValidAccountType = true;
      this.setFormConfig(definition, this.account);
    }, () => {
      this.setFormConfig(this.defaultFormConfig, this.account);
    });
  }

  private setFormConfig(typeModel: TypeModel<UserTypeFieldModel>, account: DeveloperAccount): void {
    this.formConfig = TypeMapperUtils.createFormConfig(typeModel, account);
    this.loader.complete();
  }
}
