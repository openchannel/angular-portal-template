import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent  {

  /**
   * Main text of the modal. Confirmation text
   */
  @Input() modalText: string = '';
  /**
   * Type of confirmation modal
   * can be 'submission' or 'simple'
   * 'submission' type transform modal to the
   * App Submission modal
   * And 'simple' will show simple confirmation modal
   * Default 'simple'
   */
  @Input() type: 'submission' | 'simple'  = 'simple';
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
  constructor(private modalService: NgbActiveModal) { }

  closeAction(action: 'success' | 'cancel' | 'draft') {
    this.modalService.close(action);
  }
}
