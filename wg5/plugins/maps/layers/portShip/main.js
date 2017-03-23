"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = undefined && undefined.__param || function (paramIndex, decorator) {
    return function (target, key) {
        decorator(target, key, paramIndex);
    };
};
define(["require", "exports", "jquery", "text!./sidePanel.html", "knockout", "../../../../seecool/plugins/Plugins", "../../../../seecool/StaticLib", "./SidePanel", "highcharts"], function (require, exports, $, sidePanal, ko, Plugins_1, StaticLib_1, SidePanel_1) {
    "use strict";

    var NOTION = function () {
        function NOTION() {
            _classCallCheck(this, NOTION);
        }

        _createClass(NOTION, [{
            key: "parse",
            value: function parse(str) {}
        }]);

        return NOTION;
    }();

    var PortShipPlugin = function () {
        function PortShipPlugin(config, frame) {
            _classCallCheck(this, PortShipPlugin);

            this.chartTitle_ = {};
            this.config_ = config;
            this.frame_ = frame;
            // ui.RegisterMainMenu(null, "specialShipMenuLink", "在港船舶统计", this.menuClick.bind(this), {iconFont: 'fa-bar-chart-o'});//,{iconFont:"fa-random"}
            var toolbar = frame.toolbars['right'];
            toolbar.addButton({
                text: '在港船舶统计',
                icon: 'fa fa-pie-chart',
                click: function () {
                    var page = $(document.createElement('div')).css({ width: '100%', height: '100%', border: '0', overflow: 'hidden', display: 'none' }).appendTo(document.body);
                    var pageHead = $(document.createElement('div')).attr('id', 'header').appendTo(page);
                    var pageBodyOut = $(document.createElement('div')).appendTo(page);
                    var pageBody = $(document.createElement('div')).appendTo(pageBodyOut);
                    this.colLeft_ = $(document.createElement('div')).addClass('sidebar').appendTo(pageBody);
                    this.colMain_ = $(document.createElement('div')).appendTo(pageBody);
                    page.kendoSplitter({
                        orientation: "vertical",
                        panes: [{ collapsible: false, size: "42px" }, { collapsible: false, resizable: false }]
                    });
                    pageBody.kendoSplitter({
                        orientation: "horizontal",
                        panes: [{ collapsible: false, resizable: false, size: '200px' }, { collapsible: false, resizable: false }]
                    });
                    $('<div class="logo"></div>').appendTo(pageHead);
                    var headField = $('<div class="head-field"></div>').appendTo(pageHead);
                    this.getListTable_();
                }.bind(this)
            });
        }

        _createClass(PortShipPlugin, [{
            key: "getListTable_",
            value: function getListTable_() {
                $.ajax({
                    type: "get",
                    url: this.config_.allports2Api || "api/allports2"
                }).done(this.getListTableDone_.bind(this)).fail(this.getListTableFail_.bind(this));
            }
        }, {
            key: "getListTableFail_",
            value: function getListTableFail_(jqXHR, textStatus) {
                if (textStatus !== 'abort') {
                    alert("获取数据失败");
                }
            }
        }, {
            key: "getListTableDone_",
            value: function getListTableDone_(data) {
                data = JSON.parse(data);
                this.getData_ = data.sort(function (a, b) {
                    var bt = b.kship + b.hship + b.yship + b.yuship + b.gship + b.qship;
                    var at = a.kship + a.hship + a.yship + a.yuship + a.gship + a.qship;
                    return bt - at;
                });
                var left = $(sidePanal);
                this.viewModel_ = {
                    maxTenPortName: ko.observable(),
                    maxTenPortSum: ko.observable(),
                    maxTenPortClick: this.defaultPlan_.bind(this),
                    portShipListData: ko.observable()
                };
                var index = 0;
                var list = this.getData_.map(function (v) {
                    return {
                        index: index++,
                        name: v.Name,
                        value: v.kship + v.hship + v.yship + v.yuship + v.gship + v.qship,
                        portShipListClick: this.do_search_.bind(this)
                    };
                }.bind(this));
                this.viewModel_.maxTenPortName('');
                this.viewModel_.maxTenPortSum(0);
                this.viewModel_.portShipListData(list);
                // ko.applyBindings(this.viewModel, left[0]);
                // this.ui.ShowSidePanel("在港船舶", left);
                this.frame_.sideView.open(new SidePanel_1.default(this.viewModel_));
                if (this.getData_.length) {
                    this.defaultPlan_(this.viewModel_);
                }
            }
        }, {
            key: "showMainPanal_",
            value: function showMainPanal_() {
                if (!this.main_) {
                    this.main_ = $("<div></div>").css({ width: '100%', height: '100%', border: 0 }).appendTo(this.colMain_);
                    this.mainTop_ = $("<div></div>").addClass('map-toolbar').appendTo(this.main_);
                    this.mainBottom_ = $("<div></div>").appendTo(this.main_);
                    this.chartTitle_ = $(document.createElement('div')).css({ 'float': 'left' }).addClass('shipcount-title').appendTo(this.mainTop_);
                    this.plan_ = $('<div></div>').css({ 'min-width': '400px', height: '70%', width: '100%', 'z-index': '1', 'margin-top': '30px' }).appendTo(this.mainBottom_);
                    this.main_.dialog({
                        width: 'auto'
                    });
                } else if (!this.main_.dialog('isOpen')) {
                    this.main_.dialog('open');
                }
            }
        }, {
            key: "defaultPlan_",
            value: function defaultPlan_(target) {
                var topNum = 10;
                var defaultDataTotal = 0;
                var defaultData = [];
                for (var i = 0; i < this.getData_.length && i < topNum; i++) {
                    var item = this.getData_[i];
                    defaultData.push([item.Name, item.kship + item.hship + item.yship + item.yuship + item.gship + item.qship]);
                    defaultDataTotal += item.kship + item.hship + item.yship + item.yuship + item.gship + item.qship;
                }
                this.showMainPanal_();
                this.viewModel_.maxTenPortName('十大港口');
                this.viewModel_.maxTenPortSum(defaultDataTotal);
                this.chartTitle_.text("当前统计图：船舶数量排名前 " + topNum + " 港口" + " （数量：" + defaultDataTotal + "艘）");
                this.showPlan_('十大港口', defaultData);
                //utils.notificationCenter.send('use/frequency', '在港船舶/十大港口');
            }
        }, {
            key: "do_search_",
            value: function do_search_(target) {
                var index = target.index;
                var item = this.getData_[index];
                this.showMainPanal_();
                this.chartTitle_.text("当前港口：" + item.Name + " （数量：" + (item.kship + item.hship + item.yship + item.yuship + item.gship + item.qship) + "艘）");
                var shipTypeData = [['客船', item.kship], ['货船', item.hship], ['油船', item.yship], ['渔船', item.yuship], ['公务船', item.gship], ['其他', item.qship]];
                this.showPlan_(item.Name, shipTypeData);
                //utils.notificationCenter.send('use/frequency', '在港船舶/' + item.Name);
            }
        }, {
            key: "showPlan_",
            value: function showPlan_(title, aa) {
                if (this.chart_) {
                    this.chart_.destroy();
                    this.chart_ = null;
                }
                this.chart_ = StaticLib_1.chartFactory(title + '在港船舶统计图', this.plan_[0], aa);
            }
        }]);

        return PortShipPlugin;
    }();

    PortShipPlugin = __decorate([__param(1, Plugins_1.inject('maps/ui/uiFrame'))], PortShipPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PortShipPlugin;
});