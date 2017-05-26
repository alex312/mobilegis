import { Injectable, Inject } from '@angular/core';

import { ApiClientService, Format } from '../../../base';
import { Alarm } from '../data/alarm';
// import {CableService} from './cable.service';
import { Alarm_Config, IAlarmConfig } from './config';
// import { Config } from '../../../config';
import { TrafficEnvService } from '../../traffic-env';

@Injectable()
export class AlarmService {
    private _typeAlarms: { [type: string]: Alarm[] } = {};
    private _day: number = 1;
    constructor(private _apiClient: ApiClientService, private _trafficEnvService: TrafficEnvService, @Inject(Alarm_Config) private _alarmConfig: IAlarmConfig) {
        this._day = _alarmConfig.day;
    }

    Refresh() {
        var start = new Date(Date.now() - this._day * 24 * 60 * 60 * 1000);
        let promise = this._apiClient.get(`${this._alarmConfig.webapi.alarm}?start=${Format.FormatDate(start)}&&rising=${true}`);
        promise.then(p => {
            for (var type in this._typeAlarms) {
                this._typeAlarms[type].splice(0, this._typeAlarms[type].length);
            }
            p.forEach(q => {
                this.setAlarmDesc(q);
            });
            p.sort(function (a, b) {
                a.EventTime - b.EventTime;
            });
            p.forEach(q => {
                if (!this._typeAlarms[q.RuleType])
                    this._typeAlarms[q.RuleType] = [];
                this._typeAlarms[q.RuleType].push(q);
            });
        });
        return promise;
    }
    private setAlarmDesc(alarm: Alarm) {
        let region = this._trafficEnvService.GetTrafficEnv(alarm.RegionId);
        alarm.RegionName = region ? region.Name : '';
        alarm.EventTimeDisplay = Format.FormatDate(alarm.EventTime);
    }
    GetAlarmsByType(type: number) {
        if (this._typeAlarms && this._typeAlarms[type])
            return this._typeAlarms[type];
        else
            return [];
    }
}


let alarmServiceFactory = (apiClient: ApiClientService, trafficEnvService: TrafficEnvService, alarmConfig: IAlarmConfig): AlarmService => {
    return new AlarmService(apiClient, trafficEnvService, alarmConfig);
}

export const alarmServiceProvider = {
    provide: AlarmService,
    useFactory: alarmServiceFactory,
    deps: [ApiClientService, TrafficEnvService, Alarm_Config]
}