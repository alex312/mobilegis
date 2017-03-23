"use strict";
var TrafficEnvTypes = (function () {
    function TrafficEnvTypes() {
    }
    TrafficEnvTypes.GetTypeName = function (value) {
        var index = this._trafficEnvTypes.Values.indexOf(value);
        if (index >= 0)
            return this._trafficEnvTypes.Names[index];
        else
            return '';
    };
    TrafficEnvTypes.GetTypeLabel = function (value) {
        var index = this._trafficEnvTypes.Values.indexOf(value);
        if (index >= 0)
            return this._trafficEnvTypes.Labels[index];
        else
            return value;
    };
    TrafficEnvTypes._trafficEnvTypes = {
        Names: ["Obstruction", "Berth", "Lane", "LaneCenterLine", "Anchorage", "Reportingline", "Jurisdiction", "OnBoardArea", "NavigateAssist", "ShallowArea", "PortArea", "ShippingLine", "RefPoint", "Bridge", "ShipGate", "Harbor", "Basin", "RestrictedArea", "ResponsibilityArea", "AttentionArea", "InWaterWorkArea", "Cable", "CoreProtectArea", "FirstWarningArea", "SecondWarningArea", "ThirdWarningArea", "SecondWarningContactArea", "zengbuqu", "birangqu"],
        Values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
        Labels: ["碍航物", "泊位", "航道", "航道中心线", "锚地", "VTS报告线", "VTS管辖区", "引航员登船区", "助航设施", "浅水区", "港区", "推荐航线", "参考点", "桥梁", "船闸", "港口", "港池", "限制区", "责任区", "关注区域", "水工作业区", "海缆", "核心保护区", "一级预警区", "二级预警区", "三级预警区", "二级预警联络区", "增补区", "避让区"]
    };
    return TrafficEnvTypes;
}());
exports.TrafficEnvTypes = TrafficEnvTypes;
