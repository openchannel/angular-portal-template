import {Injectable} from '@angular/core';
import {AppsServiceImpl} from '../model/apps-service-impl';
import {BasicApp, BasicAppsPage, Developer, DeveloperSearchPage} from '../model/apps-model';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MockAppsService extends AppsServiceImpl {

    developers = [{
        developerId: 'dev_aa',
        type: 'any_type'
    }, {
        developerId: 'dev_bb',
        type: 'any_type'
    }, {
        developerId: 'dev_aabb',
        type: 'any_type'
    }];

    apps: BasicApp[] = [
        {
            id: 'basic_app_id_a',
            description: 'description_a',
            label: 'label_a'
        }, {
            id: 'basic_app_id_b',
            description: 'description_b',
            label: 'label_b'
        }, {
            id: 'basic_app_id_b',
            description: 'description_c',
            label: 'label_b'
        },
    ];

    getDevelopersById(developerId: string, page: number, pageSize: number): Observable<DeveloperSearchPage> {
        return of(this.backEndGetAppsByDeveloperId(developerId, page, pageSize));
    }

    getApps(page: number, pageSize: number): Observable<BasicAppsPage> {
        return of(this.backEndGetApps(page, pageSize));
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
