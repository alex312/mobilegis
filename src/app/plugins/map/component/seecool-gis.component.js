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
var map_holder_1 = require('../service/map-holder');
var SeecoolGISComponent = (function () {
    function SeecoolGISComponent(elementRef, zone) {
        this.elementRef = elementRef;
        this.zone = zone;
        this.holder = null;
        this.map = null;
        this.destroyed = false;
    }
    SeecoolGISComponent.prototype.ngOnInit = function () {
        var _this = this;
        map_holder_1.MapHolderImp.createHolder();
        map_holder_1.MapHolderImp.holder.then((function (holder) {
            if (!_this.destroyed) {
                _this.holder = holder;
                var mapContainer = holder.mapContainer;
                _this.map = mapContainer.childNodes[0];
                mapContainer.removeChild(_this.map);
                _this.dom.nativeElement.appendChild(_this.map);
                setTimeout(function () { _this.holder.tool.map.UpdateSize(); }, 300);
            }
        }).bind(this));
    };
    SeecoolGISComponent.prototype.ngAfterViewInit = function () {
        if (window['map'])
            window['map'].map.updateSize();
    };
    SeecoolGISComponent.prototype.ngOnDestroy = function () {
        this.destroyed = true;
        if (this.holder) {
            this.dom.nativeElement.removeChild(this.map);
            this.holder.mapContainer.appendChild(this.map);
        }
    };
    __decorate([
        core_1.ViewChild('map'), 
        __metadata('design:type', Object)
    ], SeecoolGISComponent.prototype, "dom", void 0);
    SeecoolGISComponent = __decorate([
        core_1.Component({
            selector: 'mobile-app',
            templateUrl: 'build/plugins/map/component/seecool-gis.component.html',
        }), 
        __metadata('design:paramtypes', [core_1.ViewContainerRef, core_1.NgZone])
    ], SeecoolGISComponent);
    return SeecoolGISComponent;
}());
exports.SeecoolGISComponent = SeecoolGISComponent;
