import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';


@Injectable({
    providedIn: 'root'
})
export class GraphqlService {

    allCountries = gql` query countries {
        countries (filter: {}) {
          code
          name
          native
        }
      }`;

    constructor(private apollo: Apollo) {

        this.toConsoleAllCountries();
    }

    toConsoleAllCountries() {

        this.apollo.query({query: this.allCountries})
            .subscribe(({data}) => {
                console.log('GraphQL (allCountries) : ' + JSON.stringify(data));
            }, (error) => {
                console.log('GraphQL (allCountries) ERROR : ' + JSON.stringify(error));
            });
    }
}
