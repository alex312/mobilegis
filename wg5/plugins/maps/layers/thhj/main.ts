import * as ol from "openlayers";

import {inject} from "seecool/plugins/plugins";
import * as utils from "seecool/geom/utils";
import {pdata} from "seecool/Interface";
import {CollectionLinkerOption} from "seecool/datas/Collection";
import {CollectionLinker} from "seecool/datas/Collection";
import {CollectionA} from "seecool/datas/Collection";
import {IDCFeature} from "seecool/Interface";
import {Status} from "seecool/utils/Status";
import {MapTool} from "seecool/utils/MapTool";
import {Location, LocationDTO, Geomatics, DrawingStyle, ShapeType} from "seecool/StaticLib";

import LocationApi from "./datas/LocationApi";

import VectorLayerEntity from "./layers/VectorLayerEntity";

class ThhjPlugin {
    config_;
    layerEntity_:VectorLayerEntity;
    dataSet_:CollectionA<Location>;
    dataDTOSet_:CollectionA<LocationDTO>
    link_DataSet_DataDTOSet_:CollectionLinker<Location,LocationDTO>;
    link_LayerEntity_DataSet_:CollectionLinker<IDCFeature,Location>;
    dataApi_;
    map_;
    status_;

    constructor(config,
                @inject("maps/map") map) {
        this.config_ = config;
        this.map_ = map;
        this.init_();
        this.load_();
    }

    init_() {
        this.dataSet_ = new CollectionA<Location>("dataSet");
        this.dataDTOSet_ = new CollectionA<LocationDTO>("dataDTOSet");
        this.dataApi_ = new LocationApi(this.config_.locationApi || "api/location");
        this.layerEntity_ = new VectorLayerEntity({});
        this.link_DataSet_DataDTOSet_ = new CollectionLinker<Location,LocationDTO>(CollectionLinkerOption<Location,LocationDTO>(
            this.dataDTOSet_,
            this.dataSet_,
            function (v) {
                return true
            },
            this.fromDTO_.bind(this)
        ));
        this.link_LayerEntity_DataSet_ = new CollectionLinker<IDCFeature,Location>({
            sourceCollection: this.dataSet_,
            targetCollection: this.layerEntity_.DataSet,
            filterFunction: function (v) {
                return true
            },
            convertFunction: function (v:Location) {
                var style = this.olStyleFromThhjDataStyle_(v.DrawingStyle, v.Name);
                var geom = this.olGeomFromThhjDataGeom_(v.Geomatics);
                var f2 = new ol.Feature({
                    geometry: geom
                });
                f2.setStyle(style);
                this.featureAppand_(f2, v);
                return f2;
            }.bind(this)
        })
        this.link_DataSet_DataDTOSet_.start();
        this.link_LayerEntity_DataSet_.start();

        this.status_ = new Status(this);
        this.status_.ConditionTurn(true, "hided");//hided
        this.switch_(null);
        //this.ui__.RegisterShortBarButton(null,"thhjSwitch","桩位",this.Switch.bind(this)).click();
        this.map_.map.addLayer(this.layerEntity_.layer);
    }

    private switch_(evt) {
        this.status_
            .IfTurnDo("hided", "displayed", function () {
                this.layerEntity_.layer.setVisible(true);
                if (evt && evt.currentTarget)evt.currentTarget.className = "btn btn-success";
            })
            .IfTurnDo("displayed", "hided", function () {
                this.layerEntity_.layer.setVisible(false);
                //this.mapPlugin_.map.removeLayer(this.layer_);
                if (evt && evt.currentTarget)evt.currentTarget.className = "btn btn-danger";
            })
            .Turned();
    }

    private featureAppand_(olFeature, data) {
        olFeature.data = data;
        olFeature.id = "thhj:" + data.Id;
    }

    load_() {
        this.dataApi_.Get$types("")
            .then(function (pdata:pdata) {
                return new Promise(function (resolve, reject) {
                    switch (pdata.state) {
                        case "apiok":
                            this.dataDTOSet_.Add(<Array<LocationDTO>>pdata.data)
                            resolve();
                            break;
                        default:
                            reject()
                    }
                }.bind(this))
            }.bind(this))
            .catch(function (pdata:pdata) {
                switch (pdata.state) {
                    case "apierr":
                        break;
                }
                if (!pdata.state)throw(pdata);
            })
    }

