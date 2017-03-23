import * as ol from "openlayers";
import * as TideDiv from "text!plugins/maps/layers/waterDepth/htmls/TideDiv.html";
import * as ko from "knockout";
import * as fecha from "fecha";

import {inject} from "seecool/plugins/plugins";
import {pdata} from "seecool/Interface";
import {CollectionLinker} from "seecool/datas/Collection";
import {CollectionA} from "seecool/datas/Collection";
import {CollectionLinkerOption} from "seecool/datas/Collection";
import {IWaterDepthData} from "seecool/Interface";
import {IWaterDepthDataDTO} from "seecool/Interface";
import {IDCFeature} from "seecool/Interface";
import {Status} from "seecool/utils/Status";
import {ITideDTO} from "seecool/Interface";
import {CheckBox} from "seecool/StaticLib";
// import {format} from "seecool/utilities";
// import {parse} from "seecool/utilities";
// import {ExtendFeature} from "../shipLayer/layers/ShipsCanvasSource";
// import {CheckButton} from "seecool/StaticLib";

import WaterDepthLayerEntity from "./layers/WaterDepthLayerEntity";
import WaterDepthDataApi from "./datas/WaterDepthDataApi";
import TideApi from "./datas/TideApi";

class WaterDepthPlugin {
    private config_;
    //private ui_;
    private layerEntity_:WaterDepthLayerEntity;
    private dataSet_:CollectionA<IWaterDepthData>;
    private dataDTOSet_:CollectionA<IWaterDepthDataDTO>;
    private link_DataSet_DataDTOSet_:CollectionLinker<IWaterDepthData,IWaterDepthDataDTO>;
    private link_LayerEntity_DataSet_:CollectionLinker<IDCFeature,IWaterDepthData>;
    private waterDepthDataApi_;
    private tideApi_;
    private map_;
    private status_;
    private colorWaterDepth_;
    private setting_;
    private loadTideTimer_;

    constructor(config,
                @inject("maps/map") map,
                @inject("setting?")setting) {
        this.config_ = config;
        this.map_ = map;
        this.setting_ = setting;
        this.init_();
        this.load_();
        this.loadTide_();
        this.loadTideTimer_ = setInterval(function () {
            this.loadTide_()
        }.bind(this), 1 * 60 * 1000);
    }

