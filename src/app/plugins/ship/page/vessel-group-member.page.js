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
var map_1 = require('../../map');
var VesselGroupMemberPage = (function () {
    function VesselGroupMemberPage(_navCtrl, _navParams, _vesselGroupService) {
        this._navCtrl = _navCtrl;
        this._navParams = _navParams;
        this._vesselGroupService = _vesselGroupService;
        this.Group = this._navParams.data;
    }
    VesselGroupMemberPage.prototype.ngOnInit = function () { };
    VesselGroupMemberPage.prototype.Refresh = function (refresher) {
        var _this = this;
        this._vesselGroupService.RefreshData().then(function (p) {
            _this.Group = _this._vesselGroupService.DataManager.GetOrDefault(_this.Group.Id.toString());
            refresher.complete();
        }).catch(function (errMsg) {
            console.log(errMsg);
            refresher.complete();
        });
    };
    VesselGroupMemberPage.prototype.LocateShip = function (member) {
        var uid = "shipLayer:MMSI:" + member.MMSI;
        console.log(uid);
        this._navCtrl.push(map_1.MapPage, { selectedUid: uid });
    };
    VesselGroupMemberPage = __decorate([
        core_1.Component({
            templateUrl: 'build/plugins/ship/page/vessel-group-member.page.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.NavParams, vessel_group_service_1.VesselGroupService])
    ], VesselGroupMemberPage);
    return VesselGroupMemberPage;
}());
exports.VesselGroupMemberPage = VesselGroupMemberPage;
