import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer} from '@angular/platform-browser';
import {Subscription} from 'rxjs';
import {AppFormService, FormSubmissionModel} from 'oc-ng-common-service';

@Component({
  selector: 'app-submissions-data-view-modal',
  templateUrl: './submissions-data-view-modal.component.html',
  styleUrls: ['./submissions-data-view-modal.component.scss']
})
export class SubmissionsDataViewModalComponent implements OnInit {

  @Input() formId: string;
  @Input() submissionId: string;

  public submissionData: FormSubmissionModel;

  private subscriber: Subscription = new Subscription();

  constructor(private activeModal: NgbActiveModal,
              private appFormService: AppFormService,
              public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getSubmissionDetails();
  }

  getSubmissionDetails() {
    this.subscriber.add(this.appFormService.getOneFormSubmission(this.formId, this.submissionId)
      .subscribe(submissionResponse => {
        this.submissionData = submissionResponse;
      }));

  }

  checkForSpecialData(value): 'array' | 'html' | 'string' {
    if (Array.isArray(value)) {
      return 'array';
    } else if (value.includes('</')) {
      return 'html';
    } else {
      return 'string';
    }
  }

  closeModal() {
    this.subscriber.unsubscribe();
    this.activeModal.close();
  }
}
