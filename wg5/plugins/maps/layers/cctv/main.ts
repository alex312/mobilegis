import * as ol from "openlayers";
import * as sidePanel from "text!plugins/maps/layers/cctv/htmls/sidePanel.html"
import * as objInfo from "text!plugins/maps/layers/cctv/htmls/ObjInfo.html";

import CctvLayerEntity from "./layers/CctvLayerEntity";
import CctvStaticInfoApi from "./datas/CctvStaticInfoApi";
import Status from "seecool/utils/Status";

import {inject} from "seecool/plugins/plugins";
import {CollectionLinker} from "seecool/datas/Collection";
import {CollectionA} from "seecool/datas/Collection";
import {pdata} from "seecool/Interface";
import {CollectionLinkerOption} from "seecool/datas/Collection";
import {ICctv} from "seecool/Interface";
import {ICctvDTO} from "seecool/Interface";
import {CheckBox} from "seecool/StaticLib";
import {IDCFeature} from "seecool/Interface";
import {ICctvStaticInfo} from "seecool/Interface";
import {IInfoCctvStatic} from "seecool/Interface";
import {IInfoCctvHierarchy} from "seecool/Interface";
import {IInfoCctvDynamic} from "seecool/Interface";
import {IInfoCctvPosition} from "seecool/Interface";
import {IInfoMerge} from "seecool/Interface";
import {JSTool} from 'seecool/utils/JSTool';
import {Config} from "seecool/StaticLib";
// import {ExtendFeature} from "../shipLayer/layers/ShipsCanvasSource";

import * as ko from "knockout";

var CFG;

class CctvPlugin {
    private config_;
    private layerEntity_: CctvLayerEntity;
    private dataSet_: CollectionA<ICctv>;
    private link_LayerEntity_DataSet_: CollectionLinker<IDCFeature,ICctv>;
    private cctvStaticInfoApi_;
    private map_;
    private setting_;
    private status_;

    constructor(config,
                @inject("maps/map") map,
                @inject("setting?")setting) {
        this.config_ = config;
        var con = new Config(this.config_);
        CFG = con.DefaultData.bind(con);
        this.map_ = map;
        //this.setting_ = setting;
        this.init();
        this.load();
    }

    init() {
        this.dataSet_ = new CollectionA<ICctv>("dataSet");
        //this.dataDTOSet=new CollectionA<ICctvDTO>("dataDTOSet");
        this.cctvStaticInfoApi_ = new CctvStaticInfoApi(this.config_.cctvStaticInfoApi || "api/CCTVStaticInfo");

        // this.ui.RegisterMainMenu(null, "cctvMenuLink", "Cctv", this.menuClick.bind(this), {iconFont: "fa-video-camera"});
        // this.ui.RegisterSelectFocusEvent("cctvSelectFocus", this.featureSelected.bind(this));
        this.layerEntity_ = new CctvLayerEntity({});
        //this.link_DataSet_DataDTOSet=new CollectionLinker<ICctv,ICctvDTO>(CollectionLinkerOption<ICctv,ICctvDTO>(
        //    this.dataDTOSet,
        //    this.dataSet_,
        //    function(v){return true},
        //    function(v:ICctvDTO):ICctv{
        //        var t:ICctv ={
        //            Info:JSON.parse(v.Info),
        //            IsDeleted:v.IsDeleted,
        //            Key:v.Key
        //        }
        //        return t;
        //    }
        //));
        this.link_LayerEntity_DataSet_ = new CollectionLinker<IDCFeature,ICctv>({
            sourceCollection: this.dataSet_,
            targetCollection: this.layerEntity_.DataSet,
            filterFunction: function (v) {
                return (v.IsDeleted) ? false : true;
            },
            convertFunction: function (v: ICctv) {
                var Info: IInfoCctvStatic = v.Info;
                var LL = (Info.Longitude > Info.Latitude) ? [Info.Longitude, Info.Latitude] : [Info.Latitude, Info.Longitude];
                LL[0] = (LL[0] > 180 || LL[0] < -180) ? 0 : LL[0];
                LL[1] = (LL[1] > 90 || LL[1] < -90) ? 0 : LL[1];
                var lonlat = ol.proj.fromLonLat(LL);
                var geom = new ol.geom.Point(lonlat);
                var f2 = new ol.Feature({
                    geometry: geom
                });
                this.featureAppand(f2, v);
                return f2;
            }.bind(this)
        })
        //this.link_DataSet_DataDTOSet.start();
        this.link_LayerEntity_DataSet_.start();

        this.status_ = new Status(this);
        this.status_.ConditionTurn(true, "hided");//hided

        this.Switch(null);
        var switch1 = CheckBox({
            checked: true,
            view: "Cctv",
            click: this.Switch.bind(this)
        });
        var v = ko.observable();
        v.subscribe(function (old) {
            old;
        })
        //this.setting_.RegisterSettingElement("mapSwitch", switch1);
        //this.ui.RegisterShortBarButton(null,"plotSwitch","桩位",this.Switch.bind(this)).click();
        this.map_.map.addLayer(this.layerEntity_.layer);
    }

