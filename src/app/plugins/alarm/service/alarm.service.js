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
var base_1 = require('../../../base');
// import {CableService} from './cable.service';
var config_1 = require('./config');
var config_2 = require('../../../config');
var traffic_env_1 = require('../../traffic-env');
var AlarmService = (function () {
    function AlarmService(_apiClient, _trafficEnvService, _alarmConfig) {
        this._apiClient = _apiClient;
        this._trafficEnvService = _trafficEnvService;
        this._typeAlarms = {};
        this._day = 1;
        this._day = _alarmConfig.Day;
    }
    AlarmService.prototype.Refresh = function () {
        var _this = this;
        var start = new Date(Date.now() - this._day * 24 * 60 * 60 * 1000);
        var promise = this._apiClient.get(config_2.Config.Plugins.Alarm.AlarmUrl + "?start=" + base_1.Format.FormatDate(start) + "&&rising=" + true);
        promise.then(function (p) {
            for (var type in _this._typeAlarms) {
                _this._typeAlarms[type].splice(0, _this._typeAlarms[type].length);
            }
            p.forEach(function (q) {
                _this.setAlarmDesc(q);
            });
            p.sort(function (a, b) {
                a.EventTime - b.EventTime;
            });
            p.forEach(function (q) {
                if (!_this._typeAlarms[q.RuleType])
                    _this._typeAlarms[q.RuleType] = [];
                _this._typeAlarms[q.RuleType].push(q);
            });
        });
        return promise;
    };
    AlarmService.prototype.setAlarmDesc = function (alarm) {
        var region = this._trafficEnvService.GetTrafficEnv(alarm.RegionId);
        alarm.RegionName = region ? region.Name : '';
        alarm.EventTimeDisplay = base_1.Format.FormatDate(alarm.EventTime);
    };
    AlarmService.prototype.GetAlarmsByType = function (type) {
        if (this._typeAlarms && this._typeAlarms[type])
            return this._typeAlarms[type];
        else
            return [];
    };
    AlarmService = __decorate([
        core_1.Injectable(),
        __param(2, core_1.Inject(config_1.Alarm_Config)), 
        __metadata('design:paramtypes', [base_1.ApiClientService, traffic_env_1.TrafficEnvService, Object])
    ], AlarmService);
    return AlarmService;
}());
exports.AlarmService = AlarmService;
