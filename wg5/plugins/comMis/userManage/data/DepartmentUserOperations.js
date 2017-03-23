"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "./ModalFormClass", "../apis/UserManagementApi", "text!../htmls/DepartmentEdit.html", "text!../htmls/UserEdit.html", "knockout", "./ValidateClass", "css!../htmls/EditLayout.css"], function (require, exports, ModalFormClass_1, UserManagementApi_1, DepEditDiv, UserEditDic, ko, ValidateClass_1) {
    "use strict";

    var DepartmentUserOperations = function () {
        function DepartmentUserOperations(isDepFlag) {
            _classCallCheck(this, DepartmentUserOperations);

            this.info = new ModalFormClass_1.default();
            this.isDep = isDepFlag;
        }

        _createClass(DepartmentUserOperations, [{
            key: "depDataRead",
            value: function depDataRead(e) {
                var that = this;
                var depApi = new UserManagementApi_1.default("api/Department");
                var depArray = [];
                depApi.Get$pageIndex_pageSize(e.data.skip / e.data.pageSize || 0, e.data.pageSize).then(function (pdata) {
                    if (pdata.data && pdata.data.Items && pdata.data.Items.length > 0) {
                        pdata.data.Items.map(function (d) {
                            depArray.push(d);
                        });
                    }
                    e.success({ d: { __count: pdata.data.Count, results: depArray } });
                }).catch(function (pdata) {
                    if (pdata.state != "apiok") {
                        that.info.showInfoDialog("fail", "请求部门信息失败");
                    }
                });
            }
        }, {
            key: "userDataRead",
            value: function userDataRead(e) {
                var that = this;
                var userApi = new UserManagementApi_1.default("api/NormalUser");
                var userArray = [];
                userApi.GetUser$pageIndex_pageSize(e.data.skip / e.data.pageSize || 0, e.data.pageSize).then(function (pdata) {
                    if (pdata.data && pdata.data.Items && pdata.data.Items.length > 0) {
                        pdata.data.Items.map(function (d) {
                            userArray.push(d);
                        });
                    }
                    e.success({ d: { __count: pdata.data.Count, results: userArray } });
                }).catch(function () {
                    that.info.showInfoDialog("fail", "请求用户数据失败");
                });
            }
        }, {
            key: "depTreeDataRemote",
            value: function depTreeDataRemote(e) {
                var that = this;
                var dataArray = [];
                var depApi = new UserManagementApi_1.default("api/Department");
                depApi.Get().then(function (pdata) {
                    if (pdata.data && pdata.data.length > 0) {
                        (function () {
                            var nodes = pdata.data;
                            nodes.map(function (node1) {
                                node1.items = [];
                                nodes.map(function (node2) {
                                    if (node1.DepCode == node2.DepParentCode) {
                                        node1.items.push(node2);
                                        node2.isChild = true;
                                    }
                                });
                            });
                            nodes.map(function (node) {
                                if (!node.isChild) {
                                    dataArray.push(node);
                                }
                            });
                        })();
                    }
                    e.success(dataArray);
                }).catch(function (pdata) {
                    if (pdata.state != "apiok") {
                        that.info.showInfoDialog("fail", "请求部门树结构失败");
                    }
                });
            }
        }, {
            key: "userTreeDataRemote",
            value: function userTreeDataRemote(e) {
                var that = this;
                var dataArray = [];
                var tmpArray = [];
                var userApi = new UserManagementApi_1.default("api/NormalUser");
                userApi.GetUserTree().then(function (pdata) {
                    if (pdata.data && pdata.data.length > 0) {
                        var nodes = pdata.data;
                        nodes.map(function (node) {
                            node.Department.text = node.Department.DepName;
                            node.Users.map(function (user) {
                                user.text = user.UserName;
                            });
                        });
                        nodes.map(function (node) {
                            if (node.Users && node.Users.length > 0) {
                                node.Department.items = [];
                                node.Users.map(function (user) {
                                    node.Department.items.push(user);
                                });
                            }
                            //dataArray.push(node.Department);
                            tmpArray.push(node.Department);
                        });
                        tmpArray.map(function (node1) {
                            node1.items = node1.items ? node1.items : [];
                            tmpArray.map(function (node2) {
                                if (node1.DepCode == node2.DepParentCode) {
                                    node1.items.push(node2);
                                    node2.isChild = true;
                                }
                            });
                        });
                        tmpArray.map(function (node) {
                            if (!node.isChild) {
                                dataArray.push(node);
                            }
                        });
                    }
                    e.success(dataArray);
                }).catch(function (pdata) {
                    if (pdata.state != "apiok") {
                        that.info.showInfoDialog("fail", "请求人员树结构失败");
                    }
                });
            }
        }, {
            key: "deleteOperation",
            value: function deleteOperation(title, record, dataSource, treeDataSource) {
                var that = this;
                var dialogClass = new ModalFormClass_1.default();
                var dialog = dialogClass.ConfirmDialog();
                dialog.showConfirm(function (result) {
                    if (result) {
                        if (that.isDep) {
                            var depApi = new UserManagementApi_1.default("api/Department");
                            depApi.Delete$id(record.DepId).then(function () {
                                dataSource.read();
                                treeDataSource.read();
                                dialogClass.showInfoDialog('success', '删除成功');
                            }).catch(function () {
                                dialogClass.showInfoDialog("fail", "操作失败");
                            });
                        } else {
                            var userApi = new UserManagementApi_1.default("api/NormalUser");
                            userApi.Delete$id(record.Users.UserId).then(function () {
                                dataSource.read();
                                treeDataSource.read();
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
            value: function editOrAdd(record, dataSource, depDic, treeDataSource) {
                var that = this;
                var showForm = that.isDep ? $(DepEditDiv) : $(UserEditDic);
                $(showForm[0]).removeClass().addClass("modal fade");
                var modal = new ModalFormClass_1.default();
                var editForm = void 0;
                var DepArray = void 0;
                var DepParentIndex = void 0;
                var viewModel = void 0;
                var oldPassword = void 0;
                if (record) {
                    if (that.isDep) {
                        editForm = modal.PopupModal(showForm, "部门编辑", false, "md");
                        editForm._modal.find("#DepCode").attr("disabled", "disabled");
                        DepArray = that.dicToArray(depDic, record.DepCode);
                        DepParentIndex = that.findValueByCode(DepArray, record.DepParentCode);
                        viewModel = {
                            DepCode: ko.observable(record.DepCode),
                            DepName: ko.observable(record.DepName),
                            DepArray: ko.observableArray(DepArray),
                            DepParent: ko.observable(DepArray[DepParentIndex].value),
                            DepDesc: ko.observable(record.DepDesc),
                            DepId: ko.observable(record.DepId)
                        };
                    } else {
                        editForm = modal.PopupModal(showForm, "人员编辑", false, "md");
                        DepArray = that.dicToArray(depDic, null);
                        DepArray.splice(0, 1);
                        DepParentIndex = that.findValueByCode(DepArray, record.Users.DepCode);
                        oldPassword = record.Users.PassWord;
                        viewModel = {
                            UserName: ko.observable(record.Users.UserName),
                            RealName: ko.observable(record.Users.RealName),
                            DepArray: ko.observableArray(DepArray),
                            DepCode: ko.observable(DepArray[DepParentIndex].value),
                            PassWord: ko.observable(record.Users.PassWord),
                            ConfirmPassword: ko.observable(record.Users.PassWord),
                            Email: ko.observable(record.Users.Email),
                            UserId: ko.observable(record.Users.UserId),
                            ContactNumber: ko.observable(record.Users.ContactNumber)
                        };
                    }
                } else {
                    if (that.isDep) {
                        editForm = modal.PopupModal(showForm, "新增部门", false, "md");
                        DepArray = that.dicToArray(depDic, null);
                        DepParentIndex = that.findValueByCode(DepArray, null);
                        viewModel = {
                            DepCode: ko.observable(),
                            DepName: ko.observable(),
                            DepArray: ko.observableArray(DepArray),
                            DepParent: ko.observable(DepArray[DepParentIndex].value),
                            DepDesc: ko.observable(),
                            DepId: ko.observable(0)
                        };
                    } else {
                        editForm = modal.PopupModal(showForm, "新增人员", false, "md");
                        DepArray = that.dicToArray(depDic, null);
                        DepArray.splice(0, 1);
                        DepParentIndex = that.findValueByCode(DepArray, null);
                        oldPassword = null;
                        viewModel = {
                            UserName: ko.observable(null),
                            RealName: ko.observable(null),
                            DepArray: ko.observableArray(DepArray),
                            DepCode: ko.observable(DepArray[DepParentIndex].value),
                            PassWord: ko.observable(null),
                            ConfirmPassword: ko.observable(null),
                            Email: ko.observable(null),
                            UserId: ko.observable(0),
                            ContactNumber: ko.observable()
                        };
                    }
                }
                ko.applyBindings(viewModel, editForm._modal[0]);
                var form = editForm._modal.find("#submitForm");
                var validate = new ValidateClass_1.default();
                if (that.isDep) {
                    validate.depValidate(form, that.depSubmitHandler, viewModel, editForm, dataSource, treeDataSource);
                } else {
                    var selectedRoles = viewModel.UserId() == 0 ? null : record.Roles;
                    that.selecRole(form, "selectRole", selectedRoles);
                    validate.userValidate(form, that.userSubmitHandler, viewModel, editForm, dataSource, treeDataSource, oldPassword);
                }
                editForm.show();
            }
        }, {
            key: "userSubmitHandler",
            value: function userSubmitHandler(viewModel, showForm, dataSource, treeDataSource, oldPassword) {
                var that = this;
                var infoShow = new ModalFormClass_1.default();
                var selectedRolesArray = showForm._modal.find("#selectRole").data("kendoMultiSelect").value();
                showForm.hide();
                var userApi = new UserManagementApi_1.default("api/NormalUser");
                var code = "0";
                viewModel.DepArray().map(function (a) {
                    if (a && a.value == viewModel.DepCode()) {
                        code = a.DepCode;
                        return;
                    }
                });
                var pw = void 0;
                if (oldPassword != viewModel.PassWord()) {
                    pw = $.md5(viewModel.PassWord()).toUpperCase();
                } else {
                    pw = viewModel.PassWord();
                }
                var userData = {
                    UserName: viewModel.UserName(),
                    RealName: viewModel.RealName(),
                    DepCode: code,
                    PassWord: pw,
                    Email: viewModel.Email(),
                    UserId: viewModel.UserId(),
                    ContactNumber: viewModel.ContactNumber()
                };
                var postData = {
                    Users: userData,
                    roleIds: selectedRolesArray
                };
                userApi.Post$UserRole(postData).then(function () {
                    infoShow.showInfoDialog('success', '保存成功');
                    if (dataSource) dataSource.read();
                    if (treeDataSource) treeDataSource.read();
                }).catch(function () {
                    infoShow.showInfoDialog('fail', '保存失败');
                });
            }
        }, {
            key: "depSubmitHandler",
            value: function depSubmitHandler(viewModel, showForm, dataSource, treeDataSource) {
                var infoShow = new ModalFormClass_1.default();
                showForm.hide();
                var depApi = new UserManagementApi_1.default("api/Department");
                var code = "0";
                viewModel.DepArray().map(function (a) {
                    if (a && a.value == viewModel.DepParent()) {
                        code = a.DepCode;
                        return;
                    }
                });
                var postData = {
                    DepCode: viewModel.DepCode(),
                    DepName: viewModel.DepName(),
                    DepParentCode: code,
                    DepDesc: viewModel.DepDesc(),
                    DepId: viewModel.DepId(),
                    DeleteFlag: false
                };
                if (postData.DepId != 0) {
                    depApi.Put$id(postData.DepId, postData).then(function () {
                        infoShow.showInfoDialog('success', '保存成功');
                        if (dataSource) dataSource.read();
                        if (treeDataSource) treeDataSource.read();
                    }).catch(function () {
                        infoShow.showInfoDialog('fail', '保存失败');
                    });
                } else {
                    depApi.Post(postData).then(function () {
                        infoShow.showInfoDialog('success', '保存成功');
                        if (dataSource) dataSource.read();
                        if (treeDataSource) treeDataSource.read();
                    }).catch(function () {
                        infoShow.showInfoDialog('fail', '保存失败');
                    });
                }
            }
        }, {
            key: "dicToArray",
            value: function dicToArray(dic, depCode) {
                var arr = [];
                var index = 0;
                for (var x in dic) {
                    if (x != depCode) {
                        var tmp = {
                            text: dic[x],
                            value: index++,
                            DepCode: x
                        };
                        arr.push(tmp);
                    }
                }
                return arr;
            }
        }, {
            key: "findValueByCode",
            value: function findValueByCode(arr, code) {
                var index = 0;
                arr.map(function (a, i) {
                    if (a && a.DepCode == code) {
                        index = i;
                        return index;
                    }
                });
                return index;
            }
        }, {
            key: "selecRole",
            value: function selecRole(form, id, selectedRoles) {
                var that = this;
                var roleApi = new UserManagementApi_1.default("api/Role");
                roleApi.Get().then(function (pdata) {
                    if (pdata.data && pdata.data.length > 0) {
                        (function () {
                            var selectValues = [];
                            if (selectedRoles) {
                                selectedRoles.map(function (sRole) {
                                    pdata.data.map(function (role) {
                                        if (sRole.RoleId == role.RoleId) {
                                            selectValues.push(role.RoleId);
                                        }
                                    });
                                });
                            }
                            form.find("#" + id).kendoMultiSelect({
                                placeholder: "请选择角色...",
                                dataTextField: "RoleName",
                                dataValueField: "RoleId",
                                dataSource: pdata.data
                            });
                            if (selectValues.length > 0) {
                                form.find("#" + id).data("kendoMultiSelect").value(selectValues);
                            }
                        })();
                    }
                }).catch(function (pdata) {
                    if (pdata.state != "apiok") {
                        that.info.showInfoDialog("fail", "请求角色信息失败");
                    }
                });
            }
        }]);

        return DepartmentUserOperations;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DepartmentUserOperations;
});