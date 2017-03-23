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
define(["require", "exports", "jquery", "openlayers", "text!./htmls/TideDiv.html", "knockout", "fecha", "../../../../seecool/plugins/Plugins", "../../../../seecool/datas/Collection", "../../../../seecool/datas/Collection", "../../../../seecool/datas/Collection", "../../../../seecool/StaticLib", "./layers/WaterDepthLayerEntity", "./datas/WaterDepthDataApi", "./datas/TideApi"], function (require, exports, $, ol, TideDiv, ko, fecha, Plugins_1, Collection_1, Collection_2, Collection_3, StaticLib_1, WaterDepthLayerEntity_1, WaterDepthDataApi_1, TideApi_1) {
    "use strict";

    var WaterDepthPlugin = function () {
        function WaterDepthPlugin(config, map, setting) {
            _classCallCheck(this, WaterDepthPlugin);

            this.config_ = config;
            this.map_ = map;
            this.setting_ = setting;
            this.init_();
            this.load_();
            this.loadTide_();
            this.loadTideTimer_ = setInterval(function () {
                this.loadTide_();
            }.bind(this), 1 * 60 * 1000);
        }

        _createClass(WaterDepthPlugin, [{
            key: "init_",
            value: function init_() {
                this.dataSet_ = new Collection_2.CollectionA("dataSet");
                this.dataDTOSet_ = new Collection_2.CollectionA("dataDTOSet");
                this.waterDepthDataApi_ = new WaterDepthDataApi_1.default(this.config_.waterDepthDataApi || "api/WaterDepthData");
                this.tideApi_ = new TideApi_1.default(this.config_.tideApi || "api/Tide");
                this.layerEntity_ = new WaterDepthLayerEntity_1.default({});
                this.link_DataSet_DataDTOSet_ = new Collection_1.CollectionLinker(Collection_3.CollectionLinkerOption(this.dataDTOSet_, this.dataSet_, function (v) {
                    return true;
                }, function (v) {
                    return {
                        Name: v.Depth,
                        Lon: v.Lon,
                        Lat: v.Lat
                    };
                }));
                this.link_LayerEntity_DataSet_ = new Collection_1.CollectionLinker({
                    sourceCollection: this.dataSet_,
                    targetCollection: this.layerEntity_.dataSet,
                    filterFunction: function filterFunction(v) {
                        return true;
                    },
                    convertFunction: function (v) {
                        var LL = v.Lon > v.Lat ? [v.Lon, v.Lat] : [v.Lat, v.Lon];
                        var lonlat = ol.proj.fromLonLat(LL);
                        var geom = new ol.geom.Point(lonlat);
                        var f2 = new ol.Feature({
                            geometry: geom
                        });
                        f2.setProperties({ "name": v.Name.toString() });
                        this.featureAppand_(f2, v);
                        return f2;
                    }.bind(this)
                });
                this.link_DataSet_DataDTOSet_.start();
                this.link_LayerEntity_DataSet_.start();
                this.map_.map.addLayer(this.layerEntity_.layer);
                // this.status_ = new Status(this);
                // this.status_.ConditionTurn(true, "displayed");//hided
                //this.switch_(switch1);
                // this.ui_.RegisterShortBarButton(null,"plotSwitch","深",this.Switch.bind(this)).click();
                //todo
                this.isLayerShow_ = ko.observable();
                this.isLayerShow_.subscribe(function (v) {
                    this.setVisible(v);
                }.bind(this));
                this.isLayerShow_(false);
                var switch1 = StaticLib_1.CheckBox({
                    checked: this.isLayerShow_,
                    view: "水深",
                    click: this.switch_.bind(this)
                });
                this.setting_.registerSettingElement("mapSwitch", switch1);
                // var value = $('<span><input  type="search" style="width:100px" placeholder="深度阈值:18"></span>')
                // //var $('<input id="searchButton" class="">搜索</input>');
                // this.colorWaterDepth_=18;
                // value.bind("search",function(a:any){
                //    var value=a.target.value;
                //    value=value.replace("深度阈值:","");
                //    value=Number(value)||this.colorWaterDepth_;
                //    this.colorWaterDepth_=value;
                //    this.layerEntity_.OptionChange("colorWaterDepth",value);
                //    a.target.value='深度阈值:'+value;
                // }.bind(this));
                // this.ui_.RegisterToolElementLeft("waterDepth",value);
                var value = $("<div class=\"form-group row\">\n<label class=\"col-sm-4 col-form-label\">\u6DF1\u5EA6\u9608\u503C</label>\n<div class=\"col-sm-8\"><input type=\"text\" class=\"form-control\" placeholder=\"18\"></div>\n</div>");
                value.bind("keypress", function (e) {
                    if (e && e.keyCode == 13) {
                        var value = Number(e.target.value) || this.colorWaterDepth_;
                        this.layerEntity_.OptionChange("colorWaterDepth", value);
                        e.target.value = value;
                    }
                }.bind(this));
                //value.bind("search",function(a:any){
                //    var value=Number(a.target.value)||this.colorWaterDepth_;
                //    this.layerEntity_.OptionChange("colorWaterDepth",value);
                //    a.target.value=value;
                //}.bind(this));
                this.setting_.registerSettingElement("waterDepth", value);
            }
        }, {
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
                this.layerEntity_.layer.setVisible(isShow);
                this.isLayerShow_(isShow);
            }
        }, {
            key: "featureAppand_",
            value: function featureAppand_(olFeature, data) {
                olFeature.id = "waterDepth:" + data.Name;
                olFeature.data = data;
            }
        }, {
            key: "loadTide_",
            value: function loadTide_() {
                this.tideApi_.Get().then(function (pdata) {
                    switch (pdata.state) {
                        case "apiok":
                            var data = pdata.data;
                            if (!data) return;
                            data.Time = fecha.format(fecha.parse(data.Time, 'YYYY-MM-DDTHH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
                            var tideDiv = $(TideDiv);
                            ko.applyBindings(pdata.data, tideDiv[0]);
                            //this.ui_.ShowMassageInfo(tideDiv);
                            break;
                        default:
                    }
                }.bind(this));
            }
        }, {
            key: "load_",
            value: function load_() {
                this.waterDepthDataApi_.Get_GetAllPiles().then(function (pdata) {
                    return new Promise(function (resolve, reject) {
                        switch (pdata.state) {
                            case "apiok":
                                this.dataDTOSet_.Add(pdata.data);
                                resolve();
                                break;
                            default:
                                reject();
                        }
                    }.bind(this));
                }.bind(this)).catch(function (pdata) {
                    switch (pdata.state) {
                        case "apierr":
                            console.log("apierr", pdata.data);
                            break;
                    }
                    if (!pdata.state) throw pdata;
                });
            }
        }]);

        return WaterDepthPlugin;
    }();

    WaterDepthPlugin = __decorate([__param(1, Plugins_1.inject("maps/map")), __param(2, Plugins_1.inject("maps/tools/setting"))], WaterDepthPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WaterDepthPlugin;
});