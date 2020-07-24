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
  public showDialog(title: string, text: string, textVariable: string, cancelButtonText: string, confirmButtonText: string,
    confirmCallback?: any, cancelCallback?: any) {

    const modalRef = this.modalService.open(DialogComponent, { size: 'lg', backdrop: 'static' });
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

  openModalRef(component: Component, model, view: ViewMode,
    confirmCallback?: any, cancelCallback?: any): NgbModalRef {
    const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.priceModelWrapper = model;
    modalRef.componentInstance.viewMode = view;
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

  openAddonModal(component: Component, model, addonSafeName, addonDisplayName, addons, subscribeStatus?, parentAppId?,
    confirmCallback?: any, cancelCallback?: any): NgbModalRef {
    const modalRef = this.modalService.open(component, { size: 'lg addon-modal-dialog', backdrop: 'static' });
    if (model) {
      modalRef.componentInstance.ispAppModel = model;
    }

    modalRef.componentInstance.addonSafeName = addonSafeName;
    modalRef.componentInstance.addonDisplayName = addonDisplayName;
    modalRef.componentInstance.addons = addons;
    modalRef.componentInstance.subscribeStatus = subscribeStatus;
    modalRef.componentInstance.parentAppId = parentAppId;
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

  openSubscriptionRequestDialog(appName: string, appId: string, addOnApps: [], sendRequestCallback?: any, cancelCallback?: any) {
    // const modalRef = this.modalService.open(IspApplicationAddonComponent, { size: 'lg', backdrop: 'static' });
    // modalRef.componentInstance.appName = appName;
    // modalRef.componentInstance.appId = appId;
    // modalRef.componentInstance.addOns = addOnApps;
    // modalRef.componentInstance.sendRequestCallback = sendRequestCallback;
    // if (cancelCallback) {
    //   modalRef.componentInstance.cancelCallback = cancelCallback;
    // } else {
    //   modalRef.componentInstance.cancelCallback = function () {
    //     modalRef.close(false);
    //   }
   // }
  }

}
