import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbRatingConfig, NgbModalConfig, NgbModal, NgbCarouselConfig, NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common-service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { NotificationService } from 'src/app/shared/custom-components/notification/notification.service';
import { ApplicationService } from 'src/app/shared/services/application.service';

@Component({
  selector: 'app-application-detail',
  templateUrl: './application-detail.component.html',
  styleUrls: ['./application-detail.component.scss'],
  providers: [NgbCarouselConfig]
})
export class ApplicationDetailComponent implements OnInit {

  // @ViewChild('clinical') clinicalRef: ElementRef;
  // @ViewChild('reviews') reviewsRef: ElementRef;

  currentSection = 'clinical';;
  safeName;
  @Input() applicationDetails;
  appCountry;
  isLoading = true;

  isUserLoggedIn = false;
  appReviewList;
  hasReview = false;
  inProcess = false;
  userAcountName;
  activeMenu = "clinical";
  count: number = 0;
  subscriptionStatus;

  ownershipResponse;

  subscribed = false;
  notSubscribed = false;

  // @HostListener('window:scroll', ['$event'])
  // checkOffsetTop() {
  //   let clinicalOffset = this.clinicalRef ? this.clinicalRef.nativeElement.offsetTop : 0;
  //   let reviewsOffset = 0;
  //   if (this.reviewsRef) {
  //     reviewsOffset = this.reviewsRef.nativeElement.offsetTop - 500;
  //   }
  //   if (window.pageYOffset >= clinicalOffset && window.pageYOffset < reviewsOffset) {
  //     this.currentActive = 1;
  //   } else if (reviewsOffset > 0 && window.pageYOffset >= reviewsOffset) {
  //     this.currentActive = 2;
  //   } else {
  //     this.currentActive = 1;
  //   }
  // };


  @ViewChild('carouselForAppImage') carouselForAppImage: NgbCarousel
  @ViewChild('carouselForUseCaseImage') carouselForUseCaseImage: NgbCarousel

  constructor(private route: ActivatedRoute,
    private commonService: CommonService,
    private appDetailsService: ApplicationService,
    private authService: AuthenticationService,
    private dialogService: DialogService,
    private modalConfig: NgbModalConfig, private modalService: NgbModal,
    public carouselConfig: NgbCarouselConfig,
    private notificationService: NotificationService,
    public authenticationService: AuthenticationService,
    private router: Router,
    config: NgbRatingConfig) {
    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;
    modalConfig.size = "lg";
    config.max = 5;
    config.readonly = true;
    carouselConfig.keyboard = false;
    carouselConfig.pauseOnHover = false;
    carouselConfig.interval = 0;
    if (authService.isLoggedIn()) {
      this.isUserLoggedIn = true;
    }
  }

  ngOnInit(): void {
    this.userAcountName = this.authService.getCurrentUserName() + ", " + this.authService.getOrganizationName();
    // this.safeName = this.route.snapshot.paramMap.get('safe-name');
    this.fetchApplicationDetailsBySafeName();
  }

  fetchApplicationDetailsBySafeName() {
    this.isLoading = true;
    // this.appDetailsService.getApplicationDetailsFromSafeName(this.safeName, "true").subscribe((res) => {
    //   this.applicationDetails = res;

    if (this.applicationDetails && this.applicationDetails.appDetails &&
      this.applicationDetails.appDetails.customData
      && this.applicationDetails.appDetails.customData.countries &&
      this.applicationDetails.appDetails.customData.countries.length > 0) {
      this.appCountry = this.applicationDetails.appDetails.customData.countries[0];
    }
    // if (this.isUserLoggedIn) {
    //   this.listReviews();
    // }

    let ownership = this.applicationDetails.appDetails.ownership;
    if (ownership) {
      this.ownershipResponse = ownership;
    }

    this.getAppRequest(this.applicationDetails.appDetails.appId);

    this.route.queryParams.subscribe(params => {
      let type = params['type'];
      selectedSection = 'clinical'
      if (type) {
        var selectedSection = type;
      }
      var scrollTo = this.scrollTo;
      setTimeout(function () {
        scrollTo(selectedSection);
      }, 1000);
    });

    //this.commonService.scrollToFormInvalidField({ form: null, adjustSize: 60 });
    // var scroll = this.scrollTo;
    // var currentSection = this.currentSection;
    // setTimeout(function () {
    //   scroll(currentSection);
    // }, 1000);
    // }, (err) => {
    //   this.isLoading = false;
    // }, () => {
    //   // this.configMenu();
    // })
  }


