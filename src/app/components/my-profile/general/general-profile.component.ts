import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DeveloperAccountService, DeveloperAccountTypesService, DeveloperDetailsModel} from 'oc-ng-common-service';
import {LoaderService} from '../../../shared/services/loader.service';
import {mergeMap, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {OcFormComponent} from 'oc-ng-common-component';

@Component({
  selector: 'app-general-profile',
  templateUrl: './general-profile.component.html',
  styleUrls: ['./general-profile.component.scss'],
})
export class GeneralProfileComponent implements OnInit, OnDestroy {

  @ViewChild('form') dynamicForm: OcFormComponent;

  myProfile = new DeveloperDetailsModel();
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

  constructor(private developerService: DeveloperAccountService,
              private accountTypeService: DeveloperAccountTypesService,
              private loaderService: LoaderService,
              private toasterService: ToastrService) {
  }

  ngOnInit(): void {
    this.getMyProfileDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getMyProfileDetails() {
    this.loaderService.showLoader('myProfile');

    this.developerService.getAccount()
      .pipe(
        takeUntil(this.destroy$),
        tap(account => this.myProfile = account),
        mergeMap(account => this.accountTypeService.getAccountType(account.type)))
      .subscribe(definition => {
        this.formDefinition = definition;
        this.fillFormDefinitionByValue();
        this.loaderService.closeLoader('myProfile');
      }, () => {
        this.formDefinition = this.defaultFormDefinition;
        this.fillFormDefinitionByValue();
        this.loaderService.closeLoader('myProfile');
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
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.toasterService.success('Your profile has been updated');
        this.isProcessing = false;
      });
  }
}
