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
var nearby_ship_1 = require('../data/nearby-ship');
var base_1 = require('../../../base');
var config_1 = require('../../../config');
var NearbyShipService = (function () {
    function NearbyShipService(_apiClient) {
        this._apiClient = _apiClient;
        this._interval = 0.1;
    }
    NearbyShipService.prototype.GetShips = function (lon, lat) {
        var date = new Date(Date.now() - 3 * 60 * 60 * 1000);
        return this._apiClient.get(config_1.Config.Plugins.Ship.SnapshotUrl + "/GetSnapshotByRegion/(" + (lon - this._interval) + "," + (lon + this._interval) + "," + (lat - this._interval) + "," + (lat + this._interval) + ")/" + base_1.Format.FormatDate(date)).then(function (p) {
            return p.map(function (q) {
                return new nearby_ship_1.NearbyShip(q);
            });
        });
    };
    NearbyShipService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [base_1.ApiClientService])
    ], NearbyShipService);
    return NearbyShipService;
}());
exports.NearbyShipService = NearbyShipService;
