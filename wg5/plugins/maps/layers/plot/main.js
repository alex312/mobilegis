"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
define(["require", "exports", "openlayers", "knockout", "../../../../seecool/geom/utils", "../../../../seecool/plugins/Plugins", "../../../../seecool/datas/Collection", "../../../../seecool/datas/Collection", "../../../../seecool/datas/Collection", "../../../../seecool/utils/MapTool", "../../../../seecool/StaticLib", "./datas/PlotDataApi", "./layers/VectorLayerEntity"], function (require, exports, ol, ko, utils, Plugins_1, Collection_1, Collection_2, Collection_3, MapTool_1, StaticLib_1, PlotDataApi_1, VectorLayerEntity_1) {
    "use strict";

    var PlotPlugin = function () {
        function PlotPlugin(config, root, map) {
            _classCallCheck(this, PlotPlugin);

            var featuresList = ko.observableArray();
            this.config_ = config;
            this.map_ = map;
            this.root_ = root;
            this.init_();
            this.load_();
            this.expose_();
            this.featuresList_ = featuresList;
            this.dataSet_.bind("operated", function (evt, op) {
                switch (op.op) {
                    case "added":
                        op.data.map(function (v) {
                            this.featuresList_.push(v);
                            return v;
                        }.bind(this));
                        break;
                    case "modified":
                        var list = op.data.map(function (v) {
                            this.featuresList_.remove(v);
                            return v;
                        }.bind(this));
                        this.featuresList_.push(list);
                        break;
                    case "removed":
                        op.data.map(function (v) {
                            this.featuresList_.remove(v);
                        }.bind(this));
                        break;
                    case "cleared":
                        this.featuresList_.removeAll();
                        break;
                }
            }.bind(this));
        }

        _createClass(PlotPlugin, [{
            key: "reLoadData",
            value: function reLoadData() {
                return this.reLoadData_();
            }
        }, {
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
                this.setVisible_(isShow);
            }
        }, {
            key: "expose_",
            value: function expose_() {
                var wg5 = window["webgis5"] || (window["webgis5"] = {});
                wg5.plot = {};
                wg5.plot.SetFocus = this.setFocus_.bind(this);
                this.root_.plot = wg5.plot;
            }
        }, {
            key: "setFocus_",
            value: function setFocus_(id) {
                var fid = "plot:" + id;
                var feature = this.layerEntity_.layer.getFeatureById(fid);
                this.map_.setFocus(feature);
            }
        }, {
            key: "setVisible_",
            value: function setVisible_(isShow) {
                this.layerEntity_.layer.setVisible(isShow);
            }
        }, {
            key: "init_",
            value: function init_() {
                this.dataSet_ = new Collection_3.CollectionA("dataSet");
                this.dataDTOSet_ = new Collection_3.CollectionA("dataDTOSet");
                this.dataApi_ = new PlotDataApi_1.PlotDataApi(this.config_.plotInfoApi || "api/plotInfo");
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
                        var style = this.olStyleFromPlotDataStyle_(v.Style, v.Name);
                        var geom = this.olGeomFromPlotDataGeom_(v.Geomatics);
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
            key: "featureAppand_",
            value: function featureAppand_(olFeature, data) {
                olFeature.data = data;
                olFeature.id = this.featureId_(data.Id);
            }
        }, {
            key: "featureId_",
            value: function featureId_(id) {
                return "plot:" + id;
            }
        }, {
            key: "load_",
            value: function load_() {
                return this.dataApi_.Get().then(function (pdata) {
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
            key: "reLoadData_",
            value: function reLoadData_() {
                this.dataDTOSet_.Clear();
                this.load_().then(function () {
                    //this.menuClick_();
                }.bind(this));
            }
        }, {
            key: "fromDTO_",
            value: function fromDTO_(obj) {
                var data = new StaticLib_1.PlotData();
                data.Id = obj.Id;
                data.Name = obj.Name;
                data.UserId = obj.UserId;
                var g = JSON.parse(obj.Geomatics);
                var s = JSON.parse(obj.Style);
                data.Style = s || null;
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
            key: "olStyleFromPlotDataStyle_",
            value: function olStyleFromPlotDataStyle_(style, name) {
                style = style || new StaticLib_1.DrawingStyle();
                var fillColor = style.Fill ? MapTool_1.MapTool.olColorParseARGB(style.Fill) : null;
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
                    image: new ol.style.Circle({
                        radius: 5,
                        stroke: new ol.style.Stroke({ color: [100, 255, 255, 1], width: 1 }),
                        fill: new ol.style.Fill({
                            color: [100, 100, 10, 1]
                        })
                    }),
                    text: new ol.style.Text({
                        textAlign: 'center',
                        textBaseline: 'middle',
                        font: font,
                        //text: name,
                        fill: textfill ? new ol.style.Fill({ color: textfill }) : null,
                        stroke: new ol.style.Stroke({ color: textStroke, width: 1 }),
                        offsetX: 0,
                        offsetY: 0,
                        rotation: 0
                    })
                });
            }
        }, {
            key: "olGeomFromPlotDataGeom_",
            value: function olGeomFromPlotDataGeom_(g) {
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
            key: "search_",
            value: function search_(key) {
                return new Promise(function (resolve, reject) {
                    var r = this.layer_.searchDatas(key).map(function (v) {
                        var data = { name: '名称', id: '编号' }[v.type] + ':' + v.data;
                        return { data: '[标绘]' + data, target: v.target, searchListClick: this.searchSelectCallback_.bind(this) };
                    }.bind(this));
                    resolve({ state: "ok", data: r });
                }.bind(this));
            }
        }, {
            key: "searchSelectCallback_",
            value: function searchSelectCallback_(data) {
                if (data.target) {
                    this.map_.SetFocus(this.getFeatureById_(this.featureId_(data.Id)));
                } else {
                    alert("无法定位!");
                }
            }
        }, {
            key: "getFeatureById_",
            value: function getFeatureById_(Id) {
                var r;
                this.layerEntity_.Source.forEachFeature(function (f) {
                    if (f.id == Id) {
                        r = f;
                        return f;
                    }
                });
                return r;
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
            key: "featuresList",
            get: function get() {
                return this.featuresList_;
            }
        }]);

        return PlotPlugin;
    }();

    PlotPlugin = __decorate([__param(1, Plugins_1.inject('root')), __param(2, Plugins_1.inject("maps/map"))], PlotPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PlotPlugin;
});