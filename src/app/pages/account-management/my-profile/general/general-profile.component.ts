import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  AuthenticationService, DeveloperAccount,
  DeveloperAccountService,
  DeveloperAccountTypesService,
} from 'oc-ng-common-service';
import {catchError, mergeMap, takeUntil, tap} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {OcFormComponent} from 'oc-ng-common-component';
import {Router} from '@angular/router';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-general-profile',
  templateUrl: './general-profile.component.html',
  styleUrls: ['./general-profile.component.scss'],
})
export class GeneralProfileComponent implements OnInit, OnDestroy {

  @ViewChild('form') dynamicForm: OcFormComponent;

  myProfile: DeveloperAccount;
  formDefinition: any;
  isProcessing = false;

  defaultFormDefinition = {
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

  private destroy$: Subject<void> = new Subject<void>();
  private loader: LoadingBarState;

  constructor(private developerService: DeveloperAccountService,
              private accountTypeService: DeveloperAccountTypesService,
              public loadingBar: LoadingBarService,
              private toasterService: ToastrService,
              private authService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loader = this.loadingBar.useRef();
    this.getMyProfileDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getMyProfileDetails() {
    this.loader.start();

    this.developerService.getAccount()
      .pipe(
        takeUntil(this.destroy$),
        tap(account => this.myProfile = account),
        mergeMap(account => this.accountTypeService.getAccountType(account.type)))
      .subscribe(definition => {
        this.formDefinition = definition;
        this.fillFormDefinitionByValue();
        this.loader.complete();
      }, () => {
        this.formDefinition = this.defaultFormDefinition;
        this.fillFormDefinitionByValue();
        this.loader.complete();
      });
  }


  private fillFormDefinitionByValue() {
    for (const field of this.formDefinition.fields) {
      field.defaultValue = this.myProfile[field.id];
    }
  }

  saveGeneralProfile() {
    if (!this.dynamicForm.customForm.valid) {
      return;
    }

    this.isProcessing = true;
    this.developerService.updateAccountFields(this.dynamicForm.customForm.value)
      .pipe(takeUntil(this.destroy$),
        mergeMap(value => this.authService.refreshTokenSilent().pipe(
          catchError(err => {
            this.router.navigate(['login']);
            return throwError(err);
          }))))
      .subscribe(value => {
        this.toasterService.success('Your profile has been updated');
        this.isProcessing = false;
      }, () => {
        this.isProcessing = false;
      });
  }
}
