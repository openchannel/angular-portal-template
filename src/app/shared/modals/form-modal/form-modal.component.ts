import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {GraphqlService} from '../../../graphql-client/graphql-service/graphql.service';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AppFormModel, AppFormService} from 'oc-ng-common-service';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss']
})
export class FormModalComponent implements OnInit, OnDestroy {
  /**
   * Object with all data for the form generation
   */
  @Input() formData: AppFormModel;

  private subscriber: Subscription = new Subscription();
  public submissionDetailsForm: FormGroup;

  constructor(private activeModal: NgbActiveModal,
              private graphQLService: GraphqlService,
              private appFormService: AppFormService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initSubmissionDetailsForm();
  }

  initSubmissionDetailsForm(): void {
    this.submissionDetailsForm = this.fb.group({
      name: [''],
      appId: [null],
      userId: [null],
      email: [''],
    });
  }

  sendFormData(formDataForSubmission): void {
    const dataToServer = this.submissionDetailsForm.getRawValue();
    if (formDataForSubmission) {
      dataToServer.formData = formDataForSubmission;
      this.subscriber.add(this.appFormService.createFormSubmission(this.formData?.formId, dataToServer).subscribe(submissionResponse => {
            this.activeModal.close();
          }, error => console.error('createFormSubmission', dataToServer, error)
      ));
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }
}
