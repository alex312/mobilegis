var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "knockout", "../../../../seecool/plugins/Plugins"], function (require, exports, ko, Plugins_1) {
    "use strict";
    var LayersSettingPlugin = (function () {
        function LayersSettingPlugin(config, map) {
            this.zIndexList = ko.observable();
            this.userHope = {};
            this.view_ = map.map.getView();
            this.list = ko.observableArray([]);
        }
        LayersSettingPlugin.prototype.RegisterLayerSetting = function (label, isLayerShow, zIndex, maxZoom, click, setZIndex, setMaxZoom) {
            return this.registerLayerSetting(label, isLayerShow, zIndex, maxZoom, click, setZIndex, setMaxZoom);
        };
        LayersSettingPlugin.prototype.registerLayerSetting = function (label, isLayerShow, zIndex, maxZoom, click, setZIndex, setMaxZoom) {
            var _this = this;
            isLayerShow.subscribe(function (isShow) {
                var layerZoom = maxZoom();
                var zoom = this.view_.getZoom();
                if (isShow) {
                    if (zoom >= layerZoom + 1) {
                        isLayerShow(true);
                        this.userHope[label] = "none";
                    }
                    else {
                        isLayerShow(true);
                        this.userHope[label] = "show";
                        setMaxZoom(zoom - 1);
                    }
                }
                else {
                    if (zoom >= layerZoom + 1) {
                        isLayerShow(false);
                        this.userHope[label] = "hide";
                    }
                    else {
                        isLayerShow(false);
                        this.userHope[label] = "none";
                    }
                }
            }.bind(this));
            this.list.push({ label: label, isLayerShow: isLayerShow, zIndex: zIndex, maxZoom: maxZoom, click: click, setZIndex: setZIndex, setMaxZoom: setMaxZoom });
            this.list(this.list().sort(function (a, b) {
                return (a.zIndex() < b.zIndex()) ? 1 : -1;
            }));
            var list = [];
            this.list().forEach(function (data) {
                list.push(data.zIndex());
                _this.userHope[label] = 'none';
            });
            this.zIndexList(list);
        };
        return LayersSettingPlugin;
    }());
    LayersSettingPlugin = __decorate([
        __param(1, Plugins_1.inject("maps/map"))
    ], LayersSettingPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LayersSettingPlugin;
});
