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
var ship_dynamic_component_1 = require('../component/ship-dynamic.component');
var ship_archive_component_1 = require('../component/ship-archive.component');
var nearby_ship_component_1 = require('../component/nearby-ship.component');
// import {QDHShipInfoComponent} from '../../qdh';
var ShipDetailPage = (function () {
    function ShipDetailPage(navParams, platform) {
        this.navParams = navParams;
        this.title = '详细信息';
        this.pet = "dynamic";
        this.isAndorid = platform.is("android");
    }
    ShipDetailPage.prototype.ngOnInit = function () {
        this.shipDynamic = this.navParams.get('feature');
    };
    ShipDetailPage = __decorate([
        core_1.Component({
            templateUrl: 'build/plugins/ship/page/ship-detail.page.html',
            directives: [ship_dynamic_component_1.ShipDynamicComponent, ship_archive_component_1.ShipArchiveComponent, nearby_ship_component_1.NearbyShipComponent]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavParams, ionic_angular_1.Platform])
    ], ShipDetailPage);
    return ShipDetailPage;
}());
exports.ShipDetailPage = ShipDetailPage;
