import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { signupModel } from 'src/app/shared/models/signup-model';
import { SignupService } from 'src/app/shared/services/signup.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  inProcess: boolean;
  isFormShow: boolean;
  token: string;
  isLoading: boolean;
  usersList;
  closeResult = '';
  accountDetails = new signupModel();

  @ViewChild("usersModal") usersModal: ElementRef;

  constructor(private signupService: SignupService,
    private router : Router,
    private modalService: NgbModal,
    config: NgbModalConfig) { 
      config.backdrop = 'static';
      config.keyboard = false;
  }
    

  ngOnInit(): void {
  }

  signUp(regForm){
    if (!regForm.valid) {
      regForm.control.markAllAsTouched();
      return;
    }
    this.inProcess=true;
    this.signupService.validateAndRetrieveAllUsers(this.accountDetails.email).subscribe((res) => {
      if(res.users ){
        if(res.users.list.length === 1){
          this.accountDetails.userId=res.users.list[0].userId;
          this.submitRegistrationDetails();
        }else{
          this.accountDetails.userId = null;
          this.usersList = res.users.list;
          this.modalService.open(this.usersModal);          
          this.inProcess=false;
        }
      }
    }, (res)=>{
      this.inProcess=false;
    });
  }

  submitRegistrationDetails(){
    this.inProcess=true;
    // console.log("Final Req : "+JSON.stringify(this.accountDetails));
    this.signupService.registerAccount(this.accountDetails).subscribe((res)=>{
      this.inProcess=false;
      this.router.navigate(['/account-request-feedback']);
    },(err)=>{
     this.inProcess=false; 
    },()=>{
      this.inProcess=false; 
     });
  }


}
