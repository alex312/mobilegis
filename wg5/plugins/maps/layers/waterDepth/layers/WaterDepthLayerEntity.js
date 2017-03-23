"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "openlayers", "../../../../../seecool/datas/Collection", "../../../../../seecool/utils/MapTool"], function (require, exports, ol, Collection_1, MapTool_1) {
    "use strict";

    var WaterDepthLayerEntity = function () {
        function WaterDepthLayerEntity(options) {
            _classCallCheck(this, WaterDepthLayerEntity);

            this.oldOption_ = {};
            this.option_ = options;
            this.colorWaterDepth_ = options.colorWaterDepth || 18;
            this.init_();
        }

        _createClass(WaterDepthLayerEntity, [{
            key: "init_",
            value: function init_() {
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
                this.source_ = new ol.source.Vector({
                    wrapX: false
                });
                var clusterSource = new ol.source.Cluster({
                    distance: 40,
                    source: this.source_
                });
                var styleCache = {};
                this.layer_ = new ol.layer.Vector({
                    maxResolution: MapTool_1.MapTool.ZoomToResolution(12 - 1),
                    source: clusterSource,
                    //style:pointStyleFunction
                    style: function (feature, resolution) {
                        var size = feature.get('features').length;
                        var f2 = feature.get('features')[0];
                        var text = f2.get('name');
                        var style = styleCache[text];
                        if (this.oldOption_.colorWaterDepth != this.colorWaterDepth_) {
                            styleCache = {};
                            this.oldOption_.colorWaterDepth = this.colorWaterDepth_;
                        }
                        if (!style) {
                            var fillColor = text > this.colorWaterDepth_ ? 'rgba(255,255,18,1)' : 'rgba(0,0,0,0.5)';
                            style = new ol.style.Style({
                                text: new ol.style.Text({
                                    text: text,
                                    fill: new ol.style.Fill({
                                        color: fillColor
                                    })
                                })
                            });
                            styleCache[text] = style;
                        }
                        return style;
                    }.bind(this)
                });
                this.dataSet = new Collection_1.CollectionA("BerthFeatureSet");
                this.dataSet.bind("operated", function (evt, op) {
                    switch (op.op) {
                        case "added":
                            //var P=new ol.geom.LineString([[0,0],[60000,60000],[1000000,0],[1000000,1000000],[0,1000000]]);
                            //var Feature = new ol.Feature(P);
                            //this.source_.addFeatures([Feature]);
                            //
                            //var Pt=new ol.geom.Point([60000,50000])
                            //var te=P.containsXY(60000,50000);
                            //Feature = new ol.Feature(Pt);
                            //this.source_.addFeatures([Feature]);
                            this.source_.addFeatures(op.data);
                            //var listArray=JSTool.ArrayToArraysSplit(op.data,100);
                            //this.source_.addFeatures(listArray[0]);
                            //this.source_.addFeatures(listArray[1]);
                            //this.source_.addFeatures(listArray[2]);
                            //this.source_.addFeatures(listArray[3]);
                            //this.source_.addFeatures(listArray[4]);
                            //listArray.map(function(list){
                            //    this.source_.addFeatures(list);
                            //}.bind(this))
                            break;
                        case "modified":
                            var list = op.data.map(function (v) {
                                this.source_.removeFeature(v);
                                return v;
                            }.bind(this));
                            this.source_.addFeatures(list);
                            break;
                        case "removed":
                            op.data.map(function (v) {
                                this.source_.removeFeature(v);
                            }.bind(this));
                            break;
                        case "cleared":
                            this.source_.clear();
                            break;
                    }
                }.bind(this));
            }
        }, {
            key: "OptionChange",
            value: function OptionChange(target, value) {
                switch (target) {
                    case "colorWaterDepth":
                        this.colorWaterDepth_ = value;
                        this.source_.clear();
                        var list = this.dataSet.List();
                        this.source_.addFeatures(list);
                        break;
                }
            }
        }, {
            key: "source",
            get: function get() {
                return this.source_;
            }
        }, {
            key: "layer",
            get: function get() {
                return this.layer_;
            }
        }]);

        return WaterDepthLayerEntity;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WaterDepthLayerEntity;
});