import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChartLayoutTypeModel, ChartOptionsChange, ChartStatisticModel } from '@openchannel/angular-common-components';
import { filter, finalize, map, repeatWhen, switchMap, takeUntil } from 'rxjs/operators';
import { AppVersionService, ChartService } from '@openchannel/angular-common-services';
import { of, Subject } from 'rxjs';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
    selector: 'app-chart',
    templateUrl: './app-chart.component.html',
    styleUrls: ['./app-chart.component.scss'],
})
export class AppChartComponent implements OnInit, OnDestroy {
    readonly httpSearchAppsQuery: string = '{"status.value":"approved","isLive":true}';
    readonly downloadUrl: string = './assets/img/cloud-download.svg';

    @Input() showAppsDropdown: boolean = false;
    @Input() appId: string = null;

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
        apps: null,
        layout: ChartLayoutTypeModel.standard,
    };

    count: number = 0;
    countText: string = null;

    private destroy$ = {
        apps: new Subject(),
        chart: new Subject(),
    };

    private loader$ = {
        apps: this.loadingBar.useRef(),
        chart: this.loadingBar.useRef(),
    };

    constructor(private loadingBar: LoadingBarService, private chartService: ChartService, private appsService: AppVersionService) {}

    ngOnInit(): void {
        this.countText = this.createCountText('0');

        if (this.showAppsDropdown) {
            this.initChartWithAppsDropdown();
        } else {
            this.updateChartDataBySelectedValues();
        }
    }

    ngOnDestroy(): void {
        // finish all bar loaders
        Object.values(this.loader$).forEach(loader => loader.complete());

        // unsubscribe from all http requests
        Object.values(this.destroy$).forEach(destroy => {
            destroy.next();
            destroy.complete();
        });
    }

    initChartWithAppsDropdown(): void {
        this.initAppDropdownValues();
        this.updateChartDataBySelectedValues();
    }

    updateChartData(chartOptions: ChartOptionsChange): void {
        // destroy old chart http subscription
        this.destroy$.chart.next();
        // open loading bar
        this.loader$.chart.start();

        const dateEnd = new Date();
        const dateStart = this.chartService.getDateStartByCurrentPeriod(dateEnd, chartOptions.period);

        if (this.showAppsDropdown) {
            // selected app ID can be NULL
            this.appId = chartOptions?.selectedApp?.id;
        }

        this.chartService
            .getTimeSeries(chartOptions.period.id, chartOptions.field.id, dateStart.getTime(), dateEnd.getTime(), this.appId)
            .pipe(
                finalize(() => this.loader$.chart.complete()),
                takeUntil(this.destroy$.chart),
            )
            .subscribe(chartData => {
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
                this.countText = this.createCountText(chartOptions.field.label);
            });
    }

    private updateChartDataBySelectedValues(): void {
        this.updateChartData({
            period: this.chartData.periods.find(v => v.active),
            field: this.chartData.fields.find(v => v.active),
            selectedApp: this.chartData?.apps?.activeItem,
        });
    }

    private initAppDropdownValues(): void {
        // destroy old apps http subscription
        this.destroy$.apps.next();

        // open loading bar
        this.loader$.apps.start();

        const defaultItem = { id: null, label: 'All apps' };
        // init default dropdown value
        this.chartData.apps = {
            activeItem: defaultItem,
            items: [defaultItem],
        };

        let pageNumber = 1;
        let hasNext = false;

        // load all apps with pagination
        of({})
            .pipe(
                switchMap(() => this.appsService.getAppsVersions(pageNumber, 100, null, this.httpSearchAppsQuery)),
                map(response => {
                    hasNext = ++pageNumber <= response.pages;
                    return response.list.map(app => ({ id: app.appId, label: app.name }));
                }),
                repeatWhen(obs => obs.pipe(filter(() => hasNext))),
                finalize(() => this.loader$.apps.complete()),
                takeUntil(this.destroy$.apps),
            )
            .subscribe(dropdownAppValues => this.chartData.apps.items.push(...dropdownAppValues));
    }

    private createCountText(count: string): string {
        return `Total ${count}`;
    }
}
