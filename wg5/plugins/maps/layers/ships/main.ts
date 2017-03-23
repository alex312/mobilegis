import * as ol from "openlayers";
import * as ko from "knockout";
import * as fecha from "fecha";

import * as utilities from 'seecool/utilities';
import * as StaticLib from "seecool/StaticLib";

import ShipsLayer from "./layers/ShipsLayer";
import ShipsTileDataSource from "./data/ShipsTileDataSource";
import Feature from "./data/Feature";
import ShipData from "./data/ShipData";
import ShipDataSource from './data/ShipDataSource';
import ShipEntity from './data/ShipEntity';
import ScunionShipEntity from './data/ScunionShipEntity';
import RtdsShipSyncer from './data/RtdsShipSyncer';

import {inject} from "seecool/plugins/Plugins";
import {pdata} from "seecool/interface";
import {CheckButton} from "seecool/StaticLib";
import {CheckBox} from "seecool/StaticLib";
import {Config} from "seecool/StaticLib";
import {IAWEFlag} from "seecool/Interface";
import {JSTool} from 'seecool/utils/JSTool';
import {Status} from "seecool/utils/Status";
import ShipTrackLoader from "seecool/datas/ShipTrackLoader";
import MapPlugin from "../../map/main";

var CFG;

class ShipLayerPlugin {
    map;
    private dsShipsTile
    private ui
    private config
    private status;
    //private dsShipsSymbol_
    private layerShips;
    private ds:ShipDataSource;
    private rss:RtdsShipSyncer;
    private features:Feature[];
    private featureChangeHandler_:Function = this.onFeatureChange_.bind(this);
    private setting;

    constructor(config:any,
                @inject("webgisUI?") ui, //"mainUI"
                @inject("maps/map")map:MapPlugin,
                @inject("setting?")setting) {
        console.log("shipLayer PluginLoading");//,ui, map,ShipsLayer);
        this.config = config || {};
        this.ui = ui;
        this.map = map;
        this.setting = setting;
        var con = new Config(this.config);
        CFG = con.DefaultData.bind(con);

        this.dsShipsTile = new ShipsTileDataSource({
            tileUrl: `${this.config.tileUrl}?x={x}&y={y}&z={z}&ts={v}`,
            versionUrl: `${this.config.tileUrl}?check=1`,
            checkInterval: 10000
        });
        this.features = [];
        this.ds = new ShipDataSource(this.entityFactories_());

        this.layerShips = new ShipsLayer({
            tileUrl: `${this.config.tileUrl}?x={x}&y={y}&z={z}&ts={v}`,
            titleVersionUrl: `${this.config.tileUrl}?check=1`,
            flagDraw: this.shipFlagDraw.bind(this),
            criticalResolution: 152.8740565703525
        });

        map.map.addLayer(this.layerShips);

        map.map.on("moveend", this.handleMapMoveEnd_, this);

        map.bind("selectFeatureChange", this.selectedFeatureChanged.bind(this));
        //
        // this.ui.RegisterSelectFocusEvent("shipLayerSelectFocus", this.featureSelected.bind(this));
        //
        // this.ui.RegisteSearchEvent("shipLayerSearch", this.searchHistory.bind(this), {info: "船舶名称,MMSI"});
        //
        // //以下接口mobile专用
        // if (this.ui.RegisterSelectFeatureByUidEvent)
        //     this.ui.RegisterGetSelectedFeatureEvent("shipLayerGetSelectedFeature", this.getSelectedFeature.bind(this));
        // if (this.ui.RegisterSelectFeatureByUidEvent)
        //     this.ui.RegisterSelectFeatureByUidEvent("shipLayerSelectFeatureByUid", this.ShipFocus.bind(this));

        // var cid = JSTool.CrossId(StaticLib.ShipType.Colors);
        // var colors = StaticLib.ShipType.Colors.map(function (v) {
        //     return {fillColor: v, strokeColor: v}
        // })
        // var icons = StaticLib.shipIconsGenerate(colors);
        // var legends = JSTool.ArraysDo(StaticLib.ShipType.Names, icons, StaticLib.ShipType.Labels, function (name, icon, label) {
        //     return {pname: 'shipType', name: name, label: label, icon: $('<img src="' + icon + '"/>')}
        // })
        // legend.AddLegends([{pname: null, name: 'shipType', icon: null, label: '船舶类型'}]);
        // legend.AddLegends(legends);

        // this.status = new Status(this);
        // this.status.ConditionTurn(true, "hided");//hided
        // this.Switch(null);
        // var switch1 = CheckBox({
        //     checked: true,
        //     view: "船舶",
        //     click: this.Switch.bind(this)
        // });
        // this.setting.RegisterSettingElement("mapSwitch", switch1);
        // this.ui.RegisterShortBarButton(null, "shipLayerSwitch", "船舶", this.Switch.bind(this))
        // //this.RegisterShipFlagDrawEvent('shipLayerFlag',function(featureId){
        // //    var i = featureId.match('^shipLayer:MMSI:413')?'0':'1';
        // //    var r=([[{content:'\uf074',color:'#ff0000'},{content:'\uf072',color:'#00ff00'}],{content:'\uf073',color:'#0000ff'}])[i];
        // //    return r||[];
        // //})
        // this.ui.RegisterBoxSelectedEvent('shipLayerBoxSelected', this.boxSelect.bind(this));
        // this.expose();
        // this.init();

        var rtds = document.URL.replace(/\/[^\/]+$/, '/').replace(/^http/, 'ws') + config.rtds;
        var expires = 1000 * CFG("expires", 60 * 60 * 3);
        this.rss = new RtdsShipSyncer({local: this.ds, remote: rtds, expires: expires});
        this.bindLayerWithDataSource_();

        setInterval(function () {
            this.onFeatureSourceChange()
        }.bind(this), 500);
    }

