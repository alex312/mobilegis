import {OpaqueToken} from '@angular/core';

import {Group} from '../data/group';

export interface IAlarmConfig {
    Day: number;
    Groups: Group[];
}

export let Alarm_Config = new OpaqueToken('alarm.config');