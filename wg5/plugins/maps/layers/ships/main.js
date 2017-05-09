var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "knockout", "openlayers", "fecha", "../../../../seecool/plugins/Plugins", "../../../../seecool/StaticLib", "../../../../seecool/utils/MapTool", "../../../../seecool/datas/ShipTrackLoader", "./layers/ShipsLayer", "./data/ShipsTileDataSource", "./data/ShipData", "./data/ShipDataSource", "./data/ScunionShipEntity", "./data/RtdsShipSyncer", "../../../../seecool/datas/ShiphistoryApi", "./data/ShipSignalApi", "./data/RtdsShipSyncer"], function (require, exports, ko, ol, fecha, Plugins_1, StaticLib_1, MapTool_1, ShipTrackLoader_1, ShipsLayer_1, ShipsTileDataSource_1, ShipData_1, ShipDataSource_1, ScunionShipEntity_1, RtdsShipSyncer_1, ShiphistoryApi_1, ShipSignalApi_1, RtdsShipSyncer_2) {
    "use strict";
    var CFG;
    var ShipLayerPlugin = (function () {
        function ShipLayerPlugin(config, root, frameAlert, layersSetting_, map) {
            var _this = this;
            this.featuresDic_ = {};
            this.featureChangeHandler_ = this.onFeatureChange_.bind(this);
            //Search
            this.shipFlagDrawCallBackList_ = {};
            console.log("shipLayer PluginLoading"); //,ui, map,ShipsLayer);
            this.config_ = config || {};
            this.layersSetting_ = layersSetting_;
            this.map_ = map;
            this.root_ = root;
            this.frameAlert_ = frameAlert;
            var con = new StaticLib_1.Config(this.config_);
            CFG = con.DefaultData.bind(con);
            this.expires_ = 1000 * this.config_.expires || 60 * 60 * 3;
            var expires = this.expires_;
            this.dsShipsTile_ = new ShipsTileDataSource_1.default({
                tileUrl: this.config_.tileUrl + "?ttl=" + 10000 * expires + "&x={x}&y={y}&z={z}&ts={v}",
                versionUrl: this.config_.tileUrl + "?check=1",
                checkInterval: 10000
            });
            this.features_ = [];
            this.ds_ = new ShipDataSource_1.default(this.entityFactories_());
            this.layerShips_ = new ShipsLayer_1.default({
                tile: this.dsShipsTile_,
                tileUrl: this.config_.tileUrl + "?ttl=" + 10000 * expires + "&x={x}&y={y}&z={z}&ts={v}",
                titleVersionUrl: this.config_.tileUrl + "?check=1",
                flagDraw: this.shipFlagDraw_.bind(this),
                criticalResolution: MapTool_1.MapTool.ZoomToResolution(9)
            });
            map.map.addLayer(this.layerShips_);
            map.map.on("moveend", this.handleMapMoveEnd_, this);
            map.bind("selectFeatureChange", this.selectedFeatureChanged_.bind(this));
            this.shiphistoryApi_ = new ShiphistoryApi_1.default(this.config_.shiphistoryApi || 'api/shiphistory');
            this.shipTileApi_ = new ShipSignalApi_1.default(this.config_.signalApi || 'api/signal');
            // //以下接口mobile专用
            // if (this.ui.RegisterSelectFeatureByUidEvent)
            //     this.ui.RegisterGetSelectedFeatureEvent("shipLayerGetSelectedFeature", this.getSelectedFeature.bind(this));
            // if (this.ui.RegisterSelectFeatureByUidEvent)
            //     this.ui.RegisterSelectFeatureByUidEvent("shipLayerSelectFeatureByUid", this.ShipFocus.bind(this));
            //todo
            //this.ui.RegisterBoxSelectedEvent('shipLayerBoxSelected', this.boxSelect_.bind(this));
            this.expose_();
            var rtdsUrl = config.rtds || 'api/rtds';
            rtdsUrl = this.toFullUrl_(rtdsUrl).replace(/^\w+:\/\//, 'ws://');
            var rtds = rtdsUrl; //var rtds = document.URL.replace(/\/[^\/]+$/, '/').replace(/^http/, 'ws') + ;
            this.rss_ = new RtdsShipSyncer_1.default({ local: this.ds_, remote: rtds, expires: expires });
            this.bindLayerWithDataSource_();
            this.mapTimeMode_ = ko.observable("realtime");
            this.root_.bind("mapTimeMode", function (evt, mode) {
                if (_this.mapTimeMode_() != mode) {
                }
                _this.mapTimeMode_(mode);
                _this.updataVisible_();
            });
            this.handleMapMoveEnd_(this.map_);
            this.isShow_ = true;
            this.updataVisible_();
            this.zIndex_ = ko.observable();
            this.setZIndex_(this.config_.zIndex);
            this.maxZoom_ = ko.observable((this.config_.zoom || MapTool_1.MapTool.ResolutionToZoom(this.map_.map.getView().getMaxResolution())) - 1);
            // this.setMaxZoom_((this.config_.zoom||MapTool.ResolutionToZoom(this.map_.map.getView().getMaxResolution())) - 1);
            setInterval(function () {
                this.onFeatureSourceChange_();
            }.bind(this), 500);
            this.isLayerShow_ = ko.observable(true);
            this.isLayerShow_.subscribe(function (v) {
                this.setVisible_(v);
            }.bind(this));
            this.layersSetting_.RegisterLayerSetting("船舶", this.isLayerShow_, this.zIndex_, this.maxZoom_, this.switch_.bind(this), this.setZIndex_.bind(this), this.setMaxZoom_.bind(this));
            //this.setFilter("filt", "vesselTag", [1]); //过滤舟山
            //this.setFilter("filt", "vesselTag", null); //过滤舟山
        }
        Object.defineProperty(ShipLayerPlugin.prototype, "mapTimeMode", {
            get: function () {
                var _this = this;
                return ko.computed(function () {
                    return _this.mapTimeMode_();
                });
            },
            enumerable: true,
            configurable: true
        });
        // public setFocus(id) {
        //     return this.setFocus_(id);
        // }
        ShipLayerPlugin.prototype.loadTrack = function (id, start, end) {
            return this.loadTrack_(id, start, end);
        };
        ShipLayerPlugin.prototype.setVisible = function (isShow) {
            this.isShow_ = isShow;
            return this.updataVisible_();
        };
        ShipLayerPlugin.prototype.realTimeShipFocus = function (key) {
            return this.realTimeShipFocus_(key);
        };
        ShipLayerPlugin.prototype.realTimeShipFocusById = function (id) {
            return this.realTimeShipFocusById_(id);
        };
        ShipLayerPlugin.prototype.registerShipFlagDrawEvent = function (name, callback, option) {
            return this.registerShipFlagDrawEvent_(name, callback, option);
        };
        ShipLayerPlugin.prototype.removeShipFlagDrawEvent = function (name) {
            return this.removeShipFlagDrawEvent_(name);
        };
        ShipLayerPlugin.prototype.setZIndex = function (index) {
            this.setZIndex_(index);
        };
        ShipLayerPlugin.prototype.setMaxZoom = function (zoom) {
            this.setMaxZoom_(zoom);
        };
        Object.defineProperty(ShipLayerPlugin.prototype, "zIndex", {
            get: function () {
                return this.zIndex_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShipLayerPlugin.prototype, "maxZoom", {
            get: function () {
                return this.maxZoom_;
            },
            enumerable: true,
            configurable: true
        });
        ShipLayerPlugin.prototype.setFilter = function (way, name, values) {
            switch (way) {
                case "watch":
                    if (values) {
                        this.rss_.watch(name, values.initial);
                    }
                    else {
                        this.rss_.unwatch(name);
                    }
                    break;
                case "special":
                    //this.rss_.setSpecial(<"types"|"v_types">name, <any[]>values);
                    break;
                case "filt":
                    if (name === "vesselTag") {
                        if (values) {
                            this.dsShipsTile_.setUrl(this.config_.tileUrl + "?ttl=" + 10000 * this.expires_ + "&x={x}&y={y}&z={z}&ts={v}&tags=1");
                        }
                        else {
                            this.dsShipsTile_.setUrl(this.config_.tileUrl + "?ttl=" + 10000 * this.expires_ + "&x={x}&y={y}&z={z}&ts={v}");
                        }
                    }
                    //this.rss_.setFilt("v_types", ["vtanker"]);
                    this.rss_.setFilt(name, values);
                    break;
            }
        };
        ShipLayerPlugin.prototype.createItems_ = function () {
            var items = new Array(this.features_.length);
            for (var i = 0; i < this.features_.length; i++)
                items[i] = (this.createItem_(this.features_[i]));
            return items;
        };
        ShipLayerPlugin.prototype.createItem_ = function (feature) {
            return null;
        };
        ShipLayerPlugin.prototype.toFullUrl_ = function (rtdsUrl) {
            if (/^\w+:\/\//.exec(rtdsUrl)) {
                rtdsUrl = rtdsUrl;
            }
            else if (rtdsUrl.indexOf('./') === 0) {
                rtdsUrl = document.URL.replace(/\/[^\/]+$/, '/') + rtdsUrl.substring(2, rtdsUrl.length);
            }
            else {
                if (rtdsUrl.indexOf('/') !== 0) {
                    rtdsUrl = '/' + rtdsUrl; //.substring(1, rtdsUrl.length);
                }
                var t = /^\w+:\/\/[^\/]*/gi.exec(document.URL);
                if (t) {
                    t = t[0];
                }
                else {
                    t = 'http://' + document.URL;
                }
                rtdsUrl = t + rtdsUrl;
            }
            return rtdsUrl;
        };
        ShipLayerPlugin.prototype.updataVisible_ = function () {
            if (this.mapTimeMode_() == "history") {
                this.setVisible_(false);
            }
            else {
                this.setVisible_(this.isShow_);
            }
        };
        ShipLayerPlugin.prototype.setVisible_ = function (isShow) {
            this.layerShips_.setVisible(isShow);
        };
        ShipLayerPlugin.prototype.setMaxZoom_ = function (zoom) {
            // this.maxZoom_(zoom);
            // this.layerEntity_.layer.setMaxResolution(MapTool.ZoomToResolution(zoom));
        };
        ShipLayerPlugin.prototype.setZIndex_ = function (index) {
            this.zIndex_(index);
            this.layerShips_.setZIndex(index);
        };
        ShipLayerPlugin.prototype.switch_ = function () {
            if (this.isLayerShow_()) {
                this.isLayerShow_(false);
            }
            else {
                this.isLayerShow_(true);
            }
        };
        ShipLayerPlugin.prototype.registerShipFlagDrawEvent_ = function (name, callback, option) {
            if (arguments.length == 1) {
                callback = name;
                name = "";
            }
            this.shipFlagDrawCallBackList_[name] = callback;
        };
        ShipLayerPlugin.prototype.removeShipFlagDrawEvent_ = function (name) {
            if (name in this.shipFlagDrawCallBackList_) {
                delete this.shipFlagDrawCallBackList_[name];
            }
        };
        ShipLayerPlugin.prototype.shipFlagDraw_ = function (feature) {
            if (!feature)
                return;
            else {
                var flags = [];
                for (var i in this.shipFlagDrawCallBackList_) {
                    var func = this.shipFlagDrawCallBackList_[i];
                    flags = flags.concat(func(feature));
                }
            }
            return flags;
        };
        ShipLayerPlugin.prototype.expose_ = function () {
            var wg5 = window["webgis5"] || (window["webgis5"] = {});
            wg5.shipLayer = {};
            wg5.shipLayer.SetFocus = this.setFocus_.bind(this);
            wg5.shipLayer.SetFocusIsFully = function (id, isFully) {
                return this.setFocusIsFully_(id, (isFully === true) ? 'fully' : { stat: "range", minZoom: 13 });
            }.bind(this);
            wg5.shipLayer.LoadTrack = function (start, end) {
                if (this.selectedFeature_) {
                    var id = this.selectedFeature_.data.id;
                    var end_ = fecha.parse(end, "YYYY-MM-DD HH:mm:ss");
                    var start_ = fecha.parse(start, "YYYY-MM-DD HH:mm:ss");
                    this.loadTrack_(id, start_, end_);
                }
            }.bind(this);
            this.root_.shipLayer = wg5.shipLayer;
            this.root_.trigger("moduledChange", { type: 'shipLayer', data: this.root_.shipLayer });
        };
        ShipLayerPlugin.prototype.setFocus_ = function (id) {
            return this.setFocusIsFully_(id, { stat: "range", minZoom: 13 });
        };
        ShipLayerPlugin.prototype.setFocusIsFully_ = function (id, stat) {
            var _this = this;
            if (!id) {
                this.map_.setFocus(null); //todo whether needed ?
                return;
            }
            var fid = "shipLayer:" + id;
            var shipFeature = this.layerShips_.getShipFeature(fid); //var shipFeature = this.layerShips.sourceImage_.getShipFeature(uid);
            if (shipFeature) {
                this.map_.setFocus(shipFeature, stat);
                return true;
            }
            return this.searchShipSignalApi_(id)
                .then(function (pdata) {
                    //var shipSelected = false;
                    switch (pdata.state) {
                        case 'apiok':
                            var ship = RtdsShipSyncer_2.convertItem(pdata.data);
                            return _this.selectCallbackIsFully_(ship, stat);
                    }
                    //return shipSelected
                });
            //var key = fid.replace("shipLayer:MMSI:", "");
            // return this.searchHistoryApi_(key)
            //     .then(function (pdata: pdata) {
            //         var shipSelected = false;
            //         switch (pdata.state) {
            //             case 'apiok':
            //                 for (var I of pdata.data) {
            //                     if (I.target.MMSI.toString() == key.toString()) {
            //                         this.searchSelectCallbackIsFully_({target: I.target}, isFully);
            //                         shipSelected = true;
            //                         break;
            //                     }
            //                 }
            //                 break;
            //         }
            //         return shipSelected;
            //     }.bind(this))
        };
        ShipLayerPlugin.prototype.handleMapMoveEnd_ = function (evt) {
            //console.log("move");
            var map = evt.map;
            var view2d = map.getView();
            /**
             * @type {ol.Extent}
             */
            var extent;
            if (view2d.getResolution() < this.layerShips_.getCriticalResolution()) {
                var trans = ol.proj.getTransform('EPSG:3857', "EPSG:4326");
                extent = view2d.calculateExtent(/**@type {ol.Size}*/(map.getSize()));
                ol.extent.applyTransform(extent, trans, extent);
            }
            else {
                extent = ol.extent.createEmpty();
            }
            //this.ds_ShipsSymbol_.setExtent(extent);
            var w = extent[2] - extent[0];
            var h = extent[3] - extent[1];
            extent[0] -= w;
            extent[1] -= h;
            extent[2] += w;
            extent[3] += h;
            this.setExtent_(map, extent);
            //if (menuconfig.CCtvsLayerEnabled) {
            //    var trans = ol.proj.getTransform('EPSG:3857', "EPSG:4326");
            //    var extent2 = view2d.calculateExtent(/**@type {ol.Size}*/(map.getSize()));
            //    ol.extent.applyTransform(extent2, trans, extent2);
            //    this.ds_CctvsSymbol_.setExtent(extent2);
            //}
        };
        ShipLayerPlugin.prototype.entityFactories_ = function () {
            return {
                "scunion": function (id, data) {
                    return new ScunionShipEntity_1.default(id, data);
                }
            };
        };
        ShipLayerPlugin.prototype.setExtent_ = function (map, extent) {
            //console.log("setExtent",extent);
            var rss = this.rss_;
            var res = map.getView().getResolution();
            if (res <= this.layerShips_.getCriticalResolution()) {
                rss.bounds = extent;
            }
            else {
                rss.bounds = null;
            }
        };
        ShipLayerPlugin.prototype.bindLayerWithDataSource_ = function () {
            var layer = this.layerShips_;
            var features = this.featuresDic_; //this.features_;
            var that = this;
            this.ds_.bind('change', function (evt) {
                evt.removed.forEach(function (item) {
                    that.removeFeature_(features[item.id]);
                    delete features[item.id];
                });
                evt.added.forEach(function (item) {
                    that.addFeature_(features[item.id] = new ShipData_1.default(item));
                });
                //this.onFeatureSourceChange_();
            }.bind(this));
            this.ds_.bind('change_immediately', function (evt) {
                this.onFeatureSourceChange_();
            }.bind(this));
        };
        ShipLayerPlugin.prototype.addFeature_ = function (feature) {
            if (this.features_.indexOf(feature) < 0) {
                this.features_.push(feature);
                feature.bind("change", this.featureChangeHandler_);
            }
        };
        ShipLayerPlugin.prototype.removeFeature_ = function (feature) {
            var idx = this.features_.indexOf(feature);
            if (idx >= 0) {
                feature.unbind("change", this.featureChangeHandler_);
                //this.features_Changed_ = true;
                this.features_.splice(idx, 1);
            }
        };
        ShipLayerPlugin.prototype.onFeatureChange_ = function (evt) {
            // this.onFeatureSourceChange_();
            if (this.selectedFeature_ && this.selectedFeature_.data.id === evt.target.entity.id) {
                //把实时数据放到track中
                var entity = evt.target.entity;
                if (!this.selectedFeature_.data.TrackPoints)
                    return;
                this.selectedFeature_.data.TrackPoints.push({
                    id: entity.id,
                    time: entity.time,
                    sog: entity.sog,
                    cog: entity.cog,
                    heading: entity.heading,
                    lon: entity.lon,
                    lat: entity.lat
                });
            }
            // if (this.selectedFeature_ && (this.selectedFeature_.data.id != "MMSI:515420000" && evt.target.entity.id == "MMSI:515420000"))
            //     console.log(this.selectedFeature_, evt.target.entity);
        };
        //private lastRefreshSignalTime_ = new Date(2000,1,1);
        //private supplementTime;
        ShipLayerPlugin.prototype.onFeatureSourceChange_ = function () {
            //var now = new Date();
            //console.log('---SourceChange',now);
            //this.supplementTime = setTimeout(function(){
            //    console.log('---setData',new Date());
            var dataArray = [];
            for (var i = 0; i < this.features_.length; i++) {
                dataArray.push(this.features_[i].entity);
            }
            this.layerShips_.sourceImage_.setData(dataArray);
            //}.bind(this),200)
            //if(now.getTime()-this.lastRefreshSignalTime_.getTime() < 200){
            //    clearTimeout(this.supplementTime);
            //    return;
            //}
            //this.lastRefreshSignalTime_ = new Date();
        };
        ShipLayerPlugin.prototype.selectedFeatureChanged_ = function (evt, feature) {
            if (!feature) {
                if (this.selectedFeature_) {
                    this.rss_.unwatch(this.selectedFeature_.data.id);
                    this.selectedFeature_.data.ShowTrack = false;
                    this.selectedFeature_.data.TrackPoints = [];
                    this.selectedFeature_ = null;
                }
                return;
            }
            if (!(typeof (feature.id) == "string" && feature.id.startsWith('shipLayer:')))
                return null;
            if (this.selectedFeature_ != feature) {
                //清空 this.selectedFeature_的track
                if (this.selectedFeature_) {
                    this.selectedFeature_.data.ShowTrack = false;
                    this.selectedFeature_.data.TrackPoints = [];
                }
                this.selectedFeature_ = feature;
                this.rss_.watch(feature.data.id);
                var end = new Date();
                var start = new Date(end.getTime() - 1000 * 60 * 10);
                this.loadTrack_(feature.data.id, start, end);
            }
        };
        ShipLayerPlugin.prototype.loadTrack_ = function (id, start, end) {
            //查历史-->track
            var onTrackLoad = function (isFinish) {
                if (isFinish && dataLoader_.points[id] && dataLoader_.points[id].length > 0) {
                    var pointTracks = dataLoader_.points[id];
                    var data = {};
                    if (pointTracks.length > 0) {
                        var playbackPoints = [];
                        for (var i = 0; i < pointTracks.length; i++) {
                            playbackPoints.push(this.convertHistoryData_(pointTracks[i]));
                        }
                    }
                    //this.selectedFeature_.data.TrackPoints = playbackPoints;
                    this.selectedFeature_.data.TrackPoints = playbackPoints.concat(this.selectedFeature_.data.TrackPoints);
                }
            };
            var onTrackError = function () {
            };
            var dataLoader_ = new ShipTrackLoader_1.default(this.config_.shiphistoryApi || "api/shiphistory", [id], start, end, onTrackLoad, onTrackError, this, null);
            dataLoader_.load(start, end); //加载指定时间段
            this.selectedFeature_.data.ShowTrack = true;
            this.selectedFeature_.data.TrackPoints = [this.convertRealtimeData_(this.selectedFeature_.data)];
        };
        ShipLayerPlugin.prototype.convertLastHistoryDataToRealtime_ = function (data) {
            var ship = new ScunionShipEntity_1.default(data.ShipId, data);
            ship.dynamicTime = new Date(Date.parse(data.Time));
            ship.name = data.Name;
            ship.mmsi = data.MMSI;
            ship.lon = data.Lon;
            ship.lat = data.Lat;
            ship.sog = data.Sog;
            ship.cog = data.Cog;
            ship.heading = data.Heading;
            ship.time = new Date(Date.parse(data.Time));
            ship.type = data.Type;
            ship.v_length = data.V_Length;
            ship.v_name = data.V_Name;
            ship.v_type = data.V_Type;
            ship.v_width = data.V_Width;
            ship.vesselGroup = data.VesselGroups;
            ship.vesselTag = data.VesselTag;
            //ship.callsign;
            //ship.destination;
            //ship.draught;
            //ship.eta;
            //ship.imo;
            //ship.staticTime;
            //ship.status;
            //ship.dimensions;
            //ship.id=data.ShipId;//赋值会报错,有时不会
            //ship.origins;
            //ship.rot;
            //ship.signal;
            return ship;
        };
        ShipLayerPlugin.prototype.convertHistoryData_ = function (data) {
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
            ship.type = data.Type;
            return ship;
        };
        ShipLayerPlugin.prototype.convertRealtimeData_ = function (data) {
            var ship = {};
            ship.id = data.id;
            ship.name = data.name;
            ship.mmsi = data.mmsi;
            ship.lon = data.lon;
            ship.lat = data.lat;
            ship.sog = data.sog;
            ship.cog = data.cog;
            ship.heading = data.heading;
            ship.time = new Date(Date.parse(data.time)); // utilities.dateFromWcfJson();
            ship.uid = ship.id;
            ship.type = data.type;
            return ship;
        };
        ShipLayerPlugin.prototype.searchHistoryApi_ = function (key) {
            return this.shiphistoryApi_.Get_RealtimeData_GetRealTimeDataBySearchkey(key)
                .catch(this.setFocusAlert.bind(this))
                .then(function (pdata) {
                    var r = pdata.data.map(function (v) {
                        return {
                            type: "searchApi",
                            data: v.V_Name || '' + v.Name + (v.MMSI ? '(' + v.MMSI + ')' : ''),
                            target: v
                        };
                    });
                    return { state: 'apiok', data: r };
                });
        };
        ShipLayerPlugin.prototype.searchShipSignalApi_ = function (id) {
            return this.shipTileApi_.Get_signal$id(id)
                .catch(this.setFocusAlert.bind(this));
        };
        ShipLayerPlugin.prototype.setFocusAlert = function (pdata) {
            this.frameAlert_.lightAlert("船舶无法定位");
            return Promise.reject('船舶无法定位');
        };
        ShipLayerPlugin.prototype.realTimeShipFocusById_ = function (id) {
            var _this = this;
            if (!id) {
                this.frameAlert_.lightAlert("船舶无法定位");
                return;
            }
            return this.searchShipSignalApi_(id)
                .then(function (pdata) {
                    var ship = RtdsShipSyncer_2.convertItem(pdata.data);
                    return _this.selectCallbackIsFully_(ship, true);
                })
                .catch(this.setFocusAlert.bind(this));
        };
        ShipLayerPlugin.prototype.realTimeShipFocus_ = function (key) {
            if (!key) {
                this.frameAlert_.lightAlert("船舶无法定位");
                return;
            }
            return this.searchHistoryApi_(key)
                .then(function (pdata) {
                    return new Promise(function (resolve, reject) {
                        switch (pdata.state) {
                            case 'apiok':
                                for (var _i = 0, _a = pdata.data; _i < _a.length; _i++) {
                                    var I = _a[_i];
                                    if ((I.target.Name.toString() == key.toString()) || (I.target.MMSI.toString() == key.toString())) {
                                        resolve({ target: I.target });
                                        return;
                                    }
                                }
                                break;
                        }
                        reject({ state: 'err', data: '无法定位' });
                    });
                }.bind(this))
                .catch(this.setFocusAlert.bind(this))
                .then(this.searchSelectCallback_.bind(this));
        };
        ShipLayerPlugin.prototype.searchSelectCallback_ = function (data) {
            return this.searchSelectCallbackIsFully_(data, 'fully');
        };
        ShipLayerPlugin.prototype.searchSelectCallbackIsFully_ = function (data, stat) {
            return new Promise(function (resolve, reject) {
                var shipFeature = this.layerShips_.sourceImage_.getShipFeatureByDataId(data.target.ShipId);
                if (!shipFeature) {
                    var rd = this.convertLastHistoryDataToRealtime_(data.target);
                    this.ds_.add_immediately(rd);
                }
                //setTimeout(function(){
                //    console.log('---end',new Date());
                shipFeature = this.layerShips_.sourceImage_.getShipFeatureByDataId(data.target.ShipId);
                if (shipFeature) {
                    resolve();
                    this.map_.setFocus(shipFeature, stat);
                }
                else {
                    reject({ state: 'err', data: '无法定位' }); //alert("无法定位!");
                }
            }.bind(this));
        };
        ShipLayerPlugin.prototype.selectCallbackIsFully_ = function (data, stat) {
            return new Promise(function (resolve, reject) {
                var shipFeature = this.layerShips_.sourceImage_.getShipFeatureByDataId(data.id);
                if (!shipFeature) {
                    var shipEntity = new ScunionShipEntity_1.default(data.id, data);
                    this.ds_.add_immediately(shipEntity);
                }
                shipFeature = this.layerShips_.sourceImage_.getShipFeatureByDataId(data.id);
                if (shipFeature) {
                    this.map_.setFocus(shipFeature, stat);
                    resolve();
                }
                else {
                    reject({ state: 'err', data: '无法定位' }); //alert("无法定位!");
                }
            }.bind(this));
        };
        // private handleMapselectionEnd_(evt) {
        //     var map = evt.map;
        //     var view2d = map.getView();
        //     /**
        //      * @type {ol.Extent}
        //      */
        //     var extent;
        //     if (view2d.getResolution() < this.layerShips_.getCriticalResolution()) {
        //         var trans = ol.proj.getTransform('EPSG:3857', "EPSG:4326");
        //         extent = view2d.calculateExtent(/**@type {ol.Size}*/(map.getSize()));
        //         ol.extent.applyTransform(extent, trans, extent);
        //     } else {
        //         extent = ol.extent.createEmpty();
        //     }
        // }
        ShipLayerPlugin.prototype.boxSelect_ = function (list, extent) {
            var ships = list.filter(function (f) { return (typeof (f.id) == "string" && f.id.startsWith('shipLayer:')); });
            return ships.map(function (f) {
                return f.data.id;
            });
        };
        return ShipLayerPlugin;
    }());
    ShipLayerPlugin = __decorate([
        __param(1, Plugins_1.inject('root')),
        __param(2, Plugins_1.inject("frameAlert")),
        __param(3, Plugins_1.inject("maps/tools/layersSetting")),
        __param(4, Plugins_1.inject("maps/map"))
    ], ShipLayerPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipLayerPlugin;
});
