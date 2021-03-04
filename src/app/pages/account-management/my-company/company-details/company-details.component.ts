import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AccessLevel,
  AuthHolderService,
  DeveloperModel,
  DeveloperService,
  DeveloperTypeFieldModel,
  DeveloperTypeService,
  Permission,
  PermissionType,
  TypeMapperUtils,
  TypeModel
} from 'oc-ng-common-service';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {LoadingBarState} from '@ngx-loading-bar/core/loading-bar.state';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {takeUntil} from 'rxjs/operators';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-company',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit, OnDestroy {

  public inProcess = false;
  public formConfig: TypeModel<DeveloperTypeFieldModel>;

  private defaultFormConfig: TypeModel<DeveloperTypeFieldModel> = {
    fields: [{
      id: 'name',
      label: 'Company Name',
      type: 'text',
      attributes: {
        required: true
      }
    }]
  };

  private loader: LoadingBarState;
  private organizationForm: FormGroup;
  private organizationResult: any;
  private $destroy: Subject<void> = new Subject<void>();

  readonly savePermissions: Permission[] = [{
    type: PermissionType.ORGANIZATIONS,
    access: [AccessLevel.MODIFY]
  }];

  constructor(private developerService: DeveloperService,
              private developerTypeService: DeveloperTypeService,
              private authHolderService: AuthHolderService,
              private activatedRoute: ActivatedRoute,
              private toastService: ToastrService,
              public loadingBar: LoadingBarService) {
  }

  ngOnInit(): void {
    this.loader = this.loadingBar.useRef();
    this.initCompanyForm();
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
    if (this.loader) {
      this.loader.complete();
    }
  }

  initCompanyForm(): void {
    this.loader.start();
    this.developerService.getDeveloper()
    .pipe(takeUntil(this.$destroy)).subscribe(companyData => {
      if (companyData.type) {
        this.developerTypeService.getDeveloperType(companyData?.type)
        .pipe(takeUntil(this.$destroy)).subscribe(developerType => {
          this.createFormFields(developerType, companyData);
        }, error => {
          this.loader.complete();
          if (error.status === 404) {
            this.createFormFields(this.defaultFormConfig, companyData);
          }
        });
      } else {
        this.createFormFields(this.defaultFormConfig, companyData);
      }
    });
  }

  setCreatedForm(organizationForm: FormGroup): void {
    this.organizationForm = organizationForm;
  }

  setResultData(organizationData: any): void {
    this.organizationResult = organizationData;
  }

  saveOrganization(): void {
    if (this.organizationForm?.valid && this.organizationResult && !this.inProcess) {
      this.inProcess = true;
      this.developerService.updateDeveloper(TypeMapperUtils.buildDataForSaving(this.organizationResult))
      .pipe(takeUntil(this.$destroy)).subscribe(() => {
        this.inProcess = false;
        this.toastService.success('Your company details has been updated');
      }, () => {
        this.inProcess = false;
        this.toastService.error('Sorry! Can\'t update a company data. Please, try again later');
      });
    }
  }

  private createFormFields(type: TypeModel<DeveloperTypeFieldModel>, companyData?: DeveloperModel): void {
    this.formConfig = TypeMapperUtils.createFormConfig(type, companyData);
    this.loader.complete();
  }
}
