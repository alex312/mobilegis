"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "./ModalFormClass", "validator"], function (require, exports, ModalFormClass_1) {
    "use strict";

    var ValidateClass = function () {
        function ValidateClass() {
            _classCallCheck(this, ValidateClass);

            //this.viewTemplate = op.viewTemplate || "";
            //this.viewDom = op.viewDom || $(op.viewTemplate);//获取新增页面
            this.info = new ModalFormClass_1.default();
        }

        _createClass(ValidateClass, [{
            key: "depValidate",
            value: function depValidate(form, callback, viewModel, showForm, dataSource, treeDataSource) {
                form.validate({
                    errorElement: 'span',
                    errorClass: 'help-block help-block-error font-red',
                    rules: {
                        DepCode: {
                            required: true,
                            remote: {
                                url: "api/Department/ValidateDepCode",
                                type: "post",
                                //data:`${viewModel.UserId()}&UserName=`+$("#UserName").val(),
                                data: {
                                    DepId: function DepId() {
                                        return viewModel.DepId();
                                    },
                                    DepCode: function DepCode() {
                                        return $("#DepCode").val();
                                    }
                                }
                            }
                        },
                        DepName: {
                            required: true,
                            remote: {
                                url: "api/Department/ValidateDepName",
                                type: "post",
                                //data:`${viewModel.UserId()}&UserName=`+$("#UserName").val(),
                                data: {
                                    DepId: function DepId() {
                                        return viewModel.DepId();
                                    },
                                    DepName: function DepName() {
                                        return $("#DepName").val();
                                    }
                                }
                            }
                        },
                        DepParent: {
                            required: true
                        }
                    },
                    messages: {
                        DepCode: {
                            required: '不可为空',
                            remote: '此编号不可用'
                        },
                        DepName: {
                            required: '不可为空',
                            remote: '此名称不可用'
                        },
                        DepParent: {
                            required: '不可为空'
                        }
                    },
                    errorPlacement: function errorPlacement(error, element) {
                        error.attr('style', 'text-align:left;').insertAfter($(element));
                    },
                    submitHandler: function submitHandler() {
                        callback(viewModel, showForm, dataSource, treeDataSource);
                    }
                });
            }
            //     if (element.attr("type") == "checkbox") {
            //     error.insertAfter($("#errorDisplay"));
            // }
            // else {
            //     error.insertAfter($(element));
            // }

        }, {
            key: "userValidate",
            value: function userValidate(form, callback, viewModel, showForm, dataSource, treeDataSource, oldPassword) {
                var that = this;
                $.validator.addMethod("KendoCheckbox", function () {
                    var checkedNodes = form.find("#selectRole").data("kendoMultiSelect").value();
                    return checkedNodes.length > 0 ? true : false;
                });
                form.validate({
                    errorElement: 'span',
                    errorClass: 'help-block help-block-error font-red',
                    rules: {
                        UserName: {
                            required: true,
                            //ValidateUserName:true
                            remote: {
                                url: "api/normalUser/ValidateUserName",
                                type: "post",
                                //data:`${viewModel.UserId()}&UserName=`+$("#UserName").val(),
                                data: {
                                    UserId: function UserId() {
                                        return viewModel.UserId();
                                    },
                                    UserName: function UserName() {
                                        return $("#UserName").val();
                                    }
                                }
                            }
                        },
                        RealName: {
                            required: true
                        },
                        PassWord: {
                            required: true,
                            minlength: 3
                        },
                        ConfirmPassword: {
                            equalTo: "#PassWord"
                        },
                        Email: {
                            required: true,
                            email: true
                        },
                        DepCode: {
                            required: true
                        },
                        selectRoles: {
                            //required:true,
                            KendoCheckbox: true
                        },
                        ContactNumber: {
                            required: true,
                            digits: true
                        }
                    },
                    messages: {
                        UserName: {
                            required: '不可为空',
                            remote: '用户名不可用'
                        },
                        RealName: {
                            required: '不可为空'
                        },
                        PassWord: {
                            required: '不可为空',
                            minlength: jQuery.validator.format("密码不少于 {0} 位")
                        },
                        ConfirmPassword: {
                            equalTo: '两次密码输入不一致'
                        },
                        Email: {
                            required: '不可为空',
                            email: '格式不正确'
                        },
                        DepCode: {
                            required: '不可为空'
                        },
                        selectRoles: {
                            //required:'请选择',
                            KendoCheckbox: '请选择角色'
                        },
                        ContactNumber: {
                            required: '不可为空',
                            digits: "请填写数字"
                        }
                    },
                    ignore: ':hidden:not("#selectRole")',
                    errorPlacement: function errorPlacement(error, element) {
                        // if (element.attr("id") == "selectRole"){
                        //     error.insertAfter($("#errorDisplay"));
                        // }
                        // else{
                        error.attr('style', 'text-align:left;').insertAfter($(element));
                        // }
                    },
                    submitHandler: function submitHandler() {
                        callback(viewModel, showForm, dataSource, treeDataSource, oldPassword);
                    }
                });
            }
        }, {
            key: "roleValidate",
            value: function roleValidate(form, callback, viewModel, showForm, dataSource) {
                var that = this;
                $.validator.addMethod("KendoTreeCheckbox", function () {
                    var checkedNodesArray = that.checkedNodes();
                    return checkedNodesArray.length > 0 ? true : false;
                });
                form.validate({
                    errorElement: 'span',
                    errorClass: 'help-block help-block-error font-red',
                    ignore: ':hidden:not("#ActionResult")',
                    rules: {
                        RoleName: {
                            required: true,
                            remote: {
                                url: "api/Role/ValidateRoleName",
                                type: "post",
                                //data:`${viewModel.UserId()}&UserName=`+$("#UserName").val(),
                                data: {
                                    RoleId: function RoleId() {
                                        return viewModel.RoleId();
                                    },
                                    RoleName: function RoleName() {
                                        return $("#RoleName").val();
                                    }
                                }
                            }
                        },
                        RoleDesc: {
                            required: true
                        },
                        ActionResult: {
                            KendoTreeCheckbox: true
                        }
                    },
                    messages: {
                        RoleName: {
                            required: '不可为空',
                            remote: '此名称不可用'
                        },
                        RoleDesc: {
                            required: '不可为空'
                        },
                        ActionResult: {
                            KendoTreeCheckbox: '请选择权限'
                        }
                    },
                    errorPlacement: function errorPlacement(error, element) {
                        //console.log(error);
                        if (element.attr("id") == "ActionResult") {
                            //error.insertAfter($("#errorDisplay"));
                            error.insertAfter($("#errorDisplay"));
                        } else {
                            error.attr('style', 'text-align:left;').insertAfter($(element));
                        }
                    },
                    submitHandler: function submitHandler() {
                        var checkedNodesArray = that.checkedNodes();
                        callback(viewModel, showForm, dataSource, checkedNodesArray);
                    }
                });
            }
        }, {
            key: "actionValidate",
            value: function actionValidate(form, callback, viewModel, showForm, dataSource) {
                form.validate({
                    errorElement: 'span',
                    errorClass: 'help-block help-block-error font-red',
                    rules: {
                        GroupName: {
                            required: true
                        },
                        FunctionName: {
                            required: true
                        },
                        AcName: {
                            required: true
                        }
                    },
                    messages: {
                        GroupName: {
                            required: '不可为空'
                        },
                        FunctionName: {
                            required: '不可为空'
                        },
                        AcName: {
                            required: '不可为空'
                        }
                    },
                    errorPlacement: function errorPlacement(error, element) {
                        if (element.attr("id") == "AcDesc") {
                            error.insertAfter($("#errorDisplay"));
                        } else error.attr('style', 'text-align:left;').insertAfter($(element));
                    },
                    submitHandler: function submitHandler() {
                        callback(viewModel, showForm, dataSource);
                    }
                });
            }
        }, {
            key: "checkedNodes",
            value: function checkedNodes() {
                var that = this;
                var checkedNodesArray = [];
                var treeView = $("#selectAction").data("kendoTreeView");
                that.checkedNodeIds(treeView.dataSource.view(), checkedNodesArray);
                return checkedNodesArray;
            }
        }, {
            key: "checkedNodeIds",
            value: function checkedNodeIds(nodes, checkedNodes) {
                var that = this;
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].checked) {
                        if (nodes[i].id) {
                            checkedNodes.push(nodes[i].id);
                        }
                    }
                    if (nodes[i].hasChildren) {
                        that.checkedNodeIds(nodes[i].children.view(), checkedNodes);
                    }
                }
            }
        }]);

        return ValidateClass;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ValidateClass;
});