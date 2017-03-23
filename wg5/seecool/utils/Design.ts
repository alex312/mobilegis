export module Design {
    interface i_V1TypeType {Name:string,Commont?:string,Label?:string,Names?:Array<string>,Labels?:Array<string>,Types?:Array<string>,Commonts?:Array<string>
    }

    interface i_V1EnumType {Name:string,Names?:Array<string>,Labels?:Array<string>,Values?:Array<any>,Commonts?:Array<string>
    }

    var Types:Array<i_V1TypeType>;
    var Enums:Array<i_V1EnumType>;
    var NameSpaces:Array<string>;

    Types = [{
        Name: "BaseType",
        Names: ["?", "undifined", "null", "value"],
    }, {
        Name: "Location",
        Names: ["AliasName1", "AliasName2", "AttachmentGroupKey", "Comments", "DrawingStyle", "FullName", "Geomatics", "Id", "Name", "PortAreaId", "TrafficEnvType"],
        Labels: [],
    }, {
        Name: "Geomatics",
        Names: ["ShapeType", "Points"],
        Labels: [],
        Types: ["ShapeType.Names", "Array<string>"]

    }, {
        Name: "PlotInfo",
        Names: ["Id", "UserId", "Name", "Geomatics", "Style"],
        Labels: [],
    }];

    Enums = [{
        Name: "ShapeType",
        Names: ["Point", "Line", "PolyLine", "Rectanlge", "Circle", "Polygon"],
        Values: [0, 1, 2, 3, 4, 5],
        Labels: ["点", "直线", "折线", "矩形", "圆", "多边形"]
    }, {
        Name: "TrafficEnvType",
        Names: ["Obstruction", "Berth", "Lane", "LaneCenterLine", "Anchorage", "Reportingline", "Jurisdiction", "OnBoardArea", "NavigateAssist", "ShallowArea", "PortArea", "ShippingLine", "RefPoint", "Bridge", "ShipGate", "Harbor", "Basin", "RestrictedArea", "ResponsibilityArea", "AttentionArea", "InWaterWorkArea", "Cable", "CoreProtectArea", "FirstWarningArea", "SecondWarningArea", "ThirdWarningArea", "SecondWarningContactArea", "zengbuqu", "birangqu"],
        Values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
        Labels: ["碍航物", "泊位", "航道", "航道中心线", "锚地", "VTS报告线", "VTS管辖区", "引航员登船区", "助航设施", "浅水区", "港区", "推荐航线", "参考点", "桥梁", "船闸", "港口", "港池", "限制区", "责任区", "关注区域", "水工作业区", "海缆", "核心保护区", "一级预警区", "二级预警区", "三级预警区", "二级预警联络区", "增补区", "避让区"]
    }, {
        Name: "RitsRuleType",
        Names: [
            "Speed_Duration_Region",
            "Overtaking_Region",
            "Uturn_Region",
            "ShipDensity_Region",
            "Retrograde_Region",
            "Berth_Region",
            "Speed_SlowDown_Region",
            "Enter_Region",
            "Leave_Region",
            "CPA_Region",
            "In_Region",
            "CPA_Ship_Id",
            "DraggingAnchor_Ship_Id",
            "Speed_Duration_Ship_Id",
            "Speed_Duration_Region_Berth_ZhouShan",
            "Speed_Duration_Region_First_ZhouShan",
            "Speed_Duration_Region_Second_ZhouShan",
            "Speed_Duration_Region_Third_ZhouShan"
        ],
        Values: [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17
        ],
        Labels: [
            "速度保持区域", "超越区域", "禁止掉头区域", "船舶密集区域", "逆行区域", "锚泊区域", "减速区域", "进入区域", "离开区域", "CPA区域", "In区域", "CPA船舶ID", "拖锚船ID", "速度保持船ID", "锚泊报警区", "一级预警区", "二级预警区", "三级预警区"
        ]
    }, {
        Name: "ProcessState",
        Names: ["UnRead", "Read", "Precessed"],
        Values: [0, 1, 2],
        Labels: ["未阅读", "已读", "已处理"]
    }]

    export class ScopeManager {
        constructor(namespace) {
            namespace = namespace || "";
            this.namespace_ = namespace;
        }

        private namespace_;

        public getV1Type(path):i_V1TypeType {
            var rege = new RegExp("^/").test(path)
            if (rege) {
                path = this.namespace_ + "/" + path;
            }
            for (var typei of Types) {
                if (typei.Name == path)return typei;
            }
            return null;
        }

        public getV1Enum(path):i_V1EnumType {
            var rege = new RegExp("^/").test(path)
            if (rege) {
                path = this.namespace_ + "/" + path;
            }
            for (var enumi of Enums) {
                if (enumi.Name == path)return enumi;
            }
            return null;
        }

        public getEnumObject(path) {
            var t = this.getV1Enum(path);
            if (!t)return null;
            var r = {};
            for (var i = 0; i < t.Names.length; i++) {
                r[t.Names[i]] = t.Values[i];
            }
            return r;
        }

        public newObject(path, V) {
            var t = this.getV1Type(path);
            if (!t)return null;
            var r = {};
            for (var i = 0; i < t.Names.length; i++) {
                r[t.Names[i]] = V[i];
            }
            return r;
        }

        public guessV1Type(A:Array<any>) {
            var v1type = [];
            for (var i of A) {
                for (var j in i) {
                    if (!(j in v1type))v1type.push(j);
                }
            }
        }
    }
}
