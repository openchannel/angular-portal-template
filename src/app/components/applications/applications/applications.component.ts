import { Component, OnInit } from '@angular/core';
import { ApplicationService } from 'src/app/shared/services/application.service';
import { AppList } from 'src/app/shared/models/app-list';
import { AppFilter } from 'src/app/shared/models/app-filters';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FilterQuery } from 'src/app/shared/models/filter-query';
import { AppListRequest } from 'src/app/shared/models/app-list-request';
import { PaginationResponse } from 'src/app/shared/models/pagination-response';
import { CommonService } from 'src/app/shared/services/common-service';
import { SortResponse } from 'src/app/shared/models/sort-response';
import { NotificationService } from 'src/app/shared/custom-components/notification/notification.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {

  apps: AppList[];
  filters: AppFilter[];
  currentRate: number;
  appListReq: AppListRequest;
  filterMap = new Map<string, any>();
  queryMap = new Map<string, string[]>();
  paginationResponse: PaginationResponse;
  isCollapse = [];
  isProcess: boolean;
  queryString = '';
  searchTextstring = '';
  sortList: SortResponse[];
  compareMap = new Map<string, string>();
  hostingPlatformOrganization = [];

  constructor(private appService: ApplicationService, config: NgbRatingConfig, private router: Router, private route: ActivatedRoute
    , private commonService: CommonService, private notificationService: NotificationService) {
    config.max = 5;
    config.readonly = true;
    this.currentRate = 4.5;
    this.appListReq = new AppListRequest();
    this.isProcess = true;
    this.paginationResponse = new PaginationResponse();
    commonService.scrollToFormInvalidField({ form: null, adjustSize: 60 });
  }

  ngOnInit(): void {
    // var self = this;
    // self.appService.getHostingPlatformFromUserOrganization().subscribe(res => {
    //   this.hostingPlatformOrganization = res;
    //   this.getSort(function () {
    //     self.route.queryParams.subscribe(params => {
    //       //self.appService.removeTextFilter(true);
    //       self.appListReq.text = '';
    //       // Defaults to 0 if no query param provided.
    //       let query = params['query'];
    //       let searchText = params['searchText'];
    //       let sort = params['sort'];

    //       if (sort) {
    //         self.appListReq.sort = sort;
    //       } else {
    //         self.appListReq.sort = self.sortList[0].sort;
    //       }
    //       if (searchText) {
    //         self.searchTextstring = searchText;
    //         self.filterMap.set('searchText', searchText);
    //         self.appListReq.text = searchText;
    //       }
    //       if (!self.appListReq.text) {
    //         self.filterMap.delete('searchText');
    //       }

    //       if (query || searchText || sort) {
    //         self.queryString = '';
    //         self.getQueryParams(query);
    //         console.log('query params map #############', self.queryMap);
    //         console.log('query params #####', query);
    //       } else {
    //         self.appListReq = new AppListRequest();
    //         // This condition will add default application-platform versions on page load
    //         if(self.hostingPlatformOrganization.length > 0){
    //           self.hostingPlatformOrganization.forEach(hosting => {
    //             query += "," + hosting.id;
    //           });
    //           query = "application-platform="+ query.substring(1);
    //         }
    //         if (self.sortList !== undefined && self.sortList.length > 0 && query) {
    //           self.appListReq.sort = self.sortList[0].sort;
    //           self.router.navigate([], { queryParams: { query: query, sort: self.sortList[0].sort }, queryParamsHandling: 'merge' });
    //         }else if(self.sortList !== undefined && self.sortList.length > 0){
    //           self.appListReq.sort = self.sortList[0].sort;
    //           self.router.navigate([], { queryParams: { sort: self.sortList[0].sort }, queryParamsHandling: 'merge' });
    //         }
    //         self.filterMap = new Map<string, any>();
    //         //self.getFilters();
    //         //self.getApps();
    //       }
    //     });
    //   });
    // });
  }

  private getQueryParams(query: any) {
    this.queryMap = new Map<string, string[]>();
    if (query) {
      this.queryString = query;
      query.split('&').forEach(qparams => {
        
        let value: string[] = [];
        let queryParams = qparams as string;
        let key = queryParams.split('=')[0];
        let splittableValue = queryParams.split("=")[1];
        if (splittableValue.indexOf(',') > -1) {
          value = splittableValue.split(',');
        }
        else {
          value.push(splittableValue);
        }
        this.queryMap.set(key, value);
      });
    }
    var self = this;
    if (self.filters !== undefined && self.filters.length > 0) {
      let query = '';
      query = self.getQuery(query);
      query = query.slice(0, -1);

      self.appListReq.query = query;
      self.appListReq.pageNumber = 1;
      self.getApps();
    } else {
      this.getFilters(function () {

        if (self.filters !== undefined && self.filters.length > 0) {
          let query = '';
          query = self.getQuery(query);
          query = query.slice(0, -1);
          
          self.appListReq.query = query;
          self.appListReq.pageNumber = 1;
          self.getApps();
        }
      });
    }

  }

  private getQuery(query: string) {

    let filterMapKeys: string[] = this.getMapKeys(this.filterMap);
    let queryMapValues: string[] = [];
    for (let [key, value] of this.queryMap.entries()) {
      value.forEach(res => {
        queryMapValues.push(key + '__' + res);
      })
    }
    filterMapKeys.forEach(key => {
      if (!queryMapValues.includes(key) && key != 'searchText') {
        //remove keys that are not avavilable in query params
        this.filterMap.delete(key);
      }
    })
    this.filters.forEach(filter => {
      if (this.queryMap.has(filter.id)) {
        filter.values.forEach(field => {
          field.isChecked = false;
            this.queryMap.get(filter.id).forEach(paramValue => {
                if (paramValue == field.id) {
                  field.isChecked = true;
                  field.parentkey = filter.id + '__' + field.id;
                  this.filterMap.set(filter.id + '__' + field.id, field);
                  query = query + field.query + ',';
                }
            });
        });
      }
    });
    return query;
  }

  getSort(callback?) {
    this.appService.getSortBy().subscribe(res => {
      this.sortList = res;
      if (callback) {
        callback();
      }
    }, (error) => {
    });
  }
  getApps() {
    this.isProcess = true;
    this.appListReq.limit = 90;
    this.appService.getApps(this.appListReq).subscribe(res => {
      this.apps = res.data;
      this.paginationResponse = res.pagination;
      this.appListReq.pageNumber = this.paginationResponse.currentPageNumber;
      this.isProcess = false;

      this.commonService.scrollToFormInvalidField({ form: null, adjustSize: 60 });
    }, (error) => {
      // handle error response
      this.isProcess = false;
    });
  }
  getFilters(callback?) {
    this.appService.getFilters().subscribe(res => {
      this.filters = res.data;
      if (callback) {
        callback();
      }
    }, (error) => {
    });
  }
  getFdaCeStatus(fdaCeStatus) {
    let statusIcon = '';
    if (fdaCeStatus === 'Cleared') {
      statusIcon = 'assets/img/icon-approved.svg';
    } else if (fdaCeStatus === 'Pending') {
      statusIcon = 'assets/img/icon-in-review.svg';
    } else {
      statusIcon = 'assets/img/icon-not-approved.svg';
    }
    return statusIcon;
  }

  clearFilters() {
    this.filterMap = new Map<string, any>();
    this.filters.forEach(res => {
      res.values.forEach(childRes => {
        if (childRes.isChecked) {
          childRes.isChecked = false;
        }
      });
    });
    this.searchTextstring = '';
    this.queryString = '';
    this.appListReq.query = '';
    this.appListReq.text = '';
    this.appService.removeTextFilter(true);
    //this.router.navigate(['/applications']);
    //this.getApps();
    this.router.navigate([], { queryParams: { sort: this.appListReq.sort } });
  }

  onCheckboxChange(option, event, key) {
    if (event.target.checked) {
      this.filterMap.set(key, option);
      let parentId = key.split('__')[0];
      this.filters.forEach(res => {
        if (res.id == parentId) {
          res.values.forEach(childRes => {
            childRes.parentkey = null;
            childRes.parentkey = key;
          })
        }
      })
    } else {
      if (this.filterMap.has(key)) {
        this.filterMap.delete(key);
      }
    }
    this.queryString = '';
    let query = this.generateQuery();
    // if (query) {
    this.getAppByUrl(query);
    // }
  }
  generateQuery() {
    let query = '';
    let map = new Map<String, String>();
    this.filters.forEach(res => {
      // tslint:disable-next-line:no-unused-expression
      let appFilter = Object.assign({} as AppFilter, res);

      appFilter.values.forEach(filter => {
        let filterQuery = Object.assign({} as FilterQuery, filter);
        if (filterQuery.isChecked) {
          let parentId = filterQuery.parentkey.split('__')[0];
          if (map.has(parentId)) {
            let field = map.get(parentId) + ',' + filterQuery.id;
            map.set(parentId, field);
          } else {
            map.set(parentId, filterQuery.id);
          }
        }
      });
    });

    this.getMapKeys(map).forEach(key => {
      let mapKey: String = key as string;
      query = query + key + "=" + map.get(mapKey) + '&';
    });

    query = query.slice(0, -1);
    this.queryString = query;
    return query;
    // this.getAppByUrl(query);
  }

  getAppByUrl(queryParam: any, textParam?: boolean) {
    var o = {};
    if (this.queryString) {
      o['query'] = this.queryString;
    }
    if (this.searchTextstring) {
      o['searchText'] = this.searchTextstring;
    }
    if (this.appListReq.sort) {
      o['sort'] = this.appListReq.sort;
    }
    this.router.navigate(['/applications'], { queryParams: o });
    this.appListReq.query = '';
    this.appListReq.pageNumber = 1;
    // this.getApps();


    if (this.appListReq.sort) {
      o['sort'] = this.appListReq.sort;
    }
    this.router.navigate(['/applications'], { queryParams: o });
    this.appListReq.query = '';
    this.appListReq.pageNumber = 1;
    // this.getApps();


  }

  getMapKeys(map): string[] {
    return Array.from(map.keys());
  }
  getMapValues(map): string[] {
    return Array.from(map.values());
  }

  removeFilter(key) {
    this.filterMap.delete(key);
    let parentId = key.split('__')[0];
    this.filters.forEach(res => {
      if (res.id === parentId) {
        res.values.forEach(childRes => {
          if (childRes.id === key.split('__')[1]) {
            childRes.isChecked = false;
          }
        });
      }
    });

    let query = this.generateQuery();
    let searchText: boolean;
    if (key === 'searchText') {
      this.searchTextstring = '';
      searchText = true;
      this.appService.removeTextFilter(true);
      this.appListReq.text = '';
    }
    this.getAppByUrl(query, searchText);


  }

  counter(i: number) {
    return new Array(i);
  }

  changePage(i) {
    this.appListReq.pageNumber = i;
    this.getApps();

  }

  decrementPageNumber() {
    this.appListReq.pageNumber = this.appListReq.pageNumber - 1;
    this.getApps();

  }

  incrementPageNumber() {
    this.appListReq.pageNumber = this.appListReq.pageNumber + 1;
    this.getApps();

  }

  detailPage(safeName) {
    this.router.navigateByUrl('application-detail/' + safeName);
  }

  applySort() {

    this.getAppByUrl(null);
    // var o = {};
    // if (this.queryString) {
    //   o['query'] = this.queryString;
    // }
    // if (this.appListReq.text) {
    //   o['searchText'] = this.appListReq.text;
    // }
    // o['sort'] = this.appListReq.sort;

    // this.router.navigate(['/applications'], { queryParams: o });

  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2 : c1 === c2;
  }

  compareApps(appId, event) {
    if (event.target.checked) {
      if (this.compareMap.size > 2) {
        //error msg for not allowed more than 3 apps 
        event.target.checked = false;
        this.notificationService.showError([{ error: "Maximum of 3 Apps can be compared at a time!" }]);
        return;
      }
      this.compareMap.set(appId, '"' + appId + '"');
    } else {
      if (this.compareMap.has(appId)) {
        this.compareMap.delete(appId);
      }
    }
  }

  compare() {
    let keys = this.getMapValues(this.compareMap);
    let appIds = keys.join(",");
    this.router.navigate(['/application-compare'], { queryParams: { appIds: appIds } });
  }

}

