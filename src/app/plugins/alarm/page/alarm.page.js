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
var group_component_1 = require('../component/group.component');
var alarm_service_1 = require('../service/alarm.service');
var config_1 = require('../service/config');
var traffic_env_1 = require('../../traffic-env');
var AlarmPage = (function () {
    function AlarmPage(_loadingCtrl, _trafficEnvService, _alarmService, _alarmConfig) {
        this._loadingCtrl = _loadingCtrl;
        this._trafficEnvService = _trafficEnvService;
        this._alarmService = _alarmService;
        this.Groups = [];
        this.Groups = _alarmConfig.Groups;
    }
    AlarmPage.prototype.ngOnInit = function () {
        var _this = this;
        this.startLoading();
        this._trafficEnvService.Init().then(function () {
            this.queryAlarm().then(this.stopLoading.bind(this));
        }.bind(this)).catch(function (errMsg) {
            _this.stopLoading();
            console.log(errMsg);
        });
    };
    AlarmPage.prototype.queryAlarm = function () {
        var _this = this;
        var promise = this._alarmService.Refresh();
        promise.then(function (p) {
            _this.Groups.forEach(function (group) {
                group.Alarms.splice(0, group.Alarms.length);
                _this._alarmService.GetAlarmsByType(group.Type).forEach(function (alarm) {
                    group.Alarms.push(alarm);
                });
            });
        });
        return promise;
    };
    AlarmPage.prototype.startLoading = function () {
        this._loading = this._loadingCtrl.create({
            content: '请稍后...',
            dismissOnPageChange: false
        });
        this._loading.present();
    };
    AlarmPage.prototype.stopLoading = function () {
        this._loading.dismiss();
    };
    AlarmPage.prototype.Refresh = function (refresher) {
        this.queryAlarm().then(function () {
            refresher.complete();
        }).catch(function (errMsg) {
            refresher.complete();
            console.log(errMsg);
        });
    };
    AlarmPage = __decorate([
        core_1.Component({
            templateUrl: 'build/plugins/alarm/page/alarm.page.html',
            providers: [alarm_service_1.AlarmService, traffic_env_1.TrafficEnvService],
            directives: [group_component_1.GroupComponent]
        }),
        __param(3, core_1.Inject(config_1.Alarm_Config)), 
        __metadata('design:paramtypes', [ionic_angular_1.LoadingController, traffic_env_1.TrafficEnvService, alarm_service_1.AlarmService, Object])
    ], AlarmPage);
    return AlarmPage;
}());
exports.AlarmPage = AlarmPage;
