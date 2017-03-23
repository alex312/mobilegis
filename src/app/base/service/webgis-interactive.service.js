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
var WebGISInteractiveService = (function () {
    // TODO：该文件放在plugin/map/service中时，shipsummarycomponent会提示构造函数找不到参数，放在base/service中没有问题。可能是gulp打包问题。
    function WebGISInteractiveService() {
        this.callbackHandlers = {};
        if (!window['invokeCallback']) {
            window['invokeCallback'] = this.onCallback.bind(this);
        }
    }
    WebGISInteractiveService.prototype.callWebGISAction = function (actionName) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        var webgisInterface = this.getWebGISInterface();
        webgisInterface && webgisInterface[actionName] && webgisInterface[actionName].apply(webgisInterface, data);
    };
    WebGISInteractiveService.prototype.callWebGISAction2 = function (actionName1, actionName2) {
        var data = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            data[_i - 2] = arguments[_i];
        }
        var webgisInterface = this.getWebGISInterface();
        webgisInterface && webgisInterface[actionName1] && webgisInterface[actionName1][actionName2] && (_a = webgisInterface[actionName1])[actionName2].apply(_a, data);
        var _a;
    };
    WebGISInteractiveService.prototype.getWebGISInterface = function () {
        return window['webgis5'];
    };
    WebGISInteractiveService.prototype.registCallback = function (name, callback) {
        this.callbackHandlers[name] = callback;
    };
    WebGISInteractiveService.prototype.unregistCallback = function (name, callback) {
        // let callbackIndex = this.callbackHandlers[name].indexOf(callback);
        delete this.callbackHandlers[name];
    };
    WebGISInteractiveService.prototype.onCallback = function (e) {
        var name = e.Fun;
        var callback = this.callbackHandlers[name];
        if (callback)
            callback(e.Data);
    };
    WebGISInteractiveService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], WebGISInteractiveService);
    return WebGISInteractiveService;
}());
exports.WebGISInteractiveService = WebGISInteractiveService;