    private Switch(evt) {
        this.status_
            .IfTurnDo("hided", "displayed", function () {
                this.layerEntity_.layer.setVisible(true);
                if (evt && evt.currentTarget)evt.currentTarget.className = "btn btn-success";
            })
            .IfTurnDo("displayed", "hided", function () {
                this.layerEntity_.layer.setVisible(false);
                //this.map_Plugin_.map.removeLayer(this.layer_);
                if (evt && evt.currentTarget)evt.currentTarget.className = "btn btn-danger";
            })
            .Turned();
        return true; //checked 要求返回true
    }

    private menuClick() {

        var panel = $(sidePanel);
        //this.ui.ShowSidePanel("Cctv", panel);

        var features = this.layerEntity_.Source.getFeatures()
        features.sort(function (a, b) {
            return a.data.Info.Name.localeCompare(b.data.Info.Name)
        })
        var cctvdata = features.map(function (v) {
            return {
                Name: v.data.Info.Name,
                target: v,
                cctvListClick: this.cctvListClick.bind(this)
            }
        }.bind(this));


        //this.ListTotreeByPid([{a:1,b:1},{a:1,b:2},{a:2,b:2}],'a',{
        //    node:{
        //        node:[]
        //    },
        //    nodeAdd:function(i,p) {
        //        p.node.push(i);
        //    }
        //});
        //var group=[];
        //features.map(function (f) {
        //    if(!(f.data.TrafficEnvType in group)){group[f.data.TrafficEnvType]={
        //        id:'cctvCollapse'+f.data.TrafficEnvType,
        //        hid:'#cctvCollapse'+f.data.TrafficEnvType,
        //        cctvGroupName:this.GetTrafficEnvType(f.data.TrafficEnvType).label,
        //        cctvGroupList:[]}}
        //    if (!f.data) {
        //        console.log("f", f);
        //        group[f.data.TrafficEnvType].cctvGroupList.push({ data: "_", target: f, cctvListClick: this.cctvListClick.bind(this) });
        //    }
        //    else {
        //        group[f.data.TrafficEnvType].cctvGroupList.push({ data: f.data.Name || "_", target: f, cctvListClick: this.cctvListClick.bind(this)});
        //    }
        //}.bind(this));
        //var cctvdata:any = [];
        //for(var i in group){
        //    cctvdata.push(group[i]);
        //}


        var viewModel = {
            cctvdata: cctvdata
        };
        ko.applyBindings(viewModel, panel[0]);
    }

    //var list=arguments[1].split(',');

    /**
     * Tree
     * @param list
     * @param str
     * @param nodefun node的构造函数
     * @constructor
     */
    ListTotreeByPid(list, str, node) {
        //var list=arguments[1].split(',');
        var r = {root: {}};
        list.map(function (v) {
            r[str] = v;
        })
        return r.root;
    }

