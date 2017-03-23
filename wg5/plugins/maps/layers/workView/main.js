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
define(["require", "exports", "openlayers", "knockout", "../../../../seecool/plugins/Plugins", "./uis/WorkViewInfoSet", "./SidePanel", "../plotUi/uis/Alarm"], function (require, exports, ol, ko, Plugins_1, WorkViewInfoSet_1, SidePanel_1, Alarm_1) {
    "use strict";

    var WorkViewPlugin = function () {
        function WorkViewPlugin(config, frame, user, map) {
            _classCallCheck(this, WorkViewPlugin);

            this.config_ = config || {};
            this.map_ = map || {};
            //ui.RegisterToolButton("workView","workView","工作区",this.workViewList.bind(this));
            // ui.RegisterMainMenu(null, "workView", "工作区", this.workViewList_.bind(this));
            this.user_ = user;
            this.workView_ = this.getWorkView_();
            this.sideView_ = frame.sideView;
            var toolbar = frame.toolbars['right'];
            toolbar.addButton({
                text: '工作区',
                icon: 'fa fa-bookmark-o',
                click: function () {
                    // var panel = $(sidePanelDiv);
                    // this.ui_.ShowSidePanel("工作区", panel);
                    var workViewListdata = this.workView_.map(function (v) {
                        return {
                            name: v.name,
                            value: v,
                            workViewClick: this.workViewClick_.bind(this),
                            workViewDelete: this.workViewDelete_.bind(this)
                        };
                    }.bind(this));
                    this.sidePanlviewModel_ = {
                        workViewCurrent: this.workViewCurrent_.bind(this),
                        workViewData: ko.observable()
                    };
                    this.sidePanlviewModel_.workViewData(workViewListdata);
                    this.sideView_.open(new SidePanel_1.default(this.sidePanlviewModel_));
                }.bind(this)
            });
        }

        _createClass(WorkViewPlugin, [{
            key: "getWorkView_",
            value: function getWorkView_() {
                return this.user_.getSetting()['workView'] || [];
            }
        }, {
            key: "setWorkView_",
            value: function setWorkView_(workView) {
                var t = this.user_.getSetting();
                t['workView'] = workView;
                this.user_.upLoadSetting();
            }
        }, {
            key: "workViewList_",
            value: function workViewList_() {
                // var panel = $(sidePanelDiv);
                // this.ui_.ShowSidePanel("工作区", panel);
                var workViewListdata = this.workView_.map(function (v) {
                    return {
                        name: v.name,
                        value: v,
                        workViewClick: this.workViewClick_.bind(this),
                        workViewDelete: this.workViewDelete_.bind(this)
                    };
                }.bind(this));
                this.sidePanlviewModel_ = {
                    workViewCurrent: this.workViewCurrent_.bind(this),
                    workViewData: ko.observable()
                };
                this.sidePanlviewModel_.workViewData(workViewListdata);
                this.sideView_.push(new SidePanel_1.default(this.sidePanlviewModel_));
            }
        }, {
            key: "workViewCurrent_",
            value: function workViewCurrent_() {
                var view = this.map_.map.getView();
                var zoom = view.getZoom();
                var lonlat = view.getCenter();
                lonlat = ol.proj.toLonLat(lonlat);
                var workViewInfoSet = new WorkViewInfoSet_1.default({
                    lonlat: lonlat,
                    zoom: zoom
                });
                workViewInfoSet.Show().then(function (pdata) {
                    var v = pdata.data;
                    this.workView_.push(v);
                    this.setWorkView_(this.workView_);
                    var list = this.sidePanlviewModel_.workViewData();
                    list.push({
                        name: v.name,
                        value: v,
                        workViewClick: this.workViewClick_.bind(this),
                        workViewDelete: this.workViewDelete_.bind(this)
                    });
                    this.sidePanlviewModel_.workViewData(list);
                }.bind(this));
            }
        }, {
            key: "workViewClick_",
            value: function workViewClick_(target) {
                var t = target.value;
                var lonlat = ol.proj.fromLonLat(t.lonlat);
                var view = this.map_.map.getView();
                view.setZoom(t.zoom);
                view.setCenter(lonlat);
            }
        }, {
            key: "workViewDelete_",
            value: function workViewDelete_(target, evt) {
                evt.stopPropagation();
                var massage = new Alarm_1.default({ message: "是否要删除？" });
                massage.show().then(function () {
                    this.workView_.splice(this.workView_.findIndex(function (v) {
                        if (target.value == v) return true;
                    }), 1);
                    var list = this.sidePanlviewModel_.workViewData();
                    list.splice(list.findIndex(function (v) {
                        if (target == v) return true;
                    }), 1);
                    this.sidePanlviewModel_.workViewData(list);
                    this.setWorkView_(this.workView_);
                }.bind(this));
            }
        }]);

        return WorkViewPlugin;
    }();

    WorkViewPlugin = __decorate([__param(1, Plugins_1.inject('maps/ui/uiFrame')), __param(2, Plugins_1.inject('user/info')), __param(3, Plugins_1.inject("maps/map"))], WorkViewPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WorkViewPlugin;
});