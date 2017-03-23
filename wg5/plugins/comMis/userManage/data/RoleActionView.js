"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "./RoleActionOperations"], function (require, exports, RoleActionOperations_1) {
    "use strict";

    var RoleActionView = function () {
        function RoleActionView(op, isRoleFlag) {
            _classCallCheck(this, RoleActionView);

            this.viewTemplate = op.viewTemplate || "";
            this.viewDom = op.viewDom || $(op.viewTemplate); //获取新增页面
            this.isRole = isRoleFlag;
        }

        _createClass(RoleActionView, [{
            key: "init",
            value: function init() {
                var that = this;
                that.initTable();
                //按钮
                that.viewDom.find("#btnCreate").click(function () {
                    var op = new RoleActionOperations_1.default(that.isRole);
                    op.editOrAdd(null, that.tableDataSource);
                });
            }
        }, {
            key: "initTable",
            value: function initTable() {
                var that = this;
                var op = new RoleActionOperations_1.default(that.isRole);
                var dataSource = new kendo.data.DataSource({
                    pageSize: 25,
                    autoSync: true,
                    type: "odata",
                    transport: {
                        read: function read(e) {
                            op.tableDataRead(e);
                        }
                    },
                    schema: {
                        model: {
                            //id: "DepId",
                            fields: {}
                        }
                    },
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                });
                that.tableDataSource = dataSource;
                if (that.viewDom.find('#kendoGrid').data('kendoGrid')) {
                    that.viewDom.find("#kendoGrid").kendoGrid('destroy').empty();
                }
                that.viewDom.find("#kendoGrid").kendoGrid({
                    dataSource: dataSource,
                    pageable: true,
                    height: 835,
                    columns: [{
                        command: [{
                            name: "deleting", text: "", title: "删除", imageClass: "iconDelete",
                            click: function click(e) {
                                var row = $(e.target).closest("tr")[0];
                                var dataitem = this.dataItem(row);
                                op.deleteOperation("是否删除该记录？", dataitem, dataSource);
                            }
                        }, {
                            name: "editing", text: "", title: "编辑", imageClass: "iconEdit",
                            click: function click(e) {
                                var row = $(e.target).closest("tr")[0];
                                var dataitem = this.dataItem(row);
                                op.editOrAdd(dataitem, dataSource);
                            }
                        }], title: "操作", width: 125
                    }, {
                        field: "RoleName", title: "角色名称", sortable: true, hidden: !that.isRole, width: 225, template: function template(data) {
                            return data.Roles ? data.Roles.RoleName : null;
                        }
                    }, {
                        field: "RoleDesc", title: "角色描述", sortable: true, hidden: !that.isRole, template: function template(data) {
                            return data.Roles ? data.Roles.RoleDesc : null;
                        }
                    }, {
                        field: "RoleActions", title: "角色权限", sortable: false, hidden: !that.isRole, template: function template(data) {
                            var actionName = "";
                            if (data.Actions && data.Actions.length > 0) {
                                (function () {
                                    var actionArray = [];
                                    data.Actions.map(function (action) {
                                        actionArray.push(action.AcName);
                                    });
                                    actionName = actionArray.join(",");
                                })();
                            }
                            return actionName;
                        }
                    },
                    //权限
                    {
                        field: "GroupName", title: "分组名称", sortable: false, hidden: that.isRole, template: function template(data) {
                            return data.GroupName ? data.GroupName : null;
                        }
                    }, {
                        field: "FunctionName", title: "功能名称", sortable: false, hidden: that.isRole, template: function template(data) {
                            return data.FunctionName ? data.FunctionName : null;
                        }
                    }, {
                        field: "AcName", title: "权限名称", sortable: false, hidden: that.isRole, template: function template(data) {
                            return data.AcName ? data.AcName : null;
                        }
                    }, {
                        field: "AcDesc", title: "权限描述", sortable: false, hidden: that.isRole, template: function template(data) {
                            return data.AcDesc ? data.AcDesc : null;
                        }
                    }],
                    editable: false,
                    sortable: true,
                    resizable: true,
                    dataBound: function dataBound(e) {
                        //添加按钮提示
                        e.sender.tbody.find('span').each(function () {
                            $(this).removeClass('k-icon');
                            var str = $(this).attr('class').trim();
                            if (str == 'iconDelete') $(this).attr('title', '删除');else if (str == 'iconEdit') $(this).attr('title', '编辑');else $(this).attr('title', '其他');
                        });
                        e.sender.tbody.find('span').parent().each(function () {
                            $(this).removeClass('k-button');
                        });
                    }
                });
            }
        }]);

        return RoleActionView;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RoleActionView;
});