    private cctvListClick(data, evt) {
        this.map_.SetFocus(data.target);
    }

    private featureSelected(featureId) {
        if (!(typeof(featureId) == "string" && featureId.startsWith('cctv:')))return null;

        var feature = this.layerEntity_.Layer.getFeatureById(featureId);
        var data = feature.data;
        if (data) {
            var oi = $(objInfo);
            var viewModel = {
                Key: data.Key,
                IsDeleted: data.IsDeleted,
                Name: data.Info.Name,
                Altitude: data.Info.Altitude,
                Heading: data.Info.Heading,
                ImageType: data.Info.ImageType,
                Platform: data.Info.Platform,
                ViewPort: data.Info.ViewPort,
                Streams: data.Info.Streams,
                playVideo: this.playVideo.bind(this)
            };
            ko.applyBindings(viewModel, oi[0]);
            oi.data("title", "CCTV信息");
            var args = CFG("videoServerUrl", "http://192.168.9.222:27010") + "/ " + data.Key;
            var href = `http://localhost:8234/StartProcess`;
            var form = oi.find('#cctvPlayVideo').attr('action', href);
            $(`<input type="text" hidden name="token" value="cctv">`).appendTo(form);
            $(`<input type="text" hidden name="args" value="${args}">`).appendTo(form);
            return oi;
        }
        return oi;
    }

    private featureAppand(olFeature, data) {
        olFeature.id = "cctv:" + data.Key;
        olFeature.data = data;
    }

    cctvDynamic: ICctvStaticInfo;//IInfoCctvDynamic;
    cctvStatic: ICctvStaticInfo;//IInfoCctvDynamic;
    cctvPosition: ICctvStaticInfo;//IInfoCctvPosition;
    cctvHierarchy: ICctvStaticInfo;//IInfoCctvHierarchy;
    cctvInfoMergeList: {[key: string]: any} = {};

    cctvInfoMergeListUpdata(KV) {
        var features = this.layerEntity_.Source.getFeatures()
        var t = {};
        features.map(function (v) {
            t[v.data.Key] = v;
        })
        for (var i in KV) {
            var I = KV[i];
            if (i in this.cctvInfoMergeList) {

                for (var j in I.Info) {
                    if (j in this.cctvInfoMergeList[i].Info) {
                    } else {
                        this.cctvInfoMergeList[i].Info[j] = I.Info[j];
                    }
                }

                var lat = ((I.Info.Latitude > 90) ? this.cctvInfoMergeList[i].Info.Latitude : I.Info.Latitude);
                var lon = ((I.Info.Longitude > 180) ? this.cctvInfoMergeList[i].Info.Longitude : I.Info.Longitude);
                this.cctvInfoMergeList[i].Info.Latitude = lat;
                this.cctvInfoMergeList[i].Info.Longitude = lon;
                //this.dataSet_.Modify([I]);
                //t[I.Key].data.Info.Latitude=lat;
                //t[I.Key].data.Info.Longitude=lon;
                this.layerEntity_.Source.removeFeature(t[I.Key])
                //this.layerEntity_.Source.addFeatures([t[I.Key]])
                this.dataSet_.Add([this.cctvInfoMergeList[i]]);
            } else {
                this.cctvInfoMergeList[i] = I;
                this.dataSet_.Add([I]);
            }
        }
    }

