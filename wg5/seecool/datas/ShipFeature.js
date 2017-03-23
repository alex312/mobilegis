"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "./DynamicFeature"], function (require, exports, DynamicFeature_1) {
    "use strict";

    var ShipFeature = function (_DynamicFeature_1$def) {
        _inherits(ShipFeature, _DynamicFeature_1$def);

        function ShipFeature(owner) {
            _classCallCheck(this, ShipFeature);

            var _this = _possibleConstructorReturn(this, (ShipFeature.__proto__ || Object.getPrototypeOf(ShipFeature)).call(this, {}));

            _this.owner_ = owner;
            _this.focusing_ = false;
            _this.following_ = false;
            return _this;
        }

        _createClass(ShipFeature, [{
            key: "focus",
            value: function focus() {
                this.owner_.focusFeature(this);
                this.focusing_ = true;
            }
        }, {
            key: "unfocus",
            value: function unfocus() {
                this.focusing_ = false;
                this.owner_.unfocusFeature(this);
            }
        }, {
            key: "follow",
            value: function follow() {
                this.owner_.followFeature(this);
                this.following_ = true;
            }
        }, {
            key: "unfollow",
            value: function unfollow() {
                this.following_ = false;
                this.owner_.unfollowFeature(this);
            }
        }, {
            key: "getGeometry",
            value: function getGeometry() {
                return this.owner_.getFeatureGeometry(this);
            }
        }, {
            key: "getData",
            value: function getData() {
                return this.owner_.getFeatureData(this);
            }
        }, {
            key: "isFocused",
            value: function isFocused() {
                return this.focusing_;
            }
        }, {
            key: "isFollowed",
            value: function isFollowed() {
                return this.following_;
            }
        }]);

        return ShipFeature;
    }(DynamicFeature_1.default);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipFeature;
});