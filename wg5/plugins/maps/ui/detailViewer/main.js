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
define(["require", "exports", "jquery", "../../../../seecool/plugins/Plugins", "./ResultView"], function (require, exports, $, Plugins_1, ResultView_1) {
    "use strict";

    var DetailViewer = function () {
        function DetailViewer(config, map, frame) {
            _classCallCheck(this, DetailViewer);

            this.handleSelectFocusCallBackList_ = {};
            this.map_ = map;
            this.frame_ = frame;
            this.map_.bind("selectFeatureChange", this.showSelectedObjInfo.bind(this));
        }

        _createClass(DetailViewer, [{
            key: "registerSelectFocusEvent",
            value: function registerSelectFocusEvent(name, callback) {
                this.handleSelectFocusCallBackList_[name] = callback;
            }
        }, {
            key: "removeSelectFocusEvent",
            value: function removeSelectFocusEvent(name) {
                if (name in this.handleSelectFocusCallBackList_) {
                    delete this.handleSelectFocusCallBackList_[name];
                }
            }
        }, {
            key: "showSelectedObjInfo",
            value: function showSelectedObjInfo(target, feature) {
                var resultView = new ResultView_1.ResultView();
                var tabTitle = $(resultView.get('tabTitle'));
                tabTitle.empty();
                var tabContent = $(resultView.get('tabContent'));
                tabContent.empty();
                var tabs = {};
                function tabChange(evt) {
                    var count = $(evt.target.parentNode).data('count');
                    for (var i in tabs) {
                        var el = tabs[i];
                        if (count == i) {
                            el.li.addClass("active");
                            el.div.addClass("fade in active");
                        } else {
                            el.li.removeClass("active");
                            el.div.removeClass("fade in active");
                        }
                    }
                    resultView.doLayout();
                    return false;
                }
                for (var i in this.handleSelectFocusCallBackList_) {
                    var func = this.handleSelectFocusCallBackList_[i];
                    Promise.resolve(func(feature)).then(function (domElement) {
                        if (domElement) {
                            // domElement.data('index',i);
                            // tabs[i]=domElement;
                            //
                            // var count = tabTitle[0].children.length;
                            // var tid = 'objInfo' + count;
                            //
                            // var title = domElement.data('title');
                            // $(`<li><a data-toggle="tab" href="[name='${tid}']">${title}</a></li>`).appendTo(tabTitle);
                            // $(`<div class="tab-pane" name="${tid}"></div>`).append(domElement).appendTo(tabContent);
                            var count = tabTitle[0].children.length;
                            //domElement.data('index', i);
                            //var tid = 'objInfo' + count;
                            var title = domElement.data('title');
                            var li = $("<li><a href=\"#\">" + title + "</a></li>").data('count', count).click(tabChange).appendTo(tabTitle);
                            var div = $("<div class=\"tab-pane\"></div>").append(domElement).appendTo(tabContent); //name="${tid}"
                            tabs[count] = { li: li, div: div };
                            tabChange({ target: tabs[0].li.children('a')[0] });
                        }
                    });
                }
                if (feature) {
                    this.frame_.sideView.open(resultView);
                }
            }
        }]);

        return DetailViewer;
    }();

    DetailViewer = __decorate([__param(1, Plugins_1.inject("maps/map")), __param(2, Plugins_1.inject('maps/ui/uiFrame'))], DetailViewer);
    exports.DetailViewer = DetailViewer;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DetailViewer;
});