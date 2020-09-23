export interface Page<L> {
    list: L[];
    totalCount: number;
    pageSize: number;
    page: number;
    extraDetails: any;
}

export interface DeveloperSearchPage extends Page<Developer> {
}

export interface BasicAppsPage extends Page<BasicApp> {
}

export interface AllAppFields {
    list: AppField [];
}

export interface Developer {
    developerId: string;
    type: any;
}

export interface BasicApp {
    id: string;
    label: string;
    description: string;
}

export interface AppField {
    label: string;
    fieldDefinition: FieldDefinition;
    defOnlyField: boolean;
    extraField: boolean;
}

export interface FieldDefinition {
    id: string;
    label: string;
    defaultValue?: string;
    description?: string;
    type: string;
    attributes?: FiledAttributes;
    subFieldDefinitions?: FieldDefinition [];
    options?: any [];
    deleteable: boolean;
}

export interface FiledAttributes {
    required?: boolean;
    minCount?: number;
    maxCount?: number;

    // text field
    maxChars?: number;
    minChars?: number;

    // image field
    width?: string;
    height?: string;
    hash?: string;
    accept?: string;

    // tags field (minCount, maxCount)
    
    // dynamic field
    ordering?: string;
    rowLabel?: string;

    // number field
    min?: number;
    max?: number;
}
