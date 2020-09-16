import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss']
})
export class FormModalComponent implements OnInit {

  @Input() formData: any;
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  sendFormData(formDataForSubmission) {
    console.log(formDataForSubmission);
    this.activeModal.close();
  }
}
