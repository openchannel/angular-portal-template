import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldType, FiledAttributes } from '../../../core/services/apps-services/model/apps-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-field-modal',
  templateUrl: './add-field-modal.component.html',
  styleUrls: ['./add-field-modal.component.scss']
})
export class AddFieldModalComponent implements OnInit, OnDestroy {

  /** What action this modal do. Can be 'Add' or 'Edit' */
  @Input() action: 'Add' | 'Edit' = 'Add';
  /** Field previous data for editing */
  @Input() fieldData: any;

  public fieldForm: FormGroup;
  public allTypes: string [] = [];
  public optionsForTags: string[] = [];
  /** Data from options modal */
  private attributesData: FiledAttributes;
  private formSubscription: Subscription = new Subscription();
  constructor(private activeModal: NgbActiveModal,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.fillTypesArray();
    if (this.fieldData) {
      this.fillFieldForm();
    } else {
      this.initFieldForm();
    }
  }

  closeModalWithResult(status: 'success' | 'cancel') {
    const modalData = {
      status,
      fieldData: this.fieldData
    };

    this.activeModal.close(modalData);
  }

  getOptionsValue(options) {
    this.attributesData = options;
  }

  initFieldForm(): void {
    this.fieldForm = this.fb.group({
      label: ['', Validators.required],
      id: ['', Validators.required],
      description: [''],
      type: [FieldType.text, Validators.required],
      category: ['CUSTOM'],
      deleteable: [false],
      defaultValue: [''],
      placeholder: ['']
    });
    this.formSubscription.add(this.fieldForm.get('label').valueChanges
      .subscribe(value => {
        let updatedValue = value;
        updatedValue = updatedValue.trim().toLowerCase().replace(/\s+/g, '-');
        this.fieldForm.get('id').setValue(updatedValue);
      }));
  }

  fillFieldForm(): void {
    this.fieldForm = this.fb.group({
      label: [this.fieldData.label, Validators.required],
      id: [this.fieldData.id, Validators.required],
      description: [this.fieldData.description],
      type: [this.fieldData.type, Validators.required],
      category: [this.fieldData.category],
      deleteable: [this.fieldData.deletable],
      defaultValue: [this.fieldData.defaultValue],
      placeholder: [this.fieldData.placeholder]
    });
    this.fieldForm.get('id').disable({onlySelf: true});
    this.attributesData = this.fieldData.attributes;
  }

  fillTypesArray() {
    Object.keys(FieldType).forEach(key => {
      this.allTypes.push(FieldType[key]);
    });
  }

  closeAction(action: 'success' | 'cancel') {
    const modalData = {
      status: action,
      fieldData: null
    };
    if (action === 'success') {
      const fieldNewData = this.fieldForm.getRawValue();
      fieldNewData.attributes = this.attributesData;
      if (fieldNewData.type === 'tags') {
        fieldNewData.options = this.optionsForTags;
      }
      modalData.fieldData = fieldNewData;
      this.activeModal.close(modalData);
    } else {
      this.activeModal.close(modalData);
    }
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }
}
