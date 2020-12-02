import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DeveloperTypeService, InviteUserModel, InviteUserService } from 'oc-ng-common-service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invite-user-modal',
  templateUrl: './invite-user-modal.component.html',
  styleUrls: ['./invite-user-modal.component.scss']
})
export class InviteUserModalComponent implements OnInit, OnDestroy {

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

  private subscriber: Subscription = new Subscription();

  constructor(private developerTypeService: DeveloperTypeService,
              private modalService: NgbActiveModal,
              private inviteService: InviteUserService) { }

  ngOnInit(): void {
    this.makeFormConfig();
    this.getUserType();
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  closeAction(action: 'success' | 'cancel') {
    const modalData = {
      status: action,
      userData: action === 'success' ? this.formData : null
    };
    this.modalService.close(modalData);
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
    this.formInvalid = true;
    if (this.userData) {
      // todo edit user request
    } else {
      const templateId = '5fc663f2217876017548dc25';
      this.inviteService.sendDeveloperInvite(this.formData.email, this.formData.name, this.developerId, templateId)
        .subscribe(response => {
          this.formInvalid = false;
          this.closeAction('success');
        }, () => { this.formInvalid = false; });
    }
  }
}
