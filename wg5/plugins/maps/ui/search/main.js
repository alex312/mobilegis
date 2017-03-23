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
define(["require", "exports", "../../../../seecool/plugins/Plugins", "./ResultView"], function (require, exports, Plugins_1, ResultView_1) {
    "use strict";

    var Search = function () {
        function Search(config, frame) {
            _classCallCheck(this, Search);

            this.providers_ = [];
            var toolbar = frame.toolbars['left'];
            var sideView = frame.sideView;
            var view = new ResultView_1.default({ providers: this.providers_ });
            var input = toolbar.addInput({
                type: 'search',
                placeholder: '搜索',
                flex: 1
            });
            function doSearch() {
                var keyword = input.value.trim();
                if (keyword) {
                    view.search(keyword);
                    sideView.open(view);
                } else {
                    sideView.close(view);
                }
            }
            $(input).keydown(function (evt) {
                if (evt.keyCode === 10 || evt.keyCode === 13) doSearch();
            });
            toolbar.addButton({
                icon: 'icon-toolbar-search',
                css: 'search',
                click: doSearch
            });
        }

        _createClass(Search, [{
            key: "addProvider",
            value: function addProvider(provider) {
                if (this.providers_.indexOf(provider) < 0) return this.providers_.push(provider);
            }
        }, {
            key: "removeProvider",
            value: function removeProvider(provider) {
                var idx = this.providers_.indexOf(provider);
                if (idx >= 0) this.providers_.splice(idx, 1);
            }
        }]);

        return Search;
    }();

    Search = __decorate([__param(1, Plugins_1.inject('maps/ui/uiFrame'))], Search);
    exports.Search = Search;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Search;
});