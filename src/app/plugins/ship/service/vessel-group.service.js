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
var vessel_group_1 = require('../data/vessel-group');
var base_1 = require('../../../base');
var config_1 = require('../../../config');
var base_2 = require('../../../base');
var VesselGroupService = (function () {
    function VesselGroupService(_apiClient) {
        this._apiClient = _apiClient;
        this.DataManager = new base_2.DataSource();
    }
    VesselGroupService.prototype.GetVesselGroups = function () {
        return this._apiClient.get(config_1.Config.Plugins.Ship.VesselGroupUrl).then(function (p) {
            return p.filter(function (q) { return q.GroupType !== 1; }).map(function (r) {
                return new vessel_group_1.VesselGroup(r);
            });
        });
    };
    VesselGroupService.prototype.RefreshData = function () {
        var _this = this;
        var promise = this.GetVesselGroups();
        promise.then(function (p) {
            _this.DataManager.Reset2(p, function (q) { return q.Id.toString(); });
        });
        return promise;
    };
    VesselGroupService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [base_1.ApiClientService])
    ], VesselGroupService);
    return VesselGroupService;
}());
exports.VesselGroupService = VesselGroupService;
// export class VesselGroupService2 {
//     private _idGroup: { [id: number]: VesselGroup } = {};
//     constructor(private _apiClient: ApiClientService) { }
//     GetVesselGroups(): Promise<VesselGroup[]> {
//         return this._apiClient.get(Config.Plugins.Ship.VesselGroup).then(p => {
//             return p.filter(q => q.GroupType !== 1).map(r => {
//                 return new VesselGroup(r);
//             });
//         });
//     }
//     RefreshData() {
//         let promise = this.GetVesselGroups();
//         promise.then(p => {
//             let idGroup: { [id: number]: VesselGroup } = {};
//             p.forEach(q => {
//                 idGroup[q.Id] = q;
//             });
//             this._idGroup = idGroup;
//         });
//         return promise;
//     }
//     GetVesselGroup(id: number) {
//         if (this._idGroup[id])
//             return this._idGroup[id];
//         else
//             return undefined;
//     }
//     GetSnapshot() {
//         let groups: VesselGroup[] = [];
//         for (var id in this._idGroup) {
//             groups.push(this._idGroup[id]);
//         }
//         return groups;
//     }
// } 
