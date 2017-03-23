"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var ChartJs = require('chart.js');
var section_observer_chart_service_1 = require('../service/section-observer-chart.service');
var chart_data_collection_1 = require('../data/chart-data-collection');
var moment = require('moment');
var SectionObserverChartPage = (function () {
    function SectionObserverChartPage(_navParams, _loadingCtrl, _chartService) {
        this._navParams = _navParams;
        this._loadingCtrl = _loadingCtrl;
        this._chartService = _chartService;
        this.SectionObserverData = this._navParams.data;
    }
    SectionObserverChartPage.prototype.ngOnInit = function () {
        this.StatByTime('days', -1);
    };
    SectionObserverChartPage.prototype.stat = function (start, end) {
        var _this = this;
        this.startLoading();
        this._chartService.Stat(this.SectionObserverData.Id, start, end).then(function (p) {
            _this.createChart(p, 'ShipType');
            _this.createChart(p, 'LOA');
            _this.createChart(p, 'Gross');
            _this.stopLoading();
        }).catch(function (errMsg) {
            console.log(errMsg);
            _this.stopLoading();
        });
    };
    SectionObserverChartPage.prototype.createChart = function (chartDatas, type) {
        var canvas = document.getElementById(type);
        var data = {
            labels: chartDatas[type].Labels,
            datasets: [{
                    data: chartDatas[type].Datas,
                    backgroundColor: chart_data_collection_1.ShipTypeColors,
                    hoverBackgroundColor: chart_data_collection_1.ShipTypeColors
                }]
        };
        var options = {
            legend: {
                labels: {
                    boxWidth: 15,
                    fontFamily: "'Helvetica','Verdana',Arial,sans-serif",
                    fontColor: "#000"
                }
            }
        };
        var ctx = canvas.getContext("2d"); //
        ChartJs.Doughnut(ctx, {
            data: data,
            options: options
        });
    };
    SectionObserverChartPage.prototype.startLoading = function () {
        this._loading = this._loadingCtrl.create({
            content: '请稍后...',
            dismissOnPageChange: false
        });
        this._loading.present();
    };
    SectionObserverChartPage.prototype.stopLoading = function () {
        this._loading.dismiss();
    };
    SectionObserverChartPage.prototype.StatByTime = function (unitOfTime, amount) {
        var now = moment();
        var end = now.format('YYYY-MM-DD');
        var start = now.add(unitOfTime, amount).format('YYYY-MM-DD');
        this.stat(start, end);
    };
    SectionObserverChartPage = __decorate([
        core_1.Component({
            templateUrl: 'build/plugins/section-observer/page/section-observer-chart.page.html',
            providers: [section_observer_chart_service_1.SectionServerChartService]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavParams, ionic_angular_1.LoadingController, section_observer_chart_service_1.SectionServerChartService])
    ], SectionObserverChartPage);
    return SectionObserverChartPage;
}());
exports.SectionObserverChartPage = SectionObserverChartPage;