    private init() {
        var focusShipId = utilities.getUrlParameter("focusShip");
        if (focusShipId)
            this.ShipFocus(focusShipId);
    }

    //Search
    private shipFlagDrawCallBackList:{[key:string]:(featureId:string)=>Array<IAWEFlag>;} = {};

    public RegisterShipFlagDrawEvent(name, callback:(featureId:string)=>Array<IAWEFlag>, option?:any) {
        if (arguments.length == 1) {
            callback = name;
            name = "";
        }
        this.shipFlagDrawCallBackList[name] = callback;
    }

    public RemoveShipFlagDrawEvent(name) {
        if (name in this.shipFlagDrawCallBackList) {
            delete this.shipFlagDrawCallBackList[name];
        }
    }

    private shipFlagDraw(featureId:string):Array<IAWEFlag> {
        if (!featureId)
            return;
        else {
            var flags = [];
            for (var i in this.shipFlagDrawCallBackList) {
                var func = this.shipFlagDrawCallBackList[i];
                flags = flags.concat(func(featureId));
            }
        }
        return flags;
    }

    expose() {
        var wg5:any = window["webgis5"] || (window["webgis5"] = {});
        wg5.shipLayer = {};
        wg5.shipLayer.SetFocus = function (id) {
            var fid = "shipLayer:" + id;
            var feature = this.layerShips.getShipFeature(fid);
            this.map.SetFocus(feature);
        }.bind(this)
    }

    private Switch(evt) {
        this.status
            .IfTurnDo("hided", "displayed", function () {
                this.layerShips.setVisible(true);
                if (evt && evt.currentTarget)evt.currentTarget.className = "btn btn-success";
            })
            .IfTurnDo("displayed", "hided", function () {
                this.layerShips.setVisible(false);
                if (evt && evt.currentTarget)evt.currentTarget.className = "btn btn-danger";
            })
            .Turned();
        return true;
    }

    private handleMapMoveEnd_(evt) {
        //console.log("move");
        var map = evt.map;
        var view2d = map.getView();
        /**
         * @type {ol.Extent}
         */
        var extent;
        if (view2d.getResolution() < this.layerShips.getCriticalResolution()) {
            var trans = ol.proj.getTransform('EPSG:3857', "EPSG:4326");
            extent = view2d.calculateExtent(/**@type {ol.Size}*/(map.getSize()));
            ol.extent.applyTransform(extent, trans, extent);
        } else {
            extent = ol.extent.createEmpty();
        }
        //this.dsShipsSymbol_.setExtent(extent);
        var w = extent[2] - extent[0];
        var h = extent[3] - extent[1];
        extent[0] -= w;
        extent[1] -= h;
        extent[2] += w;
        extent[3] += h;
        this.setExtent(map, extent);

        //if (menuconfig.CCtvsLayerEnabled) {
        //    var trans = ol.proj.getTransform('EPSG:3857', "EPSG:4326");
        //    var extent2 = view2d.calculateExtent(/**@type {ol.Size}*/(map.getSize()));
        //    ol.extent.applyTransform(extent2, trans, extent2);
        //    this.dsCctvsSymbol_.setExtent(extent2);
        //}
    }

