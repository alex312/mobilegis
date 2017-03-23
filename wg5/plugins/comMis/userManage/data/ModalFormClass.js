"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "text!../htmls/ModalInfo.html", "../../../../seecool/SCModalForm", "../../../../seecool/SCSimpleDialog"], function (require, exports, ModalInfoDiv, SCModalForm_1, SCSimpleDialog_1) {
    "use strict";

    var ModalFormClass = function () {
        function ModalFormClass() {
            _classCallCheck(this, ModalFormClass);

            this.viewDom = $(ModalInfoDiv);
            //var form=new SCModalForm()
        }
        //弹窗


        _createClass(ModalFormClass, [{
            key: "showInfoDialog",
            value: function showInfoDialog(status, infoShow) {
                var thatShow = this;
                var dgOptions = {
                    size: "sm",
                    animation: false
                };
                var dialog = thatShow.viewDom; //.find("#infoShow");
                dialog.empty();
                var scDialog = new SCSimpleDialog_1.default(dialog, dgOptions);
                if ("success" == status) {
                    scDialog.showDialog(infoShow, "提示", "info");
                }
                if ("fail" == status) {
                    scDialog.showDialog(infoShow, "提示", "info");
                }
            }
        }, {
            key: "ConfirmDialog",
            value: function ConfirmDialog() {
                var thatShow = this;
                var dgOptions = {
                    size: "sm",
                    animation: false
                };
                var dialog = thatShow.viewDom; //.find("#infoShow");
                dialog.empty();
                return new SCSimpleDialog_1.default(dialog, dgOptions);
            }
        }, {
            key: "PopupModal",
            value: function PopupModal(form, title, flag, size) {
                var iconClass = 'glyphicon glyphicon-plus-sign text-primary';
                if (!flag) {
                    iconClass = 'glyphicon glyphicon-edit text-primary';
                }
                var options = {
                    core: {
                        size: size || "lg",
                        animation: true
                    },
                    title: {
                        "class": "test-class",
                        "text": title,
                        "istexthtml": false,
                        "iconclass": iconClass //"glyphicon glyphicon-fire text-primary", //显示在标题文本前面，使用[awesome风格]或[jquery-ui风格]或[bootstrap风格]的图标。//可选的。
                    },
                    footer: {
                        "class": "test-footer-class text-danger",
                        //窗口按钮组，//必选项。
                        "buttons": [{
                            "text": "保存",
                            "class": "btn-primary modalButton",
                            "action": function action() {
                                form.find("#submitForm").submit();
                            }
                        }, {
                            "text": "取消",
                            "class": "btn-primary modalButton",
                            "iscancel": true
                        }]
                    },
                    events: {
                        "showing": undefined,
                        "shown": undefined,
                        "hiding": undefined,
                        "hidden": function hidden(evevt, modal) {
                            modal.destroy();
                        }
                    }
                };
                return new SCModalForm_1.default(form[0], options);
            }
        }]);

        return ModalFormClass;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ModalFormClass;
});