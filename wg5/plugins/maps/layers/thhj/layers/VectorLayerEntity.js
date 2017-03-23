"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "openlayers", "../../../../../seecool/datas/Collection", "../../../../../seecool/utils/MapTool", "../../../../../seecool/datas/VectorLayer"], function (require, exports, ol, Collection_1, MapTool_1, VectorLayer_1) {
    "use strict";

    var VectorLayerEntity = function () {
        function VectorLayerEntity(option) {
            _classCallCheck(this, VectorLayerEntity);

            this.option = option;
            this.init();
        }

        _createClass(VectorLayerEntity, [{
            key: "init",
            value: function init() {
                var style = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    //image: new ol.style.Icon({ //图标
                    //    src: require.toUrl('resource/sprites/images/icon/icon_berth.png'),
                    //    size:[22,22]
                    //})
                    image: new ol.style.Circle({
                        radius: 3,
                        fill: new ol.style.Fill({
                            color: '#77cc77'
                        })
                    })
                });
                this.source = new ol.source.Vector({
                    wrapX: false
                });
                //var clusterSource = new ol.source.Cluster({
                //    distance: 20,
                //    source: this.source
                //});
                var styleCache = {};
                this.layer = new VectorLayer_1.default({
                    maxResolution: MapTool_1.MapTool.ZoomToResolution(12 - 1),
                    source: this.source,
                    //style: style
                    style: function style(feature, resolution) {
                        var text = feature.data.Name || "";
                        if (resolution > MapTool_1.MapTool.ZoomToResolution(17)) text = "";
                        var style = styleCache[text];
                        if (!style) {
                            style = new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: 3,
                                    fill: new ol.style.Fill({
                                        color: '#77cc77'
                                    })
                                }),
                                text: new ol.style.Text({
                                    text: text,
                                    fill: new ol.style.Fill({
                                        color: 'rgba(0,0,0,1)'
                                    }),
                                    offsetY: 10
                                })
                            });
                            styleCache[text] = style;
                        }
                        return style;
                    }
                });
                this.DataSet = new Collection_1.CollectionA("thhjFeatureSet");
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

        return VectorLayerEntity;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VectorLayerEntity;
});