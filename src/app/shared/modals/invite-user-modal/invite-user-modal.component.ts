import { Component, Input, OnInit } from '@angular/core';
import { DeveloperTypeService, InviteUserModel } from 'oc-ng-common-service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-invite-user-modal',
  templateUrl: './invite-user-modal.component.html',
  styleUrls: ['./invite-user-modal.component.scss']
})
export class InviteUserModalComponent implements OnInit {

  /** Title of the modal */
  @Input() modalTitle: string = 'Invite a member';
  /** If you want to edit user - you should set user data */
  @Input() userData: InviteUserModel;
  /** Text of the success button */
  @Input() successButtonText: string = 'Send Invite';
  /** Id of the inviter */
  @Input() developerId: string;

  // config for custom form generation
  public formConfig: any = {};
  // array of developer types id
  public userTypes: string [] = [];
  // custom form validity
  public formInvalid: boolean = true;
  // data from custom form
  public formData: InviteUserModel;

  constructor(private developerTypeService: DeveloperTypeService,
              private modalService: NgbActiveModal) { }

  ngOnInit(): void {
    this.makeFormConfig();
    this.getUserType();
  }

  closeAction(action: 'success' | 'cancel') {
    this.modalService.close(action);
  }

  makeFormConfig() {
    this.formConfig.fields = [
      {
        id: 'name',
        label: 'Name',
        description: '',
        placeholder: 'Enter Name',
        defaultValue: null,
        type: 'text',
        required: null,
        attributes: {
          maxChars: null,
          required: true,
          minChars: null
        },
        options: null,
        subFieldDefinitions: null
      },
      {
        id: 'email',
        label: 'Email',
        description: '',
        placeholder: 'Email',
        defaultValue: null,
        type: 'emailAddress',
        required: null,
        attributes: {
          maxChars: null,
          required: true,
          minChars: null
        },
        options: null,
        subFieldDefinitions: null
      },
      {
        id: 'type',
        label: 'Select Role',
        description: '',
        defaultValue: '',
        type: 'dropdownList',
        required: null,
        attributes: {required: true},
        options: [],
        subFieldDefinitions: null
      }
    ];
    if (this.userData) {
      this.formConfig.fields.forEach(field => {
        field.defaultValue = this.userData[field.id];
      });
    }
  }

  getUserType() {
    this.developerTypeService.getAllDeveloperTypes(1, 50).subscribe(
      result => {
        if (result.list && result.list.length > 0) {
          result.list.forEach(type => {
            this.userTypes.push(type.developerTypeId);
          });

          this.formConfig.fields.find(field => field.id === 'type').options = [...this.userTypes];
          if (!this.userData) {
            this.formConfig.fields.find(field => field.id === 'type').defaultValue = this.userTypes[0];
          }
        } else {
          this.closeAction('cancel');
        }
      }, () => {
        this.closeAction('cancel');
      }
    );
  }

  getFormStatus(status) {
    this.formInvalid = status;
  }

  getDataFromForm(data) {
    this.formData = data;
  }

  sendInvite() {

  }
}
