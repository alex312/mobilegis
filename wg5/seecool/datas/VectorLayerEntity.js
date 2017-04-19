define(["require", "exports", "openlayers", "./Collection", "../utils/MapTool", "./VectorLayer"], function (require, exports, ol, Collection_1, MapTool_1, VectorLayer_1) {
    "use strict";
    //example for style
    // var style = new ol.style.Style({
    //     fill: new ol.style.Fill({
    //         color: 'rgba(255, 255, 255, 0.2)'
    //     }),
    //     stroke: new ol.style.Stroke({
    //         color: '#ffcc33',
    //         width: 2
    //     }),
    //     //image: new ol.style.Icon({ //图标
    //     //    src: require.toUrl('resource/sprites/images/icon/icon_berth.png'),
    //     //    size:[22,22]
    //     //})
    //     image: new ol.style.Circle({
    //         radius: 3,
    //         fill: new ol.style.Fill({
    //             color: '#77cc77'
    //         })
    //     })
    // });
    //example for styleFunction
    // var styleFunction = function (feature, resolution) {
    //     var text = (feature.data && feature.data.Name) || "";
    //     if (resolution > MapTool.ZoomToResolution(17))text = "";
    //     var style = styleCache[text];
    //     if (!style) {
    //         style = new ol.style.Style({
    //             image: new ol.style.Circle({
    //                 radius: 3,
    //                 fill: new ol.style.Fill({
    //                     color: '#77cc77'
    //                 })
    //             }),
    //             text: new ol.style.Text({
    //                 text: text,//size.toString(),//
    //                 fill: new ol.style.Fill({
    //                     color: 'rgba(0,0,0,1)'
    //                 }),
    //                 offsetY: 10
    //             })
    //         });
    //         styleCache[text] = style;
    //     }
    //     return style;
    // }
    var VectorLayerEntity = (function () {
        function VectorLayerEntity(options) {
            this.options_ = options || {};
            this.init();
        }
        VectorLayerEntity.prototype.init = function () {
            this.source = new ol.source.Vector({
                wrapX: false
            });
            //var clusterSource = new ol.source.Cluster({
            //    distance: 20,
            //    source: this.source
            //});
            var styleCache = {};
            this.layer = new VectorLayer_1.default({
                usePickup: this.options_.usePickup,
                maxResolution: MapTool_1.MapTool.ZoomToResolution((this.options_.maxZoom || 12) - 1),
                source: this.source,
                style: this.options_.style
            });
            this.DataSet = new Collection_1.CollectionA("VectorLayerFeatureSet");
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
        Object.defineProperty(VectorLayerEntity.prototype, "Source", {
            get: function () {
                return this.source;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VectorLayerEntity.prototype, "Layer", {
            get: function () {
                return this.layer;
            },
            enumerable: true,
            configurable: true
        });
        return VectorLayerEntity;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VectorLayerEntity;
});
