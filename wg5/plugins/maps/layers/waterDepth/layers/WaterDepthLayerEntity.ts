import * as ol from "openlayers";

import {CollectionA} from "seecool/datas/Collection";
import {IDCFeature} from "seecool/Interface";
import {EventObject} from "seecool/datas/Collection";
import {MapTool} from "seecool/utils/MapTool";

class WaterDepthLayerEntity{
    public dataSet:CollectionA<IDCFeature>;
    private option_;
    private oldOption_;
    private layer_;
    private source_;
    private colorWaterDepth_;
    constructor(options){
        this.oldOption_={};
        this.option_=options;
        this.colorWaterDepth_=options.colorWaterDepth||18;

        this.init_();
    }
    private init_(){
        var font='arial';
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

        var getText = function(feature, resolution) {
            var text = feature.get('name');

            return text;
        };

        var createTextStyle = function(feature, resolution) {

            return new ol.style.Text({
                //textAlign: 'center',
                //textBaseline: 'middle',
                //font: font,
                text: getText(feature, resolution),
                fill: new ol.style.Fill({color: "rgba(0, 0, 0, 0.5)"}),
                //stroke: new ol.style.Stroke({color: "black", width: 1}),
                //offsetX: 0,
                //offsetY: 0,
                //rotation: 0
            })
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

        this.source_=new ol.source.Vector({
            wrapX: false
        });

        var clusterSource = new ol.source.Cluster({
            distance: 40,
            source: this.source_
        });

        var styleCache = {};
        this.layer_=new ol.layer.Vector({
            maxResolution:MapTool.ZoomToResolution(12-1),
            source: clusterSource,//this.source_,//
            //style:pointStyleFunction
            style:function(feature, resolution) {
                var size = feature.get('features').length;
                var f2=feature.get('features')[0];
                var text = f2.get('name');
                var style = styleCache[text];
                if(this.oldOption_.colorWaterDepth!=this.colorWaterDepth_){
                    styleCache={};
                    this.oldOption_.colorWaterDepth=this.colorWaterDepth_;
                }
                if (!style) {
                    var fillColor=(text>this.colorWaterDepth_)?'rgba(255,255,18,1)':'rgba(0,0,0,0.5)';
                    style = new ol.style.Style({
                        text: new ol.style.Text({
                            text: text,//size.toString(),//
                            fill: new ol.style.Fill({
                                color:fillColor
                            })
                        })
                    });
                    styleCache[text] = style;
                }
                return style;
            }.bind(this)
        });
        this.dataSet=new CollectionA<IDCFeature>("BerthFeatureSet");
        this.dataSet.bind("operated",function(evt:EventObject,op){
            switch(op.op){
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
                    var list = op.data.map(function(v){
                        this.source_.removeFeature(v);
                        return v;
                    }.bind(this));
                    this.source_.addFeatures(list);
                    break;
                case "removed":
                    op.data.map(function(v){
                        this.source_.removeFeature(v);
                    }.bind(this));
                    break;
                case "cleared":
                    this.source_.clear();
                    break;
            }
        }.bind(this))
    }
    private OptionChange(target,value){
        switch(target){
            case "colorWaterDepth":
                this.colorWaterDepth_=value;
                this.source_.clear();
                var list=this.dataSet.List();
                this.source_.addFeatures(list);
                break;

        }
    }
    public get source(){
        return this.source_;
    }
    public get layer(){
        return this.layer_;
    }
}
export default WaterDepthLayerEntity