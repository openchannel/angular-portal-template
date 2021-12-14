import { Injectable } from '@angular/core';
import { AppFormField, DropdownAdditionalField, DropdownField, DropdownFormField } from '@openchannel/angular-common-components';
import { AppVersionResponse } from '@openchannel/angular-common-services';
import { AppModelResponse } from '@openchannel/angular-common-services/lib/model/api/app-data-model';
import { cloneDeep } from 'lodash';
import { Subject } from 'rxjs';

export type PricingFormType = 'free' | 'single' | 'recurring';

export interface PricingFormConfig {
    /**
     * Will inject pricing form to your App on the create app page
     */
    enablePricingForm: boolean;
    /**
     * false - single pricing form.<br>
     * true - multi pricing form as DFA array.
     */
    enableMultiPricingForms: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class PricingFormService {
    private readonly GROUP_ID = 'model';
    setDFAItemsEditMode: Subject<number[]> = new Subject<number[]>();
    updateDFAItems: Subject<number[]> = new Subject<number[]>();

    injectPricingFormToAppFields(
        enableMultiPricingForms: boolean,
        formFields: AppFormField[],
        appData?: AppVersionResponse,
    ): AppFormField[] {
        if (this.isWizardForm(formFields)) {
            return this.buildWizardForm(formFields, enableMultiPricingForms, appData?.model);
        }
        return this.buildSingleForm(formFields, enableMultiPricingForms, appData?.model);
    }

    setCanModelBeChanged(canModelBeChanged: boolean): void {
        this.dropdownValueFilterFunc = () => canModelBeChanged;
    }

    /**
     * Remove or add cents for the price fields.
     * @param pricingData
     * @param withCents
     * (true) -> will add cents. Ex. 1234 -> 12.34
     * (false) -> will remove cents. Ex. 12.34 -> 1234
     */
    normalizePricingData(pricingData: AppModelResponse[], withCents: boolean): Partial<AppModelResponse>[] {
        const tempPricingData = cloneDeep(pricingData);
        if (tempPricingData && tempPricingData.length > 0) {
            tempPricingData.forEach(pricingModel => {
                if (pricingModel && pricingModel.price) {
                    pricingModel.price = withCents ? this.withCents(pricingModel.price) : this.withoutCents(pricingModel.price);
                }
            });
        }
        return tempPricingData;
    }

    private buildWizardForm(fields: AppFormField[], enableMultiPricingForms: boolean, oldPricingData: AppModelResponse[]): AppFormField[] {
        return [...(fields || []), this.createPricingLabel(), this.createForm(oldPricingData, enableMultiPricingForms, true)];
    }

    private buildSingleForm(fields: AppFormField[], enableMultiPricingForms: boolean, oldPricingData: AppModelResponse[]): AppFormField[] {
        return [
            this.createTitleLabel('details', 'Details'),
            ...(fields || []),
            this.createTitleLabel('plans-and-pricing', 'Plans & Pricing'),
            this.createForm(oldPricingData, enableMultiPricingForms, false),
        ];
    }

    private createForm(oldPricingData: AppModelResponse[], enableMultiPricingForms: boolean, enableWizardForm: boolean): AppFormField {
        const dropdownField = this.createTypeField();
        const dropdownForms: { [formId in PricingFormType]: AppFormField[] } = {
            free: this.createFreeForm(),
            single: this.createSingleForm(),
            recurring: this.createRecurringForm(),
        };

        const formField: DropdownFormField = {
            id: 'pricingForm',
            type: 'dropdownForm',
            attributes: {
                dropdownSettings: {
                    dropdownValueFilter: () => this.dropdownValueFilterFunc(),
                    dropdownField,
                    dropdownForms,
                },
            },
        };

        const field: AppFormField = {
            id: 'model',
            type: 'dynamicFieldArray',
            defaultValue: (this.normalizePricingData(oldPricingData, true) || [{}]).map(pricingForm => ({ pricingForm })),
            fields: [formField],
            controlUtils: {
                setDFAItemsEditMode: this.setDFAItemsEditMode,
                updateDFAItems: this.updateDFAItems,
            },
            attributes: {
                ordering: 'append',
                onlyFirstDfaItem: !enableMultiPricingForms,
            },
        };
        if (enableWizardForm) {
            field.attributes.group = this.GROUP_ID;
        }
        return field;
    }

    // Function to pass to the formField while creating form, so we can change it later easily
    // by reference
    private dropdownValueFilterFunc(): boolean {
        return false;
    }

    private withCents(value: number): number {
        return value ? value / 100 : value;
    }

    private withoutCents(value: number): number {
        return value ? Math.round(value * 100) : value;
    }

    private createFreeForm(): AppFormField[] {
        return [];
    }

    private createSingleForm(): AppFormField[] {
        return [this.createMultiPricingField(), this.createPriceField(), this.createTrialField()];
    }

    private createRecurringForm(): AppFormField[] {
        return [
            this.createMultiPricingField(),
            this.createPriceField(),
            this.createTrialField(),
            this.createBillingPeriodField(),
            this.createBillingPeriodUnitField(),
        ];
    }

    private createPricingLabel(): AppFormField {
        return {
            id: this.GROUP_ID,
            type: 'fieldGroup',
            label: 'Plans & Pricing',
        };
    }

    private createTrialField(): AppFormField {
        return {
            id: 'trial',
            label: 'Trial period (in days)',
            type: 'number',
            attributes: {
                min: 0,
                decimalCount: 0,
            },
        };
    }

    private createMultiPricingField(): DropdownAdditionalField {
        const options = ['USD'];
        return {
            id: 'currency',
            label: 'Price',
            type: 'dropdownList',
            defaultValue: 'USD',
            options,
            attributes: {
                required: true,
                subType: 'additionalField',
                subTypeSettings: {
                    additionalFieldId: 'price',
                    additionalFieldAttributesByDropdownValue: {},
                },
            },
        };
    }

    private createPriceField(): AppFormField {
        return {
            id: 'price',
            label: 'Price',
            type: 'number',
            attributes: {
                required: true,
                formHideRow: true,
                min: 0,
            },
        };
    }

    private createBillingPeriodField(): AppFormField {
        const options = ['daily', 'weekly', 'monthly', 'annually'];
        return {
            id: 'billingPeriod',
            label: 'Billing period',
            type: 'dropdownList',
            defaultValue: 'daily',
            options,
            attributes: {
                required: true,
                transformText: 'titleCase',
            },
        };
    }

    private createBillingPeriodUnitField(): AppFormField {
        return {
            id: 'billingPeriodUnit',
            label: 'Billing period unit',
            type: 'number',
            attributes: {
                required: true,
                min: 0,
                decimalCount: 0,
            },
        };
    }

    private createTypeField(): DropdownField {
        const options = ['free', 'single', 'recurring'];
        return {
            id: 'type',
            label: 'Plan Type',
            type: 'dropdownList',
            defaultValue: 'free',
            options,
            attributes: {
                required: true,
                transformText: 'titleCase',
            },
        };
    }

    private createTitleLabel(id: 'details' | 'plans-and-pricing', label: string): AppFormField {
        // By this filed id will be added custom scss style in styles.scss
        return {
            id: `pricing-title-${id}`,
            label,
            type: null,
        };
    }

    private isWizardForm(fields: AppFormField[]): boolean {
        if (!fields) {
            return false;
        }

        const groupFields = fields.filter(potentialGroupField => {
            if (potentialGroupField.id && potentialGroupField.type === 'fieldGroup') {
                const groupKey = potentialGroupField.id.replace('customData.', '');
                return !!fields.find(field => field?.attributes?.group === groupKey);
            }
            return false;
        });

        return groupFields.length > 1;
    }
}
