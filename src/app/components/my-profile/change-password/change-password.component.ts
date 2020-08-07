import { Component, OnInit, Input } from '@angular/core';
import { ChnagePasswordModel } from 'oc-ng-common-service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  @Input() changePassModel : ChnagePasswordModel = new ChnagePasswordModel();
  confirmPasswordTxt:string='';
  constructor() { }

  ngOnInit(): void {
  }

  changePassword(changePasswordform){
    if(changePasswordform.valid){
      
    }
  }
}
