"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "knockout", "text!../htmls/RoleEdit.html", "text!../htmls/ActionEdit.html", "./ValidateClass", "./ModalFormClass", "../apis/UserManagementApi", "css!../htmls/EditLayout.css"], function (require, exports, ko, roleEditDiv, actionEditDiv, ValidateClass_1, ModalFormClass_1, UserManagementApi_1) {
    "use strict";

    var RoleActionOperations = function () {
        function RoleActionOperations(isRoleFlag) {
            _classCallCheck(this, RoleActionOperations);

            this.isRole = isRoleFlag;
            this.info = new ModalFormClass_1.default();
        }

        _createClass(RoleActionOperations, [{
            key: "tableDataRead",
            value: function tableDataRead(e) {
                var that = this;
                if (that.isRole) {
                    (function () {
                        var roleApi = new UserManagementApi_1.default("api/Role");
                        var roleArray = [];
                        roleApi.GetRole$pageIndex_pageSize(e.data.skip / e.data.pageSize || 0, e.data.pageSize).then(function (pdata) {
                            pdata.data.Items.map(function (d) {
                                roleArray.push(d);
                            });
                            e.success({ d: { __count: pdata.data.Count, results: roleArray } });
                        }).catch(function () {
                            that.info.showInfoDialog("fail", "请求数据失败");
                        });
                    })();
                } else {
                    (function () {
                        var actionApi = new UserManagementApi_1.default("api/Action");
                        var actionArray = [];
                        actionApi.GetAction$pageIndex_pageSize(e.data.skip / e.data.pageSize || 0, e.data.pageSize).then(function (pdata) {
                            pdata.data.Items.map(function (d) {
                                actionArray.push(d);
                            });
                            e.success({ d: { __count: pdata.data.Count, results: actionArray } });
                        }).catch(function () {
                            that.info.showInfoDialog("fail", "请求数据失败");
                        });
                    })();
                }
            }
        }, {
            key: "readActionTreeData",
            value: function readActionTreeData(e, selectedActions) {
                var that = this;
                var actionApi = new UserManagementApi_1.default("api/Action");
                actionApi.Get().then(function (pdata) {
                    var actionsArray = [];
                    if (pdata.data && pdata.data.length > 0) {
                        actionsArray = that.transformTreeData(pdata.data, selectedActions);
                    } else {
                        that.info.showInfoDialog('fail', '权限数据为空');
                    }
                    e.success(actionsArray);
                }).catch(function (pdata) {
                    that.info.showInfoDialog('fail', '请求权限数据失败');
                });
            }
        }, {
            key: "deleteOperation",
            value: function deleteOperation(title, record, dataSource) {
                var that = this;
                var dialogClass = new ModalFormClass_1.default();
                var dialog = dialogClass.ConfirmDialog();
                dialog.showConfirm(function (result) {
                    if (result) {
                        if (that.isRole) {
                            var roleApi = new UserManagementApi_1.default("api/Role");
                            roleApi.Delete$id(record.Roles.RoleId).then(function () {
                                dataSource.read();
                                dialogClass.showInfoDialog('success', '删除成功');
                            }).catch(function () {
                                dialogClass.showInfoDialog("fail", "操作失败");
                            });
                        } else {
                            var actionApi = new UserManagementApi_1.default("api/Action");
                            actionApi.Delete$id(record.AcId).then(function () {
                                dataSource.read();
                                dialogClass.showInfoDialog('success', '删除成功');
                            }).catch(function () {
                                dialogClass.showInfoDialog("fail", "操作失败");
                            });
                        }
                    }
                }, title, "确认框", "warning");
            }
        }, {
            key: "editOrAdd",
            value: function editOrAdd(record, dataSource) {
                var that = this;
                var showForm = that.isRole ? $(roleEditDiv) : $(actionEditDiv);
                $(showForm[0]).removeClass().addClass("modal fade");
                var modal = new ModalFormClass_1.default();
                var editForm = void 0;
                var viewModel = void 0;
                if (record) {
                    if (that.isRole) {
                        editForm = modal.PopupModal(showForm, "角色编辑", false, "md");
                        viewModel = {
                            RoleName: ko.observable(record.Roles.RoleName),
                            RoleDesc: ko.observable(record.Roles.RoleDesc),
                            RoleId: ko.observable(record.Roles.RoleId)
                        };
                    } else {
                        editForm = modal.PopupModal(showForm, "权限编辑", false, "md");
                        viewModel = {
                            GroupName: ko.observable(record.GroupName),
                            FunctionName: ko.observable(record.FunctionName),
                            AcName: ko.observable(record.AcName),
                            AcDesc: ko.observable(record.AcDesc),
                            AcId: ko.observable(record.AcId)
                        };
                    }
                } else {
                    if (that.isRole) {
                        editForm = modal.PopupModal(showForm, "新增角色", false, "md");
                        viewModel = {
                            RoleName: ko.observable(),
                            RoleDesc: ko.observable(),
                            RoleId: ko.observable(0)
                        };
                    } else {
                        editForm = modal.PopupModal(showForm, "新增权限", false, "md");
                        viewModel = {
                            GroupName: ko.observable(),
                            FunctionName: ko.observable(),
                            AcName: ko.observable(),
                            AcDesc: ko.observable(),
                            AcId: ko.observable(0)
                        };
                    }
                }
                ko.applyBindings(viewModel, editForm._modal[0]);
                var form = editForm._modal.find("#submitForm");
                var validate = new ValidateClass_1.default();
                if (that.isRole) {
                    var selectedActions = viewModel.RoleId() == 0 ? null : record.Actions;
                    that.selectActions(form, "selectAction", selectedActions);
                    validate.roleValidate(form, that.roleSubmitHandler, viewModel, editForm, dataSource);
                } else {
                    validate.actionValidate(form, that.actionSubmitHandler, viewModel, editForm, dataSource);
                }
                editForm.show();
            }
        }, {
            key: "roleSubmitHandler",
            value: function roleSubmitHandler(viewModel, showForm, dataSource, selectedActions) {
                var infoShow = new ModalFormClass_1.default();
                showForm.hide();
                var roleApi = new UserManagementApi_1.default("api/Role");
                var roleData = {
                    RoleName: viewModel.RoleName(),
                    RoleDesc: viewModel.RoleDesc(),
                    RoleId: viewModel.RoleId()
                };
                var postData = {
                    Role: roleData,
                    actionIds: selectedActions
                };
                roleApi.Post$RoleAction(postData).then(function () {
                    infoShow.showInfoDialog('success', '保存成功');
                    if (dataSource) dataSource.read();
                }).catch(function () {
                    infoShow.showInfoDialog('fail', '保存失败');
                });
            }
        }, {
            key: "actionSubmitHandler",
            value: function actionSubmitHandler(viewModel, showForm, dataSource) {
                var infoShow = new ModalFormClass_1.default();
                showForm.hide();
                var actionApi = new UserManagementApi_1.default("api/Action");
                var postData = {
                    GroupName: viewModel.GroupName(),
                    FunctionName: viewModel.FunctionName(),
                    AcName: viewModel.AcName(),
                    AcDesc: viewModel.AcDesc(),
                    AcId: viewModel.AcId()
                };
                if (postData.AcId != 0) {
                    actionApi.Put$id(postData.AcId, postData).then(function () {
                        infoShow.showInfoDialog('success', '保存成功');
                        if (dataSource) dataSource.read();
                    }).catch(function () {
                        infoShow.showInfoDialog('fail', '保存失败');
                    });
                } else {
                    actionApi.Post(postData).then(function () {
                        infoShow.showInfoDialog('success', '保存成功');
                        if (dataSource) dataSource.read();
                    }).catch(function () {
                        infoShow.showInfoDialog('fail', '保存失败');
                    });
                }
            }
        }, {
            key: "selectActions",
            value: function selectActions(form, id, selectedActions) {
                var that = this;
                var dataSourceTree = new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: function read(e) {
                            that.readActionTreeData(e, selectedActions);
                        }
                    },
                    schema: {
                        model: {
                            children: "items"
                        }
                    }
                });
                form.find("#" + id).kendoTreeView({
                    checkboxes: {
                        checkChildren: true
                    },
                    check: function check(e) {
                        alert(e);
                    },
                    dataSource: dataSourceTree
                });
            }
        }, {
            key: "transformTreeData",
            value: function transformTreeData(data, selectedActions) {
                var that = this;
                var list = [];
                for (var i = 0; i < data.length; i++) {
                    var tmp = data[i];
                    var models = list;
                    var index = that.findByName(tmp.GroupName, models);
                    if (index == null) {
                        models.push({ text: tmp.GroupName, expanded: true, items: [] }); //expanded:true,
                        index = that.findByName(tmp.GroupName, models);
                    }
                    var dtmp = {};
                    for (var x in tmp) {
                        dtmp[x] = tmp[x];
                    }delete dtmp[tmp.GroupName];
                    var dmodels = models[index]["items"];
                    var dindex = that.findByName(dtmp.FunctionName, dmodels);
                    if (dindex == null) {
                        dmodels.push({ text: dtmp.FunctionName, expanded: true, items: [] });
                        dindex = that.findByName(dtmp.FunctionName, dmodels);
                    }
                    if (selectedActions && selectedActions.length > 0) {
                        var flag = false;
                        selectedActions.map(function (action) {
                            if (dtmp.AcId == action.AcId) {
                                flag = true;
                            }
                        });
                        if (flag) {
                            dmodels[dindex].items.push({ text: dtmp.AcName, id: dtmp.AcId, checked: true });
                            dmodels[dindex].expanded = true;
                            models[index].expanded = true;
                        } else {
                            dmodels[dindex].items.push({ text: dtmp.AcName, id: dtmp.AcId });
                        }
                    } else {
                        dmodels[dindex].items.push({ text: dtmp.AcName, id: dtmp.AcId });
                    }
                }
                return list;
            }
        }, {
            key: "findByName",
            value: function findByName(name, array) {
                var r = null;
                if (array && array.length > 0) {
                    var len = array.length;
                    for (var i = 0; i < len; i++) {
                        if (array[i].text == name) r = i;
                    }
                }
                // array.map(function (d, i) {
                //     if (d.text == name)r = i;
                // });
                return r;
            }
        }]);

        return RoleActionOperations;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RoleActionOperations;
});