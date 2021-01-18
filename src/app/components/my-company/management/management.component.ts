import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  DeveloperAccountModel,
  DeveloperAccountService,
  DeveloperDataModel,
  InviteDeveloperModel,
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
import {LoaderService} from '../../../shared/services/loader.service';

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
  private sortQuery = '{"name": 1}';

  private destroy$: Subject<void> = new Subject();

  private readonly loaderInvites = 'loaderInvites';
  private readonly loaderDevelopers = 'loaderDevelopers';

  constructor(public loaderService: LoaderService,
              private userService: UsersService,
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
    this.getAllDevelopers(() => {
    });
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
    this.userProperties.data.pageNumber = 1;
    this.getAllDevelopers(() => this.userProperties.data.list = []);
  }

  private getAllDevelopers(responseCallBack: () => void) {
    this.loaderService.showLoader(this.loaderInvites);
    this.subscriptions.add(
        this.inviteUserService.getDeveloperInvites(this.userProperties.data.pageNumber, 10, this.sortQuery)
        .subscribe(invites => {
          this.loaderService.closeLoader(this.loaderInvites);
          this.getActiveDevelopers(invites.list.map(developerInvite => this.mapToGridUserFromInvite(developerInvite)), responseCallBack);
        }, () => {
          this.loaderService.closeLoader(this.loaderInvites);
          this.getActiveDevelopers([], responseCallBack);
        })
    );
  }

  private getActiveDevelopers(invites: UserAccountGridModel[], responseCallBack: () => void) {
    this.loaderService.showLoader(this.loaderDevelopers);
    this.subscriptions.add(this.developerAccountService.getDeveloperAccounts(this.userProperties.data.pageNumber, 10, this.sortQuery)
        .subscribe(activeDevelopers => {
          responseCallBack();

          // push new invites
          if (this.userProperties.data.pageNumber === 1) {
            this.userProperties.data.list
            .push(...invites);
          } else {
            const lastInvitedDev = this.userProperties.data.list
            .filter(developer => developer.inviteStatus === 'INVITED').pop();
            if (lastInvitedDev) {
              this.userProperties.data.list
              .splice(this.userProperties.data.list.lastIndexOf(lastInvitedDev) + 1, 0, ...invites);
            }
          }

          // push new developers
          this.userProperties.data.list.push(...activeDevelopers.list.map(developer => this.mapToGridUserFromDeveloper(developer)));
          this.loaderService.closeLoader(this.loaderDevelopers);
        }, (error) => {
          responseCallBack();
          this.loaderService.closeLoader(this.loaderDevelopers);
        })
    );
  }

  private mapToGridUserFromDeveloper(developer: DeveloperAccountModel): UserAccountGridModel {
    return {
      ...developer,
      name: developer.name,
      email: developer.email,
      customData: developer.customData,
      userId: developer.developerId,
      userAccountId: developer.developerAccountId,
      created: developer.created,
      inviteStatus: 'ACTIVE',
    };
  }

  private mapToGridUserFromInvite(developer: InviteDeveloperModel): UserAccountGridModel {
    return {
      ...developer,
      name: developer.name,
      email: developer.email,
      customData: developer.customData,
      userId: developer.developerId,
      userAccountId: developer.developerAccountId,
      created: developer.createdDate,
      inviteId: developer.developerInviteId,
      inviteToken: developer.token,
      inviteStatus: 'INVITED'
    };
  }

  userAction(userAction: UserGridActionModel) {
    const user = this.findUserByAction(userAction);
    if (user) {
      switch (userAction.action) {
        case 'DELETE':
          this.deleteUser(userAction, user);
          break;
        case 'EDIT':
          this.editUser(userAction, user);
          break;
        default:
          console.error('Not implement');
      }
    } else {
      console.error('Can\'t find user from mail array by action');
    }
  }

  deleteUser(userAction: UserGridActionModel, user: UserAccountGridModel): void {
    if (user?.inviteStatus === 'INVITED') {
      this.deleteInvite(user);
    } else if (user?.inviteStatus === 'ACTIVE') {
      this.deleteAccount(user);
    } else {
      console.error('Not implement edit type : ', user?.inviteStatus);
    }
  }

  deleteAccount(user: UserAccountGridModel): void {
    this.openDeleteModal('Are you sure you want to delete this user?', () =>
        this.developerAccountService.deleteDeveloperAccount(user?.userAccountId)
        .subscribe(() => {
          this.deleteUserFromResultArray(user);
          this.toaster.success('User has been deleted from your organization');
        }, error => console.error('deleteDeveloperAccount', error))
    );
  }

  deleteInvite(user: UserAccountGridModel): void {
    this.openDeleteModal('Are you sure you want to delete this invite?', () =>
        this.inviteUserService.deleteDeveloperInvite(user?.inviteId).subscribe(() => {
          this.deleteUserFromResultArray(user);
          this.toaster.success('Invite has been deleted');
        }, error => console.error('deleteDeveloperInvite', error)));
  }

  deleteUserFromResultArray(user: UserAccountGridModel) {
    if (this.userProperties.data.list?.length > 0) {
      const userIndex = this.userProperties.data.list.indexOf(user);
      if (userIndex >= 0) {
        this.userProperties.data.list.splice(userIndex, 1);
      }
    }
  }

  editUser(userAction: UserGridActionModel, user: UserAccountGridModel) {
    const developerAccount = this.mapToDeveloperAccount(user);
    if (user?.inviteStatus === 'INVITED') {
      this.editDeveloperInvite(developerAccount);
    } else if (user?.inviteStatus === 'ACTIVE') {
      this.editDeveloperAccount(developerAccount);
    } else {
      console.error('Not implement edit type : ', user?.inviteStatus);
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
        this.toaster.success('User details have been updated');
      }
    });
  }

  private openDeleteModal(modalTitle: string, deleteCallback: () => Subscription) {
    const modalSuspendRef = this.modal.open(ConfirmationModalComponent);
    modalSuspendRef.componentInstance.modalTitle = modalTitle;
    modalSuspendRef.componentInstance.buttonText = 'Yes, delete it';
    modalSuspendRef.result.then(res => {
      if (res === 'success') {
        this.subscriptions.add(deleteCallback());
      }
    });
  }

  private findUserByAction(userAction: UserGridActionModel): UserAccountGridModel {
    if (this.userProperties.data.list?.length > 0) {
      if (userAction?.inviteId) {
        return this.userProperties.data.list.filter(developer => developer?.inviteId === userAction.inviteId)[0];
      } else {
        return this.userProperties.data.list.filter(developer => developer?.userAccountId === userAction.userAccountId)[0];
      }
    }
    return null;
  }
}
