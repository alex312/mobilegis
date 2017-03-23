import * as shipLayerStaticLib from "seecool/StaticLib";
import * as objInfo from "text!./htmls/ShipInfo.html";
import * as fecha from "fecha";
import * as ko from "knockout";
import * as ol from "openlayers";
import * as utilities from "seecool/utilities";
//import * as unescape from "unescape";

import ShipsLayer from "./layers/PlaybackLayer";
import ShipsSymbolDataSource from "./data/ShipsSymbolDataSource";
import ShipTrackLoader from "seecool/datas/ShipTrackLoader";
import AreaTrackLoader from "seecool/datas/AreaTrackLoader";
import ShipSelector from "./controls/ShipSelector";
import ShipTrackPlayer from "./controls/ShipTrackPlayer";

import {inject} from "seecool/plugins/Plugins";
import {God} from "seecool/StaticLib";
import {Frame} from "../../ui/frame/main";
//import {format} from "seecool/utilities";
//import {parse} from "seecool/utilities";
//import {Dialogs} from "seecool/datas/Dialogs";
//import {debug} from "util";

import "kendo";
import SidePanel from "./SidePanel";

class PlaybackPlugin {
    map;
    ships;
    playbackShip;

    constructor(config: any,
                @inject('maps/ui/frame')frame: Frame,
                @inject("maps/map") map) {
        this.map = map;

        var sideView = frame.sideView;
        var toolbar = frame.toolbars['right'];
        toolbar.addButton({
            text: '回放',
            click: ()=> {
                sideView.push(new SidePanel({
                    startTime: ko.observable(),
                    endTime: ko.observable(),
                    ships: this.ships = ko.observable(),
                    startPlayback: this.startStopPlayback.bind(this),
                    selectShip: this.selectShip.bind(this),
                    selectArea: this.selectArea.bind(this),
                    showTrackPath: this.showTrackPath.bind(this),
                    focusShip: this.focusShip.bind(this)
                }));
                this.init();
            }
        });
        //this.ui.RegisterSelectFocusEvent('playbackSelectFocus', this.featureSelected.bind(this));

        this.dsShipsSymbol_ = new ShipsSymbolDataSource({
            service: config.shipsBoundsApi || "api/ships/bounds2"
        });
        //var shipsLayer=new ShipsLayer();
        this.layerShips_ = new ShipsLayer({
            symbol: this.dsShipsSymbol_,
            criticalResolution: 152.8740565703525
        });

        map.map.addLayer(this.layerShips_);

        this.player_ = new ShipTrackPlayer({
            target: undefined //document.getElementsByName('container')
        });
        var mousePositionControl = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: 'EPSG:4326',
            // comment the following two lines to have the mouse position
            // be placed within the map.
            className: 'custom-mouse-position',
            target: document.getElementById('mouse-position'),
            undefinedHTML: '&nbsp;'
        });

        map.map.addControl(mousePositionControl)
        // map.map.addControl(new ol.control.FullScreen());

        map.map.addControl(this.player_);

        //map.map.on("moveend", this.handleMapMoveEnd_, this);

        utilities.notificationCenter.listen('player/update', $.proxy(function (type, end) {
            this.onRefreshSignal(end);
        }, this));
        this.expose();
        //this.menuClick();
    }

    expose() {
        var wg5: any = window["webgis5"] || (window["webgis5"] = {});
        wg5.playback = {};
        wg5.playback.playback = function (mmsi, start, end) {
            this.playbackSet({
                mmsi: mmsi || '',
                start: fecha.parse(start, "YYYY-MM-dd HH:mm"),
                end: fecha.parse(end, "YYYY-MM-dd HH:mm")
            });
        }.bind(this)
    }

    playbackSet(option: {mmsi: string,start?: Date,end?: Date}) {
        var now = new Date();
        var thisMinutes: any = new Date(now.getFullYear(),
            now.getMonth(), now.getDate(),
            now.getHours(), now.getMinutes());
        var twoHoursAgo = new Date(thisMinutes);
        twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
        thisMinutes.setMinutes(thisMinutes.getMinutes() - 1);
        if (option.mmsi) {
            if (this.playbackShip)this.shipSelector_.remove(this.playbackShip);
            this.playbackShip = {
                id: 'MMSI:' + option.mmsi,
                name: option.mmsi,
                mmsi: option.mmsi,
                type: null, //(/^[a-zA-Z0-9]+/.exec(uid) || [null])[0],
                callSign: '?',
                selected: null
            }
            this.shipSelector_.add(this.playbackShip);
            console.log(option);
            this.startPicker_.value(option.start || twoHoursAgo);
            this.endPicker_.value(option.end || thisMinutes);
        } else {
            this.startPicker_.value(twoHoursAgo);
            this.endPicker_.value(thisMinutes);
        }
    }

    init() {
        var element = $("#shipList");
        //.css({width: '100%', height: '200px', margin: 0, padding: 0, border: 0})
        //.appendTo(panel);

        var actionbar = $("<div></div>")
            .css({margin: 0})
            .addClass('sidebar-navbar')
            .hide()
            .appendTo(element);

        var inputs = $("<div></div>")
            .css('margin', 0)
            .addClass('sidebar-filter')
            .appendTo(element);

        var shiplistDiv = $("<div></div>")
            .css({margin: 0, padding: 0, height: '190px'})
            .appendTo(element);
        this.shipSelector_ = new ShipSelector(shiplistDiv);
        this.startPicker_ = $("#startTime")
            .kendoDateTimePicker({
                format: "yyyy-MM-dd HH:mm"
            })
            .data("kendoDateTimePicker");
        this.endPicker_ = $("#endTime")
            .kendoDateTimePicker({
                format: "yyyy-MM-dd HH:mm"
            })
            .data("kendoDateTimePicker");

        var hash = window.location.hash;

        function GetQueryString(name) {
            var reg = new RegExp("[\?|^|&]" + name + "=([^&]*)", "i");
            var r = hash.match(reg);
            if (r != null) return (r[1]);
            return null;
        }

        var urlSearch: any = {};
        urlSearch.mmsi = GetQueryString("mmsi");
        urlSearch.start = GetQueryString("start");
        urlSearch.end = GetQueryString("end");
        urlSearch.start = urlSearch.start && fecha.parse(urlSearch.start, "YYYY-MM-dd HH:mm");
        urlSearch.end = urlSearch.end && fecha.parse(urlSearch.end, "YYYY-MM-dd HH:mm");
        this.playbackSet(urlSearch);
        //this.startPicker_.max(this.endPicker_.value());
        //this.endPicker_.min(this.startPicker_.value());
    }

    handleMapMoveEnd_(evt) {
        var map = evt.map;
        var view2d = map.getView();
        var extent;
        if (view2d.getResolution() < this.layerShips_.getCriticalResolution()) {
            var trans = ol.proj.getTransform('EPSG:3857', "EPSG:4326");
            extent = view2d.calculateExtent(/**@type {ol.Size}*/(map.getSize()));
            ol.extent.applyTransform(extent, trans, extent);
        } else {
            extent = ol.extent.createEmpty();
        }
        this.dsShipsSymbol_.setExtent(extent);

    }

    private viewModel
    private dsShipsSymbol_
    private layerShips_
    private playbackSchema
    private dataLoader_
    private player_
    private shipSelector_
    private selectAreaFeature_
    private isActive_ = false

    private startPicker_
    private endPicker_
    private showTrackPath_

    startPickerChange_() {
        var startDate = this.startPicker_.value(),
            endDate = this.endPicker_.value();

        if (startDate) {
            this.endPicker_.min(new Date(startDate));
        } else if (endDate) {
            this.startPicker_.max(new Date(endDate));
        } else {
            endDate = new Date();
            this.startPicker_.max(endDate);
            this.endPicker_.min(endDate);
        }
    };

    focusShip(ship) {
        //var lon = ship.Longitude;
        //var lat = ship.Latitude;
        //var p=ol.proj.fromLonLat([lon,lat]);
        //var V=this.map.map.getView()
        //V.setCenter(p);
        this.map.setFocus(ship);
    }

    startStopPlayback() {
        console.log("aaa", this.playbackSchema);
        if (!this.isActive_) {
            var items = this.shipSelector_.getItems();
            if (items.length)this.playbackSchema = this.playbackSchema || "playbackShips";
            if (this.playbackSchema) {
                if (this.playbackSchema == "playbackShips") {
                    this.startPlaybackShips();
                    this.activate();
                }
                else {
                    this.startPlaybackArea();
                    this.activate();
                }
            } else {
                alert("请设置回放条件！");
            }
        } else {
            this.deactivate();
        }

    }

    startPlaybackShips() {
        var items = this.shipSelector_.getItems();
        if (!items.length)
            alert('尚未设置要回放的船舶。');//, '错误'
        else {
            var sTime = this.startPicker_.value();
            var eTime = this.endPicker_.value();
            var shipIds = [];
            for (var i = 0; i < items.length; i++)
                shipIds.push(items[i].id);//"MMSI:"+items[i].mmsi
            this.queryShips(shipIds, sTime, eTime);
        }
    }

    startPlaybackArea() {
        //var time = evt.end.getTime() - evt.start.getTime();
        //if (evt.playMode) {
        //    if (time > this.controller_.briefAreaTimeLimit) {
        //        Dialogs.alert("概要模式下，按区域回放开始时间和结束时间要5天");
        //        utilities.notificationCenter.send('use/frequency', '航迹回放/区域回放大于5天');
        //        return;
        //    }
        //} else {
        //    if (time > this.controller_.highAreaTimeLimit) {
        //        Dialogs.alert("高精度模式下，按区域回放开始时间和结束时间要少于5小时");
        //        utilities.notificationCenter.send('use/frequency', '航迹回放/区域回放大于5小时');
        //        return;
        //    }
        //}
        if (this.selectAreaFeature_ == null) {
            alert('尚未设置要回放的区域。');//, '错误'
        }
        var area = [];
        var geo = this.selectAreaFeature_.getGeometry();
        var extent = geo.getExtent();
        var lb = ol.proj.toLonLat([extent[0], extent[1]]);
        var rt = ol.proj.toLonLat([extent[2], extent[3]]);
        area.push(lb[0]);
        area.push(rt[0]);
        area.push(lb[1]);
        area.push(rt[1]);
        if ((area[1] - area[0]) * (area[3] - area[2]) > 1) {
            alert("设置的区域过大（超出1平方经纬度)。");
            utilities.notificationCenter.send('use/frequency', '航迹回放/设置的区域过大');
            return;
        }

        //this.shipsView_.showLoading(true);
        //this.map.getSidebar().setContent(this.shipsView_);
        var sTime = this.startPicker_.value();
        var eTime = this.endPicker_.value();
        this.queryArea(area, sTime, eTime);
    }

    private queryArea(area, start, end) {
        //utilities.notificationCenter.send('use/frequency', '航迹回放/区域' + (briefMode ? '概要模式' : '高精度模式') + '回放');

        if (this.dataLoader_) {
            this.dataLoader_.destroy();
            this.dataLoader_ = null;
        }
        this.dataLoader_ = new AreaTrackLoader(area, start, end, this.onTrackLoad, this.onTrackError, this, this.player_);
        this.dataLoader_.load();

        this.player_.activate();
        this.player_.setTime(start, end);
    }

    private queryShips(ships, start, end) {
        //utilities.notificationCenter.send('use/frequency', '航迹回放/区域' + (briefMode ? '概要模式' : '高精度模式') + '回放');

        if (this.dataLoader_) {
            this.dataLoader_.destroy();
            this.dataLoader_ = null;
        }
        this.dataLoader_ = new ShipTrackLoader(ships, start, end, this.onTrackLoad, this.onTrackError, this, this.player_);
        this.dataLoader_.load();

        this.player_.activate();
        this.player_.setTime(start, end);
    }

    onRefreshSignal(time) {
        var show = (<HTMLInputElement>$("#showTrackPath")[0]).checked;
        var points = this.dataLoader_.points;
        var data = {};
        for (var key in points) {
            if (points[key].length > 0) {
                var playbackPoints = [];
                for (var i = 0; i < points[key].length; i++) {
                    playbackPoints.push(this.convertData(points[key][i]));
                }
                for (var j = 0; j < playbackPoints.length; j++) {
                    if (new Date(playbackPoints[j].time) < time) {
                        data [key] = playbackPoints[j];
                        data[key].TrackPoints = playbackPoints;
                        data[key].ShowTrack = show;
                    }
                }
            }
        }
        this.dsShipsSymbol_.SetData(data);
        var allShips = this.layerShips_.getAllShipFeature();
        var showList = [];
        for (var k = 0; k < allShips.length; k++) {
            allShips[k].focusShip = this.focusShip.bind(this);
            allShips[k].data.v_name = allShips[k].data.v_name || allShips[k].data.name || allShips[k].data.id
            showList.push(allShips[k]);
        }
        this.ships(showList);
    }

    convertData(data) {
        var ship: any = {};
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
        ship.type = data.ShipType;
        ship.v_name = data.NameCN || data.Name;
        return ship;
    }


    onTrackLoad(finish) {
        var points = this.dataLoader_.points;
        //console.log("points",points);
        //var showList = [];
        //var data = {};
        //for (var key in points){
        //    if(points[key].length>0) {
        //        data[key] = points[key][points[key].length - 1];
        //        data[key].focusShip = this.focusShip.bind(this);
        //        showList.push(data[key]);
        //    }
        //}
        //this.ships(showList);

        if (finish) {
            console.log("load finish");
            var trackCount = 0, trackPointCount = 0;
            for (var each in points) {
                if (!points[each])
                    continue;
                trackCount++;
                trackPointCount += points[each].length;
            }
        } else if (this.isActive_) {
            this.dataLoader_.load();
        }
    }

    onTrackError() {

    }

    selectShip() {
        this.playbackSchema = "playbackShips";
        this.layerShips_.removeDrawAreaInteraction(this.map.map);
        $("#shipList").css("display", "block");
        this.shipSelector_.popup();
    }

    selectArea() {
        this.playbackSchema = "playbackArea";
        this.layerShips_.addDrawAreaInteraction(this.map.map, this.onDrawEndArea.bind(this));
        $("#shipList").css("display", "none");
    }

    deactivate() {
        if (this.player_)
            this.player_.deactivate();
        this.dsShipsSymbol_.ClearData();
        this.ships([]);
        this.layerShips_.removeDrawArea(this.selectAreaFeature_);
        this.selectAreaFeature_ = null;
        this.playbackSchema = null;
        $("#playShipList").css("display", "none");
        $("#playSetting").css("display", "block");
        $("#btnStartStop").text("启动回放");
        this.isActive_ = !this.isActive_;
    }

    activate() {
        $("#playShipList").css("display", "block");
        $("#playSetting").css("display", "none");
        $("#btnStartStop").text("停止回放");
        this.isActive_ = !this.isActive_;
    }

    onDrawEndArea(areaFeature) {
        this.layerShips_.removeDrawAreaInteraction(this.map.map);
        this.selectAreaFeature_ = areaFeature;
    }

    private showTrackPath() {
        var show = (<HTMLInputElement>$("#showTrackPath")[0]).checked;
        this.dsShipsSymbol_.ShowTrackPath(show);
        return true;
    }

    private featureSelected(featureId) {
        if (!(typeof(featureId) == "string" && featureId.startsWith('shipLayer:')))return null;

        var ship = this.layerShips_.getShipFeature(featureId);
        var shipName = "?";
        if (ship) {
            shipName = ship.data.name;
            var oi = $(objInfo);
            var viewModel = {
                ShipName: shipName,
                ShipType: shipLayerStaticLib.getShipTypeInfo(ship.data.type, ship.data.v_type, "Labels"),
                MMSI: ship.data.mmsi,
                Heading: ship.data.heading,
                COG: ship.data.cog,
                SOG: ship.data.sog,
                Longitude: utilities.formatDegree(ship.data.lon, 'ddd-cc-mm.mmL'),
                Latitude: utilities.formatDegree(ship.data.lat, 'dd-cc-mm.mmB'),
                Time: fecha.format(ship.data.time, "YYYY-MM-dd HH:mm:ss")
            }
            ko.applyBindings(viewModel, oi[0]);
            oi.data("title", "位置动态");
            return oi;
        }
        return oi;
    }

    public ShowShipArchive(event) {
        var featureId = $(this).attr("objId");
        alert(featureId);
        console.log("click:" + featureId);
    }
}

export default PlaybackPlugin;
