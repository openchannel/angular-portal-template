import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthHolderService, DeveloperModel, DeveloperService, DeveloperTypeFieldModel, DeveloperTypeService} from 'oc-ng-common-service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit, OnDestroy {

  typeFields: {
    fields: DeveloperTypeFieldModel [];
  };

  isInvalidForm = true;
  savingCompanyData = false;

  private developer: any;
  private newCustomData: any;
  private defaultDeveloperTypeFields: DeveloperTypeFieldModel [] = [{
    id: 'name',
    label: 'Company Name',
    type: 'text',
    attributes: {
      required: true
    }
  }];
  private subscriptions: Subscription = new Subscription();

  constructor(private developerService: DeveloperService,
              private developerTypeService: DeveloperTypeService,
              private authHolderService: AuthHolderService,
              private activatedRoute: ActivatedRoute,
              private toastService: ToastrService) {
  }

  ngOnInit(): void {
    this.subscriptions.add(this.developerService.getDeveloper().subscribe(developer => {
      this.developer = developer;
      this.subscriptions.add(this.developerTypeService.getDeveloperType(developer?.type).subscribe(developerType => {
        this.typeFields = {
          fields: this.mapTypeFields(developer, developerType.fields)
        };
      }, error => {
        if (error.status === 404) {
          this.typeFields = {
            fields: this.mapTypeFields(developer, this.defaultDeveloperTypeFields)
          };
        } else {
          console.error('getDeveloperType', error);
        }
      }));
    }, error => console.error('getDeveloper', error)));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  saveType(): void {
    this.savingCompanyData = true;
    const request = {
      name: this.getDeveloperName(this.developer, this.newCustomData),
      customData: {
        ...(this.developer?.customData ? this.developer.customData : {}),
        ...(this.getCustomDataValues(this.newCustomData))
      }
    };
    this.subscriptions.add(this.developerService.updateDeveloper(request)
    .subscribe(developerResponse => {
      this.savingCompanyData = false;
      this.toastService.success('Your organization details has been updated');
    }, error => {
      this.savingCompanyData = false;
      console.error('updateDeveloper', error);
    }));
  }

  setCompanyData(newCustomData: any) {
    this.newCustomData = newCustomData;
  }

  setIsFormInvalid(isInvalidForm: boolean) {
    this.isInvalidForm = isInvalidForm;
  }

  private getDeveloperName(developer: DeveloperModel, newCustomData: any): string {
    const newName = newCustomData.name;
    if (newName && newName !== developer.name) {
      return newName;
    }
    return developer.name;
  }

  private getCustomDataValues(customData: any): any {
    const result = {};
    Object.entries(customData ? customData : {}).forEach(([key, value]) => {
      if (key.includes('customData.')) {
        result[key.replace('customData.', '')] = value;
      }
    });
    return result;
  }

  private mapTypeFields(developer: DeveloperModel, fields: DeveloperTypeFieldModel[]): DeveloperTypeFieldModel [] {
    if (fields) {
      const defaultValues = this.getDefaultValues(developer);
      return fields.filter(field => field?.id).map(field => this.mapField(field, defaultValues));
    }
    return [];
  }

  private mapField(field: DeveloperTypeFieldModel, defaultValues: Map<string, any>): DeveloperTypeFieldModel {
    if (field) {
      // map options
      if (field?.options) {
        field.options = this.mapOptions(field);
      }
      if (defaultValues.has(field?.id)) {
        field.defaultValue = defaultValues.get(field?.id);
      }
      // map other fields
      if (field?.fields) {
        field.fields.forEach(child => this.mapField(child, defaultValues));
        field.subFieldDefinitions = field.fields;
        field.fields = null;
      }
    }
    return field;
  }

  private getDefaultValues(developer: DeveloperModel): Map<string, any> {
    const map = new Map<string, any>();
    Object.entries(developer?.customData ? developer.customData : {})
    .forEach(([key, value]) => map.set(`customData.${key}`, value));
    map.set('name', developer.name);
    return map;
  }

  private mapOptions(appTypeFiled: DeveloperTypeFieldModel): string [] {
    const newOptions = [];
    appTypeFiled.options.forEach(o => newOptions.push(o?.value ? o.value : o));
    return newOptions;
  }
}
