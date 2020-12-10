import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  DeveloperAccountModel,
  DeveloperAccountService,
  DeveloperDataModel,
  InviteUserService,
  UserAccountGridModel,
  UserGridActionModel,
  UsersGridParametersModel,
  UsersService
} from 'oc-ng-common-service';
import {Subject, Subscription} from 'rxjs';
import {ConfirmationModalComponent} from '../../../shared/modals/confirmation-modal/confirmation-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {InviteUserModalComponent} from '../../../shared/modals/invite-user-modal/invite-user-modal.component';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit, OnDestroy {

  @Input()
  private developerData: DeveloperDataModel;

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
  private sortQuery: string = '{"name": 1}';

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

  catchSortChanges(sortBy) {
    switch (sortBy) {
      case 'name':
        this.sortQuery = '{"name": 1}';
        break;
      case 'email':
        this.sortQuery = '{"email": 1}';
        break;
      case 'date':
        this.sortQuery = '{"created": 1}';
        break;
      case 'role':
        this.sortQuery = '{"type": 1}';
        break;
      default:
        break;
    }
    this.userProperties.data.list = [];
    this.scroll(1);
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
        this.editUser(userAction);
        break;
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

  editUser(userAction: UserGridActionModel) {
    console.log('userAction: ', userAction);
    if (this.userProperties.data.list?.length > 0) {
      const editUser = this.userProperties.data.list.filter(developer => developer?.userAccountId === userAction.userAccountId)[0];
      if (editUser) {
        const developerAccount = this.mapToDeveloperAccount(editUser);
        if (editUser?.inviteStatus === 'INVITED') {
          this.editDeveloperInvite(developerAccount);
        } else if (editUser?.inviteStatus === 'ACTIVE') {
          this.editDeveloperAccount(developerAccount);
        } else {
          console.error('Not implement edit type : ', editUser?.inviteStatus);
        }
      }
    }
  }

  private mapToDeveloperAccount(userGrid: UserAccountGridModel): DeveloperAccountModel {
    return {
      ...userGrid,
      developerId: userGrid.userId
    };
  }

  private editDeveloperInvite(developerAccount: DeveloperAccountModel) {
    // todo edit invite by token.
  }

  private editDeveloperAccount(developerAccount: DeveloperAccountModel) {
    const modalRef = this.modal.open(InviteUserModalComponent);
    modalRef.componentInstance.modalTitle = 'Edit user details';
    modalRef.componentInstance.successButtonText = 'Save';
    modalRef.componentInstance.userData = {...developerAccount};
    modalRef.result.then(result => {
      if (result.status === 'success') {
        this.toaster.success('“User details have been updated');
      }
    });
  }
}
