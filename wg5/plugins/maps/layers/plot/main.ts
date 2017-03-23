import * as ol from "openlayers";
import * as utils from "seecool/geom/utils";
import * as ko from "knockout";

import {inject} from "seecool/plugins/plugins";
import {pdata} from "seecool/Interface";
import {CollectionLinkerOption, EventObject} from "seecool/datas/Collection";
import {CollectionLinker} from "seecool/datas/Collection";
import {CollectionA} from "seecool/datas/Collection";
import {IDCFeature} from "seecool/Interface";
import {Status} from "seecool/utils/Status";
import {JSTool} from "seecool/utils/JSTool";
import {MapTool} from "seecool/utils/MapTool";
import {PlotData, PlotDataDTO, Geomatics, DrawingStyle, ShapeType} from "seecool/StaticLib";
import {PlotDataApi} from "./datas/PlotDataApi";
import {Frame} from "../../ui/frame/main";

import VectorLayerEntity from "./layers/VectorLayerEntity";
import SidePanel from "./SidePanel";
import PlotInfoSet from "./uis/PlotInfoSet";
import Alarm from "./uis/Alarm";
import PlotStyleSet from "./uis/PlotStyleSet";
import {ExtendFeature} from "seecool/StaticLib";

class PlotPlugin {
    private config_;
    private layerEntity_: VectorLayerEntity;
    private dataSet_: CollectionA<PlotData>;
    private dataDTOSet_: CollectionA<PlotDataDTO>;
    private link_DataSet_DataDTOSet_: CollectionLinker<PlotData,PlotDataDTO>;
    private link_LayerEntity_DataSet_: CollectionLinker<IDCFeature,PlotData>;
    private dataApi_;
    private map_;
    private status_;
    private plotShapeType_: string;
    private interActionDraw_;
    private datas_;
    private featuresList_;

    constructor(config,
                @inject("maps/map") map) {

        var featuresList = ko.observableArray();
        this.config_ = config;
        this.map_ = map;
        this.init_();
        this.load_();
        this.featuresList_ = featuresList;
        this.dataSet_.bind("operated", function (evt: EventObject, op) {
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
        }.bind(this))
    }