    private entityFactories_():{[key:string]:(id:string, data:any)=>ShipEntity} {
        return {
            "scunion": function (id, data) {
                return new ScunionShipEntity(id, data);
            }
        };
    }

    private setExtent(map, extent) {
        //console.log("setExtent",extent);
        let rss = this.rss;
        var res = map.getView().getResolution();
        if (res <= this.layerShips.getCriticalResolution()) {
            rss.bounds = extent;
        } else {
            rss.bounds = null;
        }
    }

    private bindLayerWithDataSource_() {
        let layer = this.layerShips;
        let features = this.features;
        var that = this;
        this.ds.bind('change', function (evt) {
            evt.removed.forEach(function (item) {
                that.removeFeature(features[item.id]);
                delete features[item.id];
            });
            evt.added.forEach(function (item) {
                that.addFeature(features[item.id] = new ShipData(item));
            });
            //this.onFeatureSourceChange();
        }.bind(this));
        this.ds.bind('change_immediately', function (evt) {
            this.onFeatureSourceChange();
        }.bind(this));
    }

    private addFeature(feature:Feature) {
        if (this.features.indexOf(feature) < 0) {
            this.features.push(feature);
            feature.bind("change", this.featureChangeHandler_);
            //this.featuresChanged_ = true;
        }
    }

    private removeFeature(feature:Feature) {
        var idx = this.features.indexOf(feature);
        if (idx >= 0) {
            feature.unbind("change", this.featureChangeHandler_);
            //this.featuresChanged_ = true;
            this.features.splice(idx, 1);
        }
    }

    private lastRefreshTime = new Date();

    private onFeatureChange_(evt) {
        // this.onFeatureSourceChange();
        if (this.selectedFeature && this.selectedFeature.data.id === evt.target.entity.id) {
            //把实时数据放到track中
            var entity = evt.target.entity
            if (!this.selectedFeature.data.TrackPoints)return
            this.selectedFeature.data.TrackPoints.push(
                {
                    id: entity.id,
                    time: entity.time,
                    sog: entity.sog,
                    cog: entity.cog,
                    heading: entity.heading,
                    lon: entity.lon,
                    lat: entity.lat
                })
        }
        if (this.selectedFeature && (this.selectedFeature.data.id != "MMSI:515420000" && evt.target.entity.id == "MMSI:515420000"))
            console.log(this.selectedFeature, evt.target.entity);
    }

    //private lastRefreshSignalTime_ = new Date(2000,1,1);
    //private supplementTime;
    private onFeatureSourceChange() {
        //var now = new Date();
        //console.log('---SourceChange',now);
        //this.supplementTime = setTimeout(function(){
        //    console.log('---setData',new Date());
        var dataArray = [];
        for (var i = 0; i < this.features.length; i++) {
            dataArray.push(this.features[i].entity);
        }
        this.layerShips.sourceImage_.setData(dataArray);
        //}.bind(this),200)
        //if(now.getTime()-this.lastRefreshSignalTime_.getTime() < 200){
        //    clearTimeout(this.supplementTime);
        //    return;
        //}
        //this.lastRefreshSignalTime_ = new Date();
    }

    protected createItems$() {
        var items = new Array(this.features.length);
        for (var i = 0; i < this.features.length; i++)
            items[i] = (this.createItem$(this.features[i]));
        return items;
    }

    protected createItem$(feature:Feature) {
        return null;
    }

    private selectedFeature;

