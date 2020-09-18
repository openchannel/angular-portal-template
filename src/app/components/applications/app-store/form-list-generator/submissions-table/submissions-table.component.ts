import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { GraphqlService } from '../../../../../graphql-client/graphql-service/graphql.service';
import { Subscription } from 'rxjs';

export interface SubmissionPreview {
  formSubmissionId: string;
  formId: string;
  submittedDateTime: string;
  submittedDate: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-submissions-table',
  templateUrl: './submissions-table.component.html',
  styleUrls: ['./submissions-table.component.scss']
})
export class SubmissionsTableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() formId: string;
  @Input() expand: boolean = false;
  public submissionsData: SubmissionPreview[] = [];
  public pageNum: number = 1;
  public pageCount: number;

  private subscriber: Subscription = new Subscription();
  constructor(private graphQLService: GraphqlService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.expand.currentValue) {
      this.getSubmissions();
    }
  }

  getSubmissions() {
    this.subscriber.add(this.graphQLService
      .getAllFormSubmissions(this.formId, this.pageNum, 50, 'submittedDate', 'ASC')
      .subscribe(res => {
          this.submissionsData = res.data.getAllFormSubmissions.list;
          this.pageCount = res.data.getAllFormSubmissions.pages;
        }
      ));
  }

  trackBySubmId(index: number, submission: any): string {
    return submission.formSubmissionId;
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }
}
