"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = undefined && undefined.__param || function (paramIndex, decorator) {
    return function (target, key) {
        decorator(target, key, paramIndex);
    };
};
define(["require", "exports", "openlayers", "../../../seecool/plugins/Plugins", "../../../seecool/utils/MapTool", "../../../seecool/datas/EventSource", "./SelectInteraction", "./MapInfoControl", "css!./map.css"], function (require, exports, ol, Plugins_1, MapTool_1, EventSource_1, SelectInteraction_1, MapInfoControl_1) {
    "use strict";

    var MapPlugin = function (_EventSource_1$defaul) {
        _inherits(MapPlugin, _EventSource_1$defaul);

        function MapPlugin(config, root, frame) {
            _classCallCheck(this, MapPlugin);

            var _this = _possibleConstructorReturn(this, (MapPlugin.__proto__ || Object.getPrototypeOf(MapPlugin)).call(this));

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
                interactions: [new ol.interaction.DoubleClickZoom(), new ol.interaction.DragPan(), new ol.interaction.PinchZoom(), new ol.interaction.KeyboardPan(), new ol.interaction.KeyboardZoom(), new ol.interaction.MouseWheelZoom(), new ol.interaction.DragZoom()],
                view: new ol.View({
                    center: ol.proj.transform(config.center || defaultConfig.center, 'EPSG:4326', 'EPSG:3857'),
                    zoom: config.zoom || defaultConfig.zoom,
                    minZoom: config.minZoom || defaultConfig.minZoom,
                    maxZoom: config.maxZoom || defaultConfig.maxZoom,
                    extent: ol.proj.transformExtent(config.extent || defaultConfig.extent, 'EPSG:4326', 'EPSG:3857'),
                    enableRotation: false
                })
            });
            _this.baseLayerSources = config.baseLayer.sources;
            var baseLayerConfig = _this.getDefaultBaseLayerConfig_(config);
            var sourceType;
            if (/^ol\.source\./.test(baseLayerConfig.provider)) {
                sourceType = ol.source[baseLayerConfig.provider.substr('ol.source.'.length)];
            } else {
                throw new Error("Not supported yet.");
            }
            var baseLayer = new ol.layer.Tile({
                source: new sourceType(baseLayerConfig.options)
            });
            _this.map.addLayer(baseLayer);
            _this.baseLayer = baseLayer;
            _this.interactionSelect_ = new SelectInteraction_1.default();
            _this.map.addInteraction(_this.interactionSelect_);
            _this.interactionSelect_.on("focus", _this.handleSelectFocus_, _this);
            var scaleLine = new ol.control.ScaleLine();
            _this.map.addControl(scaleLine);
            var mapInfoControl = new MapInfoControl_1.default({ map: _this.map });
            _this.map.addControl(mapInfoControl);
            //todo map location
            //window["map"] = this;
            _this.expose_();
            return _this;
        }

        _createClass(MapPlugin, [{
            key: "expose_",
            value: function expose_() {
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
            }
        }, {
            key: "showFeature",
            value: function showFeature(feature) {
                if (!feature) return;
                var g = feature.getGeometry();
                var extent = g.getExtent();
                for (var i in extent) {
                    if (isNaN(extent[i])) return;
                }
                var center = MapTool_1.MapTool.ExtentToCenter(extent);
                this.map.getView().setCenter(center);
            }
        }, {
            key: "showFeatureFully",
            value: function showFeatureFully(feature) {
                if (!feature) return;
                var g = feature.getGeometry();
                var extent = g.getExtent();
                this.showExtent(extent);
            }
            //showExtent[minx,miny,maxx,maxy]
            //showExtent[lonmin,latmin,lonmax,latmax]

        }, {
            key: "showExtent",
            value: function showExtent(extent) {
                var view = this.map.getView();
                var resolution = view.getResolution();
                var size = this.map.getSize();
                var zoomd = MapTool_1.MapTool.ExtentToApprZoomD(extent, resolution, size);
                for (var i in extent) {
                    if (isNaN(extent[i])) return;
                }
                var center = MapTool_1.MapTool.ExtentToCenter(extent);
                view.setZoom(view.getZoom() - zoomd);
                view.setCenter(center);
            }
        }, {
            key: "setCenter",
            value: function setCenter(Coordinate, zoom) {
                var view = this.map.getView();
                if (Coordinate) {
                    view.setCenter(Coordinate);
                }
                if (zoom) {
                    zoom = zoom > 18 ? 18 : zoom;
                    zoom = zoom < 0 ? 0 : zoom;
                    view.setZoom(zoom);
                }
            }
        }, {
            key: "setFocus",
            value: function setFocus(feature, isFully) {
                this.interactionSelect_.setFocus(feature);
                if (isFully === false) this.showFeature(feature);else this.showFeatureFully(feature);
            }
        }, {
            key: "handleSelectFocus_",
            value: function handleSelectFocus_(evt) {
                var feature = evt.element;
                if (this.currentSelected_ === feature) return;
                this.currentSelected_ = feature;
                this.trigger("selectFeatureChange", this.currentSelected_);
            }
        }, {
            key: "getDefaultBaseLayerConfig_",
            value: function getDefaultBaseLayerConfig_(config) {
                if (!config.baseLayer || !config.baseLayer.sources || !config.baseLayer.sources.length) return null;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = config.baseLayer.sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var x = _step.value;

                        if (x.default) return x;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return config.baseLayer.sources[0];
            }
        }]);

        return MapPlugin;
    }(EventSource_1.default);

    MapPlugin = __decorate([__param(1, Plugins_1.inject('root')), __param(2, Plugins_1.inject('maps/iMapFrame'))], MapPlugin);
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