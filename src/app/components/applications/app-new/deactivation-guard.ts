import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {AppNewComponent} from './app-new.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationModalComponent} from '../../../shared/modals/confirmation-modal/confirmation-modal.component';

@Injectable()
export class AppDataChangesGuard implements CanDeactivate<AppNewComponent> {
  constructor(private modal: NgbModal) {
  }

  canDeactivate(component: AppNewComponent,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot) {
    return component.isOutgoAllowed() ? true : this.openConfirmationModal();
  }

  openConfirmationModal(): Promise<any> {
    const modalRef = this.modal.open(ConfirmationModalComponent);

    modalRef.componentInstance.modalTitle = 'Skip unsaved data';
    modalRef.componentInstance.modalText = 'Unsaved data detected. Want to exit?';
    modalRef.componentInstance.type = 'submission';
    modalRef.componentInstance.buttonText = 'Agree';
    modalRef.componentInstance.cancelButtonText = 'Cancel';

    return modalRef.result;
  }
}
