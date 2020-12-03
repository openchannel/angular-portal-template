import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  DeveloperAccountModel,
  DeveloperAccountService,
  InviteUserService,
  UserAccountGridModel,
  UserGridActionModel,
  UsersGridParametersModel,
  UsersService
} from 'oc-ng-common-service';
import {Subject, Subscription} from 'rxjs';
import {mergeMap, takeUntil, tap} from 'rxjs/operators';
import {ConfirmationModalComponent} from '../../../shared/modals/confirmation-modal/confirmation-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit, OnDestroy {

  userProperties: UsersGridParametersModel = {
    data: {
      pageNumber: 1,
      pages: 50,
      list: [],
      count: 0,
    },
    layout: 'table',
    options: ['DELETE', 'EDIT']
  };

  private subscriptions = new Subscription();
  private userLimitForOnePage = 50;

  private destroy$: Subject<void> = new Subject();

  constructor(private userService: UsersService,
              private inviteUserService: InviteUserService,
              private developerAccountService: DeveloperAccountService,
              private toaster: ToastrService,
              private modal: NgbModal) {
  }

  ngOnInit(): void {
    this.scroll(1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  scroll(pageNumber: number) {
    let developers: DeveloperAccountModel [];
    this.subscriptions.add(this.developerAccountService.getDeveloperAccounts(pageNumber, this.userLimitForOnePage)
    .pipe(
        takeUntil(this.destroy$),
        tap(developerResponse => developers = developerResponse.list),
        mergeMap(() => this.inviteUserService.getDeveloperInvites(1, 20, this.createInviteQuery(developers)))
    ).subscribe(invites => {
      const invitedDeveloperAccountId = invites.list.map(invite => invite?.developerAccountId).filter(id => id);
      this.userProperties.data.list.push(...developers.map(developer => this.mapToGridUser(developer, invitedDeveloperAccountId)));
    }, error => console.error('getDevelopers', error)));

  }

  private mapToGridUser(developer: DeveloperAccountModel, invitedDeveloperAccountId: string []): UserAccountGridModel {
    return {
      ...developer,
      name: developer.name,
      email: developer.email,
      customData: developer.customData,
      created: developer.created,
      userId: developer.developerId,
      userAccountId: developer.developerAccountId,
      inviteStatus: invitedDeveloperAccountId.includes(developer.developerAccountId) ? 'INVITED' : 'ACTIVE'
    };
  }

  private createInviteQuery(users: DeveloperAccountModel []): string | null {
    if (users?.length > 0) {
      return `{\'developerAccountId\': {\'$in\':[${users.map(user => user?.developerAccountId)
        .filter(id => id).map(id => `\'${id}\'`).join(',')}]}}`;
    }
    return null;
  }

  userAction(userAction: UserGridActionModel) {
    switch (userAction.action) {
      case 'DELETE':
        this.deleteUser(userAction);
        break;
      case 'EDIT':
      default:
        console.error('Not implement');
    }
  }

  deleteUser(userAction: UserGridActionModel): void {
    const modalSuspendRef = this.modal.open(ConfirmationModalComponent);
    modalSuspendRef.componentInstance.modalTitle = 'Are you sure you want to delete this user?';
    modalSuspendRef.componentInstance.buttonText = 'Yes, delete it';
    modalSuspendRef.result.then(res => {
      if (res === 'success') {
        this.subscriptions.add(this.developerAccountService.deleteDeveloperAccount(userAction.userAccountId)
        .subscribe(() => {
          this.toaster.success('User has been deleted from your organization');
        }, error => console.error('deleteDeveloperAccount', error)));
      }
    });
  }
}