    private init_() {
        this.dataSet_ = new CollectionA<IWaterDepthData>("dataSet");
        this.dataDTOSet_ = new CollectionA<IWaterDepthDataDTO>("dataDTOSet");
        this.waterDepthDataApi_ = new WaterDepthDataApi(this.config_.waterDepthDataApi || "api/WaterDepthData");
        this.tideApi_ = new TideApi(this.config_.TideApi || "api/Tide");
        this.layerEntity_ = new WaterDepthLayerEntity({});
        this.link_DataSet_DataDTOSet_ = new CollectionLinker<IWaterDepthData,IWaterDepthDataDTO>(CollectionLinkerOption<IWaterDepthData,IWaterDepthDataDTO>(
            this.dataDTOSet_,
            this.dataSet_,
            function (v) {
                return true
            },
            function (v:IWaterDepthDataDTO) {
                return {
                    Name: v.Depth,
                    Lon: v.Lon,
                    Lat: v.Lat
                }
            }
        ));
        this.link_LayerEntity_DataSet_ = new CollectionLinker<IDCFeature,IWaterDepthData>({
            sourceCollection: this.dataSet_,
            targetCollection: this.layerEntity_.dataSet,
            filterFunction: function (v) {
                return true
            },
            convertFunction: function (v:IWaterDepthData) {
                var LL = (v.Lon > v.Lat) ? [v.Lon, v.Lat] : [v.Lat, v.Lon];
                var lonlat = ol.proj.fromLonLat(LL);
                var geom = new ol.geom.Point(lonlat);
                var f2 = new ol.Feature({
                    geometry: geom
                });
                f2.setProperties({"name": v.Name.toString()});
                this.featureAppand_(f2, v);
                return f2;
            }.bind(this)
        });
        this.link_DataSet_DataDTOSet_.start();
        this.link_LayerEntity_DataSet_.start();

        this.status_ = new Status(this);
        this.status_.ConditionTurn(true, "displayed");//hided
        this.switch_(switch1);
        // this.ui_.RegisterShortBarButton(null,"plotSwitch","深",this.Switch.bind(this)).click();

        var switch1 = CheckBox({
            checked: false,
            view: "水深",
            click: this.switch_.bind(this)
        });
        // this.setting_.RegisterSettingElement("mapSwitch", switch1);//mapSwitch

        this.map_.map.addLayer(this.layerEntity_.layer);
        //var value = $('<span><input  type="search" style="width:100px" placeholder="深度阈值:18"></span>')
        ////var $('<input id="searchButton" class="">搜索</input>');
        //this.colorWaterDepth_=18;
        //value.bind("search",function(a:any){
        //    var value=a.target.value;
        //    value=value.replace("深度阈值:","");
        //    value=Number(value)||this.colorWaterDepth_;
        //    this.colorWaterDepth_=value;
        //    this.layerEntity_.OptionChange("colorWaterDepth",value);
        //    a.target.value='深度阈值:'+value;
        //}.bind(this));
        //this.ui_.RegisterToolElementLeft("waterDepth",value);

        // var value = $(`<span><span style="margin:0 5px;">深度阈值</span><input  type="search" style="width:100px" placeholder="18"></span>`);
        // value.bind("keypress", function (e) {
        //     if (e && e.keyCode == 13) {
        //         var value = Number(e.target.value) || this.colorWaterDepth_;
        //         this.layerEntity_.OptionChange("colorWaterDepth", value);
        //         e.target.value = value;
        //     }
        // }.bind(this));
        // //value.bind("search",function(a:any){
        // //    var value=Number(a.target.value)||this.colorWaterDepth_;
        // //    this.layerEntity_.OptionChange("colorWaterDepth",value);
        // //    a.target.value=value;
        // //}.bind(this));
        // this.setting_.RegisterSettingElement("waterDepth", value);
    }

    private switch_(evt) {
        this.status_
            .IfTurnDo("hided", "displayed", function () {
                this.layerEntity_.layer.setVisible(true);
                if (evt && evt.currentTarget)evt.currentTarget.className = "btn btn-success";
            })
            .IfTurnDo("displayed", "hided", function () {
                this.layerEntity_.layer.setVisible(false);
                //this.mapPlugin_.Map.removeLayer(this.layer_);
                if (evt && evt.currentTarget)evt.currentTarget.className = "btn btn-danger";
            })
            .Turned();
        return true;
    }

    private featureAppand_(olFeature, data) {
        olFeature.id = "waterDepth:" + data.Name;
        olFeature.data = data;
    }

    private loadTide_() {
        this.tideApi_.Get()
            .then(function (pdata:pdata) {
                switch (pdata.state) {
                    case "apiok":
                        var data = <ITideDTO>pdata.data;
                        data.Time = fecha.format(fecha.parse(data.Time,'YYYY-MM-DDTHH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
                        var tideDiv = $(TideDiv);
                        ko.applyBindings(pdata.data, tideDiv[0]);
                        //this.ui_.ShowMassageInfo(tideDiv);
                        break;
                    default:
                }
            }.bind(this))
    }

    private load_() {
        this.waterDepthDataApi_.Get_GetAllPiles()
            .then(function (pdata:pdata) {
                return new Promise(function (resolve, reject) {
                    switch (pdata.state) {
                        case "apiok":
                            this.dataDTOSet_.Add(<Array<IWaterDepthDataDTO>>pdata.data);
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
                        console.log("apierr", pdata.data);
                        break;
                }
                if (!pdata.state)throw(pdata);
            })
    }
}

export default WaterDepthPlugin