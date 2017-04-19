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
define(["require", "exports", "openlayers", "../../../../../seecool/geom/utils"], function (require, exports, ol, utils) {
    "use strict";
    var VectorLayer = (function (_super) {
        __extends(VectorLayer, _super);
        function VectorLayer(options) {
            return _super.call(this, options) || this;
        }
        VectorLayer.prototype.pickup = function (coordinate, maxOffset, res) {
            var features = this.getSource().getFeatures();
            var mindistance = Infinity;
            var feature;
            for (var i in features) {
                var I = features[i];
                var df = [0, 0];
                var testg = I.getGeometry();
                testg.getClosestPoint([coordinate[0], coordinate[1]], df);
                var distance = utils.squaredDistance(coordinate[0], coordinate[1], df[0], df[1]);
                if (mindistance > distance) {
                    mindistance = distance;
                    feature = I;
                }
                if (mindistance == 0)
                    break;
            }
            return { feature: feature, distance: mindistance };
        };
        ;
        VectorLayer.prototype.getFeatureById = function (id) {
            var features = this.getSource().getFeatures();
            for (var i in features) {
                if (features[i].id == id)
                    return features[i];
            }
            return null;
        };
        ;
        VectorLayer.prototype.searchDatas = function (key) {
            var r = [];
            var features = this.getSource().getFeatures();
            //name
            for (var each in features) {
                var I = features[each].data;
                if (this.searchString(I.Name, key)) {
                    r.push({ type: "name", data: I.Name, target: features[each] });
                }
            }
            return r;
        };
        VectorLayer.prototype.searchString = function (thestring, str) {
            var r = false;
            var t = thestring.toLowerCase().replace(/\s/g, "");
            var k = str.toLowerCase();
            r = r ? r : (t.indexOf(k) >= 0);
            return r;
        };
        return VectorLayer;
    }(ol.layer.Vector));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VectorLayer;
});
