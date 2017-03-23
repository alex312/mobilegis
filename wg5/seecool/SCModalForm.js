"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports"], function (require, exports) {
    "use strict";

    $.fn.modal.Constructor.prototype.adjustDialog = function () {
        var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
            paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
        });
        // 弹出框居中。。。
        var $modal_dialog = $(this.$element[0]).find('.modal-dialog');
        var m_top = ($(window).height() - $modal_dialog.height()) / 2;
        if (m_top < 50) m_top = 50;
        $modal_dialog.css({ 'margin': m_top + 'px auto' });
    };

    var SCModalForm = function () {
        function SCModalForm(modal, options) {
            _classCallCheck(this, SCModalForm);

            if (!modal) throw "无效的模态框对象。";
            modal = $(modal); //jquery对象确认。
            this._modal = modal;
            this._hasParent = modal.parent().length > 0;
            //this._events;
            this._data = {};
            this._dialogId = undefined;
            this._bodyId = undefined;
            this._titleId = undefined;
            this._footerId = undefined;
            var inner = modal.children().detach();
            if (inner) {
                if (inner.hasClass("modal-dialog")) {
                    if (inner.find(".modal-content .modal-body").length > 0) {
                        inner = inner.find(".modal-content .modal-body").children().detach();
                    }
                }
            }
            this._buildModal(modal, options);
            this._modal.find("#" + this._bodyId).append(inner); //附加原始对象。
        }

        _createClass(SCModalForm, [{
            key: "_buildModal",
            value: function _buildModal(modalDiv, options) {
                var modalId = modalDiv.attr("id") ? modalDiv.attr("id") : "custom";
                // modalDiv.empty(); //清空。
                //基本设置
                modalDiv.removeClass("hidden").removeClass("hide").addClass("modal");
                modalDiv.attr("role", "dialog");
                modalDiv.attr("tabindex", -1);
                if (!(options.core && options.core.animation === false)) {
                    modalDiv.addClass("fade");
                }
                if (options.events) {
                    this._updateEvents(options.events);
                }
                //窗口。
                this._dialogId = modalId + "-m-d-id";
                var dialog = $("<div class='modal-dialog'>").attr("id", this._dialogId).appendTo(modalDiv);
                if (options.core) {
                    this._updateCore(dialog, options.core);
                }
                //内容
                var content = $("<div class='modal-content'>").appendTo(dialog);
                //标题
                var header = $("<div class='modal-header'>").appendTo(content);
                header.append($("<button class='close' type='button' data-dismiss='modal'>").html("&times;"));
                this._titleId = modalId + "-m-t-id";
                var title = $("<h4 class='modal-title'>").attr("id", this._titleId).appendTo(header);
                if (options.title) {
                    this._updateTitle(title, options.title);
                }
                //正文。
                var mbody = $("<div class='modal-body'>").appendTo(content);
                this._bodyId = modalId + "-m-b-id";
                mbody.attr("id", this._bodyId);
                //页脚。
                this._footerId = modalId + "-m-f-id";
                var mfooter = $("<div class='modal-footer'>").attr("id", this._footerId).appendTo(content);
                if (options.footer) {
                    this._updateFooter(mfooter, options.footer);
                }
            }
        }, {
            key: "_updateEvents",
            value: function _updateEvents(events) {
                if (events) {
                    var that = this;
                    this._events = events;
                    if ("showing" in events) {
                        this._modal.unbind("show.bs.modal");
                        if (events["showing"]) this._modal.on("show.bs.modal", function (e) {
                            that._events["showing"](e, that);
                        });
                    }
                    if ("shown" in events) {
                        this._modal.unbind("shown.bs.modal");
                        if (events["shown"]) {
                            this._modal.on("shown.bs.modal", function (e) {
                                that._events["shown"](e, that);
                            });
                        }
                    }
                    if ("hiding" in events) {
                        this._modal.unbind("hide.bs.modal");
                        if (events["hiding"]) {
                            this._modal.on("hide.bs.modal", function (e) {
                                that._events["hiding"](e, that);
                            });
                        }
                    }
                    if ("hidden" in events) {
                        this._modal.unbind("hidden.bs.modal");
                        if (events["hidden"]) {
                            this._modal.on("hidden.bs.modal", function (e) {
                                that._events["hidden"](e, that);
                            });
                        }
                    }
                }
            }
        }, {
            key: "_updateCore",
            value: function _updateCore(dialog, cData) {
                if (dialog && cData) {
                    if (cData && cData.animation === true) {
                        this._modal.addClass("fade");
                    } else {
                        this._modal.removeClass("fade");
                    }
                    if (cData.size) {
                        dialog.removeClass("modal-sm modal-lg");
                        if (cData.size == 'sm') dialog.addClass("modal-sm");else if (cData.size == "lg") dialog.addClass("modal-lg");
                    }
                }
            }
        }, {
            key: "_updateTitle",
            value: function _updateTitle(title, tData) {
                if (title && tData) {
                    if (tData["class"]) {
                        title.removeClass().addClass("modal-title");
                        title.addClass(tData["class"]);
                    }
                    if (tData["iconclass"]) {
                        title.find("label").first().remove();
                        title.append($("<label style='min-width: 1.5em;'>").addClass(tData["iconclass"]));
                    }
                    if (tData["text"]) {
                        title.find("span").first().remove();
                        if (tData["istexthtml"] === true) title.append($("<span>").html(tData["text"]));else title.append($("<span>").text(tData["text"]));
                    }
                }
            }
        }, {
            key: "_updateFooter",
            value: function _updateFooter(footer, fData) {
                var that = this;
                if (footer && fData) {
                    if (fData["class"]) {
                        footer.removeClass().addClass("modal-footer");
                        footer.addClass(fData["class"]);
                    }
                    if (fData.buttons) {
                        footer.children().remove();
                        for (var i = 0; i < fData.buttons.length; i++) {
                            var obtn = fData.buttons[i];
                            var btn = $("<div class='btn btn-default'>").appendTo(footer);
                            if (obtn["id"]) btn.attr("id", obtn["id"]);
                            if (obtn["class"]) btn.addClass(obtn["class"]);
                            if (obtn["iconclass"]) {
                                btn.append($("<label style='min-width: 2em;'>").addClass(obtn["iconclass"]));
                            }
                            if (obtn["text"]) btn.append($("<span>").text(obtn["text"]));
                            if (obtn["action"]) {
                                btn.data("btnaction", obtn["action"]); //记录action
                                btn.click(function (event) {
                                    $(this).data("btnaction")(event, that); //激发事件回掉。
                                });
                            }
                            if (obtn["iscancel"]) btn.attr("data-dismiss", "modal");else btn.removeAttr("data-dismiss");
                        }
                    }
                }
            }
        }, {
            key: "updateOptions",
            value: function updateOptions(options) {
                if (options) {
                    this._updateCore(this._modal.find("#" + this._dialogId), options.core);
                    this._updateTitle(this._modal.find("#" + this._titleId), options.title);
                    this._updateFooter(this._modal.find("#" + this._footerId), options.footer);
                }
            }
        }, {
            key: "getModal",
            value: function getModal() {
                return this._modal;
            }
        }, {
            key: "getData",
            value: function getData(name) {
                return this._data[name];
            }
        }, {
            key: "setData",
            value: function setData(name, data) {
                this._data[name] = data;
                return this;
            }
        }, {
            key: "removeData",
            value: function removeData(name) {
                if (name === undefined) this._data = {};else delete this._data[name];
            }
        }, {
            key: "setContent",
            value: function setContent(html) {
                this._modal.find("#" + this._bodyId).html(html);
                return this;
            }
        }, {
            key: "show",
            value: function show() {
                this._modal.modal("show");
                return this;
            }
        }, {
            key: "hide",
            value: function hide() {
                this._modal.modal("hide");
                return this;
            }
        }, {
            key: "toggle",
            value: function toggle() {
                this._modal.modal("toggle");
                return this;
            }
        }, {
            key: "destroy",
            value: function destroy() {
                if (this._hasParent) {
                    var inner = this._modal.find("#" + this._bodyId).children().detach();
                    this._modal.children().detach().append(inner).removeClass("hidden");
                } else {
                    this._modal.remove();
                }
            }
        }]);

        return SCModalForm;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SCModalForm;
});