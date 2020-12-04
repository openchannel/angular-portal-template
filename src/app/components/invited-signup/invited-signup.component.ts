import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DeveloperAccountTypesService,
  InviteDeveloperModel,
  InviteUserService, UsersService
} from 'oc-ng-common-service';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-invited-signup',
  templateUrl: './invited-signup.component.html',
  styleUrls: ['./invited-signup.component.scss']
})
export class InvitedSignupComponent implements OnInit, OnDestroy {

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
              private typeService: DeveloperAccountTypesService,
              private usersService: UsersService) { }

  ngOnInit(): void {
    this.getInviteDetails();
  }

  ngOnDestroy() {
    this.requestSubscriber.unsubscribe();
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
          },
          {
            id: 'password',
            label:	'Password',
            type:	'password',
            attributes: { required: true },
          }
        ]
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
    const mappedFields = fields.map(field => {
      if (!field.id.includes('customData') && this.developerInviteData[field.id]) {
        field.defaultValue = this.developerInviteData[field.id];
      }
      return field;
    });
    mappedFields.push({
      id: 'password',
      label:	'Password',
      type:	'password',
      attributes: { required: true },
    });

    return mappedFields;
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

  // register invited user and deleting invite on success
  submitForm() {
    this.inProcess = true;
    this.inviteFormData.inviteToken = this.developerInviteData.token;
    this.requestSubscriber.add(this.usersService.signup(this.inviteFormData)
      .subscribe(resp => {
        this.requestSubscriber.add(this.inviteUserService
          .deleteDeveloperInvite(this.developerInviteData.developerInviteId)
          .subscribe(() => {
            this.router.navigate(['login']);
          }, () => { this.inProcess = false; }));
      }, () => {
        this.inProcess = false;
      }));
  }
}
