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
var vessel_group_service_1 = require('../service/vessel-group.service');
var vessel_group_member_page_1 = require('./vessel-group-member.page');
var VesselGroupPage = (function () {
    function VesselGroupPage(_vesselGroupService, _navCtrl, _loadingCtrl, _platform) {
        var _this = this;
        this._vesselGroupService = _vesselGroupService;
        this._navCtrl = _navCtrl;
        this._loadingCtrl = _loadingCtrl;
        this._platform = _platform;
        this.Groups = [];
        this._vesselGroupService.DataManager.Snapshot.subscribe(function (p) {
            _this.Groups = p;
        });
    }
    VesselGroupPage.prototype.ngOnInit = function () {
        var _this = this;
        this.startLoading();
        this._vesselGroupService.RefreshData().then(function (p) {
            _this.Groups = _this._vesselGroupService.DataManager.DataSource();
            _this.stopLoading();
        }).catch(function (errMsg) {
            console.log(errMsg);
            _this.stopLoading();
        });
    };
    VesselGroupPage.prototype.startLoading = function () {
        this._loading = this._loadingCtrl.create({
            content: '请稍后...',
            dismissOnPageChange: false
        });
        this._loading.present();
    };
    VesselGroupPage.prototype.stopLoading = function () {
        this._loading.dismiss();
    };
    VesselGroupPage.prototype.GotoMembers = function (group) {
        console.log(group.Name);
        this._navCtrl.push(vessel_group_member_page_1.VesselGroupMemberPage, group);
    };
    VesselGroupPage.prototype.Refresh = function (refresher) {
        var _this = this;
        this._vesselGroupService.RefreshData().then(function (p) {
            _this.Groups = _this._vesselGroupService.DataManager.DataSource();
            refresher.complete();
        }).catch(function (errMsg) {
            console.log(errMsg);
            refresher.complete();
        });
    };
    Object.defineProperty(VesselGroupPage.prototype, "IsNotIOS", {
        get: function () {
            return !this._platform.is('ios');
        },
        enumerable: true,
        configurable: true
    });
    VesselGroupPage = __decorate([
        core_1.Component({
            templateUrl: 'build/plugins/ship/page/vessel-group.page.html'
        }), 
        __metadata('design:paramtypes', [vessel_group_service_1.VesselGroupService, ionic_angular_1.NavController, ionic_angular_1.LoadingController, ionic_angular_1.Platform])
    ], VesselGroupPage);
    return VesselGroupPage;
}());
exports.VesselGroupPage = VesselGroupPage;
