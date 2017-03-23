"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "openlayers", "../../ships/layers/ShipsCanvasSource"], function (require, exports, ol, ShipsCanvasSource_1) {
    "use strict";

    var PlaybackLayer = function (_ol$layer$Group) {
        _inherits(PlaybackLayer, _ol$layer$Group);

        function PlaybackLayer(options) {
            _classCallCheck(this, PlaybackLayer);

            options = options || {};
            var criticalResolution = options.criticalResolution || 152.8740565703525;
            var sourceImage = new ShipsCanvasSource_1.default({
                maxResolution: criticalResolution,
                mode: "history"
            });
            var layerImage = new ol.layer.Image({
                source: sourceImage
            });
            var drawSource = new ol.source.Vector({ wrapX: false });
            var drawLayer = new ol.layer.Vector({
                source: drawSource,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                })
            });

            var _this = _possibleConstructorReturn(this, (PlaybackLayer.__proto__ || Object.getPrototypeOf(PlaybackLayer)).call(this, {
                layers: [layerImage, drawLayer]
            }));

            _this.criticalResolution_ = criticalResolution;
            _this.sourceImage_ = sourceImage;
            _this.layerImage_ = layerImage;
            _this.drawLayer_ = drawLayer;
            _this.drawer_ = {};
            _this.drawSource_ = drawSource;
            if (options.symbol) {
                _this.listenKeySymbolic_ = options.symbol.on("change", _this.dataSourceSymbolChanged_, _this);
            }
            return _this;
        }

        _createClass(PlaybackLayer, [{
            key: "getCriticalResolution",
            value: function getCriticalResolution() {
                return this.criticalResolution_;
            }
        }, {
            key: "addDrawAreaInteraction",
            value: function addDrawAreaInteraction(map, onCommit) {
                this.commitAreaFeature_ = onCommit;
                var value = 'LineString';
                var geometryFunction, maxPoints;
                maxPoints = 2;
                geometryFunction = function geometryFunction(coordinates, geometry) {
                    if (!geometry) {
                        geometry = new ol.geom.Polygon(null);
                    }
                    var start = coordinates[0];
                    var end = coordinates[1];
                    geometry.setCoordinates([[start, [start[0], end[1]], end, [end[0], start[1]], start]]);
                    return geometry;
                };
                this.drawer_ = new ol.interaction.Draw({
                    source: this.drawSource_,
                    type: /** @type {ol.geom.GeometryType} */value,
                    geometryFunction: geometryFunction,
                    maxPoints: maxPoints
                });
                this.drawer_.on('drawend', this.drawAreaEnd.bind(this));
                map.addInteraction(this.drawer_);
            }
        }, {
            key: "removeDrawAreaInteraction",
            value: function removeDrawAreaInteraction(map) {
                map.removeInteraction(this.drawer_);
            }
        }, {
            key: "removeDrawArea",
            value: function removeDrawArea(feature) {
                if (feature) this.drawSource_.removeFeature(feature);
            }
        }, {
            key: "drawAreaEnd",
            value: function drawAreaEnd(evt) {
                if (this.commitAreaFeature_) this.commitAreaFeature_(evt.feature);
            }
        }, {
            key: "dispose",
            value: function dispose() {
                if (this.listenKeySymbolic_) {
                    ol.Observable.unByKey(this.listenKeySymbolic_);
                    delete this.listenKeySymbolic_;
                }
            }
        }, {
            key: "getCanvasLayer",
            value: function getCanvasLayer() {
                return this.layerImage_;
            }
        }, {
            key: "dataSourceSymbolChanged_",
            value: function dataSourceSymbolChanged_(ev) {
                var data = ev.target;
                this.sourceImage_.setData(data.getData());
            }
        }, {
            key: "pickup",
            value: function pickup(coordinate, maxOffset, res) {
                return this.sourceImage_.pickup(coordinate, maxOffset, res);
            }
        }, {
            key: "getShipFeature",
            value: function getShipFeature(id) {
                return this.sourceImage_.getShipFeature(id);
            }
        }, {
            key: "getAllShipFeature",
            value: function getAllShipFeature() {
                return this.sourceImage_.getAllShipFeature();
            }
        }]);

        return PlaybackLayer;
    }(ol.layer.Group);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PlaybackLayer;
});