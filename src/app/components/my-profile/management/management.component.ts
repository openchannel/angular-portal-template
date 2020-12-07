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
  private sortQuery: '{"name": 1}';

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
    this.userProperties.data.pageNumber = pageNumber;
    this.getAllDevelopers();
  }

  private getAllDevelopers() {
    this.subscriptions.add(
      this.inviteUserService.getDeveloperInvites(this.userProperties.data.pageNumber, 10, this.sortQuery)
        .subscribe(invites => {
          const invitesArray = invites.list.map(developer => this.mapToGridUser(developer, 'INVITED'));
          if (this.userProperties.data.pageNumber === 1 ) {
            this.userProperties.data.list
              .push(...invitesArray);
          } else {
            const lastInvitedDev = this.userProperties.data.list
              .filter(developer => developer.inviteStatus === 'INVITED').pop();
            if (lastInvitedDev) {
              this.userProperties.data.list
                .splice(this.userProperties.data.list.lastIndexOf(lastInvitedDev) + 1, 0, ...invitesArray);
            }
          }
          this.getActiveDevelopers();
        }, () => this.getActiveDevelopers())
    );
  }

  private getActiveDevelopers() {
    this.subscriptions.add(this.developerAccountService.getDeveloperAccounts(this.userProperties.data.pageNumber, 10, this.sortQuery)
      .subscribe(activeDevelopers => {
        this.userProperties.data.list
          .push(...activeDevelopers.list.map(developer => this.mapToGridUser(developer, 'ACTIVE')));
      })
    );
  }

  private mapToGridUser(developer: DeveloperAccountModel, developerStatus: 'INVITED' | 'ACTIVE'): UserAccountGridModel {
    return {
      ...developer,
      name: developer.name,
      email: developer.email,
      customData: developer.customData,
      created: developer.created,
      userId: developer.developerId,
      userAccountId: developer.developerAccountId,
      inviteStatus: developerStatus
    };
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
