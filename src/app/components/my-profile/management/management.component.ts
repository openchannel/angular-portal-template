import {Component, OnDestroy, OnInit} from '@angular/core';
import {InviteUserService, User, UserAccountGridModel, UsersGridParametersModel, UsersService} from 'oc-ng-common-service';
import {Subject, Subscription} from 'rxjs';
import {mergeMap, takeUntil, tap} from 'rxjs/operators';

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
              private inviteUserService: InviteUserService) {
  }

  ngOnInit(): void {
    this.scroll(1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  scroll(pageNumber: number) {
    let users: User [];
    this.subscriptions.add(this.userService.getUsers(pageNumber, this.userLimitForOnePage)
    .pipe(
        takeUntil(this.destroy$),
        tap(usersResponse => users = usersResponse.list),
        mergeMap(() => this.inviteUserService.getUserInvites(1, 100, this.createInviteQuery(users)))
    ).subscribe(invites => {
      const invitedUserId = invites.list.map(invite => invite?.userId).filter(id => id);
      this.userProperties.data.list.push(...users.map(user => this.mapToGridUser(user, invitedUserId)));
    }, error => console.log('getUsers', error)));

  }

  private mapToGridUser(user: User, invitedUserId: string []): UserAccountGridModel {
    return {
      ...user,
      userAccountId: null,
      inviteStatus: invitedUserId.includes(user.userId) ? 'INVITED' : 'ACTIVE'
    };
  }

  private createInviteQuery(users: User []): string | null {
    if (users?.length > 0) {
      return `{\'userId\': {\'$in\':[${users.map(user => user?.userId).filter(id => id).map(id => `\'${id}\'`).join(',')}]}}`;
    }
    return null;
  }
}
