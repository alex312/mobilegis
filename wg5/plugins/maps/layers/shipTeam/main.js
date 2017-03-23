"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = undefined && undefined.__param || function (paramIndex, decorator) {
    return function (target, key) {
        decorator(target, key, paramIndex);
    };
};
define(["require", "exports", "knockout", "../../../../seecool/plugins/Plugins", "seecool/StaticLib", "./datas/VesselGroupApi", "./datas/VesselGroupMemberApi", "./uis/ShipTeamInfoSet", "./uis/ShipInfoSet", "../plotUi/uis/Alarm", "./SidePanel"], function (require, exports, ko, Plugins_1, StaticLib_1, VesselGroupApi_1, VesselGroupMemberApi_1, ShipTeamInfoSet_1, ShipInfoSet_1, Alarm_1, SidePanel_1) {
    "use strict";

    var ShipTeamPlugin = function () {
        function ShipTeamPlugin(config, user, detailViewer, map, frame, shipLayer) {
            var _this = this;

            _classCallCheck(this, ShipTeamPlugin);

            this.shipTeam_ = [];
            this.config_ = config;
            this.map_ = map || {};
            this.user_ = user;
            this.convert_ = new StaticLib_1.Convert();
            this.convert_.add("VesselGroupDTO", "VesselGroup", function (v) {
                return v;
            });
            this.vesselGroupApi_ = new VesselGroupApi_1.default(this.config_.shipTeamGroupApi || "api/ShipTeam/Group");
            this.vesselGroupMemberApi_ = new VesselGroupMemberApi_1.default(this.config_.shipTeamItemApi || "api/ShipTeam/Item");
            this.loadData_();
            this.shipLayer_ = shipLayer;
            this.shipTeamList_ = ko.observable();
            var sideView = frame.sideView;
            var toolbar = frame.toolbars['right'];
            toolbar.addButton({
                text: '我的船队',
                icon: 'fa fa-ship',
                click: function click() {
                    sideView.open(new SidePanel_1.default({
                        shipTeamToolAdd: _this.shipTeamToolAdd_.bind(_this),
                        shipTeamList: _this.shipTeamList_
                    }));
                }
            });
        }

        _createClass(ShipTeamPlugin, [{
            key: "updataShipTeamList_",
            value: function updataShipTeamList_() {
                var list = this.shipTeam_.map(function (v) {
                    return this.toViewModelTeam_(v);
                }.bind(this));
                this.shipTeamList_(list);
            }
        }, {
            key: "group_",
            value: function group_() {
                var group;
                if (!this.user_.getSetting()["ShipTeamGroup"]) {
                    var st = this.user_.getSetting();
                    st["ShipTeamGroup"] = [];
                }
                group = this.user_.getSetting()["ShipTeamGroup"];
                return group;
            }
        }, {
            key: "loadData_",
            value: function loadData_() {
                return Promise.resolve().then(function () {
                    return this.vesselGroupApi_.Get();
                }.bind(this)).then(function (pdata) {
                    this.shipTeam_ = pdata.data.filter(function (v) {
                        //if (v.Id <100){this.group().push(v.Id);return true}
                        if (this.group_().indexOf(v.Id) != -1) return true;
                    }.bind(this));
                }.bind(this)).then(function (pdata) {
                    this.updataShipTeamList_();
                }.bind(this));
            }
        }, {
            key: "toViewModelTeam_",
            value: function toViewModelTeam_(t) {
                return {
                    id: 'shipTeamCollapse' + t.Id,
                    hid: '#shipTeamCollapse' + t.Id,
                    "Name": t.Name,
                    "Target": t,
                    "Members": t.Members.map(function (v) {
                        return this.toViewModelShip_(v);
                    }.bind(this)),
                    teamListClick: this.teamListClick_.bind(this),
                    teamListDelete: this.teamListDelete_.bind(this),
                    shipListAdd: this.shipListAdd_.bind(this)
                };
            }
        }, {
            key: "toViewModelShip_",
            value: function toViewModelShip_(t) {
                return {
                    "LocalName": t.LocalName,
                    Target: t,
                    shipListClick: this.shipListClick_.bind(this),
                    shipListDelete: this.shipListDelete_.bind(this)
                };
            }
        }, {
            key: "shipTeamToolAdd_",
            value: function shipTeamToolAdd_() {
                var workViewInfoSet = new ShipTeamInfoSet_1.default({});
                workViewInfoSet.Show().then(function (pdata) {
                    var v = pdata.data.name;
                    var vesselGroup = {
                        "Id": 0,
                        "Name": v,
                        "GroupType": 0,
                        "Param": "",
                        "Members": []
                    };
                    return this.vesselGroupApi_.Post(vesselGroup);
                }.bind(this)).then(function (pdata) {
                    this.group_().push(pdata.data.Id);
                    this.user_.upLoadSetting();
                    return this.loadData_();
                }.bind(this));
            }
        }, {
            key: "teamListClick_",
            value: function teamListClick_(target) {}
        }, {
            key: "teamListDelete_",
            value: function teamListDelete_(target) {
                var alarm = new Alarm_1.default({ message: "是否要删除此船队？" });
                alarm.show().then(function (pdata) {
                    this.vesselGroupApi_.Delete$id(target.Target.Id);
                }.bind(this)).then(function (pdata) {
                    this.group_().splice(this.group_().findIndex(function (v) {
                        if (target.Target.Id == v) return true;
                    }), 1);
                    this.shipTeam_.splice(this.shipTeam_.findIndex(function (v) {
                        if (target.Target == v) return true;
                    }), 1);
                    var list = this.shipTeamList_();
                    list.splice(list.findIndex(function (v) {
                        if (target == v) return true;
                    }), 1);
                    this.shipTeamList_(list);
                }.bind(this));
            }
        }, {
            key: "shipListAdd_",
            value: function shipListAdd_(target) {
                var groupId = target.Target.Id;
                var shipInfoSet = new ShipInfoSet_1.default({});
                shipInfoSet.Show().then(function (pdata) {
                    var mmsi = pdata.data.name;
                    var v = {
                        "Id": 0,
                        "GroupId": groupId,
                        "MMSI": mmsi,
                        "LocalName": mmsi,
                        "EnName": mmsi,
                        "Comment": ""
                    };
                    return this.vesselGroupMemberApi_.Post(v);
                }.bind(this)).then(function (pdata) {}.bind(this)).then(function (pdata) {
                    return this.loadData_();
                }.bind(this));
            }
        }, {
            key: "shipListClick_",
            value: function shipListClick_(target) {
                //this.shipLayer.ShipFocus(target.Target.MMSI);
                this.shipLayer_.RealTimeShipFocus(target.Target.MMSI);
            }
        }, {
            key: "shipListDelete_",
            value: function shipListDelete_(target) {
                var id = target.Target.Id;
                var alarm = new Alarm_1.default({ message: "确定要移除此船舶？" });
                alarm.show().then(function (pdata) {
                    return this.vesselGroupMemberApi_.Delete$id(id);
                }.bind(this)).then(function (pdata) {
                    return this.loadData_();
                }.bind(this));
            }
        }]);

        return ShipTeamPlugin;
    }();

    ShipTeamPlugin = __decorate([__param(1, Plugins_1.inject("user/info")), __param(2, Plugins_1.inject("maps/ui/detailViewer")), __param(3, Plugins_1.inject("maps/map")), __param(4, Plugins_1.inject('maps/ui/uiFrame')), __param(5, Plugins_1.inject("maps/layers/shipsUi"))], ShipTeamPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipTeamPlugin;
});