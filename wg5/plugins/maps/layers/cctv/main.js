var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "openlayers", "knockout", "../../../../seecool/plugins/Plugins", "seecool/datas/Collection", "seecool/datas/Collection", "seecool/StaticLib", "./layers/CctvLayerEntity", "../../../../seecool/ajax", "../../../../seecool/utils/MapTool"], function (require, exports, ol, ko, Plugins_1, Collection_1, Collection_2, StaticLib_1, CctvLayerEntity_1, ajax_1, MapTool_1) {
    "use strict";
    var CctvPlugin = (function () {
        function CctvPlugin(config, layersSetting_, map) {
            this.cctvInfoMergeList_ = {};
            this.config_ = config;
            this.map_ = map;
            //this.setting_ = setting;
            this.layersSetting_ = layersSetting_;
            this.init_();
            this.load_();
        }
        CctvPlugin.prototype.init_ = function () {
            this.dataSet_ = new Collection_2.CollectionA({
                name: "dataSet",
                isOne: function (a, b) {
                    return a.Key === b.Key;
                }
            });
            //this.dataDTOSet=new CollectionA<ICctvDTO>("dataDTOSet");
            //this.cctvStaticInfoApi_ = new CctvStaticInfoApi(this.config_.cctvStaticInfoApi || "api/cctvStaticInfo");
            // this.ui.RegisterMainMenu(null, "cctvMenuLink", "Cctv", this.menuClick.bind(this), {iconFont: "fa-video-camera"});
            // this.ui.RegisterSelectFocusEvent("cctvSelectFocus", this.featureSelected.bind(this));
            this.layerEntity_ = new CctvLayerEntity_1.default({});
            this.link_LayerEntity_DataSet_ = new Collection_1.CollectionLinker({
                sourceCollection: this.dataSet_,
                targetCollection: this.layerEntity_.DataSet,
                filterFunction: function (v) {
                    return (v.IsDeleted) ? false : true;
                },
                convertFunction: function (v) {
                    //console.log(v);
                    var Info = v.Info;
                    var LL = [Info.Longitude, Info.Latitude]; //(Info.Longitude > Info.Latitude) ? [Info.Longitude, Info.Latitude] : [Info.Latitude, Info.Longitude];
                    LL[0] = (LL[0] > 180 || LL[0] < -180) ? 0 : LL[0];
                    LL[1] = (LL[1] > 90 || LL[1] < -90) ? 0 : LL[1];
                    var lonlat = ol.proj.fromLonLat(LL);
                    var geom = new ol.geom.Point(lonlat);
                    var f2 = new ol.Feature({
                        geometry: geom
                    });
                    this.featureAppand_(f2, v);
                    return f2;
                }.bind(this)
            });
            this.link_LayerEntity_DataSet_.start();
            this.isLayerShow_ = ko.observable(true);
            this.isLayerShow_.subscribe(function (v) {
                this.setVisible(v);
            }.bind(this));
            var switch1 = StaticLib_1.CheckBox({
                checked: this.isLayerShow_,
                view: "CCTV",
                click: this.switch_.bind(this)
            });
            // this.setting_.registerSettingElement("mapSwitch", switch1);
            this.zIndex_ = ko.observable();
            this.setZIndex_(this.config_.zIndex);
            this.maxZoom_ = ko.observable();
            this.setMaxZoom_(this.config_.zoom - 1);
            this.layersSetting_.RegisterLayerSetting("CCTV", this.isLayerShow_, this.zIndex_, this.maxZoom_, this.switch_.bind(this), this.setZIndex_.bind(this), this.setMaxZoom_.bind(this));
            this.map_.map.addLayer(this.layerEntity_.layer);
        };
        CctvPlugin.prototype.switch_ = function () {
            if (this.isLayerShow_()) {
                this.isLayerShow_(false);
            }
            else {
                this.isLayerShow_(true);
            }
        };
        CctvPlugin.prototype.setZIndex_ = function (index) {
            this.zIndex_(index);
            this.layerEntity_.layer.setZIndex(index);
        };
        CctvPlugin.prototype.setVisible = function (isShow) {
            this.layerEntity_.layer.setVisible(isShow);
            this.isLayerShow_(isShow);
        };
        CctvPlugin.prototype.setMaxZoom_ = function (zoom) {
            this.maxZoom_(zoom);
            this.layerEntity_.layer.setMaxResolution(MapTool_1.MapTool.ZoomToResolution(zoom));
        };
        /**
         * Tree
         * @param list
         * @param str
         * @param nodefun node的构造函数
         * @constructor
         */
        CctvPlugin.prototype.listTotreeByPid = function (list, str, node) {
            //var list=arguments[1].split(',');
            var r = { root: {} };
            list.map(function (v) {
                r[str] = v;
            });
            return r.root;
        };
        CctvPlugin.prototype.featureAppand_ = function (olFeature, data) {
            olFeature.id = "cctv:" + data.Key;
            olFeature.data = data;
        };
        CctvPlugin.prototype.cctvInfoMergeListUpdate_ = function (infos) {
            for (var _i = 0, infos_1 = infos; _i < infos_1.length; _i++) {
                var info = infos_1[_i];
                var item = this.cctvInfoMergeList_[info.VideoId];
                if (item) {
                    for (var j in info) {
                        if (!(j in item.Info)) {
                            item.Info[j] = info[j];
                        }
                    }
                    if (info.Latitude <= 90)
                        item.Info.Latitude = info.Latitude;
                    if (info.Longitude <= 180)
                        item.Info.Longitude = info.Longitude;
                    this.dataSet_.Modify([[item, item]]);
                }
                else {
                    item = this.cctvInfoMergeList_[info.VideoId] = { Key: info.VideoId, Info: info };
                    this.dataSet_.Add([item]);
                }
            }
            //console.log(this.dataSet_.collection);
        };
        CctvPlugin.prototype.load_ = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, statics, dynamics;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                ajax_1.ajax.get(this.config_.cctvApi + "/Static"),
                                ajax_1.ajax.get(this.config_.cctvApi + "/Dynamic")
                            ])];
                        case 1:
                            _a = _b.sent(), statics = _a[0], dynamics = _a[1];
                            this.cctvInfoMergeListUpdate_(statics);
                            this.cctvInfoMergeListUpdate_(dynamics);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return CctvPlugin;
    }());
    CctvPlugin = __decorate([
        __param(1, Plugins_1.inject("maps/tools/layersSetting")),
        __param(2, Plugins_1.inject("maps/map"))
    ], CctvPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CctvPlugin;
});
