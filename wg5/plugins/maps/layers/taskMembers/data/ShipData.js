"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "../../../../../seecool/utilities", "../../../../../seecool/utilities", "./Feature"], function (require, exports, utilities_1, utilities_2, Feature_1) {
    "use strict";

    var ShipData = function (_Feature_1$default) {
        _inherits(ShipData, _Feature_1$default);

        function ShipData(entity) {
            _classCallCheck(this, ShipData);

            var _this = _possibleConstructorReturn(this, (ShipData.__proto__ || Object.getPrototypeOf(ShipData)).call(this, entity));

            _this.version_ = 0;
            _this.lon3857_ = NaN;
            _this.lat3857_ = NaN;
            _this.track_ = [];
            _this.track3857_ = [];
            _this.entity_change_handler_ = _this.onEntityChange_.bind(_this);
            _this.hoveredPiece_ = null;
            var en = _this.entity;
            en.bind("change", _this.entity_change_handler_);
            _this.onEntityChange_();
            return _this;
        }

        _createClass(ShipData, [{
            key: "destroy",
            value: function destroy() {
                this.entity.unbind("change", this.entity_change_handler_);
                _get(ShipData.prototype.__proto__ || Object.getPrototypeOf(ShipData.prototype), "destroy", this).call(this);
            }
        }, {
            key: "focus",
            value: function focus(piece) {
                _get(ShipData.prototype.__proto__ || Object.getPrototypeOf(ShipData.prototype), "focus", this).call(this, piece);
                this.version_++;
                this.trigger("change");
            }
        }, {
            key: "hover",
            value: function hover(piece) {
                _get(ShipData.prototype.__proto__ || Object.getPrototypeOf(ShipData.prototype), "hover", this).call(this, piece);
                this.hoveredPiece_ = piece;
            }
        }, {
            key: "updateLonLat_",
            value: function updateLonLat_() {
                var en = this.entity;
                var lon = en.lon;
                var lat = en.lat;
                this.lon3857_ = utilities_1.lon3857(lon);
                this.lat3857_ = utilities_2.lat3857(lat);
            }
        }, {
            key: "onEntityChange_",
            value: function onEntityChange_() {
                //console.log("onEntityChange_");
                this.updateLonLat_();
                var entity = this.entity;
                //if (!this.track_.length || this.track_[this.track_.length - 1].time !== entity.time) {
                //    let tp = new (<new(id:string, data:any)=>ShipEntity>entity.constructor)(this.id, entity);
                //    this.track_.push(tp);
                //    this.track3857_.push([this.lon3857_, this.lat3857_]);
                //}
                this.version_++;
                this.trigger("change");
            }
        }, {
            key: "prependTrack",
            value: function prependTrack(points) {
                if (points.length) {
                    var cstr = this.entity.constructor;
                    var track = new Array(points.length);
                    var track3857 = new Array(points.length);
                    for (var i = 0; i < points.length; i++) {
                        var item = points[i];
                        track[i] = new cstr(item.id, item);
                        track3857[i] = [utilities_1.lon3857(item.lon), utilities_2.lat3857(item.lat)];
                    }
                    this.track_.unshift.apply(this.track_, track);
                    this.track3857_.unshift.apply(this.track3857_, track3857);
                    this.version_++;
                    this.trigger("change");
                }
            }
        }, {
            key: "hoveredPiece",
            get: function get() {
                return this.hoveredPiece_;
            }
        }, {
            key: "version",
            get: function get() {
                return this.version_;
            }
        }, {
            key: "lon3857",
            get: function get() {
                return this.lon3857_;
            }
        }, {
            key: "lat3857",
            get: function get() {
                return this.lat3857_;
            }
        }, {
            key: "track",
            get: function get() {
                return this.track_;
            }
        }, {
            key: "track3857",
            get: function get() {
                return this.track3857_;
            }
        }]);

        return ShipData;
    }(Feature_1.default);

    exports.ShipData = ShipData;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipData;
});