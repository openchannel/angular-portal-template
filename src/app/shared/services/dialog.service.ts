import { DialogComponent } from '../custom-components/dialog/dialog.component';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Injectable, OnInit, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

export type ViewMode = 'deployee' | 'subscribe';
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  ngbModalRef: NgbModalRef;

  constructor(public modalService: NgbModal, config: NgbModalConfig, public router: Router) {
    config.backdrop = 'static';
    config.keyboard = true;
  }

  /**
   * This method is responsible for open dialog box based as per provided param details
   * @param title 
   * @param text 
   * @param textVariable 
   * @param cancelButtonText 
   * @param confirmButtonText 
   */
  public showDialog(component: Component, title: string, text: string, textVariable: string, cancelButtonText: string, confirmButtonText: string,
    confirmCallback?: any, cancelCallback?: any) {

    const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.text = text;
    modalRef.componentInstance.textVariable = textVariable;
    modalRef.componentInstance.cancelButtonText = cancelButtonText;
    modalRef.componentInstance.confirmButtonText = confirmButtonText;
    modalRef.componentInstance.confirmCallback = confirmCallback;
    if (cancelCallback) {
      modalRef.componentInstance.cancelCallback = cancelCallback;
    } else {
      modalRef.componentInstance.cancelCallback = function () {
        modalRef.close(false);
      }
    }
    return modalRef;
  }

}
