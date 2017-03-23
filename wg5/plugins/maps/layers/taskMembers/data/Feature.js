"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./NotifiableObject"], function (require, exports, NotifiableObject_1) {
    "use strict";

    var Feature = function (_NotifiableObject_1$d) {
        _inherits(Feature, _NotifiableObject_1$d);

        function Feature(entity) {
            _classCallCheck(this, Feature);

            var _this = _possibleConstructorReturn(this, (Feature.__proto__ || Object.getPrototypeOf(Feature)).call(this));

            _this.entity_ = null;
            _this._NEW_ARCH_LAYER_ = true;
            _this.entity_ = entity;
            _this.hovered = _this.focused = false;
            return _this;
        }

        _createClass(Feature, [{
            key: "destroy",
            value: function destroy() {
                this.trigger("die");
                this.entity_ = null;
            }
        }, {
            key: "focus",
            value: function focus(piece) {
                this.focused = !!piece;
            }
        }, {
            key: "hover",
            value: function hover(piece) {
                this.hovered = !!piece;
            }
        }, {
            key: "id",
            get: function get() {
                return this.entity_.id;
            }
        }, {
            key: "entity",
            get: function get() {
                return this.entity_;
            }
        }]);

        return Feature;
    }(NotifiableObject_1.default);

    __decorate([NotifiableObject_1.default.property()], Feature.prototype, "hovered", void 0);
    __decorate([NotifiableObject_1.default.property()], Feature.prototype, "focused", void 0);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Feature;
});