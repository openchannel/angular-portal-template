import { Component, OnInit, forwardRef, Inject, Injectable, OnDestroy, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
 
})
export class DialogComponent implements OnInit {

   
  @Input() title: string;
  @Input() text: string;
  @Input() textVariable:string;
  @Input() cancelButtonText: string;
  @Input() confirmButtonText: string;
  inProcess: boolean;
  confirmCallback: any; 
  cancelCallback: any; 
  
  constructor(public dialog:NgbActiveModal){}

  ngOnInit(): void {
   
      
  }

  dismiss(){
      this.dialog.dismiss();      
  }

  cancel(){
   this.inProcess = false;
   this.cancelCallback('cancel');
  }

  confirm(){
    this.inProcess = true;
    this.confirmCallback('confirm');
    //this.dialog.close();
  }

}
