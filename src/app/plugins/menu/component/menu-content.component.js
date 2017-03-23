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
var ionic_angular_1 = require('ionic-angular');
var menu_util_1 = require('../service/menu-util');
var MenuContentComponent = (function () {
    function MenuContentComponent(_navCtrl) {
        this._navCtrl = _navCtrl;
        // TODO:先作为menu实现，在从中将menu item的部分重构出去
        this._items = [];
        this.iconSize = "2";
        this.iconSize = menu_util_1.MenuUtil.SelectIconSize();
    }
    Object.defineProperty(MenuContentComponent.prototype, "items", {
        set: function (val) {
            menu_util_1.MenuUtil.GroupingWithColCount(val, this._items, 2);
        },
        enumerable: true,
        configurable: true
    });
    MenuContentComponent.prototype.openPage = function (cell) {
        this._navCtrl.push(cell.Page, cell.Params);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array), 
        __metadata('design:paramtypes', [Array])
    ], MenuContentComponent.prototype, "items", null);
    MenuContentComponent = __decorate([
        core_1.Component({
            selector: 'menu-content',
            templateUrl: 'build/plugins/menu/component/menu-content.component.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController])
    ], MenuContentComponent);
    return MenuContentComponent;
}());
exports.MenuContentComponent = MenuContentComponent;
