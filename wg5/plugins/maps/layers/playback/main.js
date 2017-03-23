"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = undefined && undefined.__param || function (paramIndex, decorator) {
    return function (target, key) {
        decorator(target, key, paramIndex);
    };
};
define(["require", "exports", "jquery", "fecha", "knockout", "openlayers", "../../../../seecool/utilities", "../../../../seecool/StaticLib", "text!./htmls/ShipInfo.html", "../../../../seecool/plugins/Plugins", "./SidePanel", "./layers/PlaybackLayer", "./data/ShipsSymbolDataSource", "../../../../seecool/datas/ShipTrackLoader", "../../../../seecool/datas/AreaTrackLoader", "./controls/ShipSelector", "./controls/ShipTrackPlayer", "kendo"], function (require, exports, $, fecha, ko, ol, utilities, shipLayerStaticLib, objInfo, Plugins_1, SidePanel_1, PlaybackLayer_1, ShipsSymbolDataSource_1, ShipTrackLoader_1, AreaTrackLoader_1, ShipSelector_1, ShipTrackPlayer_1) {
    "use strict";

    var PlaybackPlugin = function () {
        function PlaybackPlugin(config, root, frame, map) {
            _classCallCheck(this, PlaybackPlugin);

            this.isActive_ = false;
            this.config_ = config;
            this.map = map;
            this.root_ = root;
            this.frame_ = frame;
            var toolbar = frame.toolbars['right'];
            toolbar.addButton({
                text: '回放',
                icon: 'fa fa-history',
                click: this.menuClick_.bind(this)
            });
            //this.ui.RegisterSelectFocusEvent('playbackSelectFocus', this.featureSelected.bind(this));
            this.dsShipsSymbol_ = new ShipsSymbolDataSource_1.default({
                service: this.config_.shipsBoundsApi || "api/ships/bounds2"
            });
            //var shipsLayer=new ShipsLayer();
            this.layerShips_ = new PlaybackLayer_1.default({
                symbol: this.dsShipsSymbol_,
                criticalResolution: 152.8740565703525
            });
            map.map.addLayer(this.layerShips_);
            this.player_ = new ShipTrackPlayer_1.default({
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
            map.map.addControl(mousePositionControl);
            // map.map.addControl(new ol.control.FullScreen());
            map.map.addControl(this.player_);
            //map.map.on("moveend", this.handleMapMoveEnd_, this);
            utilities.notificationCenter.listen('player/update', $.proxy(function (type, end) {
                this.onRefreshSignal(end);
            }, this));
            this.expose_();
            this.menuClick_();
        }

        _createClass(PlaybackPlugin, [{
            key: "playback",
            value: function playback(mmsi, start, end) {
                return this.playback_(mmsi, start, end);
            }
        }, {
            key: "expose_",
            value: function expose_() {
                var wg5 = window["webgis5"] || (window["webgis5"] = {});
                wg5.playback = {};
                wg5.playback.playback = this.playback_.bind(this);
                this.root_.playback = wg5.playback;
            }
        }, {
            key: "menuClick_",
            value: function menuClick_() {
                var sideView = this.frame_.sideView;
                sideView.push(new SidePanel_1.default({
                    startTime: ko.observable(),
                    endTime: ko.observable(),
                    ships: this.ships = ko.observable(),
                    startPlayback: this.startPlayback_.bind(this),
                    stopPlayback: this.stopPlayback_.bind(this),
                    selectShip: this.selectShip.bind(this),
                    selectArea: this.selectArea.bind(this),
                    showTrackPath: this.showTrackPath.bind(this),
                    focusShip: this.focusShip.bind(this)
                }));
                this.init();
            }
        }, {
            key: "playback_",
            value: function playback_(mmsi, start, end) {
                this.playbackSet_({
                    mmsi: mmsi || '',
                    start: fecha.parse(start, "YYYY-MM-DD HH:mm"),
                    end: fecha.parse(end, "YYYY-MM-DD HH:mm")
                });
            }
        }, {
            key: "playbackSet_",
            value: function playbackSet_(option) {
                var now = new Date();
                var thisMinutes = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
                var twoHoursAgo = new Date(thisMinutes);
                twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
                thisMinutes.setMinutes(thisMinutes.getMinutes() - 1);
                if (option.mmsi) {
                    if (this.playbackShip) this.shipSelector_.remove(this.playbackShip);
                    this.playbackShip = {
                        id: 'MMSI:' + option.mmsi,
                        name: option.mmsi,
                        mmsi: option.mmsi,
                        type: null,
                        callSign: '?',
                        selected: null
                    };
                    this.shipSelector_.add(this.playbackShip);
                    console.log(option);
                    this.startPicker_.value(option.start || twoHoursAgo);
                    this.endPicker_.value(option.end || thisMinutes);
                } else {
                    this.startPicker_.value(twoHoursAgo);
                    this.endPicker_.value(thisMinutes);
                }
            }
        }, {
            key: "init",
            value: function init() {
                var element = $("#shipList");
                this.shipSelector_ = new ShipSelector_1.default(element, this.config_.shiphistoryApi || "api/shiphistory");
                this.startPicker_ = $("#startTime").kendoDateTimePicker({
                    format: "yyyy-MM-dd HH:mm"
                }).data("kendoDateTimePicker");
                this.endPicker_ = $("#endTime").kendoDateTimePicker({
                    format: "yyyy-MM-dd HH:mm"
                }).data("kendoDateTimePicker");
                var hash = window.location.hash;
                function GetQueryString(name) {
                    var reg = new RegExp("[\?|^|&]" + name + "=([^&]*)", "i");
                    var r = hash.match(reg);
                    if (r != null) return r[1];
                    return null;
                }
                var urlSearch = {};
                urlSearch.mmsi = GetQueryString("mmsi");
                urlSearch.start = GetQueryString("start");
                urlSearch.end = GetQueryString("end");
                urlSearch.start = urlSearch.start && fecha.parse(urlSearch.start, "YYYY-MM-DD HH:mm");
                urlSearch.end = urlSearch.end && fecha.parse(urlSearch.end, "YYYY-MM-DD HH:mm");
                this.playbackSet_(urlSearch);
                //this.startPicker_.max(this.endPicker_.value());
                //this.endPicker_.min(this.startPicker_.value());
            }
        }, {
            key: "handleMapMoveEnd_",
            value: function handleMapMoveEnd_(evt) {
                var map = evt.map;
                var view2d = map.getView();
                var extent;
                if (view2d.getResolution() < this.layerShips_.getCriticalResolution()) {
                    var trans = ol.proj.getTransform('EPSG:3857', "EPSG:4326");
                    extent = view2d.calculateExtent( /**@type {ol.Size}*/map.getSize());
                    ol.extent.applyTransform(extent, trans, extent);
                } else {
                    extent = ol.extent.createEmpty();
                }
                this.dsShipsSymbol_.setExtent(extent);
            }
        }, {
            key: "startPickerChange_",
            value: function startPickerChange_() {
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
            }
        }, {
            key: "focusShip",
            value: function focusShip(ship) {
                //var lon = ship.Longitude;
                //var lat = ship.Latitude;
                //var p=ol.proj.fromLonLat([lon,lat]);
                //var V=this.map.map.getView()
                //V.setCenter(p);
                this.map.setFocus(ship);
            }
        }, {
            key: "startStopPlayback_",
            value: function startStopPlayback_() {
                console.log("aaa", this.playbackSchema);
                if (!this.isActive_) {
                    this.startPlayback_();
                } else {
                    this.stopPlayback_();
                }
            }
        }, {
            key: "startPlayback_",
            value: function startPlayback_() {
                if (!this.isActive_) {
                    var items = this.shipSelector_.getItems();
                    if (items.length) this.playbackSchema = this.playbackSchema || "playbackShips";
                    if (this.playbackSchema) {
                        if (this.playbackSchema == "playbackShips") {
                            this.startPlaybackShips();
                            this.activate();
                        } else {
                            this.startPlaybackArea();
                            this.activate();
                        }
                    } else {
                        alert("请设置回放条件！");
                    }
                }
            }
        }, {
            key: "stopPlayback_",
            value: function stopPlayback_() {
                if (this.isActive_) {
                    this.deactivate();
                }
            }
        }, {
            key: "startPlaybackShips",
            value: function startPlaybackShips() {
                var items = this.shipSelector_.getItems();
                if (!items.length) alert('尚未设置要回放的船舶。'); //, '错误'
                else {
                        var sTime = this.startPicker_.value();
                        var eTime = this.endPicker_.value();
                        var shipIds = [];
                        for (var i = 0; i < items.length; i++) {
                            shipIds.push(items[i].id);
                        } //"MMSI:"+items[i].mmsi
                        this.queryShips(shipIds, sTime, eTime);
                    }
            }
        }, {
            key: "startPlaybackArea",
            value: function startPlaybackArea() {
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
                    alert('尚未设置要回放的区域。'); //, '错误'
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
        }, {
            key: "queryArea",
            value: function queryArea(area, start, end) {
                //utilities.notificationCenter.send('use/frequency', '航迹回放/区域' + (briefMode ? '概要模式' : '高精度模式') + '回放');
                if (this.dataLoader_) {
                    this.dataLoader_.destroy();
                    this.dataLoader_ = null;
                }
                this.dataLoader_ = new AreaTrackLoader_1.default(this.config_.shiphistoryApi || "api/shiphistory", area, start, end, this.onTrackLoad, this.onTrackError, this, this.player_);
                this.dataLoader_.load();
                this.player_.activate();
                this.player_.setTime(start, end);
            }
        }, {
            key: "queryShips",
            value: function queryShips(ships, start, end) {
                //utilities.notificationCenter.send('use/frequency', '航迹回放/区域' + (briefMode ? '概要模式' : '高精度模式') + '回放');
                if (this.dataLoader_) {
                    this.dataLoader_.destroy();
                    this.dataLoader_ = null;
                }
                this.dataLoader_ = new ShipTrackLoader_1.default(this.config_.shiphistoryApi || "api/shiphistory", ships, start, end, this.onTrackLoad, this.onTrackError, this, this.player_);
                this.dataLoader_.load();
                this.player_.activate();
                this.player_.setTime(start, end);
            }
        }, {
            key: "onRefreshSignal",
            value: function onRefreshSignal(time) {
                var show = $("#showTrackPath")[0].checked;
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
                                data[key] = playbackPoints[j];
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
                    allShips[k].data.v_name = allShips[k].data.v_name || allShips[k].data.name || allShips[k].data.id;
                    showList.push(allShips[k]);
                }
                this.ships(showList);
            }
        }, {
            key: "convertData",
            value: function convertData(data) {
                var ship = {};
                ship.id = data.ID;
                ship.name = data.Name;
                ship.mmsi = data.MMSI;
                ship.lon = data.Longitude;
                ship.lat = data.Latitude;
                ship.sog = data.SOG;
                ship.cog = data.COG;
                ship.heading = data.Heading;
                ship.time = new Date(Date.parse(data.Time)); // utilities.dateFromWcfJson();
                ship.uid = ship.id;
                ship.type = data.ShipType;
                ship.v_name = data.NameCN || data.Name;
                return ship;
            }
        }, {
            key: "onTrackLoad",
            value: function onTrackLoad(finish) {
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
                    var trackCount = 0,
                        trackPointCount = 0;
                    for (var each in points) {
                        if (!points[each]) continue;
                        trackCount++;
                        trackPointCount += points[each].length;
                    }
                } else if (this.isActive_) {
                    this.dataLoader_.load();
                }
            }
        }, {
            key: "onTrackError",
            value: function onTrackError() {}
        }, {
            key: "selectShip",
            value: function selectShip() {
                this.playbackSchema = "playbackShips";
                this.layerShips_.removeDrawAreaInteraction(this.map.map);
                $("#shipList").css("display", "block").trigger('resize');
                this.shipSelector_.resize();
                this.shipSelector_.popup();
            }
        }, {
            key: "selectArea",
            value: function selectArea() {
                this.playbackSchema = "playbackArea";
                this.layerShips_.addDrawAreaInteraction(this.map.map, this.onDrawEndArea.bind(this));
                $("#shipList").css("display", "none");
                this.shipSelector_.depopup();
            }
        }, {
            key: "deactivate",
            value: function deactivate() {
                if (this.player_) this.player_.deactivate();
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
        }, {
            key: "activate",
            value: function activate() {
                $("#playShipList").css("display", "block");
                $("#playSetting").css("display", "none");
                $("#btnStartStop").text("停止回放");
                this.isActive_ = !this.isActive_;
            }
        }, {
            key: "onDrawEndArea",
            value: function onDrawEndArea(areaFeature) {
                this.layerShips_.removeDrawAreaInteraction(this.map.map);
                this.selectAreaFeature_ = areaFeature;
            }
        }, {
            key: "showTrackPath",
            value: function showTrackPath() {
                var show = $("#showTrackPath")[0].checked;
                this.dsShipsSymbol_.ShowTrackPath(show);
                return true;
            }
        }, {
            key: "featureSelected",
            value: function featureSelected(featureId) {
                if (!(typeof featureId == "string" && featureId.startsWith('shipLayer:'))) return null;
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
                        Time: fecha.format(ship.data.time, "YYYY-MM-DD HH:mm:ss")
                    };
                    ko.applyBindings(viewModel, oi[0]);
                    oi.data("title", "位置动态");
                    return oi;
                }
                return oi;
            }
        }, {
            key: "ShowShipArchive",
            value: function ShowShipArchive(event) {
                var featureId = $(this).attr("objId");
                alert(featureId);
                console.log("click:" + featureId);
            }
        }]);

        return PlaybackPlugin;
    }();

    PlaybackPlugin = __decorate([__param(1, Plugins_1.inject('root')), __param(2, Plugins_1.inject('maps/ui/uiFrame')), __param(3, Plugins_1.inject("maps/map"))], PlaybackPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PlaybackPlugin;
});