  getSubscriptionStatus() {
    if (!this.isUserLoggedIn) {
      this.notSubscribed = true;
      return;
    }

    if (this.ownershipResponse) {
      if (this.ownershipResponse.ownershipStatus == 'active') {
        this.notSubscribed = false;
        this.subscribed = false;
        return;
      }
    }

    if (this.subscriptionStatus === 'NOT_REQUESTED') {
      this.notSubscribed = true;
      this.subscribed = false;
      return;
    } else {
      this.notSubscribed = false;
      this.subscribed = true;
      return;
    }

  }

  requestsubscription() {
    if (this.applicationDetails.appDetails.appId) {
      this.dialogService.showDialog("Request Subscription", "Are you sure you want to send a request for this app to your hospital administrator", "", "No", "Yes", (res) => {
        // console.log(res);
        // this.appDetailsService.saveAppRequest(this.applicationDetails.appDetails.appId).subscribe(res => {
        //   this.notificationService.showSuccess("Application subscription request sent successfully.");
        //   //this.getAppRequest(this.applicationDetails.appDetails.appId);
        //   this.subscriptionStatus = "REQUESTED"
        //   this.subscribed = true;
        //   this.notSubscribed = false;
        //   this.dialogService.modalService.dismissAll();
        // }, (err) => {

        // })
      });
    }
  }


  getAppRequest(appId: any) {
    console.log(this.authenticationService.isLoggedIn);
    if (appId && this.authenticationService.isLoggedIn()) {
      // this.appDetailsService.getAppRequest(appId).subscribe(res => {
      //   if (res.count > 0) {
      //     this.count = res.count;
      //     this.subscriptionStatus = "REQUESTED"
      //   } else {
      //     this.subscriptionStatus = "NOT_REQUESTED"
      //   }

      //   this.getSubscriptionStatus();
      //   this.isLoading = false;
      // }, (err) => {
      //   this.isLoading = false;
      // });
    } else {
      this.isLoading = false;
    }
  }

  getFdaCeStatus(fdaCeStatus) {
    let statusIcon = '';
    if (fdaCeStatus === 'Cleared') {
      statusIcon = 'assets/img/icon-approved.svg';
    } else if (fdaCeStatus === 'Pending') {
      statusIcon = 'assets/img/icon-in-review.svg';
    } else {
      statusIcon = 'assets/img/icon-not-approved.svg';
    }
    return statusIcon;
  }

  backToApplications() {
    history.back();
  }


  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  isAppOwner() {
    let isOwner = false;
    if (this.applicationDetails && this.applicationDetails.appDetails &&
      this.applicationDetails.appDetails.ownership)
      if (this.applicationDetails.appDetails.ownership.ownershipStatus === 'active' ||
        this.applicationDetails.appDetails.ownership.ownershipStatus === 'uninstalled') {
        isOwner = true;
      }
    return isOwner;
  }



  getReviewUser(appReview) {
    let reviewName = "";
    if (appReview.userAccount && appReview.userAccount.name) {
      reviewName += appReview.userAccount.name;
    }
    if (appReview.user && appReview.user.name) {
      reviewName += ", " + appReview.user.name;
    }
    if (appReview.status && appReview.status.value && appReview.status.value === 'pending') {
      reviewName += " (pending approval)";
    }
    return reviewName;
  }



  scrollTo(menu) {
    const docs = document.getElementsByName(menu);
    const documentYAxis = document.body.getBoundingClientRect().y;
    const invalidElementYAxis = docs.item(0).getBoundingClientRect().y;
    const yAxisDifference = invalidElementYAxis - documentYAxis;
    // window.scrollTo(0, (yAxisDifference-adjustSize));
    let adjustSize = 130;
    if (menu == 'reviews') {
      adjustSize = 20;
    }
    window.scroll({
      top: (yAxisDifference - adjustSize),
      left: 0,
      behavior: 'smooth'
    });
    this.currentSection = menu;
  }

  copiedToClipboard(appName, event) {
    event.stopPropagation();
    this.commonService.textCopyToClipboard(window.location.href);
    this.notificationService.showSuccess(appName.bold() + ' URL copied to clipboard', "Copied to clipboard");
  }

  onSlide1(slideEvent: NgbSlideEvent) {
    if (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT) {
      if (!slideEvent.paused) {
        this.carouselForAppImage.pause();
      }
    }
  }

  onSlide2(slideEvent: NgbSlideEvent) {
    if (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT) {
      if (!slideEvent.paused) {
        this.carouselForUseCaseImage.pause();
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }



}
