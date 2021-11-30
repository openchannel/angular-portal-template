import { from, Observable, of } from 'rxjs';
import { OcConfirmationModalComponent, ConfirmationModalButton } from '@openchannel/angular-common-components/src/lib/common-components';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { catchError, filter } from 'rxjs/operators';

type LocalButtonType = 'draft' | 'submit' | 'cancel';
type LocalConfirmationModalButton = ConfirmationModalButton & { id: LocalButtonType };

export type AppManageModalResult = Exclude<LocalButtonType, 'cancel'>;

/**
 * Will be injected to module {@link AppManageModule}
 */
export class AppManageModalService {
    constructor(private modal: NgbModal) {}

    /**
     * Modal buttons:<br>
     * 1. (optional) 'Save as draft', modal return value: 'draft'.<br>
     * 2. (always)   'Yes, submit it', modal return value: 'submit'.<br>
     *
     * Note: Reject and cancel modal statuses will be converted to the empty observable.
     */
    openModalWithDraftAndSubmitButtons(showButtonSaveAsDraft: boolean): Observable<AppManageModalResult> {
        const buttons: LocalConfirmationModalButton[] = [];
        if (showButtonSaveAsDraft) {
            buttons.push(this.getSaveAsDraftButton());
        }
        buttons.push(this.getSubmitButton());

        const modalRef = this.createAppSubmitModalRef(buttons);
        return this.catchCancelModalStatus(modalRef.result);
    }

    /**
     * Modal buttons:<br>
     * 1. (optional) 'No, cancel', modal return value: 'cancel'.<br>
     * 2. (always)   'Yes, submit it', modal return value: 'submit'.<br>
     *
     * Note: Reject and cancel modal statuses will be converted to the empty observable.
     */
    openModalWithCancelAndSubmitButtons(): Observable<AppManageModalResult> {
        const buttons: LocalConfirmationModalButton[] = [this.getCancelButton(), this.getSubmitButton()];
        const modalRef = this.createAppSubmitModalRef(buttons);
        return this.catchCancelModalStatus(modalRef.result);
    }

    private createAppSubmitModalRef(buttons: LocalConfirmationModalButton[]): NgbModalRef {
        const modalRef = this.modal.open(OcConfirmationModalComponent, { size: 'md' });
        const modalData = modalRef.componentInstance as OcConfirmationModalComponent;
        modalData.modalTitle = 'Submit app';
        modalData.modalTitleHeadingTag = 'h4';
        modalData.modalText = 'Submit this app to the marketplace now?';
        modalData.customButtons = buttons;
        return modalRef;
    }

    /**
     * Map modal reject and cancel status to the empty Observable
     */
    private catchCancelModalStatus(modalResult: Promise<any>): Observable<any> {
        return from(modalResult).pipe(
            catchError(rejectedModalValue => of()),
            filter((status: LocalButtonType) => status !== 'cancel'),
        );
    }

    private getSaveAsDraftButton(): LocalConfirmationModalButton {
        return {
            type: 'secondary',
            id: 'draft',
            text: 'Save as draft',
        };
    }

    private getSubmitButton(): LocalConfirmationModalButton {
        return {
            type: 'primary',
            id: 'submit',
            text: 'Yes, submit it',
        };
    }

    private getCancelButton(): LocalConfirmationModalButton {
        return {
            type: 'secondary',
            id: 'cancel',
            text: 'No, cancel',
        };
    }
}
