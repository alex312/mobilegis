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
define(["require", "exports", "openlayers", "fecha", "../../../../seecool/plugins/Plugins", "../../../../seecool/StaticLib", '../../../../seecool/utils/MapTool', "../../../../seecool/datas/ShipTrackLoader", "./layers/ShipsLayer", "./data/ShipsTileDataSource", "./data/ShipData", './data/ShipDataSource', './data/ScunionShipEntity', './data/RtdsShipSyncer', "../../../../seecool/datas/ShiphistoryApi"], function (require, exports, ol, fecha, Plugins_1, StaticLib_1, MapTool_1, ShipTrackLoader_1, ShipsLayer_1, ShipsTileDataSource_1, ShipData_1, ShipDataSource_1, ScunionShipEntity_1, RtdsShipSyncer_1, ShiphistoryApi_1) {
    "use strict";

    var CFG;

    var ShipLayerPlugin = function () {
        function ShipLayerPlugin(config, root, map) {
            _classCallCheck(this, ShipLayerPlugin);

            this.featureChangeHandler_ = this.onFeatureChange_.bind(this);
            //Search
            this.shipFlagDrawCallBackList_ = {};
            console.log("shipLayer PluginLoading"); //,ui, map,ShipsLayer);
            this.config_ = config || {};
            this.map_ = map;
            this.root_ = root;
            var con = new StaticLib_1.Config(this.config_);
            CFG = con.DefaultData.bind(con);
            this.dsShipsTile_ = new ShipsTileDataSource_1.default({
                tileUrl: this.config_.tileUrl + "?x={x}&y={y}&z={z}&ts={v}",
                versionUrl: this.config_.tileUrl + "?check=1",
                checkInterval: 10000
            });
            this.features_ = [];
            this.ds_ = new ShipDataSource_1.default(this.entityFactories_());
            this.layerShips_ = new ShipsLayer_1.default({
                tileUrl: this.config_.tileUrl + "?x={x}&y={y}&z={z}&ts={v}",
                titleVersionUrl: this.config_.tileUrl + "?check=1",
                flagDraw: this.shipFlagDraw_.bind(this),
                criticalResolution: MapTool_1.MapTool.ZoomToResolution(9)
            });
            map.map.addLayer(this.layerShips_);
            map.map.on("moveend", this.handleMapMoveEnd_, this);
            map.bind("selectFeatureChange", this.selectedFeatureChanged_.bind(this));
            this.shiphistoryApi_ = new ShiphistoryApi_1.default(this.config_.shiphistoryApi || 'api/shiphistory');
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
            var expires = 1000 * this.config_.expires || 60 * 60 * 3;
            this.rss_ = new RtdsShipSyncer_1.default({ local: this.ds_, remote: rtds, expires: expires });
            this.bindLayerWithDataSource_();
            setInterval(function () {
                this.onFeatureSourceChange_();
            }.bind(this), 500);
        }

        _createClass(ShipLayerPlugin, [{
            key: "setFocus",
            value: function setFocus(id) {
                return this.setFocus_(id);
            }
        }, {
            key: "loadTrack",
            value: function loadTrack(id, start, end) {
                return this.loadTrack_(id, start, end);
            }
        }, {
            key: "setVisible",
            value: function setVisible(isShow) {
                return this.setVisible_(isShow);
            }
        }, {
            key: "realTimeShipFocus",
            value: function realTimeShipFocus(key) {
                return this.realTimeShipFocus_(key);
            }
        }, {
            key: "registerShipFlagDrawEvent",
            value: function registerShipFlagDrawEvent(name, callback, option) {
                return this.registerShipFlagDrawEvent_(name, callback, option);
            }
        }, {
            key: "removeShipFlagDrawEvent",
            value: function removeShipFlagDrawEvent(name) {
                return this.removeShipFlagDrawEvent_(name);
            }
        }, {
            key: "createItems_",
            value: function createItems_() {
                var items = new Array(this.features_.length);
                for (var i = 0; i < this.features_.length; i++) {
                    items[i] = this.createItem_(this.features_[i]);
                }return items;
            }
        }, {
            key: "createItem_",
            value: function createItem_(feature) {
                return null;
            }
        }, {
            key: "toFullUrl_",
            value: function toFullUrl_(rtdsUrl) {
                if (/^\w+:\/\//.exec(rtdsUrl)) {
                    rtdsUrl = rtdsUrl;
                } else if (rtdsUrl.indexOf('./') === 0) {
                    rtdsUrl = document.URL.replace(/\/[^\/]+$/, '/') + rtdsUrl.substring(2, rtdsUrl.length);
                } else {
                    if (rtdsUrl.indexOf('/') !== 0) {
                        rtdsUrl = '/' + rtdsUrl; //.substring(1, rtdsUrl.length);
                    }
                    var t = /^\w+:\/\/[^\/]*/gi.exec(document.URL);
                    if (t) {
                        t = t[0];
                    } else {
                        t = 'http://' + document.URL;
                    }
                    rtdsUrl = t + rtdsUrl;
                }
                return rtdsUrl;
            }
        }, {
            key: "setVisible_",
            value: function setVisible_(idShow) {
                this.layerShips_.setVisible(idShow);
            }
        }, {
            key: "registerShipFlagDrawEvent_",
            value: function registerShipFlagDrawEvent_(name, callback, option) {
                if (arguments.length == 1) {
                    callback = name;
                    name = "";
                }
                this.shipFlagDrawCallBackList_[name] = callback;
            }
        }, {
            key: "removeShipFlagDrawEvent_",
            value: function removeShipFlagDrawEvent_(name) {
                if (name in this.shipFlagDrawCallBackList_) {
                    delete this.shipFlagDrawCallBackList_[name];
                }
            }
        }, {
            key: "shipFlagDraw_",
            value: function shipFlagDraw_(featureId) {
                if (!featureId) return;else {
                    var flags = [];
                    for (var i in this.shipFlagDrawCallBackList_) {
                        var func = this.shipFlagDrawCallBackList_[i];
                        flags = flags.concat(func(featureId));
                    }
                }
                return flags;
            }
        }, {
            key: "expose_",
            value: function expose_() {
                var wg5 = window["webgis5"] || (window["webgis5"] = {});
                wg5.shipLayer = {};
                wg5.shipLayer.SetFocus = this.setFocus_.bind(this);
                wg5.shipLayer.SetFocusIsFully = function (id, isFully) {
                    this.setFocusIsFully_(id, isFully);
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
            }
        }, {
            key: "setFocus_",
            value: function setFocus_(id) {
                this.setFocusIsFully_(id, true);
            }
        }, {
            key: "setFocusIsFully_",
            value: function setFocusIsFully_(id, isFully) {
                if (!id) return;
                var fid = "shipLayer:" + id;
                var shipFeature = this.layerShips_.getShipFeature(fid); //var shipFeature = this.layerShips.sourceImage_.getShipFeature(uid);
                if (shipFeature) {
                    this.map_.setFocus(shipFeature, isFully);
                    return true;
                }
                var key = fid.replace("shipLayer:MMSI:", "");
                return this.searchHistoryApi_(key).then(function (pdata) {
                    var shipSelected = false;
                    switch (pdata.state) {
                        case 'apiok':
                            var _iteratorNormalCompletion = true;
                            var _didIteratorError = false;
                            var _iteratorError = undefined;

                            try {
                                for (var _iterator = pdata.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    var I = _step.value;

                                    if (I.target.MMSI.toString() == key.toString()) {
                                        this.searchSelectCallbackIsFully_({ target: I.target }, isFully);
                                        shipSelected = true;
                                        break;
                                    }
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return) {
                                        _iterator.return();
                                    }
                                } finally {
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }

                            break;
                    }
                    return shipSelected;
                }.bind(this));
            }
            // private setFocus_(id) {
            //     this.map_.setFocus(feature);
            // }

        }, {
            key: "handleMapMoveEnd_",
            value: function handleMapMoveEnd_(evt) {
                //console.log("move");
                var map = evt.map;
                var view2d = map.getView();
                /**
                 * @type {ol.Extent}
                 */
                var extent;
                if (view2d.getResolution() < this.layerShips_.getCriticalResolution()) {
                    var trans = ol.proj.getTransform('EPSG:3857', "EPSG:4326");
                    extent = view2d.calculateExtent( /**@type {ol.Size}*/map.getSize());
                    ol.extent.applyTransform(extent, trans, extent);
                } else {
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
            }
        }, {
            key: "entityFactories_",
            value: function entityFactories_() {
                return {
                    "scunion": function scunion(id, data) {
                        return new ScunionShipEntity_1.default(id, data);
                    }
                };
            }
        }, {
            key: "setExtent_",
            value: function setExtent_(map, extent) {
                //console.log("setExtent",extent);
                var rss = this.rss_;
                var res = map.getView().getResolution();
                if (res <= this.layerShips_.getCriticalResolution()) {
                    rss.bounds = extent;
                } else {
                    rss.bounds = null;
                }
            }
        }, {
            key: "bindLayerWithDataSource_",
            value: function bindLayerWithDataSource_() {
                var layer = this.layerShips_;
                var features = this.features_;
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
            }
        }, {
            key: "addFeature_",
            value: function addFeature_(feature) {
                if (this.features_.indexOf(feature) < 0) {
                    this.features_.push(feature);
                    feature.bind("change", this.featureChangeHandler_);
                }
            }
        }, {
            key: "removeFeature_",
            value: function removeFeature_(feature) {
                var idx = this.features_.indexOf(feature);
                if (idx >= 0) {
                    feature.unbind("change", this.featureChangeHandler_);
                    //this.features_Changed_ = true;
                    this.features_.splice(idx, 1);
                }
            }
        }, {
            key: "onFeatureChange_",
            value: function onFeatureChange_(evt) {
                // this.onFeatureSourceChange_();
                if (this.selectedFeature_ && this.selectedFeature_.data.id === evt.target.entity.id) {
                    //把实时数据放到track中
                    var entity = evt.target.entity;
                    if (!this.selectedFeature_.data.TrackPoints) return;
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
                if (this.selectedFeature_ && this.selectedFeature_.data.id != "MMSI:515420000" && evt.target.entity.id == "MMSI:515420000") console.log(this.selectedFeature_, evt.target.entity);
            }
            //private lastRefreshSignalTime_ = new Date(2000,1,1);
            //private supplementTime;

        }, {
            key: "onFeatureSourceChange_",
            value: function onFeatureSourceChange_() {
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
            }
        }, {
            key: "selectedFeatureChanged_",
            value: function selectedFeatureChanged_(evt, feature) {
                if (!feature) {
                    if (this.selectedFeature_) {
                        this.rss_.unwatch(this.selectedFeature_.data.id);
                        this.selectedFeature_.data.ShowTrack = false;
                        this.selectedFeature_.data.TrackPoints = [];
                        this.selectedFeature_ = null;
                    }
                    return;
                }
                if (!(typeof feature.id == "string" && feature.id.startsWith('shipLayer:'))) return null;
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
            }
        }, {
            key: "loadTrack_",
            value: function loadTrack_(id, start, end) {
                //查历史-->track
                var onTrackLoad = function onTrackLoad(isFinish) {
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
                var onTrackError = function onTrackError() {};
                var dataLoader_ = new ShipTrackLoader_1.default(this.config_.shiphistoryApi || "api/shiphistory", [id], start, end, onTrackLoad, onTrackError, this, null);
                dataLoader_.load(start, end); //加载指定时间段
                this.selectedFeature_.data.ShowTrack = true;
                this.selectedFeature_.data.TrackPoints = [this.convertRealtimeData_(this.selectedFeature_.data)];
            }
        }, {
            key: "convertLastHistoryDataToRealtime_",
            value: function convertLastHistoryDataToRealtime_(data) {
                var ship = new ScunionShipEntity_1.default(data.ShipId, data);
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
                ship.v_length = data.V_Length;
                ship.v_name = data.V_Name;
                ship.v_type = data.V_Type;
                ship.v_width = data.V_Width;
                return ship;
            }
        }, {
            key: "convertHistoryData_",
            value: function convertHistoryData_(data) {
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
            }
        }, {
            key: "convertRealtimeData_",
            value: function convertRealtimeData_(data) {
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
            }
        }, {
            key: "searchHistoryApi_",
            value: function searchHistoryApi_(key) {
                //var searchHistoryApi = this.config_.searchHistoryApi || "api/shiphistory/RealtimeData/GetRealTimeDataBySearchkey/";
                // return new Promise(function (resolve, reject) {
                //     $.ajax({
                //         url: searchHistoryApi + key,
                //         type: 'get'
                //     })
                //         .done(function (v) {
                //             var list = v.map(function (v) {
                //                 return v;
                //             });
                //             resolve({state: 'apiok', data: list});
                //         })
                //         .fail(function (v) {
                //             reject({state: 'apierr', data: null});
                //         })
                // }.bind(this))
                return this.shiphistoryApi_.Get_RealtimeData_GetRealTimeDataBySearchkey(key).then(function (pdata) {
                    var r = pdata.data.map(function (v) {
                        return {
                            type: "searchApi",
                            data: v.V_Name || '' + v.Name + (v.MMSI ? '(' + v.MMSI + ')' : ''),
                            target: v
                        };
                    });
                    return { state: 'apiok', data: r };
                });
            }
            // private searchHistory_(key) {
            //     return this.searchHistoryApi_(key)
            //         .then(function (pdata:pdata) {
            //             return new Promise(function (resolve, reject) {
            //                 var r = pdata.data.map(function (v) {
            //                     var data = {searchApi: '', name: '名称', id: '编号'}[v.type] + ':' + v.data;
            //                     return {
            //                         fid: "shipLayer:" + v.target.ShipId,
            //                         data: '[船舶]' + data,
            //                         target: v.target,
            //                         searchListClick: this.searchSelectCallback_.bind(this)
            //                     };
            //                 }.bind(this));
            //                 resolve({state: 'ok', data: r});
            //             }.bind(this))
            //         }.bind(this))
            // }
            // private search_(key) {
            //     var resaults = this.layerShips_.search(key);
            //     var r = resaults.map(function (v) {
            //         var data = {name: '名称', id: '编号'}[v.type] + ':' + v.data;
            //         return {data: '[船舶]' + data, target: v.target, searchListClick: this.searchSelectCallback_.bind(this)};
            //     }.bind(this))
            //     return r;
            // }
            /*目前没人用*/
            //public ShipFocus(MMSI){
            //    var ShipId='MMSI:'+MMSI;
            //    var shipFeature = this.layerShips_.sourceImage_.getShipFeatureByDataId(ShipId);
            //    this.map_.SetFocus(shipFeature);
            //    return shipFeature;
            //}

        }, {
            key: "realTimeShipFocus_",
            value: function realTimeShipFocus_(key) {
                if (!key) return;
                return this.searchHistoryApi_(key).then(function (pdata) {
                    switch (pdata.state) {
                        case 'apiok':
                            var _iteratorNormalCompletion2 = true;
                            var _didIteratorError2 = false;
                            var _iteratorError2 = undefined;

                            try {
                                for (var _iterator2 = pdata.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    var I = _step2.value;

                                    if (I.target.MMSI.toString() == key.toString()) {
                                        this.searchSelectCallback_({ target: I.target });
                                        break;
                                    }
                                }
                            } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                        _iterator2.return();
                                    }
                                } finally {
                                    if (_didIteratorError2) {
                                        throw _iteratorError2;
                                    }
                                }
                            }

                            break;
                    }
                }.bind(this));
            }
        }, {
            key: "searchSelectCallback_",
            value: function searchSelectCallback_(data) {
                this.searchSelectCallbackIsFully_(data, true);
            }
        }, {
            key: "searchSelectCallbackIsFully_",
            value: function searchSelectCallbackIsFully_(data, isFully) {
                var shipFeature = this.layerShips_.sourceImage_.getShipFeatureByDataId(data.target.ShipId);
                if (!shipFeature) {
                    var rd = this.convertLastHistoryDataToRealtime_(data.target);
                    this.ds_.add_immediately(rd);
                }
                //setTimeout(function(){
                //    console.log('---end',new Date());
                shipFeature = this.layerShips_.sourceImage_.getShipFeatureByDataId(data.target.ShipId);
                if (shipFeature) this.map_.setFocus(shipFeature, isFully);else alert("无法定位!");
                //}.bind(this),500);
            }
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

        }, {
            key: "boxSelect_",
            value: function boxSelect_(list, extent) {
                var ships = list.filter(function (f) {
                    return typeof f.id == "string" && f.id.startsWith('shipLayer:');
                });
                return ships.map(function (f) {
                    return f.data.id;
                });
            }
        }]);

        return ShipLayerPlugin;
    }();

    ShipLayerPlugin = __decorate([__param(1, Plugins_1.inject('root')), __param(2, Plugins_1.inject("maps/map"))], ShipLayerPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipLayerPlugin;
});