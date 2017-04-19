define(["require", "exports", "bootstrap"], function (require, exports) {
    "use strict";
    $.fn.modal.Constructor.prototype._adjustDialog = function () {
        var modalIsOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
        $(this._element).css({
            paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
            paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
        });
        // 弹出框居中。。。
        var $modal_dialog = $(this._element).find('.modal-dialog');
        var m_top = ($(window).height() - $modal_dialog.height()) / 2;
        if (m_top < 50)
            m_top = 50;
        $modal_dialog.css({ 'margin': m_top + 'px auto' });
    };
    var SCModalForm = (function () {
        function SCModalForm(modal, options) {
            this._flag = false;
            if (!modal)
                throw "无效的模态框对象。";
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
        SCModalForm.prototype._buildModal = function (modalDiv, options) {
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
        };
        SCModalForm.prototype._updateEvents = function (events) {
            if (events) {
                var that = this;
                this._events = events;
                if ("showing" in events) {
                    this._modal.unbind("show.bs.modal");
                    if (events["showing"])
                        this._modal.on("show.bs.modal", function (e) {
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
        };
        SCModalForm.prototype._updateCore = function (dialog, cData) {
            if (dialog && cData) {
                if (cData && cData.animation === true) {
                    this._modal.addClass("fade");
                }
                else {
                    this._modal.removeClass("fade");
                }
                if (cData.size) {
                    dialog.removeClass("modal-sm modal-lg");
                    if (cData.size == 'sm')
                        dialog.addClass("modal-sm");
                    else if (cData.size == "lg")
                        dialog.addClass("modal-lg");
                }
            }
        };
        SCModalForm.prototype._updateTitle = function (title, tData) {
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
                    if (tData["istexthtml"] === true)
                        title.append($("<span>").html(tData["text"]));
                    else
                        title.append($("<span>").text(tData["text"]));
                }
            }
        };
        SCModalForm.prototype._updateFooter = function (footer, fData) {
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
                        var btn = $("<div class='btn'>").appendTo(footer);
                        if (obtn["id"])
                            btn.attr("id", obtn["id"]);
                        if (obtn["class"])
                            btn.addClass(obtn["class"]);
                        if (obtn["iconclass"]) {
                            btn.append($("<label style='min-width: 2em;'>").addClass(obtn["iconclass"]));
                        }
                        if (obtn["text"])
                            btn.append($("<span>").text(obtn["text"]));
                        if (obtn["action"]) {
                            btn.data("btnaction", obtn["action"]); //记录action
                            btn.click(function (event) {
                                $(this).data("btnaction")(event, that); //激发事件回掉。
                            });
                        }
                        if (obtn["iscancel"])
                            btn.attr("data-dismiss", "modal");
                        else
                            btn.removeAttr("data-dismiss");
                    }
                }
            }
        };
        SCModalForm.prototype.updateOptions = function (options) {
            if (options) {
                this._updateCore(this._modal.find("#" + this._dialogId), options.core);
                this._updateTitle(this._modal.find("#" + this._titleId), options.title);
                this._updateFooter(this._modal.find("#" + this._footerId), options.footer);
            }
        };
        SCModalForm.prototype.getModal = function () {
            return this._modal;
        };
        SCModalForm.prototype.getData = function (name) {
            return this._data[name];
        };
        SCModalForm.prototype.setData = function (name, data) {
            this._data[name] = data;
            return this;
        };
        SCModalForm.prototype.removeData = function (name) {
            if (name === undefined)
                this._data = {};
            else
                delete this._data[name];
        };
        SCModalForm.prototype.setContent = function (html) {
            this._modal.find("#" + this._bodyId).html(html);
            return this;
        };
        SCModalForm.prototype.show = function () {
            var SCShow = { isShown: false, winHeight: 0, modHeight: 0 };
            var size = 0;
            this._modal.on("show.bs.modal", function (e) {
                SCShow.isShown = true;
                requestAnimationFrame(adjustDialog);
            });
            this._modal.on("hide.bs.modal", function (e) {
                SCShow.isShown = false;
            });
            function adjustDialog() {
                size = $('.modal-dialog').length;
                if (SCShow.isShown === true) {
                    var modal_dialog = $('.modal-dialog')[size - 1];
                    var winHeight = $(window).height();
                    var modHeight = $(modal_dialog).height();
                    if (SCShow.winHeight !== winHeight || Math.abs(SCShow.modHeight - modHeight) > 5) {
                        SCShow.winHeight = winHeight;
                        SCShow.modHeight = modHeight;
                        var m_top = (winHeight - modHeight) / 2;
                        if (m_top < 50)
                            m_top = 50;
                        $(modal_dialog).css({ 'margin': m_top + 'px auto' });
                    }
                    requestAnimationFrame(adjustDialog);
                }
            }
            this._modal.modal("show");
            return this;
        };
        SCModalForm.prototype.hide = function () {
            this._modal.modal("hide");
            return this;
        };
        SCModalForm.prototype.toggle = function () {
            this._modal.modal("toggle");
            return this;
        };
        SCModalForm.prototype.destroy = function () {
            if (this._hasParent) {
                var inner = this._modal.find("#" + this._bodyId).children().detach();
                this._modal.children().detach().append(inner).removeClass("hidden");
            }
            else {
                this._modal.remove();
            }
        };
        return SCModalForm;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SCModalForm;
});
