import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormModalComponent } from '../../../../shared/modals/form-modal/form-modal.component';

@Component({
  selector: 'app-form-list-generator',
  templateUrl: './form-list-generator.component.html',
  styleUrls: ['./form-list-generator.component.scss']
})
export class FormListGeneratorComponent implements OnInit {

  formJSONArray: any[] = [{
    formId: 'test',
    name: 'test',
    createdDate: 1599982592157,
    fields: [
      {
        id: 'name',
        label: 'name',
        description: 'test',
        defaultValue: null,
        type: 'text',
        required: null,
        attributes: {
          maxChars: 20,
          required: true,
          minChars: null
        },
        options: null,
        subFieldDefinitions: null
      },
      {
        id: 'role',
        label: 'role',
        description: '',
        defaultValue: null,
        type: 'dropdownList',
        required: null,
        attributes: {required: true},
        options: ['admin', 'user', 'test'],
        subFieldDefinitions: null
      },
      {
        id: 'aboutme',
        label: 'aboutme',
        description: '',
        defaultValue: null,
        type: 'richText',
        required: null,
        attributes: {
          maxChars: 150,
          required: null,
          minChars: 10
        },
        options: null,
        subFieldDefinitions: null
      },
      {
        id: 'skills',
        label: 'skills',
        description: 'skills',
        defaultValue: ['angular'],
        type: 'tags',
        required: null,
        attributes: {
          minCount: 1,
          maxCount: 5,
          required: true
        }, options: null,
        subFieldDefinitions: null
      }]
  },
  {
    formId: 'test2',
    name: 'Test 2',
    createdDate: 1599982592157,
    fields: [
      {
        id: 'name',
        label: 'Your Name',
        description: 'test',
        defaultValue: null,
        type: 'text',
        required: null,
        attributes: {
          maxChars: 20,
          required: true,
          minChars: 5
        },
        options: null,
        subFieldDefinitions: null
      },
      {
        id: 'animal',
        label: 'Your Favorite Animal',
        description: '',
        defaultValue: null,
        type: 'dropdownList',
        required: null,
        attributes: {required: true},
        options: ['Cat', 'Dog', 'Rabbit', 'Parrot'],
        subFieldDefinitions: null
      },
      {
        id: 'likes',
        label: 'What meal do you like?',
        description: 'Add your favorite meal',
        defaultValue: ['pizza', 'fried potato'],
        type: 'tags',
        required: null,
        attributes: {
          minCount: null,
          maxCount: 5,
          required: null
        }, options: null,
        subFieldDefinitions: null
      },
      {
        id: 'aboutme',
        label: 'About Me',
        description: '',
        defaultValue: null,
        type: 'richText',
        required: null,
        attributes: {
          maxChars: 150,
          required: null,
          minChars: 10
        },
        options: null,
        subFieldDefinitions: null
      }]
  }];

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openFormModal(formFieldsData: any) {
    const modalRef = this.modalService.open(FormModalComponent, { size: 'lg' });
    modalRef.componentInstance.formData = formFieldsData;
  }
}
