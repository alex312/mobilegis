"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "openlayers", "../../../../../seecool/datas/Collection", "../../../../../seecool/geom/utils"], function (require, exports, ol, Collection_1, utils_1) {
    "use strict";

    var EventDealLayerEntity = function () {
        function EventDealLayerEntity(option) {
            _classCallCheck(this, EventDealLayerEntity);

            this.oldOption = {};
            this.option = option;
            this.colorWaterDepth = option.colorWaterDepth || 18;
            this.init();
        }

        _createClass(EventDealLayerEntity, [{
            key: "init",
            value: function init() {
                var font = 'arial';
                var style = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 3,
                        fill: new ol.style.Fill({
                            color: '#77cc77'
                        })
                    })
                });
                var getText = function getText(feature, resolution) {
                    var text = feature.get('name');
                    return text;
                };
                var createTextStyle = function createTextStyle(feature, resolution) {
                    return new ol.style.Text({
                        //textAlign: 'center',
                        //textBaseline: 'middle',
                        //font: font,
                        text: getText(feature, resolution),
                        fill: new ol.style.Fill({ color: "rgba(0, 0, 0, 0.5)" })
                    });
                };
                function pointStyleFunction(feature, resolution) {
                    return new ol.style.Style({
                        //image: new ol.style.Circle({
                        //    radius: 3,
                        //    //fill: new ol.style.Fill({color: 'rgba(255, 0, 0, 0.1)'})//,
                        //    //stroke: new ol.style.Stroke({color: 'red', width: 1})
                        //}),
                        text: createTextStyle(feature, resolution)
                    });
                }
                this.source = new ol.source.Vector({
                    wrapX: false
                });
                //var clusterSource = new ol.source.Cluster({
                //    distance: 40,
                //    source: this.source
                //});
                var styleCache = {};
                this.layer = new ol.layer.Vector({
                    //maxResolution:MapTool.ZoomToResolution(12-1),
                    source: this.source,
                    //style:pointStyleFunction
                    style: function (feature, resolution) {
                        //var size = feature.get('features').length;
                        var f2 = feature; //feature.get('features')[0];
                        var text = f2.get('name');
                        var style = styleCache[text];
                        if (this.oldOption.colorWaterDepth != this.colorWaterDepth) {
                            styleCache = {};
                            this.oldOption.colorWaterDepth = this.colorWaterDepth;
                        }
                        if (!style) {
                            var fillColor = text > this.colorWaterDepth ? 'rgba(255,255,18,1)' : 'rgba(0,0,0,0.5)';
                            style = new ol.style.Style({
                                text: new ol.style.Text({
                                    text: text,
                                    fill: new ol.style.Fill({
                                        color: fillColor
                                    })
                                }),
                                image: new ol.style.Icon({
                                    src: require.toUrl('resources/sprites/images/icon/icon_anchor_warm.png'),
                                    anchor: [0.5, 0.5],
                                    size: [22, 22]
                                })
                            });
                            styleCache[text] = style;
                        }
                        return style;
                    }.bind(this)
                });
                this.layer.pickup = function (coordinate, maxOffset, res) {
                    var mindistance = Infinity;
                    var feature;
                    var source = this.getSource();
                    source.forEachFeature(function (I) {
                        var df = [0, 0];
                        var testg = I.getGeometry();
                        testg.getClosestPoint([coordinate[0], coordinate[1]], df);
                        var distance = utils_1.squaredDistance(coordinate[0], coordinate[1], df[0], df[1]);
                        if (mindistance > distance) {
                            mindistance = distance;
                            feature = I;
                        }
                    });
                    return { feature: feature, distance: mindistance };
                };
                this.layer.getFeatureById = function (id) {
                    var source = this.getSource();
                    var r = null;
                    source.forEachFeature(function (I) {
                        if (I.id == id) r = I;
                    });
                    return r;
                };
                this.layer.searchDatas = function (key) {
                    var r = [];
                    //name
                    var source = this.getSource();
                    source.forEachFeature(function (I) {
                        var data = I.data;
                        if (this.searchString(data.Name, key)) {
                            r.push({ type: "name", data: data.Name, target: I });
                        }
                    });
                    return r;
                };
                this.layer.searchString = function (thestring, str) {
                    var r = false;
                    var t = thestring.toLowerCase().replace(/\s/g, "");
                    var k = str.toLowerCase();
                    r = r ? r : t.indexOf(k) >= 0;
                    return r;
                };
                this.DataSet = new Collection_1.CollectionA("BerthFeatureSet");
                this.DataSet.bind("operated", function (evt, op) {
                    switch (op.op) {
                        case "added":
                            //var P=new ol.geom.LineString([[0,0],[60000,60000],[1000000,0],[1000000,1000000],[0,1000000]]);
                            //var Feature = new ol.Feature(P);
                            //this.source.addFeatures([Feature]);
                            //
                            //var Pt=new ol.geom.Point([60000,50000])
                            //var te=P.containsXY(60000,50000);
                            //Feature = new ol.Feature(Pt);
                            //this.source.addFeatures([Feature]);
                            this.source.addFeatures(op.data);
                            //var listArray=JSTool.ArrayToArraysSplit(op.data,100);
                            //this.source.addFeatures(listArray[0]);
                            //this.source.addFeatures(listArray[1]);
                            //this.source.addFeatures(listArray[2]);
                            //this.source.addFeatures(listArray[3]);
                            //this.source.addFeatures(listArray[4]);
                            //listArray.map(function(list){
                            //    this.source.addFeatures(list);
                            //}.bind(this))
                            break;
                        case "modified":
                            var list = op.data.map(function (v) {
                                this.source.removeFeature(v);
                                return v;
                            }.bind(this));
                            this.source.addFeatures(list);
                            break;
                        case "removed":
                            op.data.map(function (v) {
                                this.source.removeFeature(v);
                            }.bind(this));
                            break;
                        case "cleared":
                            this.source.clear();
                            break;
                    }
                }.bind(this));
            }
        }, {
            key: "OptionChange",
            value: function OptionChange(target, value) {
                switch (target) {
                    case "colorWaterDepth":
                        this.colorWaterDepth = value;
                        this.source.clear();
                        var list = this.DataSet.List();
                        this.source.addFeatures(list);
                        break;
                }
            }
        }, {
            key: "Source",
            get: function get() {
                return this.source;
            }
        }, {
            key: "Layer",
            get: function get() {
                return this.layer;
            }
        }]);

        return EventDealLayerEntity;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventDealLayerEntity;
});