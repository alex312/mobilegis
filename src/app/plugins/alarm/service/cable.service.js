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
var base_1 = require('../../../base');
var config_1 = require('../../../config');
var CableService = (function () {
    function CableService(_apiClient) {
        this._apiClient = _apiClient;
        this._idCable = {};
    }
    CableService.prototype.getCables = function () {
        return this._apiClient.get(config_1.Config.Plugins.Alarm.CableUrl);
    };
    CableService.prototype.Init = function () {
        var _this = this;
        var promise = this.getCables();
        promise.then(function (p) {
            var dic = {};
            p.forEach(function (q) {
                dic[q.Id] = q;
            });
            _this._idCable = dic;
        });
        return promise;
    };
    CableService.prototype.GetCable = function (id) {
        if (this._idCable)
            return this._idCable[id];
        else
            return undefined;
    };
    CableService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [base_1.ApiClientService])
    ], CableService);
    return CableService;
}());
exports.CableService = CableService;
