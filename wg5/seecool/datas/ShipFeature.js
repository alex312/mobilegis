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
define(["require", "exports", "./DynamicFeature"], function (require, exports, DynamicFeature_1) {
    "use strict";
    var ShipFeature = (function (_super) {
        __extends(ShipFeature, _super);
        function ShipFeature(owner) {
            var _this = _super.call(this, {}) || this;
            _this.owner_ = owner;
            _this.focusing_ = false;
            _this.following_ = false;
            return _this;
        }
        ShipFeature.prototype.focus = function () {
            this.owner_.focusFeature(this);
            this.focusing_ = true;
        };
        ;
        ShipFeature.prototype.unfocus = function () {
            this.focusing_ = false;
            this.owner_.unfocusFeature(this);
        };
        ;
        ShipFeature.prototype.follow = function () {
            this.owner_.followFeature(this);
            this.following_ = true;
        };
        ;
        ShipFeature.prototype.unfollow = function () {
            this.following_ = false;
            this.owner_.unfollowFeature(this);
        };
        ;
        ShipFeature.prototype.getGeometry = function () {
            return this.owner_.getFeatureGeometry(this);
        };
        ;
        ShipFeature.prototype.getData = function () {
            return this.owner_.getFeatureData(this);
        };
        ;
        ShipFeature.prototype.isFocused = function () {
            return this.focusing_;
        };
        ;
        ShipFeature.prototype.isFollowed = function () {
            return this.following_;
        };
        ;
        return ShipFeature;
    }(DynamicFeature_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipFeature;
});
