var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "openlayers", "knockout", "../../../../seecool/geom/utils", "../../../../seecool/plugins/Plugins", "../../../../seecool/datas/Collection", "../../../../seecool/datas/Collection", "../../../../seecool/datas/Collection", "../../../../seecool/utils/MapTool", "../../../../seecool/StaticLib", "../../../../seecool/utils/Design", "../../../../seecool/utils/JSTool", "./datas/LocationApi", "./layers/VectorLayerEntity", "./datas/DefaultTrafficEnvStyleApi"], function (require, exports, ol, ko, utils, Plugins_1, Collection_1, Collection_2, Collection_3, MapTool_1, StaticLib_1, Design_1, JSTool_1, LocationApi_1, VectorLayerEntity_1, DefaultTrafficEnvStyleApi_1) {
    "use strict";
    var ThhjPlugin = (function () {
        function ThhjPlugin(config, root, layersSetting_, map) {
            var _this = this;
            this.config_ = config;
            this.layersSetting_ = layersSetting_;
            this.map_ = map;
            this.root_ = root;
            this.promise_ = {};
            this.init_();
            this.load_();
            this.expose_();
            StaticLib_1.AOP.dataAspect.setDataFunction('api/thhj', function (evt) {
                var data = {};
                _this.dataSet_.map(function (v) {
                    data[v.Id] = v;
                });
                evt.done(data);
            });
            this.isLayerShow_ = ko.observable(true);
            this.isLayerShow_.subscribe(function (v) {
                this.setVisible_(v);
            }.bind(this));
            this.layersSetting_.RegisterLayerSetting("通航环境", this.isLayerShow_, this.zIndex_, this.maxZoom_, this.switch_.bind(this), this.setZIndex_.bind(this), this.setMaxZoom_.bind(this));
        }
        ThhjPlugin.prototype.searchDatas = function (key) {
            return this.searchDatas_(key);
        };
        ThhjPlugin.prototype.setFocus = function (id) {
            return this.setFocus_(id);
        };
        Object.defineProperty(ThhjPlugin.prototype, "layerSource", {
            get: function () {
                return this.layerEntity_.Source;
            },
            enumerable: true,
            configurable: true
        });
        ThhjPlugin.prototype.setVisible = function (isShow) {
            return this.setVisible_(isShow);
        };
        ThhjPlugin.prototype.getTrafficEnvType = function (nameOrtype) {
            return this.getTrafficEnvType_(nameOrtype);
        };
        ThhjPlugin.prototype.setZIndex = function (index) {
            this.setZIndex_(index);
        };
        ThhjPlugin.prototype.setMaxZoom = function (zoom) {
            this.setMaxZoom_(zoom);
        };
        Object.defineProperty(ThhjPlugin.prototype, "zIndex", {
            get: function () {
                return this.zIndex_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ThhjPlugin.prototype, "maxZoom", {
            get: function () {
                return this.maxZoom_;
            },
            enumerable: true,
            configurable: true
        });
        ThhjPlugin.prototype.expose_ = function () {
            var wg5 = window["webgis5"] || (window["webgis5"] = {});
            wg5.thhj = {};
            wg5.thhj.SetFocus = this.setFocus_.bind(this);
            wg5.thhj.SetFocusIsFully = function (id, stat) {
                this.setFocusIsFully_(id, stat);
            }.bind(this);
            this.root_.thhj = wg5.thhj;
            this.root_.trigger("moduledChange", { type: 'thhj', data: this.root_.thhj });
        };
        ThhjPlugin.prototype.setFocus_ = function (id) {
            this.setFocusIsFully_(id, 'fully');
        };
        ThhjPlugin.prototype.setFocusIsFully_ = function (id, stat) {
            var fid = "thhj:" + id;
            var feature = this.layerEntity_.layer.getFeatureById(fid);
            this.map_.setFocus(feature, stat);
        };
        ThhjPlugin.prototype.init_ = function () {
            this.defaultTrafficEnvStyleApi_ = new DefaultTrafficEnvStyleApi_1.default(this.config_.defaultTrafficEnvStyleApi || "api/defaultTrafficEnvStyle");
            this.dataSet_ = new Collection_3.CollectionA("dataSet");
            this.dataDTOSet_ = new Collection_3.CollectionA("dataDTOSet");
            this.dataApi_ = new LocationApi_1.default(this.config_.locationApi || "api/location");
            this.layerEntity_ = new VectorLayerEntity_1.default({});
            this.link_DataSet_DataDTOSet_ = new Collection_2.CollectionLinker(Collection_1.CollectionLinkerOption(this.dataDTOSet_, this.dataSet_, function (v) {
                return true;
            }, this.fromDTO_.bind(this)));
            this.link_LayerEntity_DataSet_ = new Collection_2.CollectionLinker({
                sourceCollection: this.dataSet_,
                targetCollection: this.layerEntity_.DataSet,
                filterFunction: function (v) {
                    return true;
                },
                convertFunction: function (v) {
                    var style = StaticLib_1.olStyleFromStyle(StaticLib_1.TrafficEnvStyle(v.TrafficEnvType), v.Name, v.TrafficEnvType); //this.olStyleFromThhjDataStyle_(v.DrawingStyle, v.Name);
                    var geom;
                    if (v.Geomatics && v.Geomatics.Points.length) {
                        geom = this.olGeomFromThhjDataGeom_(v.Geomatics);
                    }
                    var f2 = new ol.Feature({
                        geometry: geom
                    });
                    f2.setStyle(style);
                    this.featureAppand_(f2, v);
                    return f2;
                }.bind(this)
            });
            this.link_DataSet_DataDTOSet_.start();
            this.link_LayerEntity_DataSet_.start();
            this.map_.map.addLayer(this.layerEntity_.layer);
            this.zIndex_ = ko.observable();
            this.setZIndex_(this.config_.zIndex);
            this.maxZoom_ = ko.observable();
            this.setMaxZoom_(this.config_.zoom - 1);
        };
        ThhjPlugin.prototype.setVisible_ = function (isShow) {
            this.layerEntity_.layer.setVisible(isShow);
        };
        ThhjPlugin.prototype.setMaxZoom_ = function (zoom) {
            this.maxZoom_(zoom);
            this.layerEntity_.layer.setMaxResolution(MapTool_1.MapTool.ZoomToResolution(zoom));
        };
        ThhjPlugin.prototype.setZIndex_ = function (index) {
            this.zIndex_(index);
            this.layerEntity_.layer.setZIndex(index);
        };
        ThhjPlugin.prototype.switch_ = function () {
            if (this.isLayerShow_()) {
                this.isLayerShow_(false);
            }
            else {
                this.isLayerShow_(true);
            }
        };
        ThhjPlugin.prototype.featureAppand_ = function (olFeature, data) {
            olFeature.data = data;
            olFeature.id = "thhj:" + data.Id;
        };
        ThhjPlugin.prototype.Promise = function (name) {
            if (!this.promise_)
                this.promise_ = {};
            return this.promise_[name];
        };
        ThhjPlugin.prototype.load_ = function () {
            this.promise_["locationLoad"] = Promise.resolve()
                .then(this.defaultTrafficEnvStyleApi_.Get.bind(this.defaultTrafficEnvStyleApi_))
                .then(function (pdata) {
                    switch (pdata.state) {
                        case 'apiok':
                            pdata.data.map(function (v) {
                                var style = JSON.parse(v.Style);
                                StaticLib_1.TrafficEnvStyle(style.TrafficEnvType, style); //
                            });
                            break;
                    }
                })
                .then(this.dataApi_.Get$types.bind(this.dataApi_, "")) //this.dataApi_.Get$types("")
                .then(function (pdata) {
                    return new Promise(function (resolve, reject) {
                        switch (pdata.state) {
                            case "apiok":
                                this.dataDTOSet_.Add(pdata.data);
                                resolve();
                                break;
                            default:
                                reject();
                        }
                    }.bind(this));
                }.bind(this))
                .catch(function (pdata) {
                    switch (pdata.state) {
                        case "apierr":
                            break;
                    }
                    if (!pdata.state)
                        throw (pdata);
                })
                .then(function () {
                    StaticLib_1.AOP.dataAspect.setDataFunction('promise/locationLoad', function (evt) {
                        evt.done();
                    });
                });
        };
        ThhjPlugin.prototype.fromDTO_ = function (obj) {
            var data = {
                Id: '' + obj.Id,
                TrafficEnvType: obj.TrafficEnvType,
                OrganizationId: "" + obj.OrganizationId,
                Name: obj.Name
            };
            var g = JSON.parse(obj.Geomatics);
            var s = JSON.parse(obj.DrawingStyle);
            data.DrawingStyle = s || null;
            data.Geomatics = g || null;
            var points = [];
            if (data.Geomatics && data.Geomatics.Points.length) {
                var str;
                for (var ii in g.Points) {
                    str = g.Points[ii];
                    var ollonlat = this.olLonLatPerse_(str);
                    points.push(ollonlat);
                }
                data.Geomatics.Points = points;
            }
            return data;
        };
        ThhjPlugin.prototype.toDTO_ = function (obj) {
            var dto = {
                Id: obj.Id,
                TrafficEnvType: obj.TrafficEnvType,
                OrganizationId: parseInt(obj.OrganizationId) || null,
                Name: obj.Name,
                DrawingStyle: JSON.stringify(obj.DrawingStyle)
            };
            var tg = {};
            if (obj.Geomatics && obj.Geomatics.Points) {
                tg.ShapeType = obj.Geomatics.ShapeType;
                var points = obj.Geomatics.Points.map(function (v) {
                    return '' + v[0] + ',' + v[1];
                });
                tg.Points = points;
            }
            dto.Geomatics = JSON.stringify(tg);
            return dto;
        };
        ThhjPlugin.prototype.olStyleFromThhjDataStyle_ = function (style, name) {
            style = style || new StaticLib_1.DrawingStyle();
            var fillColor = style.Fill ? MapTool_1.MapTool.olColorParseARGB(style.Fill) : null; //fillColor[3]
            fillColor = (fillColor && fillColor[3]) != 0 ? fillColor : null;
            var strokeColor = style.Stroke ? MapTool_1.MapTool.olColorParseARGB(style.Stroke) : "#000000";
            var strokeWidth = style.StrokeThickness ? parseInt(style.StrokeThickness) : 1;
            var lineDash = style.StrokeDashArray ? style.StrokeDashArray : '';
            lineDash = JSON.parse('[' + lineDash + ']');
            var font = 'arial';
            var textStyle = style.TextStyle || {};
            var textfill = textStyle.Color ? MapTool_1.MapTool.olColorParseARGB(textStyle.Color) : '#000000';
            var textStroke = '#000000';
            return new ol.style.Style({
                fill: fillColor ? new ol.style.Fill({ color: fillColor }) : null,
                stroke: new ol.style.Stroke({
                    color: strokeColor,
                    width: strokeWidth,
                    lineDash: lineDash
                }),
                image: new ol.style.Icon({
                    src: require.toUrl('resources/sprites/images/icon/icon_berth.png'),
                    anchor: [0.45, 0.48],
                    size: [22, 22]
                }),
                // image: new ol.style.Circle({
                //    radius: 5,
                //    stroke: new ol.style.Stroke({color: [100, 255, 255, 1], width: 1}),
                //    fill: new ol.style.Fill({
                //        color: [100, 100, 100, 1]
                //    })
                // }),
                text: new ol.style.Text({
                    textAlign: 'center',
                    textBaseline: 'middle',
                    font: font,
                    text: name,
                    fill: textfill ? new ol.style.Fill({ color: textfill }) : null,
                    //stroke: new ol.style.Stroke({color: textStroke, width: 1}),
                    offsetX: 0,
                    offsetY: 15,
                    rotation: 0
                })
            });
        };
        ThhjPlugin.prototype.olGeomFromThhjDataGeom_ = function (g) {
            var list = g.Points.map(function (v) {
                return ol.proj.fromLonLat(v);
            });
            var geom;
            if (g.ShapeType) {
                switch (g.ShapeType) {
                    case StaticLib_1.ShapeType.Point:
                        geom = new ol.geom.Point(list[0]);
                        break;
                    case StaticLib_1.ShapeType.Line:
                        geom = new ol.geom.LineString(list);
                        break;
                    case StaticLib_1.ShapeType.PolyLine:
                        geom = new ol.geom.LineString(list);
                        break;
                    case StaticLib_1.ShapeType.Rectanlge:
                        geom = new ol.geom.Polygon([[list[0], [list[0][0], list[1][1]], list[1], [list[1][0], list[0][1]], list[0]]]); //([list]);
                        break;
                    case StaticLib_1.ShapeType.Circle:
                        geom = new ol.geom.Circle(list[0], Math.sqrt(utils.squaredDistance(list[0][0], list[0][1], list[1][0], list[1][1])));
                        break;
                    case StaticLib_1.ShapeType.Polygon:
                        if (list[0][0] != list[list.length - 1][0] || list[0][1] != list[list.length - 1][1])
                            list.push(list[0]);
                        geom = new ol.geom.Polygon([list]);
                        break;
                }
            }
            else {
                if (list.length === 1) {
                    geom = new ol.geom.Point(list[0]);
                }
                else if (list.length === 2) {
                    geom = new ol.geom.LineString(list);
                }
                else {
                    if (list[0][0] != list[list.length - 1][0] || list[0][1] != list[list.length - 1][1])
                        list.push(list[0]);
                    geom = new ol.geom.Polygon([list]);
                }
            }
            return geom;
        };
        ThhjPlugin.prototype.olLonLatPerse_ = function (str) {
            var index = str.indexOf(",");
            var a = str.substr(0, index);
            var b = str.substr(index + 1, str.length - index);
            a = Number(a);
            b = Number(b);
            if (Math.abs(b) > 90 && Math.abs(a) < 90) {
                return [b, a];
            }
            return [a, b];
        };
        ThhjPlugin.prototype.getTrafficEnvType_ = function (nameOrtype) {
            if (!trafficEnvType) {
                var ns = new Design_1.Design.ScopeManager("");
                var trafficEnvType = ns.getV1Enum("TrafficEnvType");
                var c, r;
                _a = JSTool_1.JSTool.ArraysDoContext(trafficEnvType.Names, trafficEnvType.Values, trafficEnvType.Labels, function (c, n, v, l) {
                    c[n] = { name: n, value: v, label: l };
                    c[v] = { name: n, value: v, label: l };
                }), c = _a[0], r = _a[1];
                trafficEnvType = c;
            }
            return trafficEnvType[nameOrtype] || { name: 'other', value: Infinity, label: "其他" };
            var _a;
        };
        ThhjPlugin.prototype.searchDatas_ = function (key) {
            var r = [];
            this.dataSet_.map(function (I) {
                if (this.searchString_(I.Name, key)) {
                    r.push({ type: "name", data: I.Name, target: I });
                }
            }.bind(this));
            return r;
        };
        ThhjPlugin.prototype.searchString_ = function (thestring, str) {
            var r = false;
            var t = thestring.toLowerCase().replace(/\s/g, "");
            var k = str.toLowerCase();
            r = r ? r : (t.indexOf(k) >= 0);
            return r;
        };
        return ThhjPlugin;
    }());
    ThhjPlugin = __decorate([
        __param(1, Plugins_1.inject('root')),
        __param(2, Plugins_1.inject("maps/tools/layersSetting")),
        __param(3, Plugins_1.inject("maps/map"))
    ], ThhjPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ThhjPlugin;
});
