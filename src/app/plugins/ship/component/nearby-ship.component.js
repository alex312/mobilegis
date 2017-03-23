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
var nearby_ship_service_1 = require('../service/nearby-ship.service');
var ship_summary_1 = require('../data/ship-summary');
var map_1 = require('../../map');
var NearbyShipComponent = (function () {
    function NearbyShipComponent(_navCtrl, _nearbyShipService, _loadingCtrl) {
        this._navCtrl = _navCtrl;
        this._nearbyShipService = _nearbyShipService;
        this._loadingCtrl = _loadingCtrl;
        this.Ships = [];
        this._mapHolder = null;
    }
    NearbyShipComponent.prototype.ngOnInit = function () {
        var _this = this;
        map_1.MapHolderImp.createHolder();
        map_1.MapHolderImp.holder.then(function (holder) {
            _this._mapHolder = holder;
        });
        this.startLoading();
        this._nearbyShipService.GetShips(this.Ship.featureData.lon, this.Ship.featureData.lat).then(function (p) {
            _this.Ships = p;
            _this.stopLoading();
        }).then(function (errMsg) {
            console.log(errMsg);
            _this.stopLoading();
        });
    };
    NearbyShipComponent.prototype.startLoading = function () {
        this._loading = this._loadingCtrl.create({
            content: '请稍后...',
            dismissOnPageChange: false
        });
        this._loading.present();
    };
    NearbyShipComponent.prototype.stopLoading = function () {
        this._loading.dismiss();
    };
    NearbyShipComponent.prototype.LocateShip = function (ship) {
        console.log(ship.ID);
        var fun = this._mapHolder.tool['shipLayer'];
        if (fun) {
            fun.SetFocus(ship.ID);
            this._navCtrl.pop();
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', ship_summary_1.ShipSummary)
    ], NearbyShipComponent.prototype, "Ship", void 0);
    NearbyShipComponent = __decorate([
        core_1.Component({
            selector: 'nearby-ship',
            templateUrl: 'build/plugins/ship/component/nearby-ship.component.html',
            providers: [nearby_ship_service_1.NearbyShipService]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, nearby_ship_service_1.NearbyShipService, ionic_angular_1.LoadingController])
    ], NearbyShipComponent);
    return NearbyShipComponent;
}());
exports.NearbyShipComponent = NearbyShipComponent;
