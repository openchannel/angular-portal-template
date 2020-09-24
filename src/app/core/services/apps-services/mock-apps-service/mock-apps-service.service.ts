import {Injectable} from '@angular/core';
import {AppsServiceImpl} from '../model/apps-service-impl';
import {AllAppFields, BasicApp, BasicAppsPage, Developer, DeveloperSearchPage} from '../model/apps-model';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MockAppsService extends AppsServiceImpl {

    developers = [{
        developerId: 'developer_aaa',
        type: 'any_type'
    }, {
        developerId: 'developer_bbb',
        type: 'any_type'
    }, {
        developerId: 'developer_ccc',
        type: 'any_type'
    }, {
        developerId: 'developer_ddd',
        type: 'any_type'
    }, {
        developerId: 'developer_aaabbb',
        type: 'any_type'
    }, {
        developerId: 'developer_aaaccc',
        type: 'any_type'
    }];

    apps: BasicApp[] = [
        {
            id: 'basic_app_id_a',
            description: 'description_a',
            label: 'type_first'
        }, {
            id: 'basic_app_id_b',
            description: 'description_b',
            label: 'type_second'
        }
    ];

    // appFields = {
    //     list: [
    //         {
    //             label: 'label_a',
    //             fieldDefinition: {
    //                 id: 'field_definition_id_a',
    //                 label: 'field_definition_label_a',
    //                 defaultValue: '10',
    //                 type: 'text',
    //                 attributes: {
    //                     minChars: 1,
    //                     required: true,
    //                     maxChars: 10,
    //                 },
    //                 deleteable: false
    //             },
    //             defOnlyField: false,
    //             extraField: false,
    //         }, {
    //             label: 'label_b',
    //             fieldDefinition: {
    //                 id: 'field_definition_id_b',
    //                 label: 'field_definition_label_b',
    //                 defaultValue: '10',
    //                 type: 'text',
    //                 attributes: {
    //                     minChars: 1,
    //                     required: true,
    //                     maxChars: 10,
    //                 },
    //                 deleteable: false
    //             },
    //             defOnlyField: false,
    //             extraField: false
    //         }, {
    //             label: 'multiple_image_a',
    //             fieldDefinition: {
    //                 id: 'multiple_image_id-a',
    //                 label: 'multiple_image_label_b',
    //                 description: 'multiple_image_description',
    //                 type: 'multiImage',
    //                 attributes: {
    //                     width: '100',
    //                     required: null,
    //                     hash: 'MD5',
    //                     accept: 'image/jpeg',
    //                     height: '100'
    //                 },
    //                 deleteable: false
    //             },
    //             defOnlyField: true,
    //             extraField: false
    //         }, {
    //             label: 'tags_a',
    //             fieldDefinition: {
    //                 id: 'tags_a',
    //                 label: 'tags_label_a',
    //                 description: 'tags_description_a',
    //                 type: 'tags',
    //                 attributes: {
    //                     minCount: 2,
    //                     maxCount: 3,
    //                     required: null,
    //                 },
    //                 options: ['option_a_1', 'option_a_2', 'option_a_3'],
    //                 deleteable: false
    //             },
    //             defOnlyField: true,
    //             extraField: false
    //         }, {
    //             label: 'tags_a',
    //             fieldDefinition: {
    //                 id: 'tags_a',
    //                 label: 'tags_label_a',
    //                 description: 'tags_description_a',
    //                 type: 'tags',
    //                 attributes: {
    //                     minCount: 2,
    //                     maxCount: 3,
    //                     required: null,
    //                 },
    //                 options: ['option_a_1', 'option_a_2', 'option_a_3'],
    //                 deleteable: false
    //             },
    //             defOnlyField: true,
    //             extraField: false
    //         }, {
    //             label: 'dynamic_fields_a',
    //             fieldDefinition: {
    //                 id: 'dynamic_fields_id_a',
    //                 label: 'dynamic_fields_a',
    //                 description: 'dynamic_fields_description',
    //                 type: 'dynamicFieldArray',
    //                 attributes: {
    //                     minCount: 2,
    //                     maxCount: 3,
    //                     required: null,
    //                     ordering: 'append',
    //                     rowLabel: '',
    //                 },
    //                 subFieldDefinitions: [{
    //                     id: 'name_a',
    //                     label: 'name_a',
    //                     description: 'name_description',
    //                     type: 'text',
    //                     attributes: {
    //                         required: null,
    //                         minChars: 1,
    //                         maxChars: 25,
    //                     },
    //                     deleteable: false
    //                 }, {
    //                     id: 'age-a',
    //                     label: 'age-label-a',
    //                     description: 'age-decription-a',
    //                     type: 'number',
    //                     attributes: {
    //                         required: null,
    //                         min: 1,
    //                         max: 200
    //                     },
    //                     deleteable: false
    //                 }],
    //                 deleteable: false
    //             },
    //             defOnlyField: true,
    //             extraField: false
    //         }, {
    //             label: 'rich-text_a',
    //             fieldDefinition: {
    //                 id: 'rich-text_a',
    //                 label: 'rich-text_a',
    //                 description: 'rich-text_description_a',
    //                 type: 'richText',
    //                 attributes: {
    //                     maxChars: 123,
    //                     minChars: 12,
    //                     required: null,
    //                 },
    //                 deleteable: false
    //             },
    //             defOnlyField: true,
    //             extraField: false
    //         }, {
    //             label: 'tags_a',
    //             fieldDefinition: {
    //                 id: 'tags_a',
    //                 label: 'tags_label_a',
    //                 description: 'tags_description_a',
    //                 type: 'tags',
    //                 attributes: {
    //                     minCount: 2,
    //                     maxCount: 3,
    //                     required: null,
    //                 },
    //                 options: ['option_a_1', 'option_a_2', 'option_a_3'],
    //                 deleteable: false
    //             },
    //             defOnlyField: true,
    //             extraField: false
    //         }, {
    //             label: 'email_address_a',
    //             fieldDefinition: {
    //                 id: 'email_address_a',
    //                 label: 'email_address_a',
    //                 description: 'email_address_description_a',
    //                 defaultValue: 'email_address_default_value',
    //                 type: 'emailAddress',
    //                 attributes: {
    //                     required: true,
    //                 },
    //                 deleteable: false
    //             },
    //             defOnlyField: true,
    //             extraField: false
    //         }, {
    //             label: 'dropdown_list_a',
    //             fieldDefinition: {
    //                 id: 'dropdown_list_a',
    //                 label: 'dropdown_list_a',
    //                 description: 'dropdown_list_a',
    //                 defaultValue: '3',
    //                 type: 'dropdownList',
    //                 attributes: {
    //                     required: null,
    //                 },
    //                 options: [
    //                     123,
    //                     3,
    //                     4,
    //                     35,
    //                     6,
    //                     2
    //                 ],
    //                 deleteable: false
    //             },
    //             defOnlyField: true,
    //             extraField: false
    //         }, {
    //             label: 'multi_file_a',
    //             fieldDefinition: {
    //                 id: 'multi_file_a',
    //                 label: 'multi_file_a',
    //                 description: 'multi_file_a',
    //                 type: 'multiFile',
    //                 attributes: {
    //                     required: null,
    //                     hash: 'MD5',
    //                     accept: 'video/3gpp'
    //                 },
    //                 deleteable: false
    //             },
    //             defOnlyField: true,
    //             extraField: false
    //         }
    //     ]
    // };

    appFields = {
        list: [
            {
                label: 'Name',
                fieldDefinition: {
                    id: 'field_definition_id_b',
                    label: 'Name',
                    type: 'text',
                    attributes: {
                        minChars: 1,
                        required: true,
                        maxChars: 10,
                    },
                    deleteable: false
                },
                defOnlyField: false,
                extraField: false
            }, {
                label: 'Image',
                fieldDefinition: {
                    id: 'multiple_image_id-a',
                    label: 'Image',
                    description: 'Image_description',
                    type: 'multiImage',
                    attributes: {
                        width: '100',
                        required: null,
                        hash: 'MD5',
                        accept: 'image/jpeg',
                        height: '100'
                    },
                    deleteable: false
                },
                defOnlyField: true,
                extraField: false
            }, {
                label: 'Tags',
                fieldDefinition: {
                    id: 'tags_a',
                    label: 'Tags',
                    description: 'Tags_description',
                    type: 'tags',
                    attributes: {
                        minCount: 2,
                        maxCount: 3,
                        required: null,
                    },
                    options: ['option_a_1', 'option_a_2', 'option_a_3'],
                    deleteable: false
                },
                defOnlyField: true,
                extraField: false
            }, {
                label: 'File',
                fieldDefinition: {
                    id: 'file_id_a',
                    label: 'File',
                    description: 'multi_file_a',
                    type: 'multiFile',
                    attributes: {
                        required: null,
                        hash: 'MD5',
                        accept: 'video/3gpp'
                    },
                    deleteable: false
                },
                defOnlyField: true,
                extraField: false
            }
        ]
    };

    getDevelopersById(marketId: string, developerId: string, page: number, pageSize: number): Observable<DeveloperSearchPage> {
        return of(this.backEndGetAppsByDeveloperId(developerId, page, pageSize));
    }

    getApps(marketId: string, page: number, pageSize: number): Observable<BasicAppsPage> {
        return of(this.backEndGetApps(page, pageSize));
    }

    getFieldsByAppType(marketId: string, appType: string): Observable<AllAppFields> {
        return of(this.appFields);
    }

    private backEndGetAppsByDeveloperId(developerId: string, page: number, pageSize: number): DeveloperSearchPage {
        const pageDevelopers = this.paginate(this.filterDevelopersById(this.developers, developerId), page, pageSize);
        return {
            page,
            pageSize,
            totalCount: pageDevelopers.length,
            list: pageDevelopers,
            extraDetails: null
        };
    }

    private filterDevelopersById(developers: Developer [], searchDeveloperID: string) {
        if (searchDeveloperID && searchDeveloperID.length > 0) {
            const normalizeDeveloperId = searchDeveloperID.trim();
            return developers.filter(dev => dev.developerId.includes(normalizeDeveloperId));
        }
        return developers;
    }

    private backEndGetApps(page: number, pageSize: number): BasicAppsPage {
        const apps = this.paginate(this.apps, page, pageSize);
        return {
            page,
            pageSize,
            totalCount: apps.length,
            list: apps,
            extraDetails: null
        };
    }

    private paginate<T>(array: T [], page: number, pageSize: number): T [] {
        if (!page || page === 1) {
            return array.slice(0, pageSize);
        }
        const startSlice = page * pageSize;
        return array.slice(startSlice, startSlice + pageSize);
    }
}
