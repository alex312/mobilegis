"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "openlayers", "./ShipsTileSource", "./ShipsCanvasSource"], function (require, exports, ol, ShipsTileSource_1, ShipsCanvasSource_1) {
    "use strict";

    var ShipsLayer = function (_ol$layer$Group) {
        _inherits(ShipsLayer, _ol$layer$Group);

        function ShipsLayer(options) {
            _classCallCheck(this, ShipsLayer);

            options = options || {};
            var criticalResolution = options.criticalResolution || 152.8740565703525;
            var sourceTile = new ShipsTileSource_1.default({
                tileUrl: options.tileUrl,
                titleVersionUrl: options.titleVersionUrl
            });
            var sourceImage = new ShipsCanvasSource_1.default({
                maxResolution: criticalResolution,
                flagDraw: options.flagDraw
            });
            var layerTile = new ol.layer.Tile({
                minResolution: criticalResolution,
                source: sourceTile
            });
            var layerImage = new ol.layer.Image({
                source: sourceImage
            });

            var _this = _possibleConstructorReturn(this, (ShipsLayer.__proto__ || Object.getPrototypeOf(ShipsLayer)).call(this, {
                layers: [layerTile, layerImage]
            }));

            _this.criticalResolution_ = criticalResolution;
            _this.sourceTile_ = sourceTile;
            _this.sourceImage_ = sourceImage;
            _this.layerTile_ = layerTile;
            _this.layerImage_ = layerImage;
            if (options.tile) _this.listenKeyTile_ = options.tile.on("change", _this.dataSourceTileChanged_, _this);
            if (options.symbol) {
                _this.listenKeySymbolic_ = options.symbol.on("change", _this.dataSourceSymbolChanged_, _this);
            }
            return _this;
        }

        _createClass(ShipsLayer, [{
            key: "getCriticalResolution",
            value: function getCriticalResolution() {
                return this.criticalResolution_;
            }
        }, {
            key: "dispose",
            value: function dispose() {
                if (this.listenKeyTile_) {
                    ol.Observable.unByKey(this.listenKeyTile_);
                    delete this.listenKeyTile_;
                }
                if (this.listenKeySymbolic_) {
                    ol.Observable.unByKey(this.listenKeySymbolic_);
                    delete this.listenKeySymbolic_;
                }
            }
        }, {
            key: "getTileLayer",
            value: function getTileLayer() {
                return this.layerTile_;
            }
        }, {
            key: "getCanvasLayer",
            value: function getCanvasLayer() {
                return this.layerImage_;
            }
        }, {
            key: "dataSourceTileChanged_",
            value: function dataSourceTileChanged_(ev) {
                var d = ev.target.getData();
                this.sourceTile_.setUrlWithVersion(d.url, d.version);
            }
        }, {
            key: "dataSourceSymbolChanged_",
            value: function dataSourceSymbolChanged_(ev) {
                //console.log("dataSourceSymbolChanged_",ev.target);
                var data = ev.target;
                this.sourceImage_.setData(data.getData());
            }
        }, {
            key: "pickup",
            value: function pickup(coordinate, maxOffset, res) {
                return this.sourceImage_.pickup(coordinate, maxOffset, res);
            }
        }, {
            key: "extentPickup",
            value: function extentPickup(extent, res) {
                return this.sourceImage_.extentPickup(extent, res);
            }
        }, {
            key: "getShipFeature",
            value: function getShipFeature(id) {
                return this.sourceImage_.getShipFeature(id);
            }
        }, {
            key: "search",
            value: function search(key) {
                return this.sourceImage_.search(key);
            }
        }]);

        return ShipsLayer;
    }(ol.layer.Group);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipsLayer;
});