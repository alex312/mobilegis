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
define(["require", "exports", "openlayers", "../../../../seecool/datas/DynamicFeature"], function (require, exports, ol, DynamicFeature_1) {
    "use strict";
    exports.GpsFeatureState = {
        EMPTY: 0,
        NORMAL: 1,
        EXPIRED: 2
    };
    var GpsFeature = (function (_super) {
        __extends(GpsFeature, _super);
        function GpsFeature() {
            var _this = _super.call(this) || this;
            _this.geo_ = null;
            _this.timer_ = 0;
            _this.ttl_ = 30 * 1000;
            _this.state_ = exports.GpsFeatureState.EMPTY;
            _this.isFollowed_ = false;
            return _this;
        }
        GpsFeature.prototype.getGeometry = function () {
            return this.geo_;
        };
        ;
        GpsFeature.prototype.update = function (coordinate) {
            this.geo_ = new ol.geom.Point(coordinate);
            this.state_ = exports.GpsFeatureState.NORMAL;
            if (this.timer_)
                window.clearTimeout(this.timer_);
            this.timer_ = window.setTimeout(this.timeOut_.bind(this), this.ttl_);
            this.changed();
        };
        ;
        GpsFeature.prototype.timeOut_ = function () {
            this.timer_ = 0;
            this.state_ = exports.GpsFeatureState.EXPIRED;
        };
        ;
        GpsFeature.prototype.focus = function () {
            throw new Error('Not implemented.');
        };
        ;
        GpsFeature.prototype.unfocus = function () {
            throw new Error('Not implemented.');
        };
        ;
        GpsFeature.prototype.follow = function () {
            this.isFollowed_ = true;
        };
        ;
        GpsFeature.prototype.unfollow = function () {
            this.isFollowed_ = false;
        };
        ;
        GpsFeature.prototype.isFocused = function () {
            throw new Error('Not implemented.');
        };
        ;
        GpsFeature.prototype.isFollowed = function () {
            return this.isFollowed_;
        };
        ;
        return GpsFeature;
    }(DynamicFeature_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GpsFeature;
});
