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
define(["require", "exports", "jquery", "fecha", "text!./htmls/MemberInfo.html", "knockout", '../../../../seecool/utilities', "../../../../seecool/plugins/Plugins", "kendo"], function (require, exports, $, fecha, objInfo, ko, utilities, Plugins_1) {
    "use strict";

    var MembersPlugin = function () {
        function MembersPlugin(config, urlLoader, tastMembers, detailViewer) {
            _classCallCheck(this, MembersPlugin);

            this.config_ = config;
            this.tastMembers_ = tastMembers;
            this.urlLoader_ = urlLoader;
            //this.shipLayerPlugin_=shipLayerPlugin;
            detailViewer.registerSelectFocusEvent("members", this.featureSelected_.bind(this));
        }

        _createClass(MembersPlugin, [{
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
                this.tastMembers_.setVisible(isShow);
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
                if (!(typeof featureId == "string" && featureId.startsWith('taskMembers:'))) return null;
                var ship = feature; //this.layerShips_.getShipFeature(featureId);
                if (ship) {
                    var oi = $(objInfo);
                    var playback = function playback(e) {
                        var start = fecha.format(new Date(new Date().getTime() - 2 * 60 * 60 * 1000), "yyyy-MM-dd HH:mm:ss");
                        var end = fecha.format(new Date(), "yyyy-MM-dd HH:mm:ss");
                        this.urlLoader_.urlLoad({
                            url: "playback",
                            search: "mmsi=" + ship.data.mmsi + "&start=" + start + "&end=" + end,
                            target: "_blank"
                        }); //window.open
                    };
                    var loadTrack_0 = function loadTrack_0(e) {
                        var start = new Date(new Date().getTime() - 10 * 60 * 1000);
                        var end = new Date();
                        this.tastMembers_.loadTrack(ship.data.id, start, end);
                    };
                    var loadTrack_1 = function loadTrack_1(e) {
                        var start = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
                        var end = new Date();
                        this.tastMembers_.loadTrack(ship.data.id, start, end);
                    };
                    var loadTrack_2 = function loadTrack_2(e) {
                        var start = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
                        var end = new Date();
                        this.tastMembers_.loadTrack(ship.data.id, start, end);
                    };
                    var viewModel = function viewModel(ship) {
                        return {
                            Name: ship.data.name || "",
                            Time: fecha.format(ship.data.dynamicTime, "YYYY-MM-DD HH:mm:ss") || "",
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
                        var ship = this.tastMembers_.layerShips_.getShipFeature(this.shipInfoUpdataProxy_.FeatureId);
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
        }]);

        return MembersPlugin;
    }();

    MembersPlugin = __decorate([__param(1, Plugins_1.inject("urlLoader")), __param(2, Plugins_1.inject("maps/layers/taskMembers")), __param(3, Plugins_1.inject("maps/ui/detailViewer"))], MembersPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MembersPlugin;
});