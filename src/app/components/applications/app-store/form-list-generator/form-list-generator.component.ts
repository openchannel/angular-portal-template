import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormModalComponent } from '../../../../shared/modals/form-modal/form-modal.component';
import { GraphqlService } from '../../../../graphql-client/graphql-service/graphql.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-list-generator',
  templateUrl: './form-list-generator.component.html',
  styleUrls: ['./form-list-generator.component.scss']
})
export class FormListGeneratorComponent implements OnInit, OnDestroy {

  public formJSONArray: any[] = [];

  private subscriber: Subscription = new Subscription();

  constructor(private modalService: NgbModal,
              private graphQLService: GraphqlService) { }

  ngOnInit(): void {
    this.getAllFormsList();
  }

  getAllFormsList(): void {
    this.subscriber.add(this.graphQLService.getAllForms('list').subscribe(
      (result: any) => {
        console.log(result);
      }
    ));
  }

  openFormModal(formFieldsData: any): void {
    const modalRef = this.modalService.open(FormModalComponent, { size: 'lg' });
    modalRef.componentInstance.formData = formFieldsData;
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }
}
