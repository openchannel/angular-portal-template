import { Component, OnInit, Input } from '@angular/core';
import { SellerMyProfile } from 'oc-ng-common-service'

@Component({
  selector: 'app-general-profile',
  templateUrl: './general-profile.component.html',
  styleUrls: ['./general-profile.component.scss']
})
export class GeneralProfileComponent implements OnInit {

  @Input() myProfile : SellerMyProfile = new SellerMyProfile();
  constructor() { }

  ngOnInit(): void {
  }
  
  saveGeneralProdile(myProfileform){
    
  }
}
