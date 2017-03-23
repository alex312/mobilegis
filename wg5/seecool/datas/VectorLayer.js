"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "openlayers", 'seecool/geom/utils'], function (require, exports, ol, utils) {
    "use strict";

    var VectorLayer = function (_ol$layer$Vector) {
        _inherits(VectorLayer, _ol$layer$Vector);

        function VectorLayer(options) {
            _classCallCheck(this, VectorLayer);

            return _possibleConstructorReturn(this, (VectorLayer.__proto__ || Object.getPrototypeOf(VectorLayer)).call(this, options));
        }

        _createClass(VectorLayer, [{
            key: "pickup",
            value: function pickup(coordinate, maxOffset, res) {
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
                    if (mindistance == 0) return true;
                });
                return { feature: feature, distance: mindistance };
            }
        }, {
            key: "getFeatureById",
            value: function getFeatureById(id) {
                var feature = null;
                var source = this.getSource();
                source.forEachFeature(function (F) {
                    if (F.id == id) {
                        feature = F;
                        return true;
                    }
                });
                return feature;
            }
        }]);

        return VectorLayer;
    }(ol.layer.Vector);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VectorLayer;
});