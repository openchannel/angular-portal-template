import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './app-confirmation-modal.component.html',
  styleUrls: ['./app-confirmation-modal.component.scss']
})
export class AppConfirmationModalComponent {

  /** Title at the top of the modal */
  @Input() modalTitle: string = '';
  /**
   * Main text of the modal. Confirmation text
   */
  @Input() modalText: string = '';
  /**
   * Type of confirmation modal
   * can be 'submission', 'suspend', 'delete' or 'simple'.
   * Design of the modal will be changed according to type.
   * When a 'submission' type set - modal Cancel button will return 'draft' value.
   * And 'simple' will show simple confirmation modal
   * Default 'simple'
   */
  @Input() type: 'submission' | 'simple' | 'suspend' | 'delete'  = 'simple';
  /**
   * Text on the Confirm button
   * Default value: OK
   */
  @Input() buttonText: string = 'OK';
  /**
   * Show or hide cancel button
   * Default: true
   */
  @Input() showCancel: boolean = true;
  /**
   * Custom text for the Cancel button
   */
  @Input() cancelButtonText: string = 'No, cancel';

  constructor(private modalService: NgbActiveModal) { }

  closeAction(action: 'success' | 'cancel' | 'draft') {
    this.modalService.close(action);
  }
}
