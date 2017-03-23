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
var traffic_env_summary_1 = require('../data/traffic-env-summary');
var traffic_env_detail_page_1 = require('../page/traffic-env-detail.page');
var TrafficEnvInfoComponent = (function () {
    function TrafficEnvInfoComponent(_navCtrl) {
        this._navCtrl = _navCtrl;
    }
    TrafficEnvInfoComponent.prototype.ShowDetail = function () {
        if (this.TrafficEnv)
            this._navCtrl.push(traffic_env_detail_page_1.TrafficEnvDetailPage, { feature: this.TrafficEnv });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', traffic_env_summary_1.TrafficEnvSummary)
    ], TrafficEnvInfoComponent.prototype, "TrafficEnv", void 0);
    TrafficEnvInfoComponent = __decorate([
        core_1.Component({
            selector: 'traffic-env-info',
            templateUrl: 'build/plugins/traffic-env/component/traffic-env-info.component.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController])
    ], TrafficEnvInfoComponent);
    return TrafficEnvInfoComponent;
}());
exports.TrafficEnvInfoComponent = TrafficEnvInfoComponent;