    private init_() {
        this.dataSet_ = new CollectionA<PlotData>("dataSet");
        this.dataDTOSet_ = new CollectionA<PlotDataDTO>("dataDTOSet");
        this.dataApi_ = new PlotDataApi(this.config_.plotInfoApi || "api/plotInfo");
        this.layerEntity_ = new VectorLayerEntity({});
        this.link_DataSet_DataDTOSet_ = new CollectionLinker<PlotData,PlotDataDTO>(CollectionLinkerOption<PlotData,PlotDataDTO>(
            this.dataDTOSet_,
            this.dataSet_,
            function (v) {
                return true
            },
            this.fromDTO_.bind(this)
        ));
        this.link_LayerEntity_DataSet_ = new CollectionLinker<IDCFeature,PlotData>({
            sourceCollection: this.dataSet_,
            targetCollection: this.layerEntity_.DataSet,
            filterFunction: function (v) {
                return true
            },
            convertFunction: function (v: PlotData) {
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

        this.status_ = new Status(this);
        this.status_.ConditionTurn(true, "hided");//hided
        this.switch_(null);
        //this.ui_.RegisterShortBarButton(null,"plotSwitch","桩位",this.switch_.bind(this)).click();
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
        olFeature.id = this.featureId_(data.Id);
    }

    private featureId_(id: string|number) {
        return "plot:" + id;
    }

    private load_() {
        return this.dataApi_.Get()
            .then(function (pdata: pdata) {
                return new Promise(function (resolve, reject) {
                    switch (pdata.state) {
                        case "apiok":
                            this.dataDTOSet_.Add(<Array<PlotDataDTO>>pdata.data);
                            resolve();
                            break;
                        default:
                            reject();
                    }
                }.bind(this))
            }.bind(this))
            .catch(function (pdata: pdata) {
                switch (pdata.state) {
                    case "apierr":
                        break;
                }
                if (!pdata.state)throw(pdata);
            })
    }

    private fromDTO_(obj: PlotDataDTO): PlotData {
        var data = new PlotData();
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
        return data
    }

    private toDTO_(obj: PlotData): PlotDataDTO {
        var dto = new PlotDataDTO();
        dto.Id = obj.Id;
        dto.Name = obj.Name;
        dto.UserId = obj.UserId;
        dto.Style = JSON.stringify(obj.Style);
        var tg: any = {};
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

    private olStyleFromPlotDataStyle_(style: DrawingStyle, name): ol.style.Style {
        style = style || new DrawingStyle();
        var fillColor = style.Fill ? MapTool.olColorParseARGB(style.Fill) : null;
        fillColor = (fillColor && fillColor[3]) != 0 ? fillColor : null;
        var strokeColor = style.Stroke ? MapTool.olColorParseARGB(style.Stroke) : "#000000";
        var strokeWidth = style.StrokeThickness ? parseInt((<string><any>style.StrokeThickness)) : 1;
        var lineDash = style.StrokeDashArray ? style.StrokeDashArray : '';
        lineDash = (JSON.parse('[' + lineDash + ']'));
        var font = 'arial';
        var textStyle: any = style.TextStyle || {};
        var textfill = textStyle.Color ? MapTool.olColorParseARGB(textStyle.Color) : '#000000';
        var textStroke = '#000000';

        return new ol.style.Style({
            fill: fillColor ? new ol.style.Fill({color: fillColor}) : null,
            stroke: new ol.style.Stroke({
                color: strokeColor,
                width: strokeWidth,
                lineDash: <number[]>lineDash
            }),
            image: new ol.style.Circle({ //todo Style 的 Image未解析
                radius: 5,
                stroke: new ol.style.Stroke({color: [100, 255, 255, 1], width: 1}),
                fill: new ol.style.Fill({
                    color: [100, 100, 10, 1]
                })
            }),
            text: new ol.style.Text({
                textAlign: 'center',
                textBaseline: 'middle',
                font: font,
                //text: name,
                fill: textfill ? new ol.style.Fill({color: textfill}) : null,
                stroke: new ol.style.Stroke({color: textStroke, width: 1}),
                offsetX: 0,
                offsetY: 0,
                rotation: 0
            })
        })
    }

    private olGeomFromPlotDataGeom_(g: Geomatics) {
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
                    geom = new ol.geom.Polygon([[list[0], [list[0][0], list[1][1]], list[1], [list[1][0], list[0][1]], list[0]]]);//([list]);
                    break;
                case ShapeType.Circle:
                    geom = new ol.geom.Circle(list[0], Math.sqrt(utils.squaredDistance(list[0][0], list[0][1], list[1][0], list[1][1])));
                    break;
                case ShapeType.Polygon:
                    if (list[0][0] != list[list.length - 1][0] || list[0][1] != list[list.length - 1][1])
                        list.push(list[0]);
                    geom = new ol.geom.Polygon([list]);
                    break;
            }
        }
        else {
            if (list.length === 1) {
                geom = new ol.geom.Point(list[0]);
            } else if (list.length === 2) {
                geom = new ol.geom.LineString(list);
            } else {
                if (list[0][0] != list[list.length - 1][0] || list[0][1] != list[list.length - 1][1])
                    list.push(list[0]);
                geom = new ol.geom.Polygon([list]);
            }
        }
        return geom;
    }

    private olLonLatPerse_(str) {
        var index = str.indexOf(",");
        var a = str.substr(0, index);
        var b = str.substr(index + 1, str.length - index);
        a = Number(a);
        b = Number(b);
        return [a, b]
    }

    private addInteraction_(toolType) {
        var value = toolType;
        if (value !== 'None') {
            var geometryFunction, maxPoints;
            if (value === 'Line') {
                value = 'LineString';
                maxPoints = 2;
            }
            if (value === 'PolyLine') {
                value = 'LineString';
            }
            if (value === 'Square') {
                value = 'Circle';
                geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
            } else if (value === 'Rectanlge') {
                value = 'LineString';
                maxPoints = 2;
                geometryFunction = function (coordinates, geometry) {
                    if (!geometry) {
                        geometry = new ol.geom.Polygon(null);
                    }
                    var start = coordinates[0];
                    var end = coordinates[1];
                    geometry.setCoordinates([
                        [start, [start[0], end[1]], end, [end[0], start[1]], start]
                    ]);
                    return geometry;
                };
            }
        }
        this.interActionDraw_ = new ol.interaction.Draw({
            source: this.layerEntity_.Source,
            style: this.layerEntity_.Layer.getStyle(),
            type: (value),
            geometryFunction: geometryFunction,
            maxPoints: maxPoints
        });
        this.interActionDraw_.on("drawend", this.drawendfun_.bind(this), this.interActionDraw_);
        this.map_.map.addInteraction(this.interActionDraw_);
    }

    private drawendfun_(evt) {
        var f = evt.feature;
        this.addPlotInfo_(f);
    }

    private addPlotInfo_(f: ol.Feature) {
        var g: any = f.getGeometry();
        var A = g.flatCoordinates;
        var coordC = JSTool.ArrayToArraysSplit(A, 2);
        var lonlats = coordC.map((c)=> {
            return ol.proj.toLonLat(c);
        });

        switch (ShapeType[this.plotShapeType_]) {
            case ShapeType.Point:
                break;
            case ShapeType.Line:
                break;
            case ShapeType.PolyLine:
                break;
            case ShapeType.Rectanlge:
                lonlats = [lonlats[0], lonlats[2]];
                break;
            case ShapeType.Circle:
                break;
            case ShapeType.Polygon:
                break;
        }

        var plotInfoSet = new PlotInfoSet({lonlats: lonlats});
        plotInfoSet.show()
            .then(function (pdata: pdata) {
                return new Promise(function (resolve, reject) {
                    var plotData;
                    switch (pdata.state) {
                        case "ok":
                            //构建PlotDate
                            var plotData: any = new PlotData();
                            plotData.Name = pdata.data.name;
                            plotData.Id = 0;
                            plotData.UserId = 1; //this.user_.Id; //todo add user plugin
                            var geom = new Geomatics();
                            geom.ShapeType = <ShapeType><any>ShapeType[this.plotShapeType_];
                            geom.Points = pdata.data.lonlats.map((c)=> {
                                return [c.lon, c.lat];
                            });
                            plotData.Geomatics = geom;

                            break;
                    }
                    resolve(plotData);
                }.bind(this))
            }.bind(this))
            .then(function (plotData) {
                var plotData = plotData;
                var plotInfo = this.toDTO_(plotData);
                return this.dataApi_.Post(plotInfo)
                    .then(function (pdata: pdata) {
                        return new Promise(function (resolve, reject) {
                            if (pdata.state == 'apiok') {
                                resolve({state: 'ok', data: plotData})
                            } else {
                                reject({state: 'err', data: plotData})
                            }
                        })
                    })
            }.bind(this))
            .then(function (pdata: pdata) {
                return new Promise(function (resolve, reject) {
                    var data = pdata.data;
                    if (data) {
                        // this.datas_.push(data);
                        // this.featureAppand_(f, data);
                        //this.dataDTOSet_.Add([data]);
                        //this.layer_.addPlotFeature(f);
                        //var i = this.plotListItem_(f);
                        // var plotListdata = this.sidePanlviewModel_.plotdata();
                        // plotListdata.push(i);
                        // this.sidePanlviewModel_.plotdata(plotListdata);
                        resolve({state: "apiok", data: null})
                    }
                }.bind(this))
            }.bind(this))
            .then(function (pdata: pdata) {
                this.map_.map.removeInteraction(this.interActionDraw_);
                this.reLoadData_();
            }.bind(this))
            .catch(function (pdata: pdata) {
                switch (pdata.state) {
                    case "cancel":
                    case "close":
                        this.layerEntity_.Source.removeFeature(f);
                        break;
                }
                this.map_.map.removeInteraction(this.interActionDraw_);
                if (!pdata.state)throw pdata;
            }.bind(this))
    }

    private reLoadData_() { //
        this.dataDTOSet_.Clear();
        this.load_()
            .then(function () {
                //this.menuClick_();
            }.bind(this))
    }

    private search_(key) {
        return new Promise(function (resolve, reject) {
            var r = this.layer_.searchDatas(key).map(function (v) {
                var data = {name: '名称', id: '编号'}[v.type] + ':' + v.data;
                return {data: '[标绘]' + data, target: v.target, searchListClick: this.searchSelectCallback_.bind(this)};
            }.bind(this));
            resolve({state: "ok", data: r});
        }.bind(this))
    }

    private searchSelectCallback_(data) {
        if (data.target) {
            this.map_.SetFocus(this.getFeatureById_(this.featureId_(data.Id)));
        } else {
            alert("无法定位!");
        }
    }

    private getFeatureById_(Id: string) {
        var r;
        this.layerEntity_.Source.forEachFeature(function (f: ExtendFeature) {
            if (f.id == Id) {
                r = f;
                return f;
            }
        });
        return r;
    }
}

export default PlotPlugin