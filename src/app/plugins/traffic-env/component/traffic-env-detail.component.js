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
var traffic_env_summary_1 = require('../data/traffic-env-summary');
var base_1 = require('../../../base');
var TrafficEnvDetailComponent = (function () {
    function TrafficEnvDetailComponent() {
    }
    TrafficEnvDetailComponent.prototype.ngOnInit = function () {
        console.log(this.thhj);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', traffic_env_summary_1.TrafficEnvSummary)
    ], TrafficEnvDetailComponent.prototype, "thhj", void 0);
    TrafficEnvDetailComponent = __decorate([
        core_1.Component({
            selector: 'traffic-env-detail',
            templateUrl: 'build/plugins/traffic-env/component/traffic-env-detail.component.html',
            directives: [base_1.ItemLabelComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], TrafficEnvDetailComponent);
    return TrafficEnvDetailComponent;
}());
exports.TrafficEnvDetailComponent = TrafficEnvDetailComponent;
