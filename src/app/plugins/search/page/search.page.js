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
var data_1 = require('../data');
var base_1 = require('../../../base');
var map_1 = require('../../map');
var config_1 = require('../../../config');
var SearchPage = (function () {
    function SearchPage(navCtrl, loadingCtrl, alertCtrl, zone, apiClient) {
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.zone = zone;
        this.apiClient = apiClient;
        this.shipFeatures = [];
        this.thhjFeatures = [];
        this.switchValue = "shipLayer";
        this.mapHolder = null;
    }
    SearchPage.prototype.onInput = function (event) {
        this.searchKey = event.target.value.toString();
    };
    SearchPage.prototype.goBack = function () {
        this.navCtrl.pop();
    };
    SearchPage.prototype.onSearch = function () {
        this.loading = this.loadingCtrl.create({
            content: "正在查询...",
            dismissOnPageChange: true
        });
        this.loading.present(this.loading);
        // this.apiClient.get(`${this.searchUrl}?key=${this.searchKey}`).then(this.onSearchCompleted.bind(this));
        this.apiClient.get(config_1.Config.Plugins.Search.SearchUrl + "?key=" + this.searchKey).then(this.onSearchCompleted.bind(this));
    };
    SearchPage.prototype.onSearchCompleted = function (data) {
        var _this = this;
        this.loading.dismiss();
        this.zone.run(function () {
            if (data) {
                console.log(data);
                var dict_1 = {};
                data.forEach(function (item) {
                    dict_1[item.Type] = item.Datas;
                });
                _this.shipFeatures = _this.createFeatures('ship', dict_1['ship']);
                _this.thhjFeatures = _this.createFeatures('thhj', dict_1['thhj']);
            }
        });
    };
    SearchPage.prototype.onSelectFeature = function (item) {
        // this.webgisInteractive.callWebGISAction("SelectObj", feature.uid);
        var fun = this.mapHolder.tool[this.switchValue];
        if (fun) {
            fun.SetFocus(item.uid);
            this.navCtrl.pop();
        }
    };
    SearchPage.prototype.ngOnInit = function () {
        var _this = this;
        // mapHolder.createHolder();
        map_1.MapHolderImp.createHolder();
        map_1.MapHolderImp.holder.then(function (holder) {
            _this.mapHolder = holder;
        });
    };
    SearchPage.prototype.ngOnDestroy = function () {
    };
    SearchPage.prototype.createFeatures = function (type, data) {
        if (!data)
            return [];
        if (type === "ship")
            return data.map(function (item) {
                return new data_1.ShipSearchResultItem(item);
            });
        if (type == "thhj")
            return data.map(function (item) {
                return new data_1.TrafficEnvSearchResultItem(item);
                // return new ThhjSearchResultItem(item);
            });
        return [];
    };
    SearchPage.prototype.onHaveSelectedObj = function (haveSelectedObj) {
        if (haveSelectedObj)
            this.goBack();
        else
            this.doAlert("无法定位物标");
    };
    SearchPage.prototype.doAlert = function (msg) {
        var alert = this.alertCtrl.create({
            title: '提示',
            message: msg,
            buttons: ['确认']
        });
        alert.present(alert);
    };
    SearchPage = __decorate([
        core_1.Component({
            templateUrl: 'build/plugins/search/page/search.page.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.LoadingController, ionic_angular_1.AlertController, core_1.NgZone, base_1.ApiClientService])
    ], SearchPage);
    return SearchPage;
}());
exports.SearchPage = SearchPage;
