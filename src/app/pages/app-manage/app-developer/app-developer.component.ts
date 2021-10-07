import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    AppsService,
    AppTypeService,
    AppVersionService,
    ChartService,
    MarketModel,
    MarketService,
} from '@openchannel/angular-common-services';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConfirmationModalComponent } from '@shared/modals/app-confirmation-modal/app-confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { map, takeUntil } from 'rxjs/operators';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';
import { LoadingBarService } from '@ngx-loading-bar/core';
import {
    FullAppData,
    ChartStatisticModel,
    ChartOptionsChange,
    ChartLayoutTypeModel,
    ChartStatisticPeriodModel,
    AppListing,
    AppListMenuAction,
    OcConfirmationModalComponent,
} from '@openchannel/angular-common-components';
import { SortChosen } from '@openchannel/angular-common-components/src/lib/portal-components/oc-app-table/oc-app-table.component';

@Component({
    selector: 'app-app-developer',
    templateUrl: './app-developer.component.html',
    styleUrls: ['./app-developer.component.scss'],
})
export class AppDeveloperComponent implements OnInit, OnDestroy {
    count;
    countText;
    page = 1;

    isAppProcessing = false;

    chartData: ChartStatisticModel = {
        data: null,
        periods: [
            {
                id: 'month',
                label: 'Monthly',
                active: true,
                tabularLabel: 'Month',
            },
            {
                id: 'day',
                label: 'Daily',
                tabularLabel: 'Day',
            },
        ],
        fields: [
            {
                id: 'downloads',
                label: 'Downloads',
                active: true,
            },
            {
                id: 'reviews',
                label: 'Reviews',
            },
            {
                id: 'leads',
                label: 'Leads',
            },
            {
                id: 'views',
                label: 'Views',
            },
        ],
        layout: ChartLayoutTypeModel.standard,
    };

    downloadUrl = './assets/img/cloud-download.svg';
    menuUrl = './assets/img/dots-hr-icon.svg';

    // Config for the App Version List component
    appListConfig: AppListing = {
        layout: 'table',
        data: {
            pages: 1,
            pageNumber: 0,
            list: [],
            count: 50,
        },
        options: ['EDIT', 'PREVIEW', 'SUBMIT', 'SUSPEND', 'DELETE', 'UNSUSPEND'],
        previewTemplate: '',
    };

    appSorting: any = {
        created: 1,
    };

    private destroy$: Subject<void> = new Subject();
    private loader: LoadingBarState;

    constructor(
        public chartService: ChartService,
        public appService: AppsService,
        public appsVersionService: AppVersionService,
        public router: Router,
        private modal: NgbModal,
        private toaster: ToastrService,
        private appTypeService: AppTypeService,
        private marketService: MarketService,
        private loadingBar: LoadingBarService,
    ) {}

    ngOnInit(): void {
        this.loader = this.loadingBar.useRef();
        this.updateChartData({
            period: this.chartData.periods[0],
            field: this.chartData.fields[0],
        });
        this.getApps(true);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    updateChartData(chartOptions: ChartOptionsChange): void {
        const dateEnd = new Date();
        const dateStart = this.getDateStartByCurrentPeriod(dateEnd, chartOptions.period);
        this.loader.start();
        this.chartService
            .getTimeSeries(chartOptions.period.id, chartOptions.field.id, dateStart.getTime(), dateEnd.getTime())
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                chartData => {
                    this.count = 0;
                    this.chartData = {
                        ...this.chartData,
                        data: {
                            labelsY: chartData.labelsY.map(String),
                            labelsX: (chartData.labelsX as any[]).map(String),
                            tabularLabels: chartData.tabularLabels,
                        },
                    };
                    this.count += chartData.labelsY.reduce((a, b) => a + b);
                    this.countText = `Total ${chartOptions.field.label}`;
                    this.loader.complete();
                },
                () => {
                    this.loader.complete();
                },
            );
    }

    capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getApps(startNewPagination: boolean): void {
        this.loader.start();
        this.isAppProcessing = true;
        const sort = JSON.stringify(this.appSorting);

        if (startNewPagination) {
            this.page = 1;
        } else {
            this.page++;
        }

        const query = {
            $or: [
                {
                    'status.value': { $in: ['inReview', 'pending', 'inDevelopment', 'rejected'] },
                    'parent.status': {
                        $exists: false,
                    },
                },
                {
                    'parent.status.value': 'approved',
                    isLive: true,
                },
                {
                    'parent.status.value': 'suspended',
                    isLive: true,
                },
            ],
        };

        this.getPreviewAppUrl()
            .pipe(takeUntil(this.destroy$))
            .subscribe(url => url);

        if (this.appListConfig.data && this.appListConfig.data.count !== 0 && this.appListConfig.data.pageNumber < this.page) {
            this.appsVersionService
                .getAppsVersions(this.page, 10, sort, JSON.stringify(query))
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    response => {
                        this.appListConfig.data.pageNumber = response.pageNumber;
                        this.appListConfig.data.pages = response.pages;
                        this.appListConfig.data.count = response.count;

                        const parentList = response.list as FullAppData[];
                        parentList.forEach(value => {
                            value.status = value.parent && value.parent.status ? value.parent.status : value.status;
                        });

                        this.appListConfig.data.list =
                            this.page === 1
                                ? this.getAppsChildren(parentList, sort)
                                : [...this.appListConfig.data.list, ...this.getAppsChildren(parentList, sort)];

                        this.isAppProcessing = false;
                        this.loader.complete();
                    },
                    () => {
                        this.appListConfig.data.list = [];
                        this.isAppProcessing = false;
                        this.loader.complete();
                    },
                );
        } else {
            this.loader.complete();
        }
    }

    getAppsChildren(parentList: FullAppData[], sort: string): FullAppData[] {
        const parents = [...parentList];
        let allChildren: FullAppData[];

        const parentIds: string[] = parents.map(parent => parent.appId);
        if (parentIds.length > 0) {
            const childQuery = {
                'status.value': {
                    $in: ['inReview', 'pending', 'inDevelopment'],
                },
                appId: {
                    $in: parentIds,
                },
                'parent.status': {
                    $exists: true,
                },
            };

            this.appsVersionService
                .getAppsVersions(1, 200, sort, JSON.stringify(childQuery))
                .pipe(takeUntil(this.destroy$))
                .subscribe(response => {
                    allChildren = response.list as FullAppData[];
                    parents.forEach(parent => {
                        parent.children = allChildren.filter(child => child.appId === parent.appId);
                    });
                    this.loader.complete();
                });
        }

        return parents;
    }

    catchMenuAction(menuEvent: AppListMenuAction): void {
        switch (menuEvent.action) {
            case 'PREVIEW':
                this.getPreviewAppUrl()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(
                        previewUrl => {
                            if (previewUrl) {
                                window.open(previewUrl.replace('{appId}', menuEvent.appId).replace('{version}', `${menuEvent.appVersion}`));
                            } else {
                                this.toaster.warning('Please Please set the preview App URL.');
                            }
                        },
                        () => this.toaster.warning('Please Please set the preview App URL.'),
                    );
                break;
            case 'EDIT':
                this.router
                    .navigate(['/app/update', menuEvent.appId, menuEvent.appVersion], { queryParams: { formStatus: 'invalid' } })
                    .then();
                break;
            case 'DELETE':
                this.deleteAppAction(menuEvent);
                break;
            case 'SUBMIT':
                this.submitApp(menuEvent);
                break;
            case 'UNSUSPEND':
                this.unsuspendAppAction(menuEvent);
                break;
            case 'SUSPEND':
                this.suspendAppAction(menuEvent);
                break;
            default:
                break;
        }
    }

    getDateStartByCurrentPeriod(dateEnd: Date, period: ChartStatisticPeriodModel): Date {
        const dateStart = new Date(dateEnd);
        if (period?.id === 'month') {
            dateStart.setFullYear(dateEnd.getFullYear() - 1);
        } else if (period?.id === 'day') {
            dateStart.setTime(dateStart.getTime() - 31 * 24 * 60 * 60 * 1000);
        } else {
            dateStart.setMonth(dateStart.getTime() - 31 * 24 * 60 * 60 * 1000);
        }
        return dateStart;
    }

    changeSorting(sortSettings: SortChosen): void {
        if (sortSettings.by === 'status') {
            this.appSorting = {
                'status.value': sortSettings.ascending ? 1 : -1,
            };
        } else {
            this.appSorting = {
                [sortSettings.by]: sortSettings.ascending ? 1 : -1,
            };
        }
        this.appListConfig.data.count = 50;
        this.appListConfig.data.pageNumber = 0;
        this.getApps(true);
    }

    private submitApp(menuEvent: AppListMenuAction): void {
        const modalRef = this.modal.open(OcConfirmationModalComponent, { size: 'md' });

        modalRef.componentInstance.modalText = 'Submit this app to the marketplace now?';
        modalRef.componentInstance.modalTitle = 'Submit app';
        modalRef.componentInstance.confirmButtonText = 'Yes, submit it';

        modalRef.result.then(
            res => {
                if (res) {
                    this.loader.complete();

                    this.appService
                        .publishAppByVersion(menuEvent.appId, {
                            version: menuEvent.appVersion,
                            autoApprove: false,
                        })
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(
                            () => {
                                this.loader.complete();

                                this.appListConfig.data.pageNumber = 0;
                                this.toaster.success('Your app has been submitted for approval');
                                this.getApps(true);
                            },
                            err => {
                                this.loader.complete();

                                if (err.status === 400) {
                                    this.router
                                        .navigate(['/app/update', menuEvent.appId, menuEvent.appVersion], {
                                            queryParams: { formStatus: 'invalid' },
                                        })
                                        .then(() => {
                                            this.toaster.info('Fill out all mandatory fields before submitting');
                                        });
                                } else {
                                    this.toaster.error(err.message);
                                }
                            },
                        );
                }
            },
            () => {},
        );
    }

    private getPreviewAppUrl(): Observable<string> {
        if (!this.appListConfig?.previewTemplate) {
            return this.marketService.getCurrentMarket().pipe(
                map((marketSettings: MarketModel) => {
                    this.appListConfig.previewTemplate = marketSettings.previewAppUrl;
                    return marketSettings.previewAppUrl;
                }),
            );
        } else {
            return of(this.appListConfig.previewTemplate);
        }
    }

    private deleteAppAction(menuEvent: AppListMenuAction): void {
        const modalDelRef = this.modal.open(OcConfirmationModalComponent, { size: 'md' });

        modalDelRef.componentInstance.confirmButtonType = 'danger';
        modalDelRef.componentInstance.modalText = 'Delete this app from the marketplace now?';
        modalDelRef.componentInstance.modalTitle = 'Delete app';
        modalDelRef.componentInstance.confirmButtonText = 'Yes, delete it';

        modalDelRef.result.then(
            res => {
                if (res) {
                    if (menuEvent.isChild) {
                        this.appsVersionService
                            .deleteAppVersion(menuEvent.appId, menuEvent.appVersion)
                            .pipe(takeUntil(this.destroy$))
                            .subscribe(resp => {
                                if (resp.code && resp.code !== 200) {
                                    this.toaster.error(resp.message);
                                } else {
                                    this.appListConfig.data.pageNumber = 0;
                                    this.toaster.success('Your app has been deleted');
                                    this.getApps(true);
                                }
                            });
                    } else {
                        this.appService
                            .deleteApp(menuEvent.appId)
                            .pipe(takeUntil(this.destroy$))
                            .subscribe(resp => {
                                if (resp.code && resp.code !== 200) {
                                    this.toaster.error(resp.message);
                                } else {
                                    this.appListConfig.data.pageNumber = 0;
                                    this.toaster.success('Your app has been deleted');
                                    this.getApps(true);
                                }
                            });
                    }
                }
            },
            () => {},
        );
    }

    private suspendAppAction(menuEvent: AppListMenuAction): void {
        if (this.appListConfig.data.list.find(app => app.appId === menuEvent.appId).status.value === 'approved') {
            const modalSuspendRef = this.modal.open(OcConfirmationModalComponent, { size: 'md' });

            modalSuspendRef.componentInstance.modalText = 'Suspend this app from the marketplace now?';
            modalSuspendRef.componentInstance.modalTitle = 'Suspend app';
            modalSuspendRef.componentInstance.confirmButtonText = 'Yes, suspend it';
            modalSuspendRef.componentInstance.confirmButtonClass = 'confirmation-modal__custom-button';

            modalSuspendRef.result.then(
                res => {
                    if (res) {
                        this.appService
                            .changeAppStatus(menuEvent.appId, menuEvent.appVersion, 'suspended')
                            .pipe(takeUntil(this.destroy$))
                            .subscribe(resp => {
                                this.appListConfig.data.pageNumber = 0;
                                this.toaster.success('Your app has been suspended');
                                this.getApps(true);
                            });
                    }
                },
                () => {},
            );
        }
    }

    private unsuspendAppAction(menuEvent: AppListMenuAction): void {
        const modalUnsuspendRef = this.modal.open(AppConfirmationModalComponent, { size: 'md' });

        modalUnsuspendRef.componentInstance.modalText = 'Unsuspend this app from the marketplace now?';
        modalUnsuspendRef.componentInstance.modalTitle = 'Unsuspend app';
        modalUnsuspendRef.componentInstance.confirmButtonText = 'Yes, unsuspend it';

        modalUnsuspendRef.result.then(
            res => {
                if (res && res === 'success') {
                    this.appService
                        .changeAppStatus(menuEvent.appId, menuEvent.appVersion, 'approved')
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(resp => {
                            this.appListConfig.data.pageNumber = 0;
                            this.toaster.success('Your app has been unsuspended');
                            this.getApps(true);
                        });
                }
            },
            () => {},
        );
    }
}
