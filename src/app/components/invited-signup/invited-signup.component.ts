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
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-invited-signup',
  templateUrl: './invited-signup.component.html',
  styleUrls: ['./invited-signup.component.scss']
})
export class InvitedSignupComponent implements OnInit {

  public developerInviteData: InviteDeveloperModel;
  public isExpired = false;
  public inviteSignupForm: FormGroup;

  private requestSubscriber: Subscription = new Subscription();

  constructor(private activeRouter: ActivatedRoute,
              private router: Router,
              private inviteUserService: InviteUserService,
              private typeService: DeveloperAccountTypesService) { }

  ngOnInit(): void {
    this.getInviteDetails();
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

  getFormType(type) {
    this.requestSubscriber.add(
      this.typeService.getAccountType(type).subscribe(
        resp => {}
      )
    );
  }
}