    private selectedFeatureChanged(evt, feature) {
        if (!feature) {
            if (this.selectedFeature) {
                this.rss.unwatch(this.selectedFeature.data.id);
                this.selectedFeature.data.ShowTrack = false;
                this.selectedFeature.data.TrackPoints = [];
                this.selectedFeature = null;
            }
            return;
        }
        if (!(typeof(feature.id) == "string" && feature.id.startsWith('shipLayer:')))return null;

        if (this.selectedFeature != feature) {
            //清空 this.selectedfeature的track
            if (this.selectedFeature) {
                this.selectedFeature.data.ShowTrack = false;
                this.selectedFeature.data.TrackPoints = [];
            }
            this.selectedFeature = feature;
            this.rss.watch(feature.data.id);
            var end = new Date();
            var start = new Date(end.getTime() - 1000 * 60 * 10);
            this.loadTrack(feature.data.id, start, end);
        }
    }

    loadTrack(id, start, end) {
        //查历史-->track
        var onTrackLoad = function (isFinish) {
            if (isFinish && dataLoader_.points[id] && dataLoader_.points[id].length > 0) {
                var pointTracks = dataLoader_.points[id];
                var data = {};
                if (pointTracks.length > 0) {
                    var playbackPoints = [];
                    for (var i = 0; i < pointTracks.length; i++) {
                        playbackPoints.push(this.convertHistoryData(pointTracks[i]));
                    }
                }
                //this.selectedFeature.data.TrackPoints = playbackPoints;
                this.selectedFeature.data.TrackPoints = playbackPoints.concat(this.selectedFeature.data.TrackPoints);
            }
        }
        var onTrackError = function () {
        }
        var dataLoader_ = new ShipTrackLoader([id], start, end, onTrackLoad, onTrackError, this, null);
        dataLoader_.load(start, end); //加载指定时间段
        this.selectedFeature.data.ShowTrack = true;
        this.selectedFeature.data.TrackPoints = [this.convertRealtimeData(this.selectedFeature.data)];
    }

    private convertLastHistoryDataToRealtime(data) {
        var ship:ScunionShipEntity = new ScunionShipEntity(data.ShipId, data);
        //ship.callsign;
        //ship.destination;
        //ship.draught;
        ship.dynamicTime = new Date(Date.parse(data.Time));
        //ship.eta;
        //ship.imo;
        ship.mmsi = data.MMSI;
        //ship.staticTime;
        //ship.status;
        ship.type = data.Type;
        ship.cog = data.Cog;
        //ship.dimensions;
        ship.heading = data.Heading;
        //ship.id=data.ShipId;//赋值会报错,有时不会
        ship.lat = data.Lat;
        ship.lon = data.Lon;
        ship.name = data.Name;
        //ship.origins;
        //ship.rot;
        //ship.signal;
        ship.sog = data.Sog;
        ship.time = new Date(Date.parse(data.Time));
        ship.v_length = data.V_Length
        ship.v_name = data.V_Name
        ship.v_type = data.V_Type;
        ship.v_width = data.V_Width;
        return ship;
    }

    private convertHistoryData(data) {
        var ship:any = {};
        ship.id = data.ID;
        ship.name = data.Name;
        ship.mmsi = data.MMSI;
        ship.lon = data.Longitude;
        ship.lat = data.Latitude;
        ship.sog = data.SOG;
        ship.cog = data.COG;
        ship.heading = data.Heading;
        ship.time = new Date(Date.parse(data.Time));// utilities.dateFromWcfJson();
        ship.uid = ship.id;
        ship.type = data.Type;
        return ship;
    }

    private convertRealtimeData(data) {
        var ship:any = {};
        ship.id = data.id;
        ship.name = data.name;
        ship.mmsi = data.mmsi;
        ship.lon = data.lon;
        ship.lat = data.lat;
        ship.sog = data.sog;
        ship.cog = data.cog;
        ship.heading = data.heading;
        ship.time = new Date(Date.parse(data.time));// utilities.dateFromWcfJson();
        ship.uid = ship.id;
        ship.type = data.type;
        return ship;
    }

    shipInfoTime;
    shipInfoUpdataProxy;

