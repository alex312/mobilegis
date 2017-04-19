define(["require", "exports", "./SCModalForm"], function (require, exports, SCModalForm_1) {
    "use strict";
    /**
     * 生成一个对话框弹窗对象。
     * @param dialog 对话框容器，推荐使用一个<div>元素。
     * @param options 对话框设置选项。格式如下。
     *      {
                size: "sm", //可选项，表示对话框的大小。"sm"--小对话框,"md"--中等大小对话框,"lg"--大对话框。默认为"sm"
                animation: false //可选项。是否以动画方式弹出对话框，true--动画方式弹出，false--不使用动画。默认为 false
            }
     * @constructor
     */
    var SCSimpleDialog = (function () {
        function SCSimpleDialog(dialog, options) {
            this._data = undefined;
            this._core = {
                size: options ? options.size : "sm",
                animation: options && options.animation
            };
            var mfOptiosn = {
                core: this._core,
                title: {
                    "text": "提示窗口",
                    "istexthtml": false,
                    "iconclass": "glyphicon si-bookmark-empty text-primary",
                },
                footer: {
                    //窗口按钮组，//必选项。
                    "buttons": [
                        {
                            "class": "btn-sm btn-primary",
                            "text": "确定",
                            "iscancel": true //标记按钮是否是默认的取消按钮，true--点击按钮时，模态框将关闭。//可选项。
                        }
                    ]
                }
            };
            this._dialog = new SCModalForm_1.default(dialog, mfOptiosn);
        }
        SCSimpleDialog.prototype._showInnerForm = function (message, title, type, options, isconfirm, callback) {
            var titleIcon = "si-info-circled text-primary";
            var btnClass = "btn-primary";
            if (type == "warning") {
                titleIcon = "si-attention text-warning";
                btnClass = "btn-warning";
            }
            else if (type == "error") {
                titleIcon = "si-cancle-circled text-danger";
                btnClass = "btn-danger";
            }
            var mfoptions = {
                core: {
                    size: (options && options.size) ? options.size : this._core.size,
                    animation: (options && options.animation) ? options.animation : this._core.animation
                },
                title: {
                    "text": title,
                    "iconclass": "glyphicon " + titleIcon
                },
                footer: {
                    "buttons": [
                        {
                            "class": "btn-sm " + btnClass,
                            "text": "确定",
                            "iscancel": true
                        }
                    ]
                }
            };
            //判断是否是确认窗口，已确定弹出框的按钮样式。
            if (isconfirm) {
                mfoptions.footer = {
                    "buttons": [
                        {
                            "class": "btn-sm " + btnClass,
                            "text": "确定",
                            "iscancel": true,
                            "action": function () {
                                if (callback)
                                    callback(true);
                            }
                        },
                        {
                            "class": "btn-sm btn-secondary",
                            "text": "取消",
                            "iscancel": true,
                            "action": function () {
                                if (callback)
                                    callback(false);
                            }
                        }
                    ]
                };
            }
            else {
                mfoptions.footer = {
                    "buttons": [
                        {
                            "class": "btn-sm " + btnClass,
                            "text": "确定",
                            "iscancel": true
                        }
                    ]
                };
            }
            this._dialog.updateOptions(mfoptions);
            this._dialog.setContent(message);
            this._dialog.show();
        };
        SCSimpleDialog.prototype.getData = function (name) {
            return this._data[name];
        };
        SCSimpleDialog.prototype.setData = function (name, data) {
            this._data[name] = data;
            return this;
        };
        SCSimpleDialog.prototype.showDialog = function (message, title, type, options) {
            this._showInnerForm(message, title, type, options, false);
            return this;
        };
        SCSimpleDialog.prototype.showConfirm = function (resultCallback, message, title, type, options) {
            this._showInnerForm(message, title, type, options, true, resultCallback);
            return this;
        };
        SCSimpleDialog.prototype.showAjaxErrorResponse = function (message, jqXHR, status, err, options) {
            var content = message + "<p>错误码:" + jqXHR.status + " " + err + "</p>";
            if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.Message)
                content += "<p>" + jqXHR.responseJSON.Message + "</p>";
            this.showDialog(content, "Ajax错误", "error", options);
            return this;
        };
        SCSimpleDialog.prototype.destroy = function () {
            this._dialog.destroy();
        };
        return SCSimpleDialog;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SCSimpleDialog;
});
