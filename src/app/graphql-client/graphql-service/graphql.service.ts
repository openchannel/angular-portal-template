import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {ApolloQueryResult, FetchResult} from '@apollo/client/core';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GraphqlService {


  private authSettingsQuery = gql`
    query authConfig {
      authConfig {
        type
        clientId
        issuer
        grantType
        scope
        redirectUri
        strictDiscoveryDocumentValidation
      }
    }

  `;

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

  private getAppQuery = gql` query oneApp ($appId: String!, $version: Int!) {
      oneApp(appId: $appId, version: $version) {
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
              fieldDefinition {
                  attributes
                  category
                  defaultValue
                  deleteable
                  description
                  id
                  label
              }
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

  private createAppMutation = gql` mutation createApp($appVersion: AppVersionRequestInput!) {
    createAndPublishApp(appVersion: $appVersion) {
      appId
      version
    }
  }`;

  private updateOneAppMutation = gql` mutation updateOneApp($appId: String!, $version: Int!, $appDefinition: AppDefinitionRequestInput!) {
      updateApp(appId: $appId, version: $version, appDefinition: $appDefinition) {
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

  private logOutSettingsQuery = gql`
    query authConfig {
      logOutConfig {
        endSessionEndpoint
      }
    }`;


  private updateAppTypeMutation = gql` mutation updateAppType($appTypeId: String!, $typeDefinition: TypeDefinitionRequestInput!) {
    updateAppType(appTypeId: $appTypeId, typeDefinition: $typeDefinition) {
      id
      label
      description
      fieldDefinitions {
        id
        label
        description
        defaultValue
        type
        attributes
        deleteable
        options
        category
        subFieldDefinitions {
          id
          label
          description
          defaultValue
          type
          attributes
          deleteable
          options
        }
      }
    }
  }`;

  private createAppTypeMutation = gql` mutation createAppType($typeDefinition: TypeDefinitionRequestInput!) {
    createAppType(typeDefinition: $typeDefinition) {
      id
      label
      description
      fieldDefinitions {
        id
        label
        description
        defaultValue
        type
        attributes
        deleteable
        options
        category
        subFieldDefinitions {
          id
          label
          description
          defaultValue
          type
          attributes
          deleteable
          options
        }
      }
    }
  }`;

  private deleteAppMutation = gql` mutation deleteApp($appId: String!) {
      deleteApp(appId: $appId) {
          status
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
        submittedDate
        name
        email
        appId
        developerId
        userId
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

  private getAppTypesQuery = gql` query getAppTypes($page: Int, $pageSize: Int, $disableFields: Boolean) {
    getAppTypes(page: $page, pageSize: $pageSize, disableFields: $disableFields) {
      pages
      pageNumber
      list {
        id
        label
        description
        fieldDefinitions {
          id
          label
          description
          defaultValue
          type
          attributes
          deleteable
          options
          category
          subFieldDefinitions {
            id
            label
            description
            defaultValue
            type
            attributes
            deleteable
            options
          }
        }
      }
    }
  }`;

  private getOneAppTypeQuery = gql` query getAppType($appTypeId: String!) {
    getAppType(appTypeId: $appTypeId) {
      id
      label
      description
      fieldDefinitions {
        id
        label
        description
        defaultValue
        type
        attributes
        deleteable
        options
        category
        subFieldDefinitions {
          id
          label
          description
          defaultValue
          type
          attributes
          deleteable
          options
        }
      }
    }
  }`;

  private getDevelopersQuery = gql` query getDevelopers($searchText: String, $page: Int, $pageSize: Int) {
    getDevelopers(searchText: $searchText, page: $page, pageSize: $pageSize) {
      pages
      pageNumber
      list {
        developerId
      }
    }
  }`;

  private loginOrRegisterUser = gql`mutation login($loginRequest: LoginRequestInput!) {
    loginOrRegisterUser(request: $loginRequest) {
      accessToken
      refreshToken
    }
  }`;

  private refreshTokenMutation = gql`mutation refreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
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

  getAuthConfig(): Observable<ApolloQueryResult<any>> {
    return this.apollo.query({query: this.authSettingsQuery});
  }

  getAllForms(): Observable<ApolloQueryResult<any>> {
    return this.apollo.query({query: this.allFormsQuery});
  }

  loginUser(idToken: string): Observable<FetchResult<any>> {
    return this.apollo.mutate({
      mutation: this.loginOrRegisterUser,
      variables: {
        loginRequest: {
          idToken
        }
      }});
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

  createApp(appVersion: any) {
    return this.apollo.mutate({
      mutation: this.createAppMutation,
      variables: {appVersion}
    });
  }

  getAppTypes(page?: number, pageSize?: number, disableFields?: boolean): Observable<ApolloQueryResult<any>> {
    return this.apollo.query({
      query: this.getAppTypesQuery,
      variables: {
        page,
        pageSize,
        disableFields
      }
    });
  }

  getAppType(appTypeId: string): Observable<ApolloQueryResult<any>> {
    return this.apollo.query({
      query: this.getOneAppTypeQuery,
      variables: {
        appTypeId
      }
    });
  }

  getDevelopers(searchText?: string, page?: number, pageSize?: number) {
    return this.apollo.query({
      query: this.getDevelopersQuery,
      variables: {
        searchText,
        page,
        pageSize
      }
    });
  }

  updateAppType(appTypeId: string, typeDefinition: any) {
    return this.apollo.mutate({
      mutation: this.updateAppTypeMutation,
      variables: {appTypeId, typeDefinition}
    });
  }

  createAppType(typeDefinition: any) {
    return this.apollo.mutate({
      mutation: this.createAppTypeMutation,
      variables: {typeDefinition}
    });
  }

  getLogOutConfig(): Observable<ApolloQueryResult<any>> {
    return this.apollo.query({ query: this.logOutSettingsQuery});
  }

  refreshToken(refreshToken: string): Observable<FetchResult<any>> {
    return this.apollo.mutate({
      mutation: this.refreshTokenMutation,
      variables: {refreshToken},
    });
  }

  deleteApp(appId: string) {
    return this.apollo.mutate({
      mutation: this.deleteAppMutation,
      variables: {appId}
    });
  }

  oneApp(appId: string, version: number) {
    return this.apollo.query({
      query: this.getAppQuery,
      variables: {
        appId,
        version
      }
    });
  }

  updateOneApp(appId: string, version: number, appDefinition) {
    return this.apollo.mutate({
      mutation: this.updateOneAppMutation,
      variables: {appId, version, appDefinition}
    });
  }
}