    private featureSelected(featureId) {
        if (!featureId && this.shipInfoUpdataProxy) {
            clearInterval(this.shipInfoUpdataProxy.timer);
            delete this.shipInfoUpdataProxy;
        }
        if (!(typeof(featureId) == "string" && featureId.startsWith('shipLayer:')))return null;
        var ship = this.layerShips.getShipFeature(featureId);
        if (ship) {
            var oi = $('<div></div>')// $(objInfo);
            var playback = function (e) {
                var start = fecha.format(new Date((new Date().getTime() - 2 * 60 * 60 * 1000)), "YYYY-MM-DD HH:mm:ss");
                var end = fecha.format(new Date(), "YYYY-MM-DD HH:mm:ss");
                this.ui.UrlLoad({
                    url: "playback",
                    search: "mmsi=" + ship.data.mmsi + "&start=" + start + "&end=" + end,
                    target: "_blank"
                });//window.open
            }
            var loadTrack_0 = function (e) {
                var start = new Date(new Date().getTime() - 10 * 60 * 1000);
                var end = new Date();
                this.loadTrack(ship.data.id, start, end);
            }
            var loadTrack_1 = function (e) {
                var start = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
                var end = new Date();
                this.loadTrack(ship.data.id, start, end);
            }
            var loadTrack_2 = function (e) {
                var start = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
                var end = new Date();
                this.loadTrack(ship.data.id, start, end);
            }
            var viewModel = function (ship) {
                return {
                    ShipName: ship.data.name,
                    ShipType: StaticLib.getShipTypeInfo(ship.data.type, ship.data.v_type, "Labels"),
                    MMSI: ship.data.mmsi,
                    Heading: Math.round(ship.data.cog * 10) / 10 + "°",
                    COG: Math.round(ship.data.cog * 10) / 10 + "°",
                    SOG: Math.round(ship.data.sog * 10) / 10 + "节",
                    Longitude: utilities.formatDegree(ship.data.lon, 'ddd-cc-mm.mmL'),
                    Latitude: utilities.formatDegree(ship.data.lat, 'dd-cc-mm.mmB'),
                    Time: fecha.format(ship.data.time, "YYYY-MM-DD HH:mm:ss"),
                    playback: playback.bind(this),
                    loadTrack_0: loadTrack_0.bind(this), //10min
                    loadTrack_1: loadTrack_1.bind(this), //1h
                    loadTrack_2: loadTrack_2.bind(this)  //1day
                }
            }
            var vm = ko.observable(viewModel(ship));
            var I = 0;

            this.shipInfoUpdataProxy = this.shipInfoUpdataProxy || {};
            if (this.shipInfoUpdataProxy.timer) {
                clearInterval(this.shipInfoUpdataProxy.timer);
            }
            this.shipInfoUpdataProxy.timer = setInterval(function () {
                if (!utilities.DC.GN([this.shipInfoUpdataProxy], '0.*'))return;
                I++;
                var ship = this.layerShips.getShipFeature(this.shipInfoUpdataProxy.FeatureId);
                if (ship) {
                    var v = viewModel.apply(this, [ship]);
                    //v.ShipName+=I;
                    this.shipInfoUpdataProxy.updataModel(v);
                }
            }.bind(this), 1000);
            this.shipInfoUpdataProxy.FeatureId = featureId;
            this.shipInfoUpdataProxy.updataModel = vm;
            ko.applyBindings(vm, oi[0]);
            oi.data("title", "位置动态");
            return oi;
        }
        return oi;
    }

    private getSelectedFeature(featureId) {
        if (!featureId && this.shipInfoUpdataProxy) {
            clearInterval(this.shipInfoUpdataProxy.timer);
            delete this.shipInfoUpdataProxy;
        }
        if (!(typeof(featureId) == "string" && featureId.startsWith('shipLayer:')))return null;
        var ship = this.layerShips.getShipFeature(featureId);
        if (ship) {
            return {
                uid: "shipLayer:" + ship.data.id,
                name: ship.data.name,
                data: ship.data
            }
        } else
            return null;
    }

