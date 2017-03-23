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
var ship_summary_1 = require('../data/ship-summary');
var base_1 = require('../../../base');
var ShipDynamicComponent = (function () {
    function ShipDynamicComponent() {
    }
    ShipDynamicComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', ship_summary_1.ShipSummary)
    ], ShipDynamicComponent.prototype, "ship", void 0);
    ShipDynamicComponent = __decorate([
        core_1.Component({
            selector: 'ship-dynamic',
            templateUrl: 'build/plugins/ship/component/ship-dynamic.component.html',
            directives: [base_1.ItemLabelComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], ShipDynamicComponent);
    return ShipDynamicComponent;
}());
exports.ShipDynamicComponent = ShipDynamicComponent;
