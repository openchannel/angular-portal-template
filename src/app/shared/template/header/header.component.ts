import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedInUser: string = '';
  searchText: string = '';
  isMenuCollapsed: boolean;
  isDropdwonCollapsed: boolean;
  isCollapsed: boolean;
  isSearch = false;

  constructor(public router: Router,
    private route: ActivatedRoute,
    public authenticationService: AuthenticationService,
    private userService: UserService, appService: ApplicationService
  ) {
    this.loggedInUser = this.getUsername();
    appService.textFilterRemoved$.subscribe(
      text => {
        this.searchText = '';
      });


    userService.userUpdate$.subscribe(
      res => {
        this.loggedInUser = this.getUsername();
      }
    );
  }



  ngOnInit() {
    this.isMenuCollapsed = true;
    this.isDropdwonCollapsed = true;
    this.isCollapsed = true;
    // if (this.router.url.includes('applications') && !this.router.url.includes('searchText')) {
    //   this.searchText = '';
    // }
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  toggleDropdown(): void {
    this.isDropdwonCollapsed = !this.isDropdwonCollapsed;
  }

  goToHomePage($event): void {
    this.router.navigate(['/']);
  }

  goToLoginPage($event): void {
    console.log("Event" + $event);
    if ($event.srcElement && $event.srcElement.id == "navbarDropdownCaret") {
      return;
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    this.authenticationService.isLoggedIn();
  }

  getUsername() {
    return this.userService.getUserFullName();
  }

  register() {
    this.isDropdwonCollapsed = true;
    this.router.navigate(['/account-request']);
  }

  logout() {
    this.userService.logOut().subscribe(res => {
      localStorage.clear();
      this.router.navigate(['/']);
    },
      (error) => {
      }
    )
  }

  searchApp(value: string) {

    var o = {};
    if (this.router.url.includes('applications') && this.route.snapshot.queryParams['query']) {
      o['query'] = this.route.snapshot.queryParams['query'];
    }
    if (this.router.url.includes('applications') && this.route.snapshot.queryParams['sort']) {
      o['sort'] = this.route.snapshot.queryParams['sort'];
    }
    o['searchText'] = value;

    // if (this.searchText) {
    //   if (this.router.url.includes('applications') && this.route.snapshot.queryParams['query']) {
    //     this.router.navigate(['/applications'], { queryParams: { query: this.route.snapshot.queryParams['query'], searchText: value } });
    //   } else {
    //     this.router.navigate(['/applications'], { queryParams: { searchText: value } });
    //   }
    // } else {
    //   if (this.router.url.includes('applications') && this.route.snapshot.queryParams['query']) {
    //     this.router.navigate(['/applications'], { queryParams: { query: this.route.snapshot.queryParams['query'] } });
    //   } else {
    //     this.router.navigate(['/applications']);
    //   }
    // }
    this.router.navigate(['/applications'], { queryParams: o });
  }

}
