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
var section_observer_service_1 = require('../service/section-observer.service');
var section_observer_chart_page_1 = require('./section-observer-chart.page');
var SectionObserverPage = (function () {
    function SectionObserverPage(_navCtrl, _loadingCtrl, _sectionObserverService) {
        this._navCtrl = _navCtrl;
        this._loadingCtrl = _loadingCtrl;
        this._sectionObserverService = _sectionObserverService;
        this.SectionObservers = [];
    }
    SectionObserverPage.prototype.ngOnInit = function () {
        var _this = this;
        this.startLoading();
        this._sectionObserverService.GetSectionObservers().then(function (p) {
            _this.SectionObservers = p;
            _this.stopLoading();
        }).catch(function (errMsg) {
            console.log(errMsg);
            _this.stopLoading();
        });
    };
    SectionObserverPage.prototype.startLoading = function () {
        this._loading = this._loadingCtrl.create({
            content: '请稍后...',
            dismissOnPageChange: false
        });
        this._loading.present();
    };
    SectionObserverPage.prototype.stopLoading = function () {
        this._loading.dismiss();
    };
    SectionObserverPage.prototype.Refresh = function (refresher) {
        var _this = this;
        this._sectionObserverService.GetSectionObservers().then(function (p) {
            _this.SectionObservers = p;
            refresher.complete();
        }).catch(function (errMsg) {
            console.log(errMsg);
            refresher.complete();
        });
    };
    SectionObserverPage.prototype.GotoChart = function (section) {
        this._navCtrl.push(section_observer_chart_page_1.SectionObserverChartPage, section);
    };
    SectionObserverPage = __decorate([
        core_1.Component({
            templateUrl: 'build/plugins/section-observer/page/section-observer.page.html',
            providers: [section_observer_service_1.SectionObserverService]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.LoadingController, section_observer_service_1.SectionObserverService])
    ], SectionObserverPage);
    return SectionObserverPage;
}());
exports.SectionObserverPage = SectionObserverPage;
