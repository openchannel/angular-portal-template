import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {GraphqlService} from '../../../../../graphql-client/graphql-service/graphql.service';
import {Subscription} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SubmissionsDataViewModalComponent} from '../../../../../shared/modals/submissions-data-view-modal/submissions-data-view-modal.component';
import {AppFormService, FormSubmissionModel} from 'oc-ng-common-service';

@Component({
  selector: 'app-submissions-table',
  templateUrl: './submissions-table.component.html',
  styleUrls: ['./submissions-table.component.scss']
})
export class SubmissionsTableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() formId: string;
  @Input() expand: boolean = false;
  public submissionsData: FormSubmissionModel[] = [];
  public pageNum = 1;
  public pageCount = 50;

  private subscriber: Subscription = new Subscription();

  constructor(private graphQLService: GraphqlService,
              private appFormService: AppFormService,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.expand.currentValue) {
      this.getSubmissions();
    }
  }

  getSubmissions() {
    this.subscriber.add(this.appFormService.getFormSubmissions(this.formId, this.pageNum, 50)
    .subscribe(submissionsResponse => {
          if (submissionsResponse?.list) {
            this.submissionsData = submissionsResponse.list;
            this.pageCount = submissionsResponse.pages;
          } else {
            this.submissionsData = [];
            this.pageCount = 1;
          }
        }, error => console.error('getSubmissions', error)
    ));
  }

  trackBySubmId(index: number, submission: any): string {
    return submission.formSubmissionId;
  }

  openSubmissionModal(submissionId: string): void {
    const modalRef = this.modalService.open(SubmissionsDataViewModalComponent, {size: 'lg'});
    modalRef.componentInstance.formId = this.formId;
    modalRef.componentInstance.submissionId = submissionId;
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }
}
