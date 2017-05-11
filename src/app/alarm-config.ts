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
        { Type: 9, Name: '避碰预警', Alarms: [], Hidden: true },
        { Type: 13, Name: '速度异常', Alarms: [], Hidden: true },
    ]
};

//  ===========   0   ===========
//         [BusinessType(true, RuleTarget.Region)]
//         [Description("封闭区域船舶速度异常")]
//         [StatusEvent]
//         Speed_Duration_Region,
//  ===========   1   ===========
//         [BusinessType(true, RuleTarget.Region)]
//         [Description("封闭区域船舶追越")]
//         [StatusEvent(false)]
//         Overtaking_Region,
//  ===========   2   ===========
//         [BusinessType(true, RuleTarget.Region)]
//         [Description("封闭区域船舶掉头")]
//         [StatusEvent(false)]
//         Uturn_Region,
//  ===========   3   ===========
//         [BusinessType(true, RuleTarget.Region)]
//         [Description("封闭区域船舶密度超标")]
//         [StatusEvent]
//         ShipDensity_Region,
//  ===========   4   ===========
//         [BusinessType(true, RuleTarget.Region)]
//         [Description("封闭区域船舶逆行")]
//         [StatusEvent]
//         Retrograde_Region,
//  ===========   5   ===========
//         [BusinessType(true, RuleTarget.Region)]
//         [Description("封闭区域船舶锚泊")]
//         [StatusEvent]
//         Berth_Region,
//  ===========   6   ===========
//         [BusinessType(true, RuleTarget.Region)]
//         [Description("封闭区域船舶减速")]
//         [StatusEvent]
//         Speed_SlowDown_Region,
//  ===========   7   ===========
//         [BusinessType(true, RuleTarget.Region)]
//         [Description("封闭区域船舶禁止进入")]
//         [InstantanesouEvent]
//         Enter_Region,
//  ===========   8   ===========
//         [BusinessType(true, RuleTarget.Region)]        
//         [Description("封闭区域船舶禁止离开")]
//         [InstantanesouEvent]
//         Leave_Region,
//  ===========   9   ===========
//         [BusinessType(true, RuleTarget.Region)]
//         [Description("封闭区域船舶避碰（CPA）")]
//         [StatusEvent]
//         CPA_Region,
//  ===========   10   ===========
//         [BusinessType(true, RuleTarget.Region)]
//         [Description("封闭区域禁止船舶停留")]
//         [StatusEvent]
//         In_Region,
//  ===========   11   ===========
//         [BusinessType(true, RuleTarget.Ship)]
//         [Description("船舶避碰（CPA）")]
//         [StatusEvent]
//         CPA_Ship_Id,
//  ===========   12   ===========
//         [BusinessType(true, RuleTarget.Ship)]
//         [Description("走锚")]
//         [StatusEvent]
//         DraggingAnchor_Ship_Id,
//  ===========   13   ===========
//         [BusinessType(true, RuleTarget.Ship)]
//         [Description("船舶速度异常")]
//         [StatusEvent]
//         Speed_Duration_Ship_Id,
//  ===========   14   ===========
//         [BusinessType(true, RuleTarget.Region)]
//         [Description("雷达目标未开启AIS")]
//         [StatusEvent]
//         SignalFusion_RadarHasNoAIS_Region_Union,