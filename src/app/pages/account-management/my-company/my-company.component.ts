import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
    AccessLevel,
    AuthHolderService,
    DeveloperModel,
    DeveloperRoleService,
    DeveloperService,
    InviteUserService,
    PaymentsGateways,
    Permission,
    PermissionType,
    SiteConfigService,
} from '@openchannel/angular-common-services';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ModalInviteUserModel, OcInviteModalComponent } from '@openchannel/angular-common-components';
import { first, takeUntil } from 'rxjs/operators';
import { ManagementComponent } from './management/management.component';
import { Location } from '@angular/common';

export interface Page {
    pageId: string;
    placeholder: string;
    routerLink: string;
    permissions: Permission[];
    paymentsGatewayToActivate?: PaymentsGateways;
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
            routerLink: '/my-company/company-details',
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
            routerLink: '/my-company/user-management',
            permissions: [
                {
                    type: PermissionType.ACCOUNTS,
                    access: [AccessLevel.READ, AccessLevel.MODIFY],
                },
            ],
        },
        {
            pageId: 'payouts',
            placeholder: 'Payouts',
            routerLink: '/my-company/payouts',
            permissions: [
                {
                    type: PermissionType.ACCOUNTS,
                    access: [AccessLevel.READ, AccessLevel.MODIFY],
                },
            ],
            paymentsGatewayToActivate: PaymentsGateways.STRIPE,
        },
    ];

    currentPages: Page[] = [];
    selectedPage: Page;
    isProcessing = false;

    private organizationName: string;

    private $destroy: Subject<void> = new Subject();

    constructor(
        private developerService: DeveloperService,
        private modal: NgbModal,
        private toaster: ToastrService,
        private authHolderService: AuthHolderService,
        private developerRolesService: DeveloperRoleService,
        private inviteService: InviteUserService,
        private router: Router,
        private location: Location,
        private siteConfigService: SiteConfigService,
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
        this.location.replaceState(newPage.routerLink);
    }

    goBack(): void {
        history.back();
    }

    openInviteModal(): void {
        const modalRef = this.modal.open(OcInviteModalComponent, { size: 'sm' });
        const modalData = new ModalInviteUserModel();
        modalData.modalTitle = 'Invite a member';
        modalData.successButtonText = 'Send Invite';

        modalData.requestFindUserRoles = () => this.developerRolesService.getDeveloperRoles(1, 100).pipe(takeUntil(this.$destroy));

        modalData.requestSendInvite = (accountData: any) =>
            this.inviteService.sendDeveloperInvite(this.organizationName, accountData).pipe(takeUntil(this.$destroy));

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
        this.siteConfigService
            .getSiteConfigAsObservable()
            .pipe(
                first(config => !!config),
                takeUntil(this.$destroy),
            )
            .subscribe(() => {
                this.currentPages = this.filterPages(this.pages);
                this.initMainPage();
            });
    }

    private initMainPage(): void {
        const pagePath = this.router.url;
        const pageByUrl = this.currentPages.find(page => page.routerLink === pagePath);
        this.selectedPage = pageByUrl || this.currentPages[0];
    }

    private filterPages(pagesToFilter: Page[]): Page[] {
        let filteredPages = this.filterPagesByDeveloperType(pagesToFilter);
        filteredPages = this.filterPagesByPaymentsGateway(filteredPages);

        return filteredPages;
    }

    private filterPagesByDeveloperType(pagesToFilter: Page[]): Page[] {
        return pagesToFilter.filter(page => this.authHolderService.hasAnyPermission(page.permissions));
    }

    private filterPagesByPaymentsGateway(pagesToFilter: Page[]): Page[] {
        return pagesToFilter.filter(page => {
            if (!page.paymentsGatewayToActivate) {
                return true;
            }

            const { paymentsEnabled, paymentsGateway } = this.siteConfigService.siteConfig;

            return paymentsEnabled && page.paymentsGatewayToActivate === paymentsGateway;
        });
    }
}
