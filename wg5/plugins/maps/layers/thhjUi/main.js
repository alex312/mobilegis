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
define(["require", "exports", "jquery", "text!plugins/maps/layers/thhjUi/htmls/ObjInfo.html", "knockout", "../../../../seecool/plugins/Plugins", "./SidePanel", "../../../../seecool/StaticLib"], function (require, exports, $, objInfo, ko, Plugins_1, SidePanel_1, StaticLib_1) {
    "use strict";

    var ThhjUiPlugin = function () {
        function ThhjUiPlugin(config, thhj, search, frame, detailViewer, setting) {
            _classCallCheck(this, ThhjUiPlugin);

            this.thhj_ = thhj;
            this.setting_ = setting;
            var sideView = frame.sideView;
            this.detailViewer_ = detailViewer;
            var toolbar = frame.toolbars['right'];
            toolbar.addButton({
                text: '通航环境',
                icon: 'fa fa-th',
                click: function () {
                    var group = [];
                    var features = this.thhj_.layerSource.getFeatures();
                    features.map(function (f) {
                        if (!(f.data.TrafficEnvType in group)) {
                            group[f.data.TrafficEnvType] = {
                                id: 'thhjCollapse' + f.data.TrafficEnvType,
                                hid: '#thhjCollapse' + f.data.TrafficEnvType,
                                thhjGroupName: this.thhj_.getTrafficEnvType(f.data.TrafficEnvType).label,
                                thhjGroupList: []
                            };
                        }
                        if (!f.data) {
                            console.log("f", f);
                            group[f.data.TrafficEnvType].thhjGroupList.push({
                                data: "_",
                                target: f,
                                thhjListClick: this.thhjListClick.bind(this)
                            });
                        } else {
                            group[f.data.TrafficEnvType].thhjGroupList.push({
                                data: f.data.Name || "_",
                                target: f,
                                thhjListClick: this.thhjListClick.bind(this)
                            });
                        }
                    }.bind(this));
                    var thhjdata = [];
                    for (var i in group) {
                        thhjdata.push(group[i]);
                    }
                    sideView.open(new SidePanel_1.default({
                        thhjdata: thhjdata
                    }));
                }.bind(this)
            });
            // this.status_ = new Status(this);
            // this.status_.ConditionTurn(true, "hided");//hided
            // this.switch_(null);
            this.isLayerShow_ = ko.observable(true);
            this.isLayerShow_.subscribe(function (v) {
                this.setVisible(v);
            }.bind(this));
            var switch1 = StaticLib_1.CheckBox({
                checked: this.isLayerShow_,
                view: "通航环境",
                click: this.switch_.bind(this)
            });
            this.setting_.registerSettingElement("mapSwitch", switch1);
            this.detailViewer_.registerSelectFocusEvent("thhjSelectFocus", this.featureSelected_.bind(this));
            search.addProvider({
                thhj_: this.thhj_,
                search: function search(keyword) {
                    var thhj = this.thhj_;
                    return new Promise(function (resolve, reject) {
                        var r = thhj.searchDatas(keyword).map(function (v) {
                            return {
                                type: "thhj",
                                id: v.target.Id,
                                match: v.data,
                                tags: ['通航要素'],
                                title: v.data,
                                target: v.target
                            };
                        });
                        resolve(r);
                    });
                },
                onItemClick: function onItemClick(item) {
                    if (item.type === 'thhj') {
                        this.thhj_.setFocus(item.id);
                        return true;
                    }
                }
            });
        }

        _createClass(ThhjUiPlugin, [{
            key: "switch_",
            value: function switch_() {
                if (this.isLayerShow_()) {
                    this.isLayerShow_(false);
                } else {
                    this.isLayerShow_(true);
                }
            }
        }, {
            key: "setVisible",
            value: function setVisible(isShow) {
                this.thhj_.setVisible(isShow);
                this.isLayerShow_(isShow);
            }
        }, {
            key: "featureSelected_",
            value: function featureSelected_(feature) {
                if (!feature) return;
                var featureId = feature.id;
                if (!(typeof featureId == "string" && featureId.startsWith('thhj:'))) return null;
                //var feature = this.layerEntity_.layer.getFeatureById(featureId);
                var data = feature.data;
                var shipName = "?";
                if (data) {
                    shipName = data.name;
                    var oi = $(objInfo);
                    var viewModel = {
                        Name: data.Name,
                        AliasName1: data.AliasName1,
                        AliasName2: data.AliasName2,
                        AttachmentGroupKey: data.AttachmentGroupKey,
                        Comments: data.Comments,
                        FullName: data.FullName,
                        PortAreaId: data.PortAreaId,
                        TrafficEnvType: this.thhj_.getTrafficEnvType(data.TrafficEnvType).label
                    };
                    ko.applyBindings(viewModel, oi[0]);
                    oi.data("title", "通航物标信息");
                    return oi;
                }
                return oi;
            }
        }, {
            key: "thhjListClick",
            value: function thhjListClick(data, evt) {
                this.thhj_.setFocus(data.target.data.Id);
                console.log("click");
            }
        }]);

        return ThhjUiPlugin;
    }();

    ThhjUiPlugin = __decorate([__param(1, Plugins_1.inject('maps/layers/thhj')), __param(2, Plugins_1.inject('maps/ui/search')), __param(3, Plugins_1.inject('maps/ui/uiFrame')), __param(4, Plugins_1.inject("maps/ui/detailViewer")), __param(5, Plugins_1.inject("maps/tools/setting"))], ThhjUiPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ThhjUiPlugin;
});