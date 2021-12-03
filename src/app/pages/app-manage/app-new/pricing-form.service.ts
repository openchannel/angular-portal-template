import { Injectable } from '@angular/core';
import { AppFormField, DropdownAdditionalField, DropdownField, DropdownFormField } from '@openchannel/angular-common-components';
import { AppVersionResponse } from '@openchannel/angular-common-services';
import { AppModelResponse } from '@openchannel/angular-common-services/lib/model/api/app-data-model';

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
    constructor() {}

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

    private buildWizardForm(fields: AppFormField[], enableMultiPricingForms: boolean, oldPricingData: AppModelResponse[]): AppFormField[] {
        return [
            ...(fields || []),
            this.createPricingLabel(),
            this.createForm(oldPricingData, enableMultiPricingForms, true)
        ];
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
                    dropdownField,
                    dropdownForms,
                },
            },
        };

        const field: AppFormField = {
            id: 'model',
            type: 'dynamicFieldArray',
            defaultValue: (oldPricingData?.length > 0 ? oldPricingData : [{} as any]).map(pricingForm => ({ pricingForm })),
            fields: [formField],
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
            },
        };
    }

    private createMultiPricingField(): DropdownAdditionalField {
        const options = ['USD'];
        return {
            id: 'currency',
            label: 'Pricing',
            type: 'dropdownList',
            defaultValue: 'USD',
            options,
            attributes: {
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
            label: 'Pricing',
            type: 'number',
            attributes: {
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
                min: 0,
            },
        };
    }

    private createTypeField(): DropdownField {
        const options = ['free', 'single', 'recurring'];
        return {
            id: 'type',
            label: 'Type',
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
