import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  DeveloperAccountModel,
  DeveloperAccountService,
  DeveloperRoleService,
  InviteDeveloperModel,
  InviteUserService,
  ModalUpdateUserModel,
  Page,
  UserAccountGridModel,
  UserGridActionModel,
  UsersGridParametersModel,
  UsersService
} from 'oc-ng-common-service';
import {Observable, of, Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {LoadingBarState} from '@ngx-loading-bar/core/loading-bar.state';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {OcConfirmationModalComponent, OcInviteModalComponent} from 'oc-ng-common-component';
import {flatMap, map, takeUntil, tap} from 'rxjs/operators';
import {cloneDeep} from 'lodash';

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

  private listRoles: any = {};
  private sortQuery = '{"name": 1}';
  private destroy$: Subject<void> = new Subject();
  private loader: LoadingBarState;
  private readonly DEVELOPERS_LIMIT_PER_REQUEST = 10;
  private inProcessGettingDevelopers = false;

  constructor(public loadingBar: LoadingBarService,
              private userService: UsersService,
              private inviteUserService: InviteUserService,
              private developerAccountService: DeveloperAccountService,
              private developerRolesService: DeveloperRoleService,
              private toaster: ToastrService,
              private modal: NgbModal) {
  }

  ngOnInit(): void {
    this.loader = this.loadingBar.useRef();
    this.getAllDevelopers(true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.loader) {
      this.loader.complete();
    }
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
    this.getAllDevelopers(true);
  }

  getRoles(startNewPagination: boolean, oldRoles: any): Observable<any> {
     return startNewPagination ? this.developerRolesService.getDeveloperRoles(1, 100)
        .pipe(map(response => {
          const tempRoles = {};
          response.list.forEach(r => tempRoles[r.developerRoleId] = r.name);
          return tempRoles;
        })) : of(oldRoles);
  }
  getAllDevelopers(startNewPagination: boolean) {
    if (!this.inProcessGettingDevelopers) {
      this.loader.start();
      this.inProcessGettingDevelopers = true;
      if (startNewPagination) {
        this.userProperties.data.pageNumber = 1;
      }
      let inviteResponse: Page<InviteDeveloperModel>;
      let activeResponse: Page<DeveloperAccountModel>;
      this.inviteUserService.getDeveloperInvites(this.userProperties.data.pageNumber, this.DEVELOPERS_LIMIT_PER_REQUEST, this.sortQuery)
      .pipe(
        tap((response) => inviteResponse = response),
        flatMap(() => this.developerAccountService.getDeveloperAccounts(
            this.userProperties.data.pageNumber, this.DEVELOPERS_LIMIT_PER_REQUEST, this.sortQuery)),
        tap((response) =>  activeResponse = response),
        flatMap(() => this.getRoles(startNewPagination, this.listRoles)),
        tap(mappedRoles =>  this.listRoles = mappedRoles),
        takeUntil(this.destroy$))
        .subscribe(() => {
          this.loader.complete();

          if (startNewPagination) {
            this.userProperties.data.list = [];
          }

          const invites = inviteResponse.list.map(userInvite => this.mapToGridUserFromInvite(userInvite));

          // push new invites
          if (this.userProperties.data.pageNumber === 1) {
            this.userProperties.data.list.push(...invites);
          } else {
            const lastInvitedDev = this.userProperties.data.list
                .filter(user => user.inviteStatus === 'INVITED').pop();
            if (lastInvitedDev) {
            this.userProperties.data.list.splice(
                this.userProperties.data.list.lastIndexOf(lastInvitedDev) + 1, 0, ...invites);
            }
          }
          // push new developers
          this.userProperties.data.pageNumber++;
          this.userProperties.data.list
              .push(...activeResponse.list.map(user => this.mapToGridUserFromDeveloper(user)));
          this.inProcessGettingDevelopers = false;
        }, () => {
          this.loader.complete();
          this.inProcessGettingDevelopers = false;
        });
    }
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
      roles: this.toRoleName(developer.roles)
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
      inviteStatus: 'INVITED',
      roles: this.toRoleName(developer.roles)
    };
  }

  private toRoleName(userRoles: string[]) {
    const roleName = [];
    userRoles.forEach(r => roleName.push(this.listRoles[r]));
    return roleName;
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
    this.openDeleteModal('Delete user', 'Delete this user from the marketplace now?', 'Yes, delete user', () =>
        this.developerAccountService.deleteDeveloperAccount(user?.userAccountId)
        .subscribe(() => {
          this.deleteUserFromResultArray(user);
          this.toaster.success('User has been deleted from your organization');
        })
    );
  }

  deleteInvite(user: UserAccountGridModel): void {
    this.openDeleteModal('Delete invite', 'Are you sure you want to delete this invite?', 'Yes, delete invite', () =>
        this.inviteUserService.deleteDeveloperInvite(user?.inviteId).subscribe(() => {
          this.deleteUserFromResultArray(user);
          this.toaster.success('Invite has been deleted');
        }));
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
      this.editInvite(developerAccount);
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

  private editDeveloperAccount(developerAccount: DeveloperAccountModel) {

    const modalRef = this.modal.open(OcInviteModalComponent, {size: 'sm'});
    const modalData = new ModalUpdateUserModel();
    modalData.userData = cloneDeep(developerAccount);
    modalData.modalTitle = 'Edit member';
    modalData.successButtonText = 'Save';
    modalData.requestFindUserRoles =
        () => this.developerRolesService.getDeveloperRoles(1, 100);
    modalData.requestUpdateAccount = (accountId: string, accountData: any) =>
        this.developerAccountService.updateAccountFieldsForAnotherUser(accountId, true, accountData);
    modalRef.componentInstance.modalData = modalData;
    modalRef.result.then(() => {
      this.getAllDevelopers(true);
      this.toaster.success('User details have been updated');
    }, () => {});
  }

  private openDeleteModal(modalTitle: string, modalText: string, confirmText: string, deleteCallback: () => void) {
    const modalSuspendRef = this.modal.open(OcConfirmationModalComponent, {size: 'md'});
    modalSuspendRef.componentInstance.ngbModalRef = modalSuspendRef;
    modalSuspendRef.componentInstance.modalTitle = modalTitle;
    modalSuspendRef.componentInstance.modalText = modalText;
    modalSuspendRef.componentInstance.confirmButtonText = confirmText;
    modalSuspendRef.componentInstance.confirmButtonType = 'danger';
    modalSuspendRef.result.then(() => deleteCallback(), () => {});
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

  private editInvite(developerAccount: DeveloperAccountModel) {
    const modalRef = this.modal.open(OcInviteModalComponent, {size: 'sm'});
    const modalData = new ModalUpdateUserModel();
    modalData.userData = developerAccount;
    modalData.modalTitle = 'Edit invite';
    modalData.successButtonText = 'Save';
    modalData.requestFindUserRoles =
      () => this.developerRolesService.getDeveloperRoles(1, 100);
    modalData.requestUpdateAccount = (accountId: string, accountData: any) =>
      this.inviteUserService.editDeveloperInvite(accountData.inviteId, accountData);
    modalRef.componentInstance.modalData = modalData;
    modalRef.result.then(() => {
      this.getAllDevelopers(true);
      this.toaster.success('User details have been updated');
    }, () => {});
  }
}
