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

    constructor(private apollo: Apollo) {}

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
            }});
    }

    getForm(formId: string): Observable<ApolloQueryResult<any>> {
        return this.apollo.query({
            query: this.formQuery,
            variables: {
                formId,
            }});
    }

    createFormSubmission(formId: string, submission: any) {
        return this.apollo.mutate({
            mutation: this.formSubmitMutation,
            variables: { formId, submission },
        });
    }
}
