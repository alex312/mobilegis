"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "jquery", 'text!./PlotInfoSetDiv.html', 'seecool/utilities', "knockout"], function (require, exports, $, template, utilities, ko) {
    "use strict";

    var PlotInfoSet = function () {
        function PlotInfoSet(options) {
            _classCallCheck(this, PlotInfoSet);

            var lonlats = options.lonlats;
            lonlats = lonlats.map(function (v) {
                var lon = utilities.formatDegree(v[0], 'ddd-cc-mm.mmL');
                var lat = utilities.formatDegree(v[1], 'dd-cc-mm.mmB');
                return { lon: lon, lat: lat };
            });
            this.title_ = options && options.title || "新建标绘";
            this.template_ = template;
            this.viewDom_ = $(this.template_);
            this.name_ = ko.observable();
            this.remark_ = ko.observable();
            this.lonlats_ = ko.observable();
            this.viewDom_.modal({ keyboard: false, show: false });
            this.viewDom_.on('hidden.bs.modal', this.destroy.bind(this));
            this.viewDom_.on('shown.bs.modal', this.shown.bind(this));
            this.name_("");
            this.remark_("");
            this.lonlats_(lonlats);
            this.promise_ = new Promise(function (resolve, reject) {
                this.ok_ = function () {
                    ////取目标
                    //var name$ = this.viewDom_.find('#plotName');
                    //var remark$ = this.viewDom_.find('#plotRemark');
                    //var lonlats$ = this.viewDom_.find("#lonlats");
                    //取值
                    var name = this.name_();
                    var remark = this.remark_();
                    var lonlats = this.lonlats_();
                    //验证
                    var ready = this.validate_(name, null, lonlats);
                    //确认返回
                    if (ready) {
                        lonlats = lonlats.map(function (v) {
                            var lon = utilities.degreeToDecimal(v.lon);
                            var lat = utilities.degreeToDecimal(v.lat);
                            return { lon: lon, lat: lat };
                        });
                        resolve({ state: "ok", data: { name: name, remark: remark, lonlats: lonlats } });
                        this.viewDom_.modal('hide');
                    }
                }.bind(this);
                this.cancel_ = function () {
                    reject({ state: "cancel", data: null });
                }.bind(this);
                // title: "<div class='widget-header'><h4 class='smaller'>新建标绘</h4></div>",//"提示",
                //     title_html:true,
                //     resizable: false,
                //     autoOpen: true,
                //     modal: true,
                //     width: '350px',
                //     buttons: buttons,
                //     close: function () {
                //     this.viewDom_.dialog('destroy');
                //     reject({state: "close", data: null});
                // }.bind(this)
            }.bind(this));
            ko.applyBindings(this, this.viewDom_[0]);
        }

        _createClass(PlotInfoSet, [{
            key: "show",
            value: function show() {
                this.viewDom_.modal('show');
                return this.promise_;
            }
        }, {
            key: "shown",
            value: function shown() {
                var t = this.viewDom_.find("[data-dismiss='modal']");
                if (t.length == 0) t = this.viewDom_.find("button");
                t.focus();
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

        return PlotInfoSet;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PlotInfoSet;
});