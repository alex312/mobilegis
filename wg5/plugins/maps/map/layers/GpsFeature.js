"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "openlayers", "../../../../seecool/datas/DynamicFeature"], function (require, exports, ol, DynamicFeature_1) {
    "use strict";

    exports.GpsFeatureState = {
        EMPTY: 0,
        NORMAL: 1,
        EXPIRED: 2
    };

    var GpsFeature = function (_DynamicFeature_1$def) {
        _inherits(GpsFeature, _DynamicFeature_1$def);

        function GpsFeature() {
            _classCallCheck(this, GpsFeature);

            var _this = _possibleConstructorReturn(this, (GpsFeature.__proto__ || Object.getPrototypeOf(GpsFeature)).call(this));

            _this.geo_ = null;
            _this.timer_ = 0;
            _this.ttl_ = 30 * 1000;
            _this.state_ = exports.GpsFeatureState.EMPTY;
            _this.isFollowed_ = false;
            return _this;
        }

        _createClass(GpsFeature, [{
            key: "getGeometry",
            value: function getGeometry() {
                return this.geo_;
            }
        }, {
            key: "update",
            value: function update(coordinate) {
                this.geo_ = new ol.geom.Point(coordinate);
                this.state_ = exports.GpsFeatureState.NORMAL;
                if (this.timer_) window.clearTimeout(this.timer_);
                this.timer_ = window.setTimeout(this.timeOut_.bind(this), this.ttl_);
                this.changed();
            }
        }, {
            key: "timeOut_",
            value: function timeOut_() {
                this.timer_ = 0;
                this.state_ = exports.GpsFeatureState.EXPIRED;
            }
        }, {
            key: "focus",
            value: function focus() {
                throw new Error('Not implemented.');
            }
        }, {
            key: "unfocus",
            value: function unfocus() {
                throw new Error('Not implemented.');
            }
        }, {
            key: "follow",
            value: function follow() {
                this.isFollowed_ = true;
            }
        }, {
            key: "unfollow",
            value: function unfollow() {
                this.isFollowed_ = false;
            }
        }, {
            key: "isFocused",
            value: function isFocused() {
                throw new Error('Not implemented.');
            }
        }, {
            key: "isFollowed",
            value: function isFollowed() {
                return this.isFollowed_;
            }
        }]);

        return GpsFeature;
    }(DynamicFeature_1.default);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GpsFeature;
});