"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "jquery", "text!./WorkViewInfoSetDiv.html", "../../../../../seecool/utilities", "knockout"], function (require, exports, $, WorkViewInfoSetDiv, utilities, ko) {
    "use strict";

    var WorkViewInfoSet = function () {
        function WorkViewInfoSet(option) {
            _classCallCheck(this, WorkViewInfoSet);

            this.dataModel = {
                lonlat: option.lonlat || [0, 0],
                zoom: option.zoom || 1
            };
            this.ui = $(WorkViewInfoSetDiv);
            this.viewModel = {
                name: ko.observable(),
                zoom: ko.observable(),
                lon: ko.observable(),
                lat: ko.observable()
            };
            var lon = utilities.formatDegree(this.dataModel.lonlat[0], 'ddd-cc-mm.mmL');
            var lat = utilities.formatDegree(this.dataModel.lonlat[1], 'dd-cc-mm.mmB');
            this.viewModel.name("");
            this.viewModel.zoom(this.dataModel.zoom);
            this.viewModel.lon(lon);
            this.viewModel.lat(lat);
            ko.applyBindings(this.viewModel, this.ui[0]);
        }
        //public get UI(){
        //    return this.ui_;
        //}


        _createClass(WorkViewInfoSet, [{
            key: "Show",
            value: function Show() {
                return new Promise(function (resolve, reject) {
                    var buttons = [{ text: '确定', click: null, 'class': 'btn btn-primary' }, { text: '取消', click: null, 'class': 'btn btn-secondary' }];
                    buttons[0].click = function () {
                        ////取目标
                        //var name$ = this.ui.find('#plotName');
                        //var remark$ = this.ui.find('#plotRemark');
                        //var lonlats$ = this.ui.find("#lonlats");
                        //取值
                        var name = this.viewModel.name();
                        var zoom = this.viewModel.zoom();
                        var lon = this.viewModel.lon();
                        var lat = this.viewModel.lat();
                        //验证
                        var ready = this.validate(name, null, lon, lat);
                        //确认返回
                        if (ready) {
                            this.ui.dialog('destroy');
                            lon = utilities.degreeToDecimal(lon);
                            lat = utilities.degreeToDecimal(lat);
                            var lonlat = [lon, lat];
                            var t = this.dataModel;
                            t.name = name;
                            t.zoom = zoom;
                            t.lonlat = lonlat;
                            resolve({ state: "ok", data: this.dataModel });
                        }
                    }.bind(this);
                    buttons[1].click = function () {
                        this.ui.dialog('destroy');
                        reject({ state: "cancel", data: null });
                    }.bind(this);
                    this.ui.dialog({
                        title: "新建工作区",
                        resizable: false,
                        autoOpen: true,
                        modal: true,
                        width: '450px',
                        buttons: buttons,
                        close: function () {
                            this.ui.dialog('destroy');
                            reject({ state: "close", data: null });
                        }.bind(this)
                    });
                }.bind(this));
            }
        }, {
            key: "validate",
            value: function validate(name, remark, lonlats) {
                if (!name || name.trim().length === 0) {
                    alert("名称不能为空.");
                    return false;
                }
                return true;
            }
        }]);

        return WorkViewInfoSet;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WorkViewInfoSet;
});