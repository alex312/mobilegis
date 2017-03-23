"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports"], function (require, exports) {
    "use strict";

    var Design;
    (function (Design) {
        var Types;
        var Enums;
        var NameSpaces;
        Types = [{
            Name: "BaseType",
            Names: ["?", "undifined", "null", "value"]
        }, {
            Name: "Location",
            Names: ["AliasName1", "AliasName2", "AttachmentGroupKey", "Comments", "DrawingStyle", "FullName", "Geomatics", "Id", "Name", "PortAreaId", "TrafficEnvType"],
            Labels: []
        }, {
            Name: "Geomatics",
            Names: ["ShapeType", "Points"],
            Labels: [],
            Types: ["ShapeType.Names", "Array<string>"]
        }, {
            Name: "PlotInfo",
            Names: ["Id", "UserId", "Name", "Geomatics", "Style"],
            Labels: []
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
            Names: ["Speed_Duration_Region", "Overtaking_Region", "Uturn_Region", "ShipDensity_Region", "Retrograde_Region", "Berth_Region", "Speed_SlowDown_Region", "Enter_Region", "Leave_Region", "CPA_Region", "In_Region", "CPA_Ship_Id", "DraggingAnchor_Ship_Id", "Speed_Duration_Ship_Id", "Speed_Duration_Region_Berth_ZhouShan", "Speed_Duration_Region_First_ZhouShan", "Speed_Duration_Region_Second_ZhouShan", "Speed_Duration_Region_Third_ZhouShan"],
            Values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
            Labels: ["速度保持区域", "超越区域", "禁止掉头区域", "船舶密集区域", "逆行区域", "锚泊区域", "减速区域", "进入区域", "离开区域", "CPA区域", "In区域", "CPA船舶ID", "拖锚船ID", "速度保持船ID", "锚泊报警区", "一级预警区", "二级预警区", "三级预警区"]
        }, {
            Name: "ProcessState",
            Names: ["UnRead", "Read", "Precessed"],
            Values: [0, 1, 2],
            Labels: ["未阅读", "已读", "已处理"]
        }];

        var ScopeManager = function () {
            function ScopeManager(namespace) {
                _classCallCheck(this, ScopeManager);

                namespace = namespace || "";
                this.namespace_ = namespace;
            }

            _createClass(ScopeManager, [{
                key: "getV1Type",
                value: function getV1Type(path) {
                    var rege = new RegExp("^/").test(path);
                    if (rege) {
                        path = this.namespace_ + "/" + path;
                    }
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = Types[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var typei = _step.value;

                            if (typei.Name == path) return typei;
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    return null;
                }
            }, {
                key: "getV1Enum",
                value: function getV1Enum(path) {
                    var rege = new RegExp("^/").test(path);
                    if (rege) {
                        path = this.namespace_ + "/" + path;
                    }
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = Enums[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var enumi = _step2.value;

                            if (enumi.Name == path) return enumi;
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }

                    return null;
                }
            }, {
                key: "getEnumObject",
                value: function getEnumObject(path) {
                    var t = this.getV1Enum(path);
                    if (!t) return null;
                    var r = {};
                    for (var i = 0; i < t.Names.length; i++) {
                        r[t.Names[i]] = t.Values[i];
                    }
                    return r;
                }
            }, {
                key: "newObject",
                value: function newObject(path, V) {
                    var t = this.getV1Type(path);
                    if (!t) return null;
                    var r = {};
                    for (var i = 0; i < t.Names.length; i++) {
                        r[t.Names[i]] = V[i];
                    }
                    return r;
                }
            }, {
                key: "guessV1Type",
                value: function guessV1Type(A) {
                    var v1type = [];
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = A[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var i = _step3.value;

                            for (var j in i) {
                                if (!(j in v1type)) v1type.push(j);
                            }
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }
                }
            }]);

            return ScopeManager;
        }();

        Design.ScopeManager = ScopeManager;
    })(Design = exports.Design || (exports.Design = {}));
});