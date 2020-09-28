import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {ApolloQueryResult} from '@apollo/client/core';
import {Observable} from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class GraphqlService {

    private allAppsQuery = gql` query getApps ($developerId: String) {
      allApps (developerId: $developerId) {
        name
        appCreatedDate
        appIcon
        appId
        appSubmittedDate
        childApps{
          name
        }
        created
        customAppData
        customFields{
          label
        }
        description
        developer{
          name
          username
        }
        developerId
        groupId
        isLatestVersion
        isLive
        isPreviousAvailable
        lastUpdated
        lastUpdatedDate
        pricingModels {
          license
        }
        recordFound
        safeNames
        statistics
        status
        statusChangeReason
        submittedDate
        type {
          label
        }
        version
      }
    }`;

    private formQuery = gql` query getForm($formId: String!){
      getForm(formId: $formId){
        name
        createdDate
        createdDateTime
        description
        fields{
          attributes
          category
          defaultValue
          deleteable
          description
          id
          label
          options
          required
          specialType
          subFieldDefinitions{
            id
          }
          type
          valueIncompatible
          wizardStep
        }
        formId
      }
    }`;

    private allFormsQuery = gql` query getAllForms{
        getAllForms {
            name
            createdDate
            createdDateTime
            description
            fields{
                attributes
                category
                defaultValue
                deleteable
                description
                id
                label
                options
                required
                specialType
                subFieldDefinitions{
                    id
                }
                type
                valueIncompatible
                wizardStep
            }
            formId
        }
    }`;

    private formSubmitMutation = gql` mutation submitForm($formId: String!, $submission: FormSubmissionRequestInput!) {
        submitForm(formId: $formId, submission: $submission) {
            app{
              name
            }
            developer{
              name
              username
            }
            email
            formName
            formId
            formData
            formDataFields {
              label
            }
            name
            submittedDate
            submittedDateTime
            user {
                name
                username
            }
        }
    }`;

    private allFormSubmissionsQuery = gql` query getAllFormSubmissions($formId: String!, $page: Int, $pageSize: Int,
                                                                       $sortBy: String, $sortOrder: String) {
        getAllFormSubmissions(formId: $formId, page: $page, pageSize: $pageSize, sortBy: $sortBy, sortOrder: $sortOrder) {
            count
            pageNumber
            pages
            list {
              formId
              formSubmissionId
              submittedDateTime
              submittedDate
            }
        }
    }`;

    private getFormSubmissionDataQuery = gql` query getFormSubmissionData($formId: String!, $formSubmissionId: String!, $customDataType: String) {
        getFormSubmissionData(formId: $formId, formSubmissionId: $formSubmissionId, customDataType: $customDataType) {
            formSubmissionId
            formId
            submittedDate
            name
            email
            appId
            developerId
            userId
            formData {
                skills
                role
                name
                aboutme
            }
        }
    }`;

    private getDevelopersQuery = gql` query getDevelopers($searchText: String, $page: Int, $pageSize: Int , $sortBy: String, $sortOrder: String) {
        getDevelopers(searchText: $searchText, page: $page, pageSize: $pageSize, sortBy: $sortBy, sortOrder: $sortOrder) {
            count
            pageNumber
            pages
            list {
                developerId
            }
        }
    }`;


    constructor(private apollo: Apollo) {
    }

    testGetAllFormSubmissions() {
        const subscription = this.getAllFormSubmissions('test', 1, 10, 'submittedDate', 'DESC')
            .subscribe(response => {
                console.log('getAllFormSubmissions' + JSON.stringify(response));
            }, err => console.log('ERROR getAllFormSubmissions : ' + JSON.stringify(err)), () => subscription.unsubscribe());

    }

    testGetFormSubmissionData() {
        const subscription = this.getFormSubmissionData('test', '5f632676ed72363871e1c689')
            .subscribe(response => {
                console.log('getFormSubmissionData : ' + JSON.stringify(response));
            }, err => console.log('ERROR getFormSubmissionData: ' + JSON.stringify(err)), () => subscription.unsubscribe());
    }

    testGetDevelopers() {
        const subscription = this.getDevelopersById('', 'A', 1, 100)
            .subscribe(response => {
                console.log('getDevelopersById : ' + JSON.stringify(response));
            }, err => console.log('ERROR getDevelopersById: ' + JSON.stringify(err)), () => subscription.unsubscribe());
    }

    testCasesToConsole() {

        // this.createFormSubmission('test', {
        //     name: '',
        //     appId: null,
        //     userId: null,
        //     email: '',
        //     formData: {
        //         name: 'vitalii samofal',
        //         role: 'admin',
        //         aboutme: '<p>sdfsdfljsldfklsdjf</p>',
        //         skills: ['angular', '123', '12', '2', '21']
        //     }
        // })
        //     .subscribe(({data}) => {
        //         console.log('GraphQL (allApps) : ' + JSON.stringify(data));
        //     }, (error) => {
        //         console.log('GraphQL (allApps) ERROR : ' + JSON.stringify(error));
        //     });

        // this.getForm('test')
        //     .subscribe(({data}) => {
        //         console.log('GraphQL (getForm) : ' + JSON.stringify(data));
        //     }, (error) => {
        //         console.log('GraphQL (getForm) ERROR : ' + JSON.stringify(error));
        //     });
    }

    getAllApps(): Observable<ApolloQueryResult<any>> {
        return this.apollo.query({query: this.allAppsQuery});
    }

    getDevelopersApps(developerId: string): Observable<ApolloQueryResult<any>> {
        return this.apollo.query({
            query: this.allAppsQuery,
            variables: {
                developerId,
            }
        });
    }

    getForm(formId: string): Observable<ApolloQueryResult<any>> {
        return this.apollo.query({
            query: this.formQuery,
            variables: {
                formId,
            }
        });
    }

    getAllForms(formId: string): Observable<ApolloQueryResult<any>> {
        return this.apollo.query({query: this.allFormsQuery});
    }

    /**
     * @param formId : required parameter.
     * @param page : page number
     * @param pageSize : count elements for on the one page
     * @param sortBy : field name
     * @param sortOrder : 'ASC' or 'DESC'
     */
    getAllFormSubmissions(formId: string, page: number, pageSize: number, sortBy: string, sortOrder: string): Observable<ApolloQueryResult<any>> {
        return this.apollo.query({
            query: this.allFormSubmissionsQuery,
            variables: {
                formId,
                page,
                pageSize,
                sortBy,
                sortOrder
            }
        });
    }

    getFormSubmissionData(formId: string, formSubmissionId: string): Observable<ApolloQueryResult<any>> {
        return this.apollo.query({
            query: this.getFormSubmissionDataQuery,
            variables: {
                formId,
                formSubmissionId
            }
        });
    }

    createFormSubmission(formId: string, submission: any) {
        return this.apollo.mutate({
            mutation: this.formSubmitMutation,
            variables: {formId, submission},
        });
    }

    getDevelopersById(marketId: string, searchText: string, page: number, pageSize: number): Observable<ApolloQueryResult<any>> {
        return this.apollo.query({
            query: this.getDevelopersQuery,
            variables: {
                searchText,
                page,
                pageSize,
            }
        });
    }
}
