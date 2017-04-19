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
    var DynamicFeature = (function (_super) {
        __extends(DynamicFeature, _super);
        function DynamicFeature(option) {
            return _super.call(this, option) || this;
        }
        DynamicFeature.prototype.die = function () {
            this.dispatchEvent("die");
        };
        ;
        DynamicFeature.prototype.focus = function () {
        };
        ;
        DynamicFeature.prototype.unfocus = function () {
        };
        ;
        DynamicFeature.prototype.follow = function () {
        };
        ;
        DynamicFeature.prototype.unfollow = function () {
        };
        ;
        DynamicFeature.prototype.getData = function () {
        };
        ;
        DynamicFeature.prototype.getGeometry = function () {
            return ol.Feature.prototype.getGeometry.apply(this, arguments);
        };
        ;
        DynamicFeature.prototype.setGeometry = function () {
            return ol.Feature.prototype.setGeometry.apply(this, arguments);
        };
        ;
        return DynamicFeature;
    }(ol.Feature));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DynamicFeature;
});
