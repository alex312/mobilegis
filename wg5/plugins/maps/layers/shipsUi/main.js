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
define(["require", "exports", "jquery", "knockout", "fecha", 'text!./htmls/ShipInfo.html', "../../../../seecool/StaticLib", '../../../../seecool/utilities', "../../../../seecool/plugins/Plugins", '../../../../seecool/utils/JSTool', "../../../../seecool/StaticLib", "../../../../seecool/datas/ShiphistoryApi"], function (require, exports, $, ko, fecha, objInfo, StaticLib, utilities, Plugins_1, JSTool_1, StaticLib_1, ShiphistoryApi_1) {
    "use strict";
    //import {Status} from "../../../../seecool/utils/Status";
    //import {CheckButton} from "../../../../seecool/StaticLib";

    var shipsUiPlugin = function () {
        function shipsUiPlugin(config, ships, search, urlLoader, detailViewer, legend, setting) {
            _classCallCheck(this, shipsUiPlugin);

            this.config_ = config;
            this.setting_ = setting;
            this.legend_ = legend;
            this.ships_ = ships;
            this.urlLoader_ = urlLoader;
            detailViewer.registerSelectFocusEvent("shipLayerSelectFocus", this.featureSelected_.bind(this));
            // this.searchPlugin_.registeSearchEvent("shipLayerSearch", this.searchHistory_.bind(this), {info: "船舶名称,MMSI"});
            search.addProvider({
                onItemClick: function onItemClick(item) {
                    if (item.type === 'ship') {
                        ships.setFocus_(item.id);
                        return true;
                    }
                }
            });
            var cid = JSTool_1.JSTool.CrossId(StaticLib.ShipType.Colors);
            var colors = StaticLib.ShipType.Colors.map(function (v) {
                return { fillColor: v, strokeColor: v };
            });
            var icons = StaticLib.shipIconsGenerate(colors);
            var legends = JSTool_1.JSTool.ArraysDo(StaticLib.ShipType.Names, icons, StaticLib.ShipType.Labels, function (name, icon, label) {
                return { pname: 'shipType', name: name, label: label, icon: $('<img src="' + icon + '"/>') };
            });
            legend.addLegends([{ pname: null, name: 'shipType', icon: null, label: '船舶类型' }]);
            legend.addLegends(legends);
            // this.status_ = new Status(this);
            // this.status_.ConditionTurn(true, "hided");//hided
            //this.switch_(null);
            this.isLayerShow_ = ko.observable(true);
            this.isLayerShow_.subscribe(function (v) {
                this.setVisible(v);
            }.bind(this));
            var switch1 = StaticLib_1.CheckBox({
                checked: this.isLayerShow_,
                view: "船舶",
                click: this.switch_.bind(this)
            });
            this.setting_.registerSettingElement("mapSwitch", switch1);
            this.shiphistoryApi_ = new ShiphistoryApi_1.default(this.config_.shiphistoryApi || 'api/shiphistory');
            //this.ui.RegisterShortBarButton(null, "shipLayerSwitch", "船舶", this.switch_.bind(this))
            //this.RegisterShipFlagDrawEvent('shipLayerFlag',function(featureId){
            //    var i = featureId.match('^shipLayer:MMSI:413')?'0':'1';
            //    var r=([[{content:'\uf074',color:'#ff0000'},{content:'\uf072',color:'#00ff00'}],{content:'\uf073',color:'#0000ff'}])[i];
            //    return r||[];
            //})
        }

        _createClass(shipsUiPlugin, [{
            key: "switch_",
            value: function switch_() {
                if (this.isLayerShow_()) {
                    this.isLayerShow_(false);
                } else {
                    this.isLayerShow_(true);
                }
            }
        }, {
            key: "setVisible",
            value: function setVisible(isShow) {
                this.ships_.setVisible(isShow);
                this.isLayerShow_(isShow);
            }
        }, {
            key: "featureSelected_",
            value: function featureSelected_(feature) {
                if (!feature) return;
                var featureId = feature.id;
                if (!featureId && this.shipInfoUpdataProxy_) {
                    clearInterval(this.shipInfoUpdataProxy_.timer);
                    delete this.shipInfoUpdataProxy_;
                }
                if (!(typeof featureId == "string" && featureId.startsWith('shipLayer:'))) return null;
                var ship = feature; //this.layerShips_.getShipFeature(featureId);
                if (ship) {
                    var oi = $(objInfo);
                    var playback = function (e) {
                        var start = fecha.format(new Date(new Date().getTime() - 2 * 60 * 60 * 1000), "YYYY-MM-DD HH:mm:ss");
                        var end = fecha.format(new Date(), "YYYY-MM-DD HH:mm:ss");
                        this.urlLoader_.urlLoad({
                            url: "playback",
                            search: "mmsi=" + ship.data.mmsi + "&start=" + start + "&end=" + end,
                            target: "_blank"
                        }); //window.open
                    }.bind(this);
                    var loadTrack_0 = function (e) {
                        var start = new Date(new Date().getTime() - 10 * 60 * 1000);
                        var end = new Date();
                        this.ships_.loadTrack(ship.data.id, start, end);
                    }.bind(this);
                    var loadTrack_1 = function (e) {
                        var start = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
                        var end = new Date();
                        this.ships_.loadTrack(ship.data.id, start, end);
                    }.bind(this);
                    var loadTrack_2 = function (e) {
                        var start = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
                        var end = new Date();
                        this.ships_.loadTrack(ship.data.id, start, end);
                    }.bind(this);
                    var viewModel = function viewModel(ship) {
                        return {
                            ShipName: ship.data.v_name || ship.data.name,
                            ShipType: StaticLib.getShipTypeInfo(ship.data.type, ship.data.v_type, "Labels"),
                            MMSI: ship.data.mmsi,
                            Heading: Math.round(ship.data.cog * 10) / 10 + "°",
                            COG: Math.round(ship.data.cog * 10) / 10 + "°",
                            SOG: Math.round(ship.data.sog * 10) / 10 + "节",
                            Longitude: utilities.formatDegree(ship.data.lon, 'ddd-cc-mm.mmL'),
                            Latitude: utilities.formatDegree(ship.data.lat, 'dd-cc-mm.mmB'),
                            Time: fecha.format(ship.data.time, "YYYY-MM-DD HH:mm:ss"),
                            playback: playback.bind(this),
                            loadTrack_0: loadTrack_0.bind(this),
                            loadTrack_1: loadTrack_1.bind(this),
                            loadTrack_2: loadTrack_2.bind(this) //1day
                        };
                    };
                    var vm = ko.observable(viewModel(ship));
                    var I = 0;
                    this.shipInfoUpdataProxy_ = this.shipInfoUpdataProxy_ || {};
                    if (this.shipInfoUpdataProxy_.timer) {
                        clearInterval(this.shipInfoUpdataProxy_.timer);
                    }
                    this.shipInfoUpdataProxy_.timer = setInterval(function () {
                        if (!utilities.DC.GN([this.shipInfoUpdataProxy_], '0.*')) return;
                        I++;
                        var ship = this.ships_.layerShips_.getShipFeature(this.shipInfoUpdataProxy_.FeatureId);
                        if (ship) {
                            var v = viewModel.apply(this, [ship]);
                            //v.ShipName+=I;
                            this.shipInfoUpdataProxy_.updataModel(v);
                        }
                    }.bind(this), 1000);
                    this.shipInfoUpdataProxy_.FeatureId = featureId;
                    this.shipInfoUpdataProxy_.updataModel = vm;
                    ko.applyBindings(vm, oi[0]);
                    oi.data("title", "位置动态");
                    return oi;
                }
                return oi;
            }
        }, {
            key: "searchHistory_",
            value: function searchHistory_(key) {
                return this.shiphistoryApi_.Get_RealtimeData_GetRealTimeDataBySearchkey(key).then(function (pdata) {
                    var r = pdata.data.map(function (v) {
                        return {
                            type: "searchApi",
                            data: v.V_Name || '' + v.Name + (v.MMSI ? '(' + v.MMSI + ')' : ''),
                            target: v
                        };
                    });
                    return { state: 'apiok', data: r };
                }).then(function (pdata) {
                    return new Promise(function (resolve, reject) {
                        var r = pdata.data.map(function (v) {
                            return {
                                type: "ships",
                                match: v.data,
                                tags: ['船舶'],
                                data: v.data,
                                target: v.target
                            };
                        }.bind(this));
                        resolve({ state: 'ok', data: r });
                    }.bind(this));
                }.bind(this));
            }
        }]);

        return shipsUiPlugin;
    }();

    shipsUiPlugin = __decorate([__param(1, Plugins_1.inject("maps/layers/ships")), __param(2, Plugins_1.inject('maps/ui/search')), __param(3, Plugins_1.inject("urlLoader")), __param(4, Plugins_1.inject("maps/ui/detailViewer")), __param(5, Plugins_1.inject("maps/tools/legend")), __param(6, Plugins_1.inject("maps/tools/setting"))], shipsUiPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = shipsUiPlugin;
});