define(["require", "exports", "openlayers", "seecool/datas/Collection", "seecool/utils/MapTool", "plugins/maps/layers/cctv/layers/CctvLayer"], function (require, exports, ol, Collection_1, MapTool_1, CctvLayer_1) {
    "use strict";
    var CctvLayerEntity = (function () {
        function CctvLayerEntity(option) {
            this.option = option;
            this.init();
        }
        CctvLayerEntity.prototype.init = function () {
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
            this.source = new ol.source.Vector({});
            //var clusterSource = new ol.source.Cluster({
            //    distance: 20,
            //    source: this.source
            //});
            var styleCache = {};
            this.layer = new CctvLayer_1.default({
                //maxResolution:MapTool.ZoomToResolution(14), //调试时注释掉
                source: this.source,
                //style: style //调试用 勿删
                style: function (feature, resolution) {
                    var text = feature.data.Info.Name || "";
                    if (resolution > MapTool_1.MapTool.ZoomToResolution(17))
                        text = "";
                    var style = styleCache[text];
                    if (!style) {
                        style = new ol.style.Style({
                            image: new ol.style.Icon({
                                src: require.toUrl('resources/sprites/images/icon/icon_cctv.png'),
                                size: [24, 12]
                            }),
                            //image: new ol.style.Circle({
                            //    radius: 10,
                            //    fill: new ol.style.Fill({
                            //        color: '#ff0000'
                            //    })
                            //}),
                            text: new ol.style.Text({
                                text: text,
                                fill: new ol.style.Fill({
                                    color: 'rgba(0,0,0,1)'
                                }),
                                offsetY: 12
                            })
                        });
                        styleCache[text] = style;
                    }
                    return style;
                }
            });
            this.DataSet = new Collection_1.CollectionA({
                name: "CctvFeatureSet",
                isOne: function (a, b) {
                    return a.id === b.id;
                }
            });
            this.DataSet.bind("operated", function (evt, op) {
                switch (op.op) {
                    case "added":
                        ////调试用 勿删
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
                        for (var _i = 0, _a = op.data; _i < _a.length; _i++) {
                            var I = _a[_i];
                            var index = "", theOld, theNew;
                            if (I instanceof Array) {
                                theOld = I[0];
                                theNew = I[1];
                            }
                            else {
                                theOld = I;
                                theNew = I;
                            }
                            var vv = this.Layer.getFeatureById(theOld.id);
                            this.source.removeFeature(vv);
                            this.source.addFeature(theNew);
                        }
                        break;
                    case "removed":
                        op.data.map(function (v) {
                            var vv = this.Layer.getFeatureById(v.id);
                            this.source.removeFeature(vv);
                        }.bind(this));
                        break;
                    case "cleared":
                        this.source.clear();
                        break;
                }
            }.bind(this));
        };
        Object.defineProperty(CctvLayerEntity.prototype, "Source", {
            get: function () {
                return this.source;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CctvLayerEntity.prototype, "Layer", {
            get: function () {
                return this.layer;
            },
            enumerable: true,
            configurable: true
        });
        return CctvLayerEntity;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CctvLayerEntity;
});
