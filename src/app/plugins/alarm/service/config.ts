import { OpaqueToken } from '@angular/core';

import { Group } from '../data/group';
import { isPresent, isBlank } from '../../../base';

export let Alarm_Config = new OpaqueToken('alarm.config');
export interface IAlarmConfig {
    day: number;
    groups: Group[];
    webapi: IWebapiConfig;
}

interface IWebapiConfig {
    alarm: string;
    cable: string;
}

class Config implements IAlarmConfig {
    private _day: number;
    get day() {
        return this._day;
    }
    set day(value) {
        this._day = value;
    }

    private _groups: Group[];
    get groups() {
        return this._groups;
    }
    set groups(value: Group[]) {
        this._groups = value;
    }

    private _webapi: IWebapiConfig;
    get webapi() {
        return this._webapi;
    }
    set webapi(value: IWebapiConfig) {
        this._webapi = value;
    }
}
var config: Config;

export const getConfig = (): IAlarmConfig => {
    return config;
}
export const setConfig = (newConfig: IAlarmConfig): void => {
    let config = getConfig();
    if (isBlank(config))
        config = new Config();
    if (isPresent(newConfig))
        Object.assign(config, newConfig);
}