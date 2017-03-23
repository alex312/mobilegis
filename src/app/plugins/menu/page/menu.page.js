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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var config_1 = require('../service/config');
var menu_util_1 = require('../service/menu-util');
var MenuPage = (function () {
    function MenuPage(_navCtrl, _menuConfig) {
        this._navCtrl = _navCtrl;
        this.Children = [];
        this.IconSize = '2';
        this.Current = _menuConfig.Menu;
        menu_util_1.MenuUtil.Grouping(this.Current.SubMenuItems, this.Children);
        this.IconSize = menu_util_1.MenuUtil.SelectIconSize();
    }
    MenuPage.prototype.ngOnInit = function () { };
    MenuPage.prototype.OpenPage = function (item) {
        this._navCtrl.push(item.Page, item);
    };
    MenuPage = __decorate([
        core_1.Component({
            templateUrl: 'build/plugins/menu/page/menu-item.page.html'
        }),
        __param(1, core_1.Inject(config_1.Menu_Config)), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, Object])
    ], MenuPage);
    return MenuPage;
}());
exports.MenuPage = MenuPage;
