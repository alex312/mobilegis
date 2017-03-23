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
var base_1 = require('../../../base');
var base_2 = require('../../../base');
var config_1 = require('../../../config');
var ShipArchiveComponent = (function () {
    function ShipArchiveComponent(nav, loadingCtrl, apiClient) {
        this.nav = nav;
        this.loadingCtrl = loadingCtrl;
        this.apiClient = apiClient;
    }
    ShipArchiveComponent.prototype.ngOnInit = function () {
        this.startLoading();
        this.query()
            .then(this.stopLoading.bind(this))
            .catch(this.stopLoading.bind(this));
    };
    ShipArchiveComponent.prototype.query = function () {
        var _this = this;
        // let linkPromise = this.apiClient.get(`wg5/LinkService/api/link?signalIds=SCUNION..${this.shipId}`);
        var linkPromise = this.apiClient.get(config_1.Config.Plugins.Ship.LinkUrl + "?signalIds=SCUNION.." + this.shipId);
        //archiveId
        linkPromise.then(function (link) {
            //TODO: 使用link对象
            var archiveId = link[0]["archiveId"];
            // let promise = this.apiClient.get(`wg5/ShipArchiveWebService/api/ShipArchive/shipId=${archiveId}`);
            var promise = _this.apiClient.get(config_1.Config.Plugins.Ship.ArchiveUrl + "/shipId=" + archiveId);
            promise.then(function (archive) {
                _this.archive = archive;
            });
            //TODO：promise 的catch处理
        });
        // TODO：linkPromise的catch处理
        return linkPromise;
    };
    ShipArchiveComponent.prototype.startLoading = function () {
        this.loading = this.loadingCtrl.create({
            content: "请稍后...",
            // 如果在ngOnInit中显示loading，需要设置为false，否则ngOnInit执行完之后将dismiss loading。
            dismissOnPageChange: false
        });
        this.loading.present(this.loading);
    };
    ShipArchiveComponent.prototype.stopLoading = function () {
        this.loading.dismiss();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ShipArchiveComponent.prototype, "shipId", void 0);
    ShipArchiveComponent = __decorate([
        core_1.Component({
            selector: 'ship-archive',
            templateUrl: 'build/plugins/ship/component/ship-archive.component.html',
            directives: [base_2.ItemLabelComponent]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.LoadingController, base_1.ApiClientService])
    ], ShipArchiveComponent);
    return ShipArchiveComponent;
}());
exports.ShipArchiveComponent = ShipArchiveComponent;
