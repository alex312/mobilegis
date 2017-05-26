import { Component, OnInit, Inject } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular';

import { Group } from '../data/group';
import { AlarmService } from '../service/alarm.service';
import { Alarm_Config, IAlarmConfig } from '../service/config';
import { TrafficEnvService } from '../../traffic-env';

@Component({
    templateUrl: './alarm.page.html',
})
export class AlarmPage implements OnInit {
    private _loading: Loading;
    Groups: Group[] = [];
    constructor(private _loadingCtrl: LoadingController, private _trafficEnvService: TrafficEnvService, private _alarmService: AlarmService, @Inject(Alarm_Config) _alarmConfig: IAlarmConfig) {
        this.Groups = _alarmConfig.groups;
    }
    ngOnInit() {
        this.startLoading();
        this._trafficEnvService.Init().then(function () {
            this.queryAlarm().then(this.stopLoading.bind(this));
        }.bind(this)).catch(errMsg => {
            this.stopLoading();
            console.log(errMsg);
        });
    }
    private queryAlarm() {
        let promise = this._alarmService.Refresh();
        promise.then(p => {
            this.Groups.forEach(group => {
                group.Alarms.splice(0, group.Alarms.length);
                this._alarmService.GetAlarmsByType(group.Type).forEach(alarm => {
                    group.Alarms.push(alarm);
                });
            });

        });
        return promise;
    }
    private startLoading() {
        this._loading = this._loadingCtrl.create({
            content: '请稍后...',
            dismissOnPageChange: false
        });
        this._loading.present();
    }
    private stopLoading() {
        this._loading.dismiss();
    }
    Refresh(refresher) {
        this.queryAlarm().then(function () {
            refresher.complete();
        }).catch(errMsg => {
            refresher.complete();
            console.log(errMsg);
        });
    }
}