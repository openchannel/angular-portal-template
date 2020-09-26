import {AllAppFields, AppField, BasicAppsPage, DeveloperSearchPage} from './apps-model';
import {Observable} from 'rxjs';

export abstract class AppsServiceImpl {

    abstract getDevelopersById(marketId: string, developerId: string, page: number, countForPage: number): Observable<DeveloperSearchPage>;

    abstract getApps(marketId: string, page: number, pageSize: number): Observable<BasicAppsPage>;

    abstract getFieldsByAppType(marketId: string, appType: string): Observable<AllAppFields>;
}
