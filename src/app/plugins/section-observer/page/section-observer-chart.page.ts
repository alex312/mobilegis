import { Component, OnInit } from '@angular/core';
import { NavParams, LoadingController, Loading } from 'ionic-angular';

import { SectionObserver } from '../data/section-observer';
import { SectionServerChartService } from '../service/section-observer-chart.service';
import { ChartDataCollection } from '../data/chart-data-collection';
import * as moment from 'moment';
import * as $ from 'jquery'

@Component({
    templateUrl: './section-observer-chart.page.html',
})
export class SectionObserverChartPage implements OnInit {
    SectionObserverData: SectionObserver;
    private _loading: Loading;
    constructor(private _navParams: NavParams, private _loadingCtrl: LoadingController, private _chartService: SectionServerChartService) {
        this.SectionObserverData = this._navParams.data;
    }
    ngOnInit() {
        this.StatByTime('days', -1);
    }
    private stat(start: string, end: string) {
        this.startLoading();
        this._chartService.Stat(this.SectionObserverData.Id, start, end).then(p => {
            this.createChart(p, 'ShipType', '船舶类型');
            this.createChart(p, 'LOA', '船长');
            this.createChart(p, 'Gross', '总吨');
            this.stopLoading();
        }).catch(errMsg => {
            console.log(errMsg);
            this.stopLoading();
        });
    }
    private createChart(chartDatas: ChartDataCollection, type: string, title: string) {
        //chart.js
        // var canvas = <HTMLCanvasElement>document.getElementById(type);
        // let data = {
        //     labels: chartDatas[type].Labels,
        //     datasets: [{
        //         data: chartDatas[type].Datas,
        //         backgroundColor: ShipTypeColors,
        //         hoverBackgroundColor: ShipTypeColors

        //     }]
        // }
        // let options = {
        //     legend: {
        //         labels: {
        //             boxWidth: 15,
        //             fontFamily: "'Helvetica','Verdana',Arial,sans-serif",
        //             fontColor: "#000"
        //         }
        //     }
        // }
        // var ctx = canvas.getContext("2d"); //
        // ChartJs.Doughnut(ctx, {
        //     data: data,
        //     options: options
        // });

        //highcharts
        var element = <HTMLDivElement>document.getElementById(type);
        console.log($(element));
        var chart = <any>$(element);
        (chart).highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: title
            },
            tooltip: {
                pointFormat: '数量:{point.y},占比:{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                        format: '<b>{point.name}</b>:{point.percentage:.1f}%',
                        style: {
                            color: 'black'
                        }
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: '',
                data: chartDatas[type].Series
            }]
        });
    }
    private startLoading() {
        this._loading = this._loadingCtrl.create({
            content: '请稍后...',
            dismissOnPageChange: false
        });
        this._loading.present();
    }
    private stopLoading() {
        this._loading.dismiss();
    }
    StatByTime(unitOfTime, amount) {
        let now = moment();
        let end = now.format('YYYY-MM-DD');
        let start = now.add(unitOfTime, amount).format('YYYY-MM-DD');
        this.stat(start, end);
    }
}