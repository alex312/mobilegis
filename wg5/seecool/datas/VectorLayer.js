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
define(["require", "exports", "openlayers", "seecool/geom/utils"], function (require, exports, ol, utils) {
    "use strict";
    var VectorLayer = (function (_super) {
        __extends(VectorLayer, _super);
        function VectorLayer(options) {
            var _this = _super.call(this, options) || this;
            if (options) {
                if (!(options.usePickup === false)) {
                    _this.pickup = _this.deaultPickup;
                }
            }
            return _this;
        }
        VectorLayer.prototype.deaultPickup = function (coordinate, maxOffset, res) {
            var mindistance = Infinity;
            var feature;
            var source = this.getSource();
            source.forEachFeature(function (F) {
                var df = [0, 0];
                var testg = F.getGeometry();
                testg.getClosestPoint([coordinate[0], coordinate[1]], df);
                var distance = utils.squaredDistance(coordinate[0], coordinate[1], df[0], df[1]);
                if (mindistance > distance) {
                    mindistance = distance;
                    feature = F;
                }
                if (mindistance == 0)
                    return true;
            });
            return { feature: feature, distance: mindistance };
        };
        ;
        VectorLayer.prototype.getFeatureById = function (id) {
            var feature = null;
            var source = this.getSource();
            source.forEachFeature(function (F) {
                if (F.id == id) {
                    feature = F;
                    return true;
                }
            });
            return feature;
        };
        ;
        return VectorLayer;
    }(ol.layer.Vector));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VectorLayer;
});
