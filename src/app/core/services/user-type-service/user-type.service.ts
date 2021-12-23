import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OcEditUserFormConfig } from '@openchannel/angular-common-components/src/lib/auth-components';
import {
    DeveloperAccountTypeModel,
    DeveloperAccountTypesService,
    DeveloperTypeService,
    Page,
    TypeFieldModel,
    TypeModel,
} from '@openchannel/angular-common-services';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { map, tap } from 'rxjs/operators';
import { cloneDeep, keyBy } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class OcEditUserTypeService {
    private readonly EMPTY_TYPE_RESPONSE: Observable<any> = of({
        list: [],
        pages: 1,
        count: 0,
        pageNumber: 1,
    });

    constructor(private organizationTypeService: DeveloperTypeService, private accountTypeService: DeveloperAccountTypesService) {}

    injectTypeDataIntoConfigs(
        configs: OcEditUserFormConfig[],
        injectOrganizationTypes: boolean,
        injectAccountTypes: boolean,
    ): Observable<OcEditUserFormConfig[]> {
        if (!configs) {
            return null;
        }

        return forkJoin({
            organizationTypes: this.getDeveloperTypes(injectOrganizationTypes, configs),
            accountTypes: this.getDeveloperAccountTypes(injectAccountTypes, configs),
        }).pipe(
            map(data => {
                const accTypes = keyBy(data.accountTypes.list, 'developerAccountTypeId');
                const orgTypes = keyBy(data.organizationTypes.list, 'developerTypeId');
                const newConfigs = cloneDeep(configs) as OcEditUserFormConfig[];

                return newConfigs
                    .map(config => {
                        const accountTypeData = accTypes[config?.account?.type];
                        const organizationTypeData = orgTypes[config?.organization?.type];

                        let isInvalid = !(injectOrganizationTypes || injectAccountTypes);

                        // put organization type
                        if (injectOrganizationTypes) {
                            if (organizationTypeData) {
                                config.organization.typeData = organizationTypeData;
                            } else {
                                isInvalid = true;
                            }
                        }
                        // put account type
                        if (injectAccountTypes) {
                            if (accountTypeData) {
                                config.account.typeData = accountTypeData;
                            } else {
                                isInvalid = true;
                            }
                        }
                        return isInvalid ? null : config;
                    })
                    .filter(config => config);
            }),
        );
    }

    private getDeveloperTypes(
        injectOrganizationType: boolean,
        configs: OcEditUserFormConfig[],
    ): Observable<Page<TypeModel<TypeFieldModel>>> {
        if (injectOrganizationType) {
            const orgTypesIDs = configs.map(config => config?.organization?.type).filter(type => type);
            const searchQuery = orgTypesIDs?.length > 0 ? `{'developerTypeId':{'$in': ['${orgTypesIDs.join("','")}']}}` : '';
            if (searchQuery) {
                return this.organizationTypeService.getAllDeveloperTypes(1, 100, searchQuery);
            }
        }
        return this.EMPTY_TYPE_RESPONSE;
    }

    private getDeveloperAccountTypes(
        injectAccountType: boolean,
        configs: OcEditUserFormConfig[],
    ): Observable<Page<DeveloperAccountTypeModel>> {
        if (injectAccountType) {
            const accTypesIDs = configs.map(config => config?.account?.type).filter(type => type);
            const searchQuery = accTypesIDs?.length > 0 ? `{'developerAccountTypeId':{'$in': ['${accTypesIDs.join("','")}']}}` : '';
            if (searchQuery) {
                return this.accountTypeService
                    .getAllDeveloperAccountsType(1, 100, searchQuery)
                    .pipe(tap(types => this.logInvalidAccountTypes(types.list, accTypesIDs)));
            }
        }
        return this.EMPTY_TYPE_RESPONSE;
    }

    private logInvalidAccountTypes(fetchedTypesData: DeveloperAccountTypeModel[], configTypes: string[]): void {
        const existingTypes = fetchedTypesData.map(typeData => typeData.developerAccountTypeId);
        const notExistingTypes = configTypes.filter(type => !existingTypes.includes(type));

        notExistingTypes.forEach(type => {
            console.warn(`${type} is not a valid developer account type`);
        });
    }
}
