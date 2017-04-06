"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    } return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = undefined && undefined.__param || function (paramIndex, decorator) {
    return function (target, key) {
        decorator(target, key, paramIndex);
    };
};
define(["require", "exports", "openlayers", "../../../../seecool/geom/utils", "../../../../seecool/plugins/Plugins", "../../../../seecool/datas/Collection", "../../../../seecool/datas/Collection", "../../../../seecool/datas/Collection", "../../../../seecool/utils/MapTool", "../../../../seecool/StaticLib", "../../../../seecool/utils/Design", "../../../../seecool/utils/JSTool", "./datas/LocationApi", "./layers/VectorLayerEntity", "./datas/DefaultTrafficEnvStyleApi"], function (require, exports, ol, utils, Plugins_1, Collection_1, Collection_2, Collection_3, MapTool_1, StaticLib_1, Design_1, JSTool_1, LocationApi_1, VectorLayerEntity_1, DefaultTrafficEnvStyleApi_1) {
    "use strict";

    var ThhjPlugin = function () {
        function ThhjPlugin(config, root, map) {
            _classCallCheck(this, ThhjPlugin);

            this.config_ = config;
            this.map_ = map;
            this.root_ = root;
            this.promise_ = {};
            this.init_();
            this.load_();
            this.expose_();
        }

        _createClass(ThhjPlugin, [{
            key: "searchDatas",
            value: function searchDatas(key) {
                return this.searchDatas_(key);
            }
        }, {
            key: "setFocus",
            value: function setFocus(id) {
                return this.setFocus_(id);
            }
        }, {
            key: "setVisible",
            value: function setVisible(isShow) {
                return this.setVisible_(isShow);
            }
        }, {
            key: "getTrafficEnvType",
            value: function getTrafficEnvType(nameOrtype) {
                return this.getTrafficEnvType_(nameOrtype);
            }
        }, {
            key: "expose_",
            value: function expose_() {
                var wg5 = window["webgis5"] || (window["webgis5"] = {});
                wg5.thhj = {};
                wg5.thhj.SetFocus = this.setFocus_.bind(this);
                wg5.thhj.SetFocusIsFully = function (id, isFully) {
                    this.setFocusIsFully_(id, isFully);
                }.bind(this);
                this.root_.thhj = wg5.thhj;
            }
        }, {
            key: "setFocus_",
            value: function setFocus_(id) {
                this.setFocusIsFully_(id, true);
            }
        }, {
            key: "setFocusIsFully_",
            value: function setFocusIsFully_(id, isFully) {
                var fid = "thhj:" + id;
                var feature = this.layerEntity_.layer.getFeatureById(fid);
                this.map_.setFocus(feature, isFully);
            }
        }, {
            key: "init_",
            value: function init_() {
                this.defaultTrafficEnvStyleApi_ = new DefaultTrafficEnvStyleApi_1.default(this.config_.defaultTrafficEnvStyleApi || "api/DefaultTrafficEnvStyle");
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
                    filterFunction: function filterFunction(v) {
                        return true;
                    },
                    convertFunction: function (v) {
                        var style = StaticLib_1.olStyleFromStyle(StaticLib_1.TrafficEnvStyle(v.TrafficEnvType), v.Name); //this.olStyleFromThhjDataStyle_(v.DrawingStyle, v.Name);
                        if (v.Geomatics !== undefined && v.Geomatics !== null && v.Geomatics.Points !== undefined && v.Geomatics.Points !== null && v.Geomatics.Points.length !== 0)
                            var geom = this.olGeomFromThhjDataGeom_(v.Geomatics);
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
            }
        }, {
            key: "setVisible_",
            value: function setVisible_(isShow) {
                this.layerEntity_.layer.setVisible(isShow);
            }
        }, {
            key: "featureAppand_",
            value: function featureAppand_(olFeature, data) {
                olFeature.data = data;
                olFeature.id = "thhj:" + data.Id;
            }
        }, {
            key: "load_",
            value: function load_() {
                this.promise_["locationLoad"] = Promise.resolve().then(this.defaultTrafficEnvStyleApi_.Get.bind(this.defaultTrafficEnvStyleApi_)).then(function (pdata) {
                    switch (pdata.state) {
                        case 'apiok':
                            pdata.data.map(function (v) {
                                var style = JSON.parse(v.Style);
                                StaticLib_1.TrafficEnvStyle(style.TrafficEnvType, style); //
                            });
                            break;
                    }
                }).then(this.dataApi_.Get$types.bind(this.dataApi_, "")) //this.dataApi_.Get$types("")
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
                    }.bind(this)).catch(function (pdata) {
                        switch (pdata.state) {
                            case "apierr":
                                break;
                        }
                        if (!pdata.state) throw pdata;
                    });
            }
        }, {
            key: "fromDTO_",
            value: function fromDTO_(obj) {
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
                if (data.Geomatics && data.Geomatics.Points) {
                    var str;
                    for (var ii in g.Points) {
                        str = g.Points[ii];
                        var ollonlat = this.olLonLatPerse_(str);
                        points.push(ollonlat);
                    }
                    data.Geomatics.Points = points;
                }
                return data;
            }
        }, {
            key: "toDTO_",
            value: function toDTO_(obj) {
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
            }
        }, {
            key: "olStyleFromThhjDataStyle_",
            value: function olStyleFromThhjDataStyle_(style, name) {
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
            }
        }, {
            key: "olGeomFromThhjDataGeom_",
            value: function olGeomFromThhjDataGeom_(g) {
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
                            if (list[0][0] != list[list.length - 1][0] || list[0][1] != list[list.length - 1][1]) list.push(list[0]);
                            geom = new ol.geom.Polygon([list]);
                            break;
                    }
                } else {
                    if (list.length === 1) {
                        geom = new ol.geom.Point(list[0]);
                    } else if (list.length === 2) {
                        geom = new ol.geom.LineString(list);
                    } else {
                        if (list[0][0] != list[list.length - 1][0] || list[0][1] != list[list.length - 1][1]) list.push(list[0]);
                        geom = new ol.geom.Polygon([list]);
                    }
                }
                return geom;
            }
        }, {
            key: "olLonLatPerse_",
            value: function olLonLatPerse_(str) {
                var index = str.indexOf(",");
                var a = str.substr(0, index);
                var b = str.substr(index + 1, str.length - index);
                a = Number(a);
                b = Number(b);
                return [a, b];
            }
        }, {
            key: "getTrafficEnvType_",
            value: function getTrafficEnvType_(nameOrtype) {
                if (!trafficEnvType) {
                    var ns = new Design_1.Design.ScopeManager("");
                    var trafficEnvType = ns.getV1Enum("TrafficEnvType");
                    var c, r;

                    var _JSTool_1$JSTool$Arra = JSTool_1.JSTool.ArraysDoContext(trafficEnvType.Names, trafficEnvType.Values, trafficEnvType.Labels, function (c, n, v, l) {
                        c[n] = { name: n, value: v, label: l };
                        c[v] = { name: n, value: v, label: l };
                    });

                    var _JSTool_1$JSTool$Arra2 = _slicedToArray(_JSTool_1$JSTool$Arra, 2);

                    c = _JSTool_1$JSTool$Arra2[0];
                    r = _JSTool_1$JSTool$Arra2[1];

                    trafficEnvType = c;
                }
                return trafficEnvType[nameOrtype] || { name: 'other', value: Infinity, label: "其他" };
            }
        }, {
            key: "searchDatas_",
            value: function searchDatas_(key) {
                var r = [];
                this.dataSet_.map(function (I) {
                    if (this.searchString_(I.Name, key)) {
                        r.push({ type: "name", data: I.Name, target: I });
                    }
                }.bind(this));
                return r;
            }
        }, {
            key: "searchString_",
            value: function searchString_(thestring, str) {
                var r = false;
                var t = thestring.toLowerCase().replace(/\s/g, "");
                var k = str.toLowerCase();
                r = r ? r : t.indexOf(k) >= 0;
                return r;
            }
        }, {
            key: "layerSource",
            get: function get() {
                return this.layerEntity_.Source;
            }
        }]);

        return ThhjPlugin;
    }();

    ThhjPlugin = __decorate([__param(1, Plugins_1.inject('root')), __param(2, Plugins_1.inject("maps/map"))], ThhjPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ThhjPlugin;
});