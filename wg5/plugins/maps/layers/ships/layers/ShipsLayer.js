var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "openlayers", "./ShipsTileSource", "./ShipsCanvasSource"], function (require, exports, ol, ShipsTileSource_1, ShipsCanvasSource_1) {
    "use strict";
    var ShipsLayer = (function (_super) {
        __extends(ShipsLayer, _super);
        function ShipsLayer(options) {
            var _this = this;
            options = options || {};
            var criticalResolution = options.criticalResolution || 152.8740565703525;
            var sourceTile = new ShipsTileSource_1.default({
                tileUrl: options.tileUrl,
                titleVersionUrl: options.titleVersionUrl
            });
            var sourceImage = new ShipsCanvasSource_1.default({
                maxResolution: criticalResolution,
                flagDraw: options.flagDraw,
                specialDraw: options.specialDraw
            });
            var layerTile = new ol.layer.Tile({
                minResolution: criticalResolution,
                source: sourceTile
            });
            var layerImage = new ol.layer.Image({
                source: sourceImage
            });
            _this = _super.call(this, {
                layers: [layerTile, layerImage]
            }) || this;
            _this.criticalResolution_ = criticalResolution;
            _this.sourceTile_ = sourceTile;
            _this.sourceImage_ = sourceImage;
            _this.layerTile_ = layerTile;
            _this.layerImage_ = layerImage;
            if (options.tile)
                _this.listenKeyTile_ = options.tile.on("change", _this.dataSourceTileChanged_, _this);
            if (options.symbol) {
                _this.listenKeySymbolic_ = options.symbol.on("change", _this.dataSourceSymbolChanged_, _this);
            }
            return _this;
        }
        ShipsLayer.prototype.setZIndex = function (index) {
            this.layerTile_.setZIndex(index);
            this.layerImage_.setZIndex(index);
        };
        ShipsLayer.prototype.getCriticalResolution = function () {
            return this.criticalResolution_;
        };
        ;
        ShipsLayer.prototype.dispose = function () {
            if (this.listenKeyTile_) {
                ol.Observable.unByKey(this.listenKeyTile_);
                delete this.listenKeyTile_;
            }
            if (this.listenKeySymbolic_) {
                ol.Observable.unByKey(this.listenKeySymbolic_);
                delete this.listenKeySymbolic_;
            }
        };
        ;
        ShipsLayer.prototype.getTileLayer = function () {
            return this.layerTile_;
        };
        ;
        ShipsLayer.prototype.getCanvasLayer = function () {
            return this.layerImage_;
        };
        ;
        ShipsLayer.prototype.dataSourceTileChanged_ = function (ev) {
            var d = ev.target.getData();
            this.sourceTile_.setUrlWithVersion(d.url, d.version);
        };
        ;
        ShipsLayer.prototype.dataSourceSymbolChanged_ = function (ev) {
            //console.log("dataSourceSymbolChanged_",ev.target);
            var data = (ev.target);
            this.sourceImage_.setData(data.getData());
        };
        ;
        ShipsLayer.prototype.pickup = function (coordinate, maxOffset, res) {
            return this.sourceImage_.pickup(coordinate, maxOffset, res);
        };
        ;
        ShipsLayer.prototype.extentPickup = function (extent, res) {
            return this.sourceImage_.extentPickup(extent, res);
        };
        ;
        ShipsLayer.prototype.getShipFeature = function (id) {
            return this.sourceImage_.getShipFeature(id);
        };
        ;
        ShipsLayer.prototype.search = function (key) {
            return this.sourceImage_.search(key);
        };
        ;
        return ShipsLayer;
    }(ol.layer.Group));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipsLayer;
});
