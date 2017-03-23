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
var traffic_env_detail_component_1 = require('../component/traffic-env-detail.component');
var TrafficEnvDetailPage = (function () {
    function TrafficEnvDetailPage(navParams) {
        this.navParams = navParams;
        this.title = '详细信息';
    }
    TrafficEnvDetailPage.prototype.ngOnInit = function () {
        this.thhjSummary = this.navParams.get('feature');
    };
    TrafficEnvDetailPage = __decorate([
        core_1.Component({
            templateUrl: 'build/plugins/traffic-env/page/traffic-env-detail.page.html',
            directives: [traffic_env_detail_component_1.TrafficEnvDetailComponent]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavParams])
    ], TrafficEnvDetailPage);
    return TrafficEnvDetailPage;
}());
exports.TrafficEnvDetailPage = TrafficEnvDetailPage;