    load() {
        this.cctvStaticInfoApi_.Get_CctvDynamic$version(0)
            .then(function (pdata: pdata) {
                var t = {};
                <ICctvDTO>pdata.data.Items
                pdata.data.Items.map(function (v) {
                    t[v.Key] = v;
                    t[v.Key].Info = JSON.parse(v.Info);
                })
                this.cctvInfoMergeListUpdata(t);
            }.bind(this))

        this.cctvStaticInfoApi_.Get_CctvStatic$version(0)
            .then(function (pdata: pdata) {
                var t = {};
                <ICctvDTO>pdata.data.Items
                pdata.data.Items.map(function (v) {
                    t[v.Key] = v;
                    t[v.Key].Info = JSON.parse(v.Info);
                })
                this.cctvInfoMergeListUpdata(t);
            }.bind(this))

        //this.cctvStaticInfoApi_.Get_CctvPosition$version(0)
        //.then(function(pdata:pdata){
        //    var t={};
        //    <ICctvDTO>pdata.data.Items
        //    pdata.data.Items.map(function(v){
        //        t[v.Key]=v;
        //        t[v.Key].Info=JSON.parse(v.Info);
        //    })
        //    this.cctvInfoMergeListUpdata(t);
        //}.bind(this))
        //
        //this.cctvStaticInfoApi_.Get_CctvHierarchy$$default$version(0)
        //.then(function(pdata:pdata){
        //    var t={};
        //    <ICctvDTO>pdata.data.Items
        //    pdata.data.Items.map(function(v){
        //        t[v.Key]=v;
        //        t[v.Key].Info=JSON.parse(v.Info);
        //    })
        //    this.cctvInfoMergeListUpdata(t);
        //}.bind(this))


        //Promise.all([
        //    this.cctvStaticInfoApi_.Get_CctvDynamic$version(0),
        //    this.cctvStaticInfoApi_.Get_CctvStatic$version(0),
        //    this.cctvStaticInfoApi_.Get_CctvPosition$version(0),
        //    this.cctvStaticInfoApi_.Get_CctvHierarchy$$default$version(0)
        //])
        //.then(function(all){
        //    this.cctvDynamic=all[0];
        //    this.cctvStatic=all[1];
        //    this.cctvPosition=all[2];
        //    this.cctvHierarchy=all[3];
        //    all.map(function(v){
        //        v.data.Items.map(function(vv){
        //            vv.Info=JSON.parse(vv.Info);
        //            this.cctvInfoMergeList[vv.Key]=priorConfig(this.cctvInfoMergeList[vv.Key],vv);
        //        }.bind(this))
        //    }.bind(this))
        //    var t=[];
        //    for(var i in this.cctvInfoMergeList){t.push(this.cctvInfoMergeList[i])};
        //
        //    return new Promise(function(resolve,reject){
        //        //switch(pdata.state){
        //        //    case "apiok":
        //                //<ICctvStaticInfo>(pdata.data);
        //        var cctvs = t.filter(function (v) {
        //            return (v.Info.Type == 2);
        //        });
        //        //this.dataDTOSet.Add(cctvs);
        //        this.dataSet_.Add(cctvs);
        //        resolve();
        //        //        break;
        //        //    default:
        //        //        reject()
        //        //}
        //    }.bind(this))
        //}.bind(this))
        //.catch(function(pdata:pdata){
        //    switch(pdata.state){
        //        case "apierr":
        //            break;
        //    }
        //    if(!pdata.state)throw(pdata);
        //})
    }

    //
    //playVideo(data,evt){
    //    evt.target.form.submit();
    //    return false;
    //}
    playVideo(data, evt) {
        var args = CFG("videoServerUrl", "http://192.168.9.222:27010") + "/ " + data.Key;//CCTV1_50BAD15900030304";
        $.ajax({
            url: `http://localhost:8234/StartProcess?token=cctv&args=${args}`,
            type: 'get',
            dataType: 'jsonp',
            //jsonp:"jsoncallback",
        }).done(function (evt) {
            //alert("已发起播放请求");
        }).fail(function (evt) {
            //alert("播放失败,你的设备可能没有安装相应服务");
        })
    }

    playVideoByUrl(data, evt) {
        //var args = data.Url;
        var args = "http://192.168.9.222:27010/%20CCTV1_50BAD15900030304";
        $.ajax({
            url: `http://localhost:8234/StartProcess?token=cctv&args=${args}`,
            type: 'get'
        })
            .done(function () {
            })
            .fail(function () {
                alert("播放失败,你的设备可能没有安装相应服务");
            })
    }
}
export default CctvPlugin
