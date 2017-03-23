"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ItemButtonComponent = (function () {
    function ItemButtonComponent() {
        this._useIcon = false;
        this.click = new core_1.EventEmitter();
    }
    Object.defineProperty(ItemButtonComponent.prototype, "image", {
        get: function () {
            return this._image;
        },
        set: function (src) {
            this._image = src;
            this.resetBackgroundImage();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemButtonComponent.prototype, "useIcon", {
        get: function () {
            return this._useIcon;
        },
        set: function (flag) {
            this._useIcon = flag;
            this.resetBackgroundImage();
        },
        enumerable: true,
        configurable: true
    });
    ItemButtonComponent.prototype.resetBackgroundImage = function () {
        if (this.useIcon || !this._image || this.image.length === 0)
            this.backImage = "none";
        else
            this.backImage = "url(\"" + this._image + "\")";
    };
    ItemButtonComponent.prototype.onClick = function () {
        this.click.emit(null);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String), 
        __metadata('design:paramtypes', [String])
    ], ItemButtonComponent.prototype, "image", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean), 
        __metadata('design:paramtypes', [Boolean])
    ], ItemButtonComponent.prototype, "useIcon", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ItemButtonComponent.prototype, "iconName", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ItemButtonComponent.prototype, "text", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ItemButtonComponent.prototype, "click", void 0);
    ItemButtonComponent = __decorate([
        core_1.Component({
            selector: 'item-button',
            templateUrl: 'build/base/components/item-button.component.html'
        }), 
        __metadata('design:paramtypes', [])
    ], ItemButtonComponent);
    return ItemButtonComponent;
}());
exports.ItemButtonComponent = ItemButtonComponent;
