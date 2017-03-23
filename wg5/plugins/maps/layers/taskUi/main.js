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
define(["require", "exports", "fecha", "knockout", "text!./htmls/ObjInfo.html", "../../../../seecool/plugins/Plugins", "./SidePanel", "./TaskSidePanel", "../taskUi/datas/TaskApi", "../../../../seecool/StaticLib", "../../../../seecool/datas/Collection"], function (require, exports, fecha, ko, objInfo, Plugins_1, SidePanel_1, TaskSidePanel_1, TaskApi_1, StaticLib_1, Collection_1) {
    "use strict";

    var TaskPluginUi = function () {
        function TaskPluginUi(config, user, frame, taskMembers, detailViewer) {
            var _this = this;

            _classCallCheck(this, TaskPluginUi);

            this.config_ = config;
            this.user_ = user;
            this.frame_ = frame;
            this.taskMembers_ = taskMembers;
            var sideView = frame.sideView;
            var toolbar = frame.toolbars['right'];
            toolbar.addButton({
                text: '任务列表',
                icon: 'fa fa-tasks',
                click: function click() {
                    var fs = ko.computed(function () {
                        var features = []; //this.task_.layerSource.getFeatures();
                        this.featuresList_().map(function (r) {
                            if (r.CurrentStatus != '已结束') features.push(r);
                        });
                        features.sort(function (a, b) {
                            if (a.Date < b.Date) return 1;else return -1;
                        });
                        return features;
                    }.bind(_this));
                    sideView.open(new SidePanel_1.default({
                        taskdata: fs,
                        taskListClick: _this.taskListClick_.bind(_this)
                    }));
                }
            });
            this.dataSet_ = new Collection_1.CollectionA("dataSet");
            this.dataDTOSet_ = new Collection_1.CollectionA("dataDTOSet");
            this.link_DataSet_DataDTOSet_ = new Collection_1.CollectionLinker(Collection_1.CollectionLinkerOption(this.dataDTOSet_, this.dataSet_, function (v) {
                return true;
            }, this.fromDTO_.bind(this)));
            this.link_DataSet_DataDTOSet_.start();
            this.dataApi_ = new TaskApi_1.default(this.config_.taskApi || "api/task");
            detailViewer.registerSelectFocusEvent("taskMembersFocus", this.featureSelected_.bind(this));
            this.featuresList_ = ko.observableArray();
            this.dataSet_.bind("operated", function (evt, op) {
                switch (op.op) {
                    case "added":
                        op.data.map(function (v) {
                            this.featuresList_.push(v);
                            return v;
                        }.bind(this));
                        break;
                    case "modified":
                        var list = op.data.map(function (v) {
                            this.featuresList_.remove(v);
                            return v;
                        }.bind(this));
                        this.featuresList_.push(list);
                        break;
                    case "removed":
                        op.data.map(function (v) {
                            this.featuresList_.remove(v);
                        }.bind(this));
                        break;
                    case "cleared":
                        this.featuresList_.removeAll();
                        break;
                }
            }.bind(this));
            this.load_();
            setInterval(function () {
                this.load_();
                //this.showTask_(this.dataSet_);
                console.log("加载任务信息");
            }.bind(this), 1 * 60 * 1000);
        }

        _createClass(TaskPluginUi, [{
            key: "load_",
            value: function load_() {
                var user = this.user_.getUser();
                this.dataApi_.Get$executantId_depCode_status_type_startTime_endTime_pageIndex_pageSize('', user.DepCode) //Get$executantId_status_pageIndex_pageSize(user.UserId, '') //Get$executantId(user.UserId)//Get()//
                .then(function (pdata) {
                    return new Promise(function (resolve, reject) {
                        this.dataDTOSet_.Clear();
                        switch (pdata.state) {
                            case "apiok":
                                this.dataDTOSet_.Add(pdata.data.Records);
                                //this.dataDTOSet_.Add(<Array<TaskDataDTO>>pdata.data);
                                resolve();
                                break;
                            default:
                                reject();
                        }
                    }.bind(this));
                }.bind(this)).catch(function (pdata) {
                    switch (pdata.state) {
                        case "apierr":
                            break;
                    }
                    if (!pdata.state) throw pdata;
                });
            }
        }, {
            key: "taskListClick_",
            value: function taskListClick_(data, evt) {
                // this.map_.setFocus(data.target);
                //var id = 'ID:' + data.Director.UserId;
                // this.taskMembers_.setFocus(id);
                // console.log("click");
                this.showTask_(data);
            }
        }, {
            key: "showTask_",
            value: function showTask_(feature) {
                var sideView = this.frame_.sideView;
                sideView.push(new TaskSidePanel_1.default({
                    feature: feature,
                    tastMembersSetFocus: this.tastMembersSetFocus.bind(this)
                }));
            }
        }, {
            key: "tastMembersSetFocus",
            value: function tastMembersSetFocus(data, evt) {
                // var id = 'ID:' + data.Director.UserId;
                //this.taskMembers_.setFocus(id);
                var id = data.Director.UserName;
                this.taskMembers_.setFocusByData(data.Director);
            }
        }, {
            key: "fromDTO_",
            value: function fromDTO_(t) {
                var r;
                r = new StaticLib_1.TaskData();
                r.Id = '' + t.Id;
                r.Date = this.parse_(t.Date);
                r.Name = t.Name;
                r.Summary = t.Summary;
                r.RequiredCompletionDate = fecha.parse(t.RequiredCompletionDate, "YYYY-MM-DDTHH:mm:ss+08:00");
                r.CurrentStatus = this.getCurrentStatus_(t.CurrentStatus);
                r.Locale = t.Locale;
                r.Type = this.getType_(t.Type);
                r.Level = t.Level;
                r.NoteList = t.NoteList;
                r.Director = t.Director;
                if (t.ApproveUser == null) {
                    var member = new StaticLib_1.Member();
                    member.UserName = '    ';
                    r.ApproveUser = member;
                } else {
                    r.ApproveUser = t.ApproveUser;
                }
                r.CreateUser = t.CreateUser;
                r.Members = t.Members;
                r.Vehicles = t.Vehicles;
                r.Equipments = t.Equipments;
                r.ApproveTime = this.parse_(t.ApproveTime);
                r.DispatchTime = this.parse_(t.DispatchTime);
                r.ReceiveTime = this.parse_(t.ReceiveTime);
                r.BeginTime = this.parse_(t.BeginTime);
                r.CompleteTime = this.parse_(t.CompleteTime);
                r.CloseTime = this.parse_(t.CloseTime);
                if (t.Department == null) {
                    var department = new StaticLib_1.Department();
                    department.DepName = '    ';
                    r.Department = department;
                } else {
                    r.Department = t.Department;
                }
                return r;
            }
        }, {
            key: "parse_",
            value: function parse_(str) {
                if (!str) return null;
                return fecha.parse(str, "YYYY-MM-DDTHH:mm:ss.SSSSSSS+08:00");
            }
        }, {
            key: "getCurrentStatus_",
            value: function getCurrentStatus_(status) {
                var result;
                if (status == 'PendingApprove') {
                    result = '待审核';
                } else if (status == 'PendingDispatch') {
                    result = '待派发';
                } else if (status == 'PendingReceive') {
                    result = '待领取';
                } else if (status == 'PendingExecution') {
                    result = '待执行';
                } else if (status == 'BeginExecuted') {
                    result = '执行中';
                } else if (status == 'Completed') {
                    result = '已完成';
                } else if (status == 'Closed') {
                    result = '已结束';
                }
                return result;
            }
        }, {
            key: "getType_",
            value: function getType_(type) {
                var result;
                if (type == 'TrafficManagement') {
                    result = '通航管理';
                } else if (type == 'ShipSupervision') {
                    result = '船舶监管';
                } else if (type == 'CrewManagement') {
                    result = '船员管理';
                } else if (type == 'RiskPreventionManagement') {
                    result = '危防管理';
                } else if (type == 'EmergencyHandling') {
                    result = '应急处置';
                } else if (type == 'CompanyManagement') {
                    result = '公司管理';
                } else if (type == 'TemporaryTask') {
                    result = '临时任务';
                }
                return result;
            }
        }, {
            key: "featureSelected_",
            value: function featureSelected_(feature) {
                if (!feature) return;
                var featureId = feature.id;
                if (!(typeof featureId == "string" && featureId.startsWith('taskMembers:'))) return null;
                var data = feature.data;
                if (data) {
                    var id = data.id.replace("ID:", "");
                    var list = [];
                    this.dataSet_.map(function (t) {
                        //if (t.Director.UserId == id && t.CurrentStatus != '已结束') {
                        if (t.CurrentStatus != '已结束') {
                            list.push(t);
                        }
                    });
                    list.sort(function (a, b) {
                        if (a.Date < b.Date) return 1;else return -1;
                    });
                    list.map(function (ele) {
                        ele.DateString = fecha.format(ele.Date, "YYYY-MM-DD HH:mm:ss");
                        ele.RequiredCompletionDateString = fecha.format(ele.RequiredCompletionDate, "YYYY-MM-DD HH:mm:ss");
                    });
                    var oi = $(objInfo);
                    var viewModel = {
                        list: list
                    };
                    ko.applyBindings(viewModel, oi[0]);
                    oi.data("title", "任务信息");
                    // var args = CFG("videoServerUrl", "http://192.168.9.222:27010") + "/ " + data.Key;
                    // var href = `http://localhost:8234/StartProcess`;
                    // var form = oi.find('#cctvPlayVideo').attr('action', href);
                    // $(`<input type="text" hidden name="token" value="cctv">`).appendTo(form);
                    // $(`<input type="text" hidden name="args" value="${args}">`).appendTo(form);
                    return oi;
                }
                return oi;
            }
        }]);

        return TaskPluginUi;
    }();

    TaskPluginUi = __decorate([__param(1, Plugins_1.inject("user/info")), __param(2, Plugins_1.inject('maps/ui/uiFrame')), __param(3, Plugins_1.inject('maps/layers/taskMembers')), __param(4, Plugins_1.inject("maps/ui/detailViewer"))], TaskPluginUi);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TaskPluginUi;
});