    private searchHistoryApi = function (key) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: this.config.searchHistoryApi || "api/shiphistory/RealtimeData/GetRealTimeDataBySearchkey/" + key,
                type: 'get'
            })
                .done(function (v) {
                    var list = v.map(function (v) {
                        return v;
                    });
                    resolve({state: 'apiok', data: list});
                })
                .fail(function (v) {
                    reject({state: 'apierr', data: null});
                })
        }.bind(this))
            .then(function (pdata:pdata) {
                var r = pdata.data.map(function (v) {
                    return {
                        type: "searchApi",
                        data: v.V_Name || '' + v.Name + (v.MMSI ? '(' + v.MMSI + ')' : ''),
                        target: v
                    }
                })
                return {state: 'apiok', data: r}
            })
    }

    private searchHistory(key) {
        return this.searchHistoryApi(key)
            .then(function (pdata:pdata) {
                return new Promise(function (resolve, reject) {
                    var r = pdata.data.map(function (v) {
                        var data = {searchApi: '', name: '名称', id: '编号'}[v.type] + ':' + v.data;
                        return {
                            fid: "shipLayer:" + v.target.ShipId,
                            data: '[船舶]' + data,
                            target: v.target,
                            searchListClick: this.searchSelectCallback.bind(this)
                        };
                    }.bind(this));
                    resolve({state: 'ok', data: r});
                }.bind(this))
            }.bind(this))
    }

    private search(key) {
        var resaults = this.layerShips.search(key);
        var r = resaults.map(function (v) {
            var data = {name: '名称', id: '编号'}[v.type] + ':' + v.data;
            return {data: '[船舶]' + data, target: v.target, searchListClick: this.searchSelectCallback.bind(this)};
        }.bind(this))
        return r;
    }

    /*目前没人用*/
    //public ShipFocus(MMSI){
    //    var ShipId='MMSI:'+MMSI;
    //    var shipFeature = this.layerShips.sourceImage_.getShipFeatureByDataId(ShipId);
    //    this.map.SetFocus(shipFeature);
    //    return shipFeature;
    //}

    public RealTimeShipFocus(key) {
        if (!key)return;
        return this.searchHistoryApi(key)
            .then(function (pdata:pdata) {
                switch (pdata.state) {
                    case 'apiok':
                        for (var I of pdata.data) {
                            if (I.target.MMSI.toString() == key.toString()) {
                                this.searchSelectCallback({target: I.target});
                                break;
                            }
                        }
                        break;
                }
            }.bind(this))
    }

    private searchSelectCallback(data) {
        var shipFeature = this.layerShips.sourceImage_.getShipFeatureByDataId(data.target.ShipId);
        if (!shipFeature) {
            var rd = this.convertLastHistoryDataToRealtime(data.target);
            this.ds.add_immediately(rd);
        }
        //setTimeout(function(){
        //    console.log('---end',new Date());
        shipFeature = this.layerShips.sourceImage_.getShipFeatureByDataId(data.target.ShipId);
        if (shipFeature)
            this.map.SetFocus(shipFeature);
        else
            alert("无法定位!");
        //}.bind(this),500);
    }

    public ShipFocus(uid):any {
        if (!uid)return;
        var shipFeature = this.layerShips.sourceImage_.getShipFeature(uid);
        if (shipFeature) {
            this.map.SetFocus(shipFeature);
            return true;
        }
        var key = uid.replace("shipLayer:MMSI:", "");
        return this.searchHistoryApi(key)
            .then(function (pdata:pdata) {
                var shipSelected = false;
                switch (pdata.state) {
                    case 'apiok':
                        for (var I of pdata.data) {
                            if (I.target.MMSI.toString() == key.toString()) {
                                this.searchSelectCallback({target: I.target});
                                shipSelected = true;
                                break;
                            }
                        }
                        break;
                }
                return shipSelected;
            }.bind(this))
    }

    handleMapselectionEnd_(evt) {
        var map = evt.map;
        var view2d = map.getView();
        /**
         * @type {ol.Extent}
         */
        var extent;
        if (view2d.getResolution() < this.layerShips.getCriticalResolution()) {
            var trans = ol.proj.getTransform('EPSG:3857', "EPSG:4326");
            extent = view2d.calculateExtent(/**@type {ol.Size}*/(map.getSize()));
            ol.extent.applyTransform(extent, trans, extent);
        } else {
            extent = ol.extent.createEmpty();
        }
    }

    boxSelect(list, extent) {
        var ships = list.filter(f=>(typeof(f.id) == "string" && f.id.startsWith('shipLayer:')))
        return ships.map(function (f) {
            return f.data.id
        });
    }
}

export default ShipLayerPlugin;
