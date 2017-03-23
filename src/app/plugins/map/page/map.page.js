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
var platform_browser_1 = require('@angular/platform-browser');
var ionic_angular_1 = require('ionic-angular');
var feature_1 = require('../data/feature');
var search_1 = require('../../search');
// import {ShipDetailPage, ShipSummaryComponent} from '../../ship';
// import {TrafficEnvDetailPage, TrafficEnvSummaryComponent} from '../../traffic-env';
var seecool_gis_component_1 = require('../component/seecool-gis.component');
var map_holder_1 = require('../service/map-holder');
var feature_info_component_1 = require('../component/feature-info.component');
var MapPage = (function () {
    function MapPage(navCtrl, navParams, zone, sanitizer) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.zone = zone;
        this.sanitizer = sanitizer;
        // url: SafeResourceUrl;
        this.FeatureType = feature_1.FeatureType;
        // this.webgisInteractive.registCallback("SelectObj", this.onSelectedObject.bind(this));
        map_holder_1.MapHolderImp.createHolder();
        map_holder_1.MapHolderImp.holder.then(function (holder) {
            _this.holder = holder;
            var selectedUid = _this.navParams.get('selectedUid');
            _this.selectedObject(selectedUid);
        });
        map_holder_1.MapHolderImp.registSelectFeatureAction("mapPage", this.onSelectedObject.bind(this));
    }
    MapPage.prototype.selectedObject = function (selectedUid) {
        if (selectedUid) {
            var index = selectedUid.indexOf(':');
            if (index !== -1) {
                var layer = selectedUid.substring(0, index);
                var uid = selectedUid.substring(index + 1);
                var fun = this.holder.tool[layer];
                if (fun) {
                    fun.SetFocus(uid);
                }
            }
        }
    };
    MapPage.prototype.onStartSearch = function () {
        this.navCtrl.push(search_1.SearchPage);
    };
    MapPage.prototype.ngOnDestroy = function () {
        // this.webgisInteractive.unregistCallback("SelectObj", this.onSelectedObject.bind(this));
    };
    MapPage.prototype.onSelectedObject = function (env, selectObject) {
        var _this = this;
        this.zone.run(function () {
            console.log();
            if (selectObject && selectObject.data) {
                _this.selectedFeature = new feature_1.Feature(selectObject.type, selectObject.data);
                var fun = _this.holder.tool[selectObject.type];
                if (fun) {
                    if (_this.selectedFeature.type === feature_1.FeatureType.Ship)
                        fun.SetFocusIsFully(_this.selectedFeature.id, false);
                }
            }
            else {
                _this.hideSummaryPanel();
            }
            setTimeout(function () { _this.holder.tool.map.UpdateSize(); }, 300);
        });
    };
    MapPage.prototype.hideSummaryPanel = function () {
        this.selectedFeature = null;
    };
    MapPage = __decorate([
        core_1.Component({
            templateUrl: 'build/plugins/map/page/map.page.html',
            directives: [seecool_gis_component_1.SeecoolGISComponent, feature_info_component_1.FeatureInfoComponent]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.NavParams, core_1.NgZone, platform_browser_1.DomSanitizationService])
    ], MapPage);
    return MapPage;
}());
exports.MapPage = MapPage;
