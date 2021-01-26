import {Component, OnInit} from '@angular/core';
import {
  AuthHolderService,
  DeveloperAccountTypesService,
  DeveloperDataModel,
  DeveloperService,
  InviteUserService,
  ModalInviteUserModel,
  SellerMyProfile
} from 'oc-ng-common-service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {OcInviteModalComponent} from 'oc-ng-common-component';

export interface Page {
  pageId: string;
  pageTitle: string;
  placeholder: string;
  showByTypes: string [];
}

@Component({
  selector: 'app-my-company',
  templateUrl: './my-company.component.html',
  styleUrls: ['./my-company.component.scss']
})
export class MyCompanyComponent implements OnInit {


  pages: Page[] = [{
    pageId: 'company',
    pageTitle: 'My company',
    placeholder: 'Company details',
    showByTypes: ['ADMIN', 'GENERAL'],
  }, {
    pageId: 'profile',
    pageTitle: 'My company',
    placeholder: 'User management',
    showByTypes: ['*'],
  }];

  currentPages: Page[] = [];
  selectedPage: Page;

  myProfile = new SellerMyProfile();
  isProcessing = false;

  developerData: DeveloperDataModel = {};

  private subscriptions = new Subscription();

  constructor(
      private activatedRoute: ActivatedRoute,
      private developerService: DeveloperService,
      private modal: NgbModal,
      private toaster: ToastrService,
      private authHolderService: AuthHolderService,
      private developerAccountTypesService: DeveloperAccountTypesService,
      private inviteService: InviteUserService) {
  }

  ngOnInit(): void {
    this.initProfile();
  }

  gotoPage(newPage: Page) {
    this.selectedPage = newPage;
  }

  goBack() {
    history.back();
  }

  private initProfile() {
    this.subscriptions.add(this.developerService.getDeveloper().subscribe(developer => {
      this.developerData.developer = developer;
      this.currentPages = this.filterPagesByDeveloperType(this.authHolderService.userDetails.role);
      this.initMainPage();
    }));
  }

  private initMainPage() {
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

  private filterPagesByDeveloperType(developerType: string): Page [] {
    return this.currentPages = this.pages.filter(page =>
        page.showByTypes.filter(pattern => pattern === '*' || pattern === developerType || !developerType).length > 0);
  }

  openInviteModal() {
    const inviteTemplateId = '5fc663f2217876017548dc25';

    const modalRef = this.modal.open(OcInviteModalComponent, {size: 'sm'});
    modalRef.componentInstance.ngbModalRef = modalRef;

    const modalData = new ModalInviteUserModel();
    modalData.modalTitle = 'Invite a member';
    modalData.successButtonText = 'Save';
    modalData.requestFindUserTypes =
        () => this.developerAccountTypesService.getAllDeveloperAccountsType(1, 100);
    modalData.requestSendInvite = (accountData: any) => {
      return this.inviteService.sendDeveloperInvite(inviteTemplateId, this.developerData.developer.name, accountData);
    };

    modalRef.componentInstance.modalData = modalData;

    modalRef.result.then(result => {
      if (result) {
        this.toaster.success('Invitation sent');
      }
    });
  }
}
