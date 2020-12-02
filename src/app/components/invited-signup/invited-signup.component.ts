import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthenticationService,
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
  public inviteSignupForm: FormGroup;
  public formConfig: any;
  public  isTerms = false;

  private requestSubscriber: Subscription = new Subscription();

  constructor(private activeRouter: ActivatedRoute,
              private router: Router,
              private inviteUserService: InviteUserService,
              private typeService: DeveloperAccountTypesService) { }

  ngOnInit(): void {
    this.getInviteDetails();
  }

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

  getCreatedForm(form) {
    this.inviteSignupForm = form;
    this.inviteSignupForm.get('email').disable();
    const companyKey = Object.keys(form.value).find(key => key.includes('company'));
    if (companyKey) {
      this.inviteSignupForm.get(companyKey).disable();
    }
  }
}
