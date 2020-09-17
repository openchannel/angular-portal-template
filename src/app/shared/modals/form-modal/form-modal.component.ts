import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GraphqlService } from '../../../graphql-client/graphql-service/graphql.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss']
})
export class FormModalComponent implements OnInit, OnDestroy {
  /**
   * Object with all data for the form generation
   */
  @Input() formData: any;

  private subscriber: Subscription = new Subscription();

  constructor(private activeModal: NgbActiveModal,
              private graphQLService: GraphqlService) { }

  ngOnInit(): void {
  }

  sendFormData(formDataForSubmission) {
    const dataToServer = {
      name: '',
      appId: null,
      email: '',
      formData: formDataForSubmission
    };

    if (formDataForSubmission) {
      this.subscriber.add(this.graphQLService.createFormSubmission(this.formData?.formId, dataToServer).subscribe(
        result => {
          if (result?.errors.length > 0) {
            console.log(result?.errors);
          } else {
            this.activeModal.close();
          }
        }
      ));
    }
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }
}
