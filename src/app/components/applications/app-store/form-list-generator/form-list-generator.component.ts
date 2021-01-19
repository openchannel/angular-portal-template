import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormModalComponent} from '../../../../shared/modals/form-modal/form-modal.component';
import {Subscription} from 'rxjs';
import {AppFormModel, AppFormService} from 'oc-ng-common-service';

@Component({
  selector: 'app-form-list-generator',
  templateUrl: './form-list-generator.component.html',
  styleUrls: ['./form-list-generator.component.scss']
})
export class FormListGeneratorComponent implements OnInit, OnDestroy {

  public formJSONArray: any[] = [];
  public expandTables: boolean[] = [];

  private subscriber: Subscription = new Subscription();

  private pageNumber = 1;
  private pageLimit = 100;

  constructor(private modalService: NgbModal,
              private appFormService: AppFormService) { }

  ngOnInit(): void {
    this.getAllFormsList();
    this.expandTables.fill(false);
  }

  getAllFormsList(): void {
    this.subscriber.add(this.appFormService.getForms(this.pageNumber, this.pageLimit).subscribe(
      (formResponse) => {
        if (formResponse?.list) {
          this.formJSONArray = formResponse.list;
        } else {
          this.formJSONArray = [];
        }
      }));
  }

  openFormModal(formFieldsData: AppFormModel): void {
    const modalRef = this.modalService.open(FormModalComponent, { size: 'lg' });
    modalRef.componentInstance.formData = formFieldsData;
  }

  changeActiveFormId(expand: boolean, index: number) {
    this.expandTables[index] = expand;
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }
}
