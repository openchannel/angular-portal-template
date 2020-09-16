import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GraphqlService } from '../../../graphql-client/graphql-service/graphql.service';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss']
})
export class FormModalComponent implements OnInit {

  @Input() formData: any;
  constructor(private activeModal: NgbActiveModal,
              private graphQLService: GraphqlService) { }

  ngOnInit(): void {
  }

  sendFormData(formDataForSubmission) {
    // const dataToServer = {
    //     name: '',
    // };

    if (formDataForSubmission) {
      this.graphQLService.createFormSubmission(this.formData?.formId, formDataForSubmission).subscribe(
        result => {
          if (result?.errors) {
            console.log(result?.errors);
          } else {
            this.activeModal.close();
          }
        }
      );
    }
  }
}
