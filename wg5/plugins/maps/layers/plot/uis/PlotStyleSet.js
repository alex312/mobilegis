"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "text!./PlotStyleSetDiv.html", "knockout"], function (require, exports, template, ko) {
    "use strict";

    var PlotStyleSet = function () {
        function PlotStyleSet(options) {
            _classCallCheck(this, PlotStyleSet);

            this.template_ = template;
            this.viewDom_ = $(this.template_);
            this.title_ = options && options.title || "标绘样式设置";
            this.name_ = ko.observable(options.name || "");
            this.remark_ = ko.observable(options.remark || "");
            this.strokeColor_ = ko.observable(options.strokeColor || "#000000");
            this.strokeTypes_ = ko.observableArray([{ value: 'solid', text: '────' }, { value: 'dash', text: '-------' }]);
            this.selectedStrokeType_ = ko.observable(options.strokeType || 'solid');
            this.strokeWidths_ = ko.observableArray([{ value: '1', text: '1像素' }, { value: '2', text: '2像素' }, { value: '3', text: '3像素' }, { value: '4', text: '4像素' }]);
            this.selectedStrokeWidth_ = ko.observable(options.strokeWidth || '1');
            this.diaphas_ = ko.observableArray([{ value: '0', text: '0' }, { value: '0.1', text: '0.1' }, { value: '0.2', text: '0.2' }, { value: '0.3', text: '0.3' }, { value: '0.4', text: '0.4' }, { value: '0.5', text: '0.5' }, { value: '0.6', text: '0.6' }, { value: '0.7', text: '0.7' }, { value: '0.8', text: '0.8' }, { value: '0.9', text: '0.9' }, { value: '1', text: '1' }]);
            this.selectedDiapha_ = ko.observable(options.diapha || '0');
            this.fillColor_ = ko.observable(options.fillColor || '#000000');
            this.textColor_ = ko.observable(options.textColor || '#000000');
            this.shadowColor_ = ko.observable(options.shadowColor || '#000000');
            this.minScale_ = ko.observable(options.minScale || '4');
            this.viewDom_.modal({ keyboard: false, show: false });
            this.viewDom_.on('hidden.bs.modal', this.destroy.bind(this));
            this.promise_ = new Promise(function (resolve, reject) {
                this.cancel_ = function () {
                    reject({ state: "cancel", data: null });
                    this.viewDom_.modal('hide');
                };
                this.ok_ = function () {
                    //取值
                    var name = this.name_();
                    var remark = this.remark_();
                    var strokeColor = this.strokeColor_();
                    var strokeType = this.selectedStrokeType_();
                    var strokeWidth = this.selectedStrokeWidth_();
                    var diapha = this.selectedDiapha_();
                    var fillColor = this.fillColor_();
                    var textColor = this.textColor_();
                    var shadowColor = this.shadowColor_();
                    var minScale = this.minScale_();
                    //验证
                    var ready = this.validate_(name, null, null);
                    //确认返回
                    if (ready) {
                        //this.view.dialog('destroy');
                        resolve({ state: "ok", data: {
                                name: name,
                                remark: remark,
                                strokeColor: strokeColor,
                                strokeType: strokeType,
                                strokeWidth: strokeWidth,
                                diapha: diapha,
                                fillColor: fillColor,
                                textColor: textColor,
                                shadowColor: shadowColor,
                                minScale: minScale
                            } });
                    }
                    this.viewDom_.modal('hide');
                };
            }.bind(this));
            ko.applyBindings(this, this.viewDom_[0]);
        }

        _createClass(PlotStyleSet, [{
            key: "show",
            value: function show() {
                this.viewDom_.modal('show');
                return this.promise_;
            }
        }, {
            key: "destroy",
            value: function destroy() {
                this.viewDom_.remove();
            }
        }, {
            key: "validate_",
            value: function validate_(name, remark, lonlats) {
                if (!name || name.trim().length === 0) {
                    alert("名称不能为空.");
                    return false;
                }
                return true;
            }
        }]);

        return PlotStyleSet;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PlotStyleSet;
});