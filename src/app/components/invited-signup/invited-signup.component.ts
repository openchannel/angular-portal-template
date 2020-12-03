import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DeveloperAccountTypesService,
  InviteDeveloperModel,
  InviteUserService
} from 'oc-ng-common-service';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-invited-signup',
  templateUrl: './invited-signup.component.html',
  styleUrls: ['./invited-signup.component.scss']
})
export class InvitedSignupComponent implements OnInit {

  public developerInviteData: InviteDeveloperModel;
  public isExpired = false;
  public inviteFormData: any;
  public formConfig: any;
  public isTerms = false;
  public isFormInvalid = true;
  public inProcess = false;


  private requestSubscriber: Subscription = new Subscription();

  constructor(private activeRouter: ActivatedRoute,
              private router: Router,
              private inviteUserService: InviteUserService,
              private typeService: DeveloperAccountTypesService) { }

  ngOnInit(): void {
    this.getInviteDetails();
  }
  // making form config according to form type
  getFormType(type) {
    if (type) {
      this.requestSubscriber.add(
        this.typeService.getAccountType(type).subscribe(
          resp => {
            this.formConfig = {
              fields: this.mapDataToField(resp.fields)
            };
          }
        )
      );
    } else {
      this.formConfig = {
        fields: [
          {
          id:	'name',
          label:	'Name',
          type:	'text',
          attributes: { required: false }
          },
          {
            id: 'email',
            label:	'Email',
            type:	'emailAddress',
            attributes: { required: true },
          }]
      };
    }
  }
  // getting invitation details
  getInviteDetails(): void {
    const userToken = this.activeRouter.snapshot.params.token;
    if (userToken) {
      this.requestSubscriber.add(this.inviteUserService.getDeveloperInviteInfoByToken(userToken)
        .subscribe(response => {
          this.developerInviteData = response;
          if (new Date(this.developerInviteData.expireDate) < new Date()) {
            this.isExpired = true;
          } else {
            this.getFormType(this.developerInviteData.type);
          }
        }, () => {
          this.router.navigate(['']);
        }));
    } else {
      this.router.navigate(['']);
    }
  }

  mapDataToField(fields) {
    return fields.map(field => {
      if (!field.id.includes('customData') && this.developerInviteData[field.id]) {
        field.defaultValue = this.developerInviteData[field.id];
      }
      return field;
    });
  }
  // getting generated form group for disabling special fields
  getCreatedForm(form) {
    form.get('email').disable();
    const companyKey = Object.keys(form.value).find(key => key.includes('company'));
    if (companyKey) {
      form.get(companyKey).disable();
    }
  }
  // getting last values of form for submission
  getFormValues(form) {
    this.inviteFormData = form;
  }
  // Active form validation
  getFormValidity(status) {
    this.isFormInvalid = status;
  }

  submitForm() {
    // todo register user request
  }
}
