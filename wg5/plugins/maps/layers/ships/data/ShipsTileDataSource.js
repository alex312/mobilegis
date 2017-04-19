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
    var ShipsTileDataSource = (function (_super) {
        __extends(ShipsTileDataSource, _super);
        function ShipsTileDataSource(option) {
            var _this = _super.call(this) || this;
            option = option || {};
            _this.tileUrl_ = option.tileUrl || null;
            _this.versionUrl_ = option.versionUrl || null;
            _this.checkInterval_ = option.checkInterval || 1000 * 60;
            _this.xhr_ = null;
            _this.timer_ = null;
            _this.version_ = null;
            if (_this.tileUrl_ && _this.versionUrl_ && _this.checkInterval_) {
                _this.check_();
            }
            return _this;
        }
        ShipsTileDataSource.prototype.setUrl = function (tileUrl) {
            this.tileUrl_ = tileUrl;
            this.dispatchEvent("change");
        };
        ShipsTileDataSource.prototype.getData = function () {
            return { url: this.tileUrl_, version: this.version_ };
        };
        ShipsTileDataSource.prototype.dispose = function () {
            if (this.timer_) {
                window.clearTimeout(this.timer_);
                this.timer_ = null;
            }
            if (this.xhr_) {
                this.xhr_.abort();
                this.xhr_ = null;
            }
        };
        ;
        ShipsTileDataSource.prototype.check_ = function () {
            this.xhr_ = new XMLHttpRequest();
            this.xhr_.open("get", this.versionUrl_, true);
            this.xhr_.onload = this.checkComplete_.bind(this, false);
            this.xhr_.onerror = this.checkComplete_.bind(this, true);
            this.xhr_.send();
        };
        ;
        ShipsTileDataSource.prototype.checkComplete_ = function (failed, evt) {
            var xhr = evt.target;
            if (!failed && xhr.status === 200) {
                var version = JSON.parse(xhr.responseText);
                if (version !== this.version_) {
                    this.version_ = version;
                    this.changed();
                }
            }
            this.timer_ = window.setTimeout(this.check_.bind(this), this.checkInterval_);
        };
        ;
        return ShipsTileDataSource;
    }(ol.Observable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipsTileDataSource;
});
