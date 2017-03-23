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
define(["require", "exports", "text!./htmls/toolPanel.html", "../../../../seecool/utilities", "openlayers", "knockout", "../../../../seecool/plugins/Plugins"], function (require, exports, ToolPanel, utils, ol, ko, Plugins_1) {
    "use strict";

    var LocationPlugin = function () {
        function LocationPlugin(config, map, frame) {
            _classCallCheck(this, LocationPlugin);

            this.frame_ = frame;
            this.map_ = map;
            // ui.RegisterToolButton("locationTool","location","定位",this.showPanel.bind(this));
            var toolbar = this.frame_.toolbars['right'];
            toolbar.addButton({
                text: '定位',
                icon: 'fa fa-map-marker',
                click: this.showPanel_.bind(this)
            });
        }

        _createClass(LocationPlugin, [{
            key: "showPanel_",
            value: function showPanel_() {
                if (!this.toolPanal_) {
                    this.toolPanal_ = $(ToolPanel);
                    this.viewModel_ = {
                        Lon: ko.observable(),
                        Lat: ko.observable(),
                        ShowLon: ko.observable(),
                        ShowLat: ko.observable()
                    };
                    ko.applyBindings(this.viewModel_, this.toolPanal_[0]);
                    this.toolPanal_.dialog({
                        width: 200,
                        height: "auto",
                        position: {},
                        close: this.closePanel_.bind(this),
                        buttons: {
                            "定位": this.location_.bind(this),
                            "关闭": this.closePanel_.bind(this)
                        },
                        autoOpen: false
                    });
                }
                if (!this.toolPanal_.dialog('isOpen')) {
                    this.toolPanal_.dialog('open');
                }
            }
        }, {
            key: "closePanel_",
            value: function closePanel_() {
                if (this.toolPanal_.dialog('isOpen')) {
                    this.toolPanal_.dialog('close');
                }
                this.removeOverlay_();
            }
        }, {
            key: "location_",
            value: function location_() {
                var lon, lat, lonlat, zoom;
                lon = this.degreeToDecimal_(this.viewModel_.Lon());
                lat = this.degreeToDecimal_(this.viewModel_.Lat());
                this.viewModel_.ShowLon(utils.formatDegree(lon, 'ddd-cc-mm.mmL'));
                this.viewModel_.ShowLat(utils.formatDegree(lat, 'dd-cc-mm.mmB'));
                if (lon && lat) {
                    lonlat = ol.proj.fromLonLat([lon || 0, lat || 0]);
                }
                this.map_.setCenter(lonlat, zoom);
                this.showOverlay_(lonlat);
            }
        }, {
            key: "showOverlay_",
            value: function showOverlay_(lonlat) {
                if (!this.overlay_) {
                    this.overlay_ = new ol.Overlay({
                        position: lonlat,
                        positioning: 'bottom-center',
                        element: $('<i class="menu-icon bigger-250 fa fa-map-marker" style="color:#FFA907;font-size: 30px;"></i>')[0]
                    });
                    this.map_.map.addOverlay(this.overlay_);
                }
                this.overlay_.setPosition(lonlat);
            }
        }, {
            key: "removeOverlay_",
            value: function removeOverlay_() {
                // this.map_.removeOverlay(this.overlay_);
                // delete this.overlay_;
            }
        }, {
            key: "degreeToDecimal_",
            value: function degreeToDecimal_(str) {
                if (!str) {
                    return 0;
                } else if (str.indexOf("°") != -1) {
                    return utils.degreeToDecimal(str);
                } else {
                    //var r,g=/([0-9\.]{1,})\s?/ig,n=0;
                    //while(r=g.exec(str)){
                    //    n+=Number(r[1])+n*60;
                    //}
                    return Number(str);
                }
            }
        }]);

        return LocationPlugin;
    }();

    LocationPlugin = __decorate([__param(1, Plugins_1.inject("maps/map")), __param(2, Plugins_1.inject('maps/ui/uiFrame'))], LocationPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LocationPlugin;
});