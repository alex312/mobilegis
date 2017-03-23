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
var MenuItemPage = (function () {
    function MenuItemPage(_navCtrl, _navParams) {
        this._navCtrl = _navCtrl;
        this._navParams = _navParams;
        this.Children = [];
        this.IconSize = '2';
        this.Current = this._navParams.data;
        menu_util_1.MenuUtil.Grouping(this.Current.SubMenuItems, this.Children);
        this.IconSize = menu_util_1.MenuUtil.SelectIconSize();
    }
    MenuItemPage.prototype.ngOnInit = function () { };
    MenuItemPage.prototype.OpenPage = function (item) {
        this._navCtrl.push(item.Page, item);
    };
    MenuItemPage = __decorate([
        core_1.Component({
            templateUrl: 'build/plugins/menu/page/menu-item.page.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.NavParams])
    ], MenuItemPage);
    return MenuItemPage;
}());
exports.MenuItemPage = MenuItemPage;
