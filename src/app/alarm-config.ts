import { IAlarmConfig } from './plugins/alarm';

export const AlarmConfig: IAlarmConfig = {
    // Day: 3,
    // Groups: [
    //     { Type: 14, Name: '锚泊报警', Alarms: [], Hidden: false },
    //     { Type: 15, Name: '一级预警', Alarms: [], Hidden: true },
    //     { Type: 16, Name: '二级预警', Alarms: [], Hidden: true },
    //     { Type: 17, Name: '三级预警', Alarms: [], Hidden: true },
    // ]
    Day: 1,
    Groups: [
        { Type: 0, Name: '超速报警', Alarms: [], Hidden: false },
        { Type: 8, Name: '越界预警', Alarms: [], Hidden: true },
        { Type: 9, Name: '避碰预警', Alarms: [], Hidden: true }
    ]
};