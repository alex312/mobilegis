"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "../apis/UserManagementApi", "./ModalFormClass", "./DepartmentUserOperations"], function (require, exports, UserManagementApi_1, ModalFormClass_1, DepartmentUserOperations_1) {
    "use strict";

    var DepartmentUserView = function () {
        function DepartmentUserView(op, isDepFlag) {
            _classCallCheck(this, DepartmentUserView);

            this.viewTemplate = op.viewTemplate || "";
            this.viewDom = op.viewDom || $(op.viewTemplate); //获取新增页面
            this.info = new ModalFormClass_1.default();
            this.depDic = {};
            this.isDep = isDepFlag;
            //this.init();
        }

        _createClass(DepartmentUserView, [{
            key: "init",
            value: function init() {
                var that = this;
                var depApi = new UserManagementApi_1.default("api/Department");
                that.depDic = {};
                that.depDic["0"] = "无";
                depApi.Get().then(function (pdata) {
                    if (pdata.data && pdata.data.length > 0) {
                        pdata.data.map(function (d) {
                            that.depDic[d.DepCode] = d.DepName;
                        });
                        that.initHtml();
                    } else {
                        that.info.showInfoDialog("fail", "部门数据为空");
                    }
                }).catch(function () {
                    that.info.showInfoDialog("fail", "请求数据失败");
                });
            }
        }, {
            key: "initHtml",
            value: function initHtml() {
                var that = this;
                //分隔初始化
                that.viewDom.find("#spliter").kendoSplitter({
                    panes: [{ collapsible: false, min: "265px", size: "365px" }, { collapsible: false }],
                    orientation: "horizontal"
                });
                //test
                //that.initTree();
                //右侧表
                that.initTable();
                //左侧树
                that.initTreeRemote();
                //按钮
                that.viewDom.find("#btnCreate").click(function () {
                    var op = new DepartmentUserOperations_1.default(that.isDep);
                    op.editOrAdd(null, that.tableDataSource, that.depDic, that.treeDataSource);
                });
            }
            // public initTree(){
            //     let that=this;
            //     let op=new DepartmentUserOperations();
            //     let depApi=new UserManagementApi("api/Department");
            //     depApi.Get()
            //         .then(function(pdata:pdata){
            //             let nodes=pdata.data;
            //             if(nodes && nodes.length>0){
            //                 let dataSource=op.depTreeData(nodes);
            //                 that.viewDom.find("#treeContainer").kendoTreeView({
            //                     dataSource: dataSource,
            //                     dataTextField:[ "DepName", "DepName" ]
            //                 });
            //             }
            //         })
            //         .catch(function(){
            //             that.info.showInfoDialog("fail","请求数据失败");
            //         })
            // }

        }, {
            key: "initTreeRemote",
            value: function initTreeRemote() {
                var that = this;
                var dataSourceTree = new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: function read(e) {
                            var treeRead = new DepartmentUserOperations_1.default(that.isDep);
                            if (that.isDep) {
                                treeRead.depTreeDataRemote(e);
                            } else {
                                treeRead.userTreeDataRemote(e);
                            }
                        }
                    },
                    schema: {
                        model: {
                            children: "items"
                        }
                    }
                });
                that.treeDataSource = dataSourceTree;
                if (that.isDep) {
                    that.viewDom.find("#treeContainer").kendoTreeView({
                        dataSource: dataSourceTree,
                        dataTextField: ["DepName", "DepName"]
                    });
                } else {
                    that.viewDom.find("#treeContainer").kendoTreeView({
                        dataSource: dataSourceTree,
                        dataTextField: ["DepName", "UserName"]
                    });
                }
            }
        }, {
            key: "initTable",
            value: function initTable() {
                var that = this;
                var dataSource = new kendo.data.DataSource({
                    pageSize: 25,
                    autoSync: true,
                    type: "odata",
                    transport: {
                        read: function read(e) {
                            var dataRead = new DepartmentUserOperations_1.default(that.isDep);
                            if (that.isDep) {
                                dataRead.depDataRead(e);
                            } else {
                                dataRead.userDataRead(e);
                            }
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
                var op = new DepartmentUserOperations_1.default(that.isDep);
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
                                op.deleteOperation("是否删除该记录？", dataitem, dataSource, that.treeDataSource);
                            }
                        }, {
                            name: "editing", text: "", title: "编辑", imageClass: "iconEdit",
                            click: function click(e) {
                                var row = $(e.target).closest("tr")[0];
                                var dataitem = this.dataItem(row);
                                op.editOrAdd(dataitem, dataSource, that.depDic, that.treeDataSource);
                            }
                        }], title: "操作", width: 125
                    }, {
                        field: "DepCode", title: "部门编号", sortable: true, hidden: !that.isDep
                    }, {
                        field: "DepName", title: "部门名称", sortable: false, hidden: !that.isDep
                    }, {
                        field: "DepParentCode", title: "上级部门", sortable: false, hidden: !that.isDep, template: function template(data) {
                            return data.DepParentCode ? that.depDic[data.DepParentCode] || "无" : null;
                        }
                    }, {
                        field: "UserName", title: "用户名", sortable: false, hidden: that.isDep, template: function template(data) {
                            return data.Users ? data.Users.UserName : null;
                        }
                    }, {
                        field: "ContactNumber", title: "联系电话", sortable: false, hidden: that.isDep, template: function template(data) {
                            return data.Users ? data.Users.ContactNumber : null;
                        }
                    }, {
                        field: "Email", title: "邮箱", sortable: false, hidden: that.isDep, template: function template(data) {
                            return data.Users ? data.Users.Email : null;
                        }
                    }, {
                        field: "DepCode", title: "部门", sortable: false, hidden: that.isDep, template: function template(data) {
                            return data.Users ? that.depDic[data.Users.DepCode] || "无" : null;
                        }
                    }, {
                        field: "Roles", title: "角色", sortable: false, hidden: that.isDep, template: function template(data) {
                            var roles = "";
                            if (data.Roles && data.Roles.length > 0) {
                                (function () {
                                    var rolesArray = [];
                                    data.Roles.map(function (role) {
                                        rolesArray.push(role.RoleName);
                                    });
                                    roles = rolesArray.join(",");
                                })();
                            }
                            return roles;
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

        return DepartmentUserView;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DepartmentUserView;
});