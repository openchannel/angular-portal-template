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

export interface Developer {
    developerId: string;
    type: any;
}

export interface BasicApp {
    id: string;
    label: string;
    description: string;
}
