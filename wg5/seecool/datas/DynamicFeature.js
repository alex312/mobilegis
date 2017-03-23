"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";

    var DynamicFeature = function (_ol$Feature) {
        _inherits(DynamicFeature, _ol$Feature);

        function DynamicFeature(option) {
            _classCallCheck(this, DynamicFeature);

            return _possibleConstructorReturn(this, (DynamicFeature.__proto__ || Object.getPrototypeOf(DynamicFeature)).call(this, option));
        }

        _createClass(DynamicFeature, [{
            key: "die",
            value: function die() {
                this.dispatchEvent("die");
            }
        }, {
            key: "focus",
            value: function focus() {}
        }, {
            key: "unfocus",
            value: function unfocus() {}
        }, {
            key: "follow",
            value: function follow() {}
        }, {
            key: "unfollow",
            value: function unfollow() {}
        }, {
            key: "getData",
            value: function getData() {}
        }, {
            key: "getGeometry",
            value: function getGeometry() {
                return ol.Feature.prototype.getGeometry.apply(this, arguments);
            }
        }, {
            key: "setGeometry",
            value: function setGeometry() {
                return ol.Feature.prototype.setGeometry.apply(this, arguments);
            }
        }]);

        return DynamicFeature;
    }(ol.Feature);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DynamicFeature;
});