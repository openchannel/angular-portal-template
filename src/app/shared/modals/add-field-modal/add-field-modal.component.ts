import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-field-modal',
  templateUrl: './add-field-modal.component.html',
  styleUrls: ['./add-field-modal.component.scss']
})
export class AddFieldModalComponent implements OnInit {

  @Input() action: string = 'Add';
  @Input() fieldData: any;

  public fieldForm: FormGroup;
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  closeModalWithResult(status: 'success' | 'cancel') {
    const modalData = {
      status,
      fieldData: this.fieldData
    };

    this.activeModal.close(modalData);
  }

  getOptionsValue(options) {
    this.fieldData.options = options;
  }
}
