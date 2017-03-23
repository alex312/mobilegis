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
var ship_summary_1 = require('../data/ship-summary');
var ship_detail_page_1 = require('../page/ship-detail.page');
var ShipInfoComponent = (function () {
    function ShipInfoComponent(_webGISService, _navCtrl) {
        this._webGISService = _webGISService;
        this._navCtrl = _navCtrl;
    }
    ShipInfoComponent.prototype.Playback = function (minute) {
        var end = Date.now();
        var start = new Date(end - minute * 60 * 1000);
        var endStr = base_1.Format.FormatDate(end);
        var startStr = base_1.Format.FormatDate(start);
        console.log("ship=" + this.Ship.mmsi + ",start=" + startStr + ",end=" + endStr);
        this._webGISService.callWebGISAction2('shipLayer', 'LoadTrack', startStr, endStr);
    };
    ShipInfoComponent.prototype.ShowDetail = function () {
        if (this.Ship)
            this._navCtrl.push(ship_detail_page_1.ShipDetailPage, { feature: this.Ship });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', ship_summary_1.ShipSummary)
    ], ShipInfoComponent.prototype, "Ship", void 0);
    ShipInfoComponent = __decorate([
        core_1.Component({
            selector: 'ship-info',
            templateUrl: 'build/plugins/ship/component/ship-info.component.html'
        }), 
        __metadata('design:paramtypes', [base_1.WebGISInteractiveService, ionic_angular_1.NavController])
    ], ShipInfoComponent);
    return ShipInfoComponent;
}());
exports.ShipInfoComponent = ShipInfoComponent;
