import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OcEditUserFormConfig } from '@openchannel/angular-common-components/src/lib/auth-components';
import { DeveloperAccountTypesService, DeveloperTypeService, Page, TypeFieldModel, TypeModel } from '@openchannel/angular-common-services';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { map } from 'rxjs/operators';
import { cloneDeep, keyBy } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class OcEditUserTypeService {
    private readonly EMPTY_TYPE_RESPONSE: Observable<Page<TypeModel<TypeFieldModel>>> = of({
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
        if (configs) {
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
                                    console.error(config.organization.type, ' is not a valid developer type');
                                    isInvalid = true;
                                }
                            }
                            // put account type
                            if (injectAccountTypes) {
                                if (accountTypeData) {
                                    config.account.typeData = accountTypeData;
                                } else {
                                    console.error(config.account.type, ' is not a valid developer account type');
                                    isInvalid = true;
                                }
                            }
                            return isInvalid ? null : config;
                        })
                        .filter(config => config);
                }),
            );
        }
        return null;
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
    ): Observable<Page<TypeModel<TypeFieldModel>>> {
        if (injectAccountType) {
            const accTypesIDs = configs.map(config => config?.account?.type).filter(type => type);
            const searchQuery = accTypesIDs?.length > 0 ? `{'developerAccountTypeId':{'$in': ['${accTypesIDs.join("','")}']}}` : '';
            if (searchQuery) {
                return this.accountTypeService.getAllDeveloperAccountsType(1, 100, searchQuery);
            }
        }
        return this.EMPTY_TYPE_RESPONSE;
    }
}
