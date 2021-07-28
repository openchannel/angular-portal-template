import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
    AccessLevel,
    AuthHolderService,
    DeveloperModel,
    DeveloperRoleService,
    DeveloperService,
    InviteUserService,
    Permission,
    PermissionType,
} from '@openchannel/angular-common-services';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OcInviteModalComponent, ModalInviteUserModel } from '@openchannel/angular-common-components';
import { takeUntil } from 'rxjs/operators';
import { ManagementComponent } from './management/management.component';

export interface Page {
    pageId: string;
    placeholder: string;
    permissions: Permission[];
}

@Component({
    selector: 'app-my-company',
    templateUrl: './my-company.component.html',
    styleUrls: ['./my-company.component.scss'],
})
export class MyCompanyComponent implements OnInit, OnDestroy {
    @ViewChild('appManagement') appManagement: ManagementComponent;

    organizationData: Observable<DeveloperModel>;

    pages: Page[] = [
        {
            pageId: 'company',
            placeholder: 'Company details',
            permissions: [
                {
                    type: PermissionType.ORGANIZATIONS,
                    access: [AccessLevel.READ, AccessLevel.MODIFY],
                },
            ],
        },
        {
            pageId: 'profile',
            placeholder: 'User management',
            permissions: [
                {
                    type: PermissionType.ACCOUNTS,
                    access: [AccessLevel.READ, AccessLevel.MODIFY],
                },
            ],
        },
    ];

    currentPages: Page[] = [];
    selectedPage: Page;
    isProcessing = false;

    private organizationName: string;
    private $destroy: Subject<void> = new Subject();

    constructor(
        private activatedRoute: ActivatedRoute,
        private developerService: DeveloperService,
        private modal: NgbModal,
        private toaster: ToastrService,
        private authHolderService: AuthHolderService,
        private developerRolesService: DeveloperRoleService,
        private inviteService: InviteUserService,
    ) {}

    ngOnInit(): void {
        this.organizationData = this.developerService.getDeveloper().pipe(takeUntil(this.$destroy));
        this.organizationData.subscribe(data => {
            this.organizationName = data?.name;
        });
        this.initProfile();
    }

    ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    gotoPage(newPage: Page): void {
        this.selectedPage = newPage;
    }

    goBack(): void {
        history.back();
    }

    openInviteModal(): void {
        const inviteTemplateId = '5fc663f2217876017548dc25';

        const modalRef = this.modal.open(OcInviteModalComponent, { size: 'sm' });

        const modalData = new ModalInviteUserModel();
        modalData.modalTitle = 'Invite a member';
        modalData.successButtonText = 'Send Invite';

        modalData.requestFindUserRoles = () => this.developerRolesService.getDeveloperRoles(1, 100).pipe(takeUntil(this.$destroy));

        modalData.requestSendInvite = (accountData: any) =>
            this.inviteService.sendDeveloperInvite(this.organizationName, accountData, inviteTemplateId).pipe(takeUntil(this.$destroy));

        modalRef.componentInstance.modalData = modalData;
        modalRef.result.then(
            () => {
                this.toaster.success('Invitation sent');
                this.appManagement.getAllDevelopers(true);
            },
            () => {},
        );
    }

    private initProfile(): void {
        this.currentPages = this.filterPagesByDeveloperType();
        this.initMainPage();
    }

    private initMainPage(): void {
        const pageType = this.activatedRoute.snapshot.paramMap.get('pageId');
        if (pageType) {
            const pageByUrl = this.currentPages.filter(page => page.pageId === pageType)[0];
            if (pageByUrl) {
                this.selectedPage = pageByUrl;
            }
        } else {
            this.selectedPage = this.currentPages[0];
        }
    }

    private filterPagesByDeveloperType(): Page[] {
        return (this.currentPages = this.pages.filter(page => this.authHolderService.hasAnyPermission(page.permissions)));
    }
}
