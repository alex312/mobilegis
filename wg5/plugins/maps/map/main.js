var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "openlayers", "knockout", "../../../seecool/plugins/Plugins", "../../../seecool/utils/MapTool", "../../../seecool/datas/EventSource", "./SelectInteraction", "./MapInfoControl", "css!./map.css"], function (require, exports, ol, ko, Plugins_1, MapTool_1, EventSource_1, SelectInteraction_1, MapInfoControl_1) {
    "use strict";
    var MapPlugin = (function (_super) {
        __extends(MapPlugin, _super);
        function MapPlugin(config, root, frame) {
            var _this = _super.call(this) || this;
            _this.root_ = root;
            frame.bind("containerSizeChange", function (evt, size) {
                this.map.setSize(size);
            }.bind(_this));
            _this.map = new ol.Map({
                target: frame.get('map'),
                pixelRatio: 1,
                logo: false,
                controls: ol.control.defaults({
                    zoom: false,
                    rotate: false,
                    attribution: false
                }),
                interactions: [
                    //new ol.interaction.DoubleClickZoom(),
                    new ol.interaction.DragPan(),
                    new ol.interaction.PinchZoom(),
                    new ol.interaction.KeyboardPan(),
                    new ol.interaction.KeyboardZoom(),
                    new ol.interaction.MouseWheelZoom(),
                    new ol.interaction.DragZoom()
                ],
                view: new ol.View({
                    center: ol.proj.transform(config.center || defaultConfig.center, 'EPSG:4326', 'EPSG:3857'),
                    zoom: config.zoom || defaultConfig.zoom,
                    minZoom: config.minZoom || defaultConfig.minZoom,
                    maxZoom: config.maxZoom || defaultConfig.maxZoom,
                    extent: ol.proj.transformExtent(config.extent || defaultConfig.extent, 'EPSG:4326', 'EPSG:3857'),
                    enableRotation: false
                })
            });
            var baseLayerConfig = _this.getDefaultBaseLayerConfig_(config);
            var sourceType;
            if (/^ol\.source\./.test(baseLayerConfig.provider)) {
                sourceType = ol.source[baseLayerConfig.provider.substr('ol.source.'.length)];
            }
            else {
                throw new Error("Not supported yet.");
            }
            var baseLayer = new ol.layer.Tile({
                source: new sourceType(baseLayerConfig.options)
            });
            _this.baseLayer = baseLayer;
            _this.map.addLayer(_this.baseLayer);
            _this.baseLayerSources_ = config.baseLayer.sources;
            _this.baseLayerSourcesActive_ = baseLayerConfig.title;
            _this.interactionSelect_ = new SelectInteraction_1.default();
            _this.map.addInteraction(_this.interactionSelect_);
            _this.interactionSelect_.on("focus", _this.handleSelectFocus_, _this);
            _this.interactionMode_ = ko.observable('');
            _this.bind('setInteractionMode', function (evt, data) {
                if (data === 'free') {
                    setTimeout(function () {
                        _this.interactionMode_('free');
                        _this.interactionSelect_.setActive(true);
                    }, 600);
                }
                else {
                    _this.interactionMode_('busy');
                    _this.interactionSelect_.setActive(false);
                }
            });
            _this.bind('closeDetailView', function () {
                this.setFocus(null);
            }.bind(_this));
            var scaleLine = new ol.control.ScaleLine();
            _this.map.addControl(scaleLine);
            var mapInfoControl = new MapInfoControl_1.default({ map: _this.map });
            _this.map.addControl(mapInfoControl);
            //todo map location
            //window["map"] = this;
            _this.expose_();
            return _this;
        }
        Object.defineProperty(MapPlugin.prototype, "interactionMode", {
            get: function () {
                return ko.computed(function () {
                    return this.interactionMode_();
                });
            },
            enumerable: true,
            configurable: true
        });
        MapPlugin.prototype.changeMap_ = function (mapConfig) {
            var sourceType;
            if (/^ol\.source\./.test(mapConfig.provider)) {
                sourceType = ol.source[mapConfig.provider.substr('ol.source.'.length)];
            }
            else {
                throw new Error("Not supported yet.");
            }
            this.baseLayer.setSource(new sourceType(mapConfig.options));
        };
        MapPlugin.prototype.getBaseMapList = function () {
            var _this = this;
            var list = this.baseLayerSources_.map(function (v) {
                return {
                    active: _this.baseLayerSourcesActive_ === v.title,
                    title: v.title
                };
            });
            return list;
        };
        MapPlugin.prototype.setBaseMap = function (title) {
            var config;
            this.baseLayerSources_.map(function (v) {
                if (title === v.title) {
                    config = v;
                }
            });
            if (config) {
                this.baseLayerSourcesActive_ = config.title;
                this.changeMap_(config);
            }
        };
        MapPlugin.prototype.expose_ = function () {
            var wg5 = window["webgis5"] || (window["webgis5"] = {});
            wg5.map = {};
            wg5.map.SetCenter = function (lonlat, zoom) {
                if (lonlat) {
                    lonlat = ol.proj.fromLonLat(lonlat);
                }
                this.setCenter(lonlat, zoom);
            }.bind(this);
            wg5.map.SetExtent = function (extent) {
                if (extent[0] < extent[2] && extent[1] < extent[3] && extent[2] < 180 && extent[3] < 90) {
                    var minC = ol.proj.fromLonLat([extent[0], extent[1]]);
                    var maxC = ol.proj.fromLonLat([extent[2], extent[3]]);
                    this.ShowExtent([minC[0], minC[1], maxC[0], maxC[1]]);
                }
            }.bind(this);
            wg5.map.UpdateSize = function () {
                this.map.updateSize();
            }.bind(this);
            this.root_.map = wg5.map;
            this.bind("selectFeatureChange", function (target, feature) {
                var type = "";
                var data = null;
                if (feature && feature.data) {
                    var id = feature.id;
                    var data = feature.data;
                    var type = id.substring(0, id.indexOf(":"));
                }
                this.root_.trigger("selectedFeatureChange", { type: type, data: data });
            });
            this.root_.trigger("moduledChange", { type: 'map', data: this.root_.map });
            // wg5.map.SetFocus=function(featureId:string|IExposeSetFocusOption){
            //    if(typeof(featureId)=='string'){
            //        this.ui.ShowSelectedObjInfo(featureId);
            //    }else if(typeof(featureId)=='object'){
            //        var fid=null;
            //        var f=<IExposeSetFocusOption>featureId;
            //        switch(f.name){
            //            case "thhj":fid="thhj:"+f.id;break;
            //            case "plot":fid="plot:"+f.id;break;
            //            case "dynamicEvent":fid="dynamicEvent:"+f.id;break;
            //            case "shipLayer":fid="shipLayer:"+f.id;break;
            //        }
            //        this.ui.ShowSelectedObjInfo(fid);
            //    }
            // }.bind(this)
        };
        MapPlugin.prototype.showFeature = function (feature, stat) {
            if (!feature)
                return;
            var g = feature.getGeometry();
            var extent = g.getExtent();
            this.showExtent(extent, stat);
        };
        MapPlugin.prototype.showExtent = function (extent, stat) {
            var view = this.map.getView();
            var resolution = view.getResolution();
            var size = this.map.getSize();
            var zoom = view.getZoom();
            if (typeof (stat) == "object") {
                if (stat.stat == "range") {
                    zoom = (zoom < stat.minZoom) ? stat.minZoom : zoom;
                    zoom = (zoom > stat.maxZoom) ? stat.maxZoom : zoom;
                }
            }
            else if (stat == "enough") {
                zoom = zoom - MapTool_1.MapTool.ExtentToEnoughZoomD(extent, resolution, size);
            }
            else {
                zoom = zoom - MapTool_1.MapTool.ExtentToApprZoomD(extent, resolution, size);
            }
            for (var i in extent) {
                if (isNaN(extent[i]))
                    return;
            }
            var center = MapTool_1.MapTool.ExtentToCenter(extent);
            view.setZoom(zoom);
            view.setCenter(center);
        };
        MapPlugin.prototype.setCenter = function (Coordinate, zoom) {
            var view = this.map.getView();
            if (Coordinate) {
                view.setCenter(Coordinate);
            }
            if (zoom) {
                zoom = zoom > 18 ? 18 : zoom;
                zoom = zoom < 0 ? 0 : zoom;
                view.setZoom(zoom);
            }
        };
        //fully 界面内尽可能大的,默认的
        //enough 界面内足够显示就行
        //none 只选中
        //Object
        //  range 在大于等于zoom的级别显示
        MapPlugin.prototype.setFocus = function (feature, stat) {
            this.interactionSelect_.setFocus(feature);
            if (stat == "none") {
                ;
            }
            else {
                this.showFeature(feature, stat);
            }
        };
        MapPlugin.prototype.handleSelectFocus_ = function (evt) {
            var feature = evt.element;
            if (this.currentSelected_ === feature)
                return;
            this.currentSelected_ = feature;
            this.trigger("selectFeatureChange", this.currentSelected_);
        };
        ;
        MapPlugin.prototype.getDefaultBaseLayerConfig_ = function (config) {
            if (!config.baseLayer || !config.baseLayer.sources || !config.baseLayer.sources.length)
                return null;
            for (var _i = 0, _a = config.baseLayer.sources; _i < _a.length; _i++) {
                var x = _a[_i];
                if (x.default)
                    return x;
            }
            return config.baseLayer.sources[0];
        };
        return MapPlugin;
    }(EventSource_1.default));
    MapPlugin = __decorate([
        __param(1, Plugins_1.inject('root')),
        __param(2, Plugins_1.inject('maps/iMapFrame'))
    ], MapPlugin);
    var defaultConfig = {
        center: [117.8, 38.95],
        zoom: 14,
        minZoom: 3,
        maxZoom: 18,
        extent: [-179, -60, 179, 60]
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MapPlugin;
});
