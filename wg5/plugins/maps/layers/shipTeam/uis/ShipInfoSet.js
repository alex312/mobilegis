"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "text!plugins/maps/layers/shipTeam/uis/ShipInfoSetDiv.html", "knockout"], function (require, exports, ShipInfoSetDiv, ko) {
    "use strict";

    var ShipInfoSet = function () {
        function ShipInfoSet(option) {
            _classCallCheck(this, ShipInfoSet);

            this.dataModel = {
                name: option.name || ""
            };
            this.ui = $(ShipInfoSetDiv);
            this.viewModel = {
                name: ko.observable()
            };
            this.viewModel.name(this.dataModel.name);
            ko.applyBindings(this.viewModel, this.ui[0]);
        }

        _createClass(ShipInfoSet, [{
            key: "Show",
            value: function Show() {
                return new Promise(function (resolve, reject) {
                    var buttons = [{ text: '确定', 'class': 'btn btn-primary', click: null }, { text: '取消', 'class': 'btn btn-secondary', click: null }];
                    buttons[0].click = function () {
                        ////取目标
                        //var name$ = this.ui.find('#plotName');
                        //var remark$ = this.ui.find('#plotRemark');
                        //var lonlats$ = this.ui.find("#lonlats");
                        //取值
                        var name = this.viewModel.name();
                        //验证
                        var ready = this.validate(name);
                        //确认返回
                        if (ready) {
                            this.ui.dialog('destroy');
                            var t = this.dataModel;
                            t.name = name;
                            resolve({ state: "ok", data: this.dataModel });
                        }
                    }.bind(this);
                    buttons[1].click = function () {
                        this.ui.dialog('destroy');
                        reject({ state: "cancel", data: null });
                    }.bind(this);
                    this.ui.dialog({
                        title: "添加船只",
                        resizable: false,
                        autoOpen: true,
                        modal: true,
                        width: 'auto',
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
            value: function validate(name) {
                if (!name || name.trim().length === 0) {
                    alert("MMSI不能为空.");
                    return false;
                }
                return true;
            }
        }]);

        return ShipInfoSet;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipInfoSet;
});