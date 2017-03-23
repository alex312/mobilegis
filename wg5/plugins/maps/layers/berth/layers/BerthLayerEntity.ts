import * as ol from "openlayers";

import {CollectionA} from "seecool/datas/Collection";
import {IDCFeature} from "seecool/Interface";
import {EventObject} from "seecool/datas/Collection";
import {MapTool} from "seecool/utils/MapTool";

class BerthLayerEntity{
    public DataSet:CollectionA<IDCFeature>;
    option;
    layer;
    source;
    constructor(option){
        this.option=option;
        this.init();
    }
    init(){
        var style = new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            //image: new ol.style.Icon({ //图标
            //    src: 'resource/sprites/images/icon/icon_berth.png',
            //    size:[22,22]
            //})
            image: new ol.style.Circle({
                radius: 3,
                fill: new ol.style.Fill({
                    color: '#77cc77'
                })
            })
        });

        this.source=new ol.source.Vector({
            wrapX: false
        });

        //var clusterSource = new ol.source.Cluster({
        //    distance: 20,
        //    source: this.source
        //});

        var styleCache = {};
        this.layer=new ol.layer.Vector({
            maxResolution:MapTool.ZoomToResolution(16-1),
            source: this.source,//clusterSource,//
            //style: style
            style:function(feature, resolution) {
                var text = feature.data.Name||"";
                if(resolution>MapTool.ZoomToResolution(17))text="";
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
                            text: text,//size.toString(),//
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
        this.DataSet=new CollectionA<IDCFeature>("BerthFeatureSet");
        this.DataSet.bind("operated",function(evt:EventObject,op){
            switch(op.op){
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
                    var list = op.data.map(function(v){
                        this.source.removeFeature(v);
                        return v;
                    }.bind(this));
                    this.source.addFeatures(list);
                    break;
                case "removed":
                    op.data.map(function(v){
                        this.source.removeFeature(v);
                    }.bind(this));
                    break;
                case "cleared":
                    this.source.clear();
                    break;
            }
        }.bind(this))
    }
    public get Source(){
        return this.source;
    }
    public get Layer(){
        return this.layer;
    }
}
export default BerthLayerEntity