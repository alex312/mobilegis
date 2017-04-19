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
define(["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    var ShipsTileSource = (function (_super) {
        __extends(ShipsTileSource, _super);
        function ShipsTileSource(options) {
            var _this = this;
            options = options || {};
            options.tileUrlFunction = function (coord, pixelRatio, projection) {
                return _this.tileUrlFunction_(coord, pixelRatio, projection);
            };
            _this = _super.call(this, options) || this;
            _this.url_ = options.tileUrl;
            _this.version_ = options.titleVersionUrl;
            return _this;
        }
        ShipsTileSource.prototype.setUrlWithVersion = function (url, version) {
            var urlChanged = false;
            var versionChanged = false;
            if (this.url_ !== url) {
                this.url_ = url;
                urlChanged = true;
            }
            if (this.version_ !== version) {
                this.version_ = version;
                versionChanged = true;
            }
            if (urlChanged) {
                //ol
                this.setTileLoadFunction(this.getTileLoadFunction());
            }
            else {
                this.versionChanged_();
            }
        };
        ;
        ShipsTileSource.prototype.tileUrlFunction_ = function (tileCoord, pixelRatio, projection) {
            if (!this.url_ || !this.version_)
                return undefined;
            if (!tileCoord)
                return undefined;
            /**@type {string}*/
            var url = (this.url_);
            return url
                .replace('{v}', this.version_.toString())
                .replace('{x}', tileCoord[1].toString())
                .replace('{y}', (-tileCoord[2] - 1).toString())
                .replace('{-y}', (-tileCoord[2]).toString())
                .replace('{z}', tileCoord[0].toString());
        };
        ;
        ShipsTileSource.prototype.versionChanged_ = function () {
            this.changed();
        };
        ;
        return ShipsTileSource;
    }(ol.source.XYZ));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipsTileSource;
});
