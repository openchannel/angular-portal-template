import { Component, OnInit } from '@angular/core';
import { UserActProfile } from 'src/app/shared/models/user-account';
import { UserService } from 'src/app/shared/services/user.service';
import { NotificationService } from 'src/app/shared/custom-components/notification/notification.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  userAct: UserActProfile;
  inProcess = false;
  isProcess = false;

  constructor(private userActProfileService: UserService,
    private notificationService: NotificationService,
    private loaderService: LoaderService) {
    this.userAct = new UserActProfile();
    this.fetchUserProfileInfo();
  }

  ngOnInit(): void {

  }

  fetchUserProfileInfo() {
    this.isProcess = true;
    // Manually manage loader here due to api call in this method is also used to get data after successful login 
    // this.loaderService.showLoader("1");
    this.userActProfileService.getUserProfile().subscribe(res => {
      // this.loaderService.closeLoader("1");
      this.userAct = res;
      this.isProcess = false;
    },
      (error) => {
        // this.notificationService.showError("Failed to load profile data.")
      })
  }

  /**
  *  Submit the user profile form and update user details
  * @param profileForm 
  */
  doSubmit(profileForm: NgForm) {

    if (!profileForm.valid) {
      profileForm.control.markAllAsTouched();
      return;
    }
    this.inProcess = true;
    this.userActProfileService.updateUserAccount(this.userAct).subscribe(res => {
      localStorage.setItem('firstName', this.userAct.firstName);
      localStorage.setItem('lastName', this.userAct.lastName);
      localStorage.setItem('email', this.userAct.email);
      this.userActProfileService.updateUserName(true);
      this.notificationService.showSuccess("Profile data updated successfully.");
      this.inProcess = false;
    },
      (error) => {
        this.inProcess = false;
      }
    );
  }


}