    fromDTO_(obj:LocationDTO):Location {
        var data:Location = {
            Id: '' + obj.Id,
            TrafficEnvType: obj.TrafficEnvType,
            OrganizationId: `${obj.OrganizationId}`,
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
        return data
    }

    toDTO_(obj:Location):LocationDTO {
        var dto:LocationDTO = {
            Id: <number><any>obj.Id,
            TrafficEnvType: obj.TrafficEnvType,
            OrganizationId: parseInt(obj.OrganizationId) || null,
            Name: obj.Name,
            DrawingStyle: JSON.stringify(obj.DrawingStyle)
        };
        var tg:any = {};

        if (obj.Geomatics && obj.Geomatics.Points) {
            tg.ShapeType = obj.Geomatics.ShapeType;
            var points = obj.Geomatics.Points.map(function (v) {
                return '' + v[0] + ',' + v[1];
            });
            tg.Points = points;
        }
        dto.Geomatics = JSON.stringify(tg);
        return dto
    }

    olStyleFromThhjDataStyle_(style:DrawingStyle, name):ol.style.Style {
        style = style || new DrawingStyle();
        var fillColor = style.Fill ? MapTool.olColorParseARGB(style.Fill) : null;//fillColor[3]
        fillColor = (fillColor && fillColor[3]) != 0 ? fillColor : null;
        var strokeColor = style.Stroke ? MapTool.olColorParseARGB(style.Stroke) : "#000000";
        var strokeWidth = style.StrokeThickness ? parseInt((<string><any>style.StrokeThickness)) : 1;
        var lineDash = style.StrokeDashArray ? style.StrokeDashArray : '';
        lineDash = JSON.parse('[' + lineDash + ']');
        var font = 'arial';
        var textStyle:any = style.TextStyle || {};
        var textfill = textStyle.Color ? MapTool.olColorParseARGB(textStyle.Color) : '#000000';
        var textStroke = '#000000';

        return new ol.style.Style({
            fill: fillColor ? new ol.style.Fill({color: fillColor}) : null,
            stroke: new ol.style.Stroke({
                color: strokeColor,
                width: strokeWidth,
                lineDash: <number[]>lineDash
            }),
            image: new ol.style.Icon({
                src: 'resources/sprites/images/icon/icon_berth.png',
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
                fill: textfill ? new ol.style.Fill({color: textfill}) : null,
                //stroke: new ol.style.Stroke({color: textStroke, width: 1}),
                offsetX: 0,
                offsetY: 15,
                rotation: 0
            })
        })
    }

    olGeomFromThhjDataGeom_(g:Geomatics) {
        var list = g.Points.map(function (v) {
            return ol.proj.fromLonLat(v);
        });
        var geom;
        if (g.ShapeType) {
            switch (<ShapeType>g.ShapeType) {
                case ShapeType.Point:
                    geom = new ol.geom.Point(list[0]);
                    break;
                case ShapeType.Line:
                    geom = new ol.geom.LineString(list);
                    break;
                case ShapeType.PolyLine:
                    geom = new ol.geom.LineString(list);
                    break;
                case ShapeType.Rectanlge:
                    geom = new ol.geom.Polygon([[list[0], [list[0][0], list[1][1]], list[1], [list[1][0], list[0][1]],list[0]]]);//([list]);
                    break;
                case ShapeType.Circle:
                    geom = new ol.geom.Circle(list[0], Math.sqrt(utils.squaredDistance(list[0][0], list[0][1], list[1][0], list[1][1])));
                    break;
                case ShapeType.Polygon:
                    if(list[0][0]!=list[list.length-1][0]||list[0][1]!=list[list.length-1][1])
                        list.push(list[0]);
                    geom = new ol.geom.Polygon([list]);
                    break;
            }
        }
        else {
            if (list.length === 1) {
                geom = new ol.geom.Point(list[0]);
            }else if (list.length === 2) {
                geom = new ol.geom.LineString(list);
            }else {
                if(list[0][0]!=list[list.length-1][0]||list[0][1]!=list[list.length-1][1])
                    list.push(list[0]);
                geom = new ol.geom.Polygon([list]);
            }
        }
        return geom;
    }

    olLonLatPerse_(str) {
        var index = str.indexOf(",");
        var a = str.substr(0, index);
        var b = str.substr(index + 1, str.length - index);
        a = Number(a);
        b = Number(b);
        return [a, b]
    }
}

export default ThhjPlugin