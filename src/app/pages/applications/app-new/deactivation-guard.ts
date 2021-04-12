import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {AppNewComponent} from './app-new.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {OcConfirmationModalComponent} from 'oc-ng-common-component';

@Injectable({providedIn: 'root'})
export class AppDataChangesGuard implements CanDeactivate<AppNewComponent> {
  constructor(private modal: NgbModal) {
  }

  canDeactivate(component: AppNewComponent,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot) {
    return component.isOutgoAllowed() ? true : this.openConfirmationModal();
  }

  openConfirmationModal(): Promise<any> {
    const modalRef = this.modal.open(OcConfirmationModalComponent, {size: 'md'});
    modalRef.componentInstance.modalTitle = 'Skip unsaved data';
    modalRef.componentInstance.modalText = 'Unsaved data detected. Want to exit?';
    modalRef.componentInstance.rejectButtonText = 'Cancel';
    modalRef.componentInstance.confirmButtonText = 'Agree';
    modalRef.componentInstance.confirmButtonType = 'primary';
    return modalRef.result.then(() => true, () => false);
  }
}
