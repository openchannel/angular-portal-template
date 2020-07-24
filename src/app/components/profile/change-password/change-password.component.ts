import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { ChangePasswordModel } from 'src/app/shared/models/login-model';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/custom-components/notification/notification.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  
  changePasswordModel : ChangePasswordModel;
  confirmPassword: string;
  inProcess = false;
  constructor(private userService : UserService, private router : Router, private notificationService : NotificationService) { 
    this.changePasswordModel = new ChangePasswordModel();
  }

  ngOnInit(): void {
  }

  changePassword(changePasswordForm:NgForm) {
      if(!changePasswordForm.valid){      
        changePasswordForm.control.markAllAsTouched();
        return;
      }
      
      if(this.changePasswordModel.newPassword != this.confirmPassword) {
        this.notificationService.showError([{"message":"New password and confirm password does not match"}]);
        return;
      }

      this.changePasswordModel.email = localStorage.getItem('email')
      this.inProcess=true;
      this.userService.changePassword(this.changePasswordModel).subscribe((res) => {  
        this.inProcess=false;
        this.notificationService.showSuccess('Password updated successfully.');
        changePasswordForm.reset();
      },
      (err) => {
        this.inProcess=false;
      });
  }
}
