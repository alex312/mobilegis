"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "openlayers", "../../../../../seecool/geom/utils"], function (require, exports, ol, utils) {
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
                    if (mindistance == 0) break;
                }
                return { feature: feature, distance: mindistance };
            }
        }, {
            key: "getFeatureById",
            value: function getFeatureById(id) {
                var features = this.getSource().getFeatures();
                for (var i in features) {
                    if (features[i].id == id) return features[i];
                }
                return null;
            }
        }, {
            key: "searchDatas",
            value: function searchDatas(key) {
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
            }
        }, {
            key: "searchString",
            value: function searchString(thestring, str) {
                var r = false;
                var t = thestring.toLowerCase().replace(/\s/g, "");
                var k = str.toLowerCase();
                r = r ? r : t.indexOf(k) >= 0;
                return r;
            }
        }]);

        return VectorLayer;
    }(ol.layer.Vector);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VectorLayer;
});