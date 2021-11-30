import { from, Observable, of } from 'rxjs';
import { OcConfirmationModalComponent, ConfirmationModalButton } from '@openchannel/angular-common-components/src/lib/common-components';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError } from 'rxjs/operators';

export type SubmitAppModalResult = 'draft' | 'submit';

/**
 * Will be injected to module {@link AppManageModule}
 */
export class AppManageModalService {
    constructor(private modal: NgbModal) {}

    openSubmitModal(showButtonSaveAsDraft: boolean): Observable<SubmitAppModalResult> {
        const modalRefSecond = this.modal.open(OcConfirmationModalComponent, { size: 'md' });
        const modalData = modalRefSecond.componentInstance as OcConfirmationModalComponent;
        modalData.modalTitle = 'Submit app';
        modalData.modalTitleHeadingTag = 'h4';
        modalData.modalText = 'Submit this app to the marketplace now?';
        modalData.customButtons = this.getSubmitModalButtons(showButtonSaveAsDraft);
        return this.catchRejectModalStatus(modalRefSecond.result);
    }

    private getSubmitModalButtons(showButtonSaveAsDraft: boolean): ConfirmationModalButton[] {
        const buttons: (ConfirmationModalButton & { id: SubmitAppModalResult })[] = [];

        if (showButtonSaveAsDraft) {
            buttons.push({
                type: 'secondary',
                id: 'draft',
                text: 'Save as draft',
            });
        }

        buttons.push({
            type: 'primary',
            id: 'submit',
            text: 'Yes, submit it',
        });
        return buttons;
    }

    /**
     * Map modal reject status to the empty Observable
     */
    private catchRejectModalStatus(modalResult: Promise<any>): Observable<any> {
        return from(modalResult).pipe(catchError(rejectedModalValue => of()));
    }
}
