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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./NotifiableObject"], function (require, exports, NotifiableObject_1) {
    "use strict";
    var Feature = (function (_super) {
        __extends(Feature, _super);
        function Feature(entity) {
            var _this = _super.call(this) || this;
            _this.entity_ = null;
            _this._NEW_ARCH_LAYER_ = true;
            _this.entity_ = entity;
            _this.hovered = _this.focused = false;
            return _this;
        }
        Feature.prototype.destroy = function () {
            this.trigger("die");
            this.entity_ = null;
        };
        Object.defineProperty(Feature.prototype, "id", {
            get: function () {
                return this.entity_.id;
            },
            enumerable: true,
            configurable: true
        });
        Feature.prototype.focus = function (piece) {
            this.focused = !!piece;
        };
        Feature.prototype.hover = function (piece) {
            this.hovered = !!piece;
        };
        Object.defineProperty(Feature.prototype, "entity", {
            get: function () {
                return this.entity_;
            },
            enumerable: true,
            configurable: true
        });
        return Feature;
    }(NotifiableObject_1.default));
    __decorate([
        NotifiableObject_1.default.property()
    ], Feature.prototype, "hovered", void 0);
    __decorate([
        NotifiableObject_1.default.property()
    ], Feature.prototype, "focused", void 0);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Feature;
});
