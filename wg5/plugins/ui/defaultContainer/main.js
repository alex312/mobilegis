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
define(["require", "exports", "jquery", "../../../seecool/plugins/Plugins"], function (require, exports, $, Plugins_1) {
    "use strict";
    //import "css!./layout.css";

    var DefaultContainerPlugin = function () {
        function DefaultContainerPlugin(config, frame) {
            _classCallCheck(this, DefaultContainerPlugin);

            this.mainMenuMap_ = {};
            this.containers = {};
            this.items_ = {};
            this.element_ = frame.get("container");
            this.items_['viewDom'] = $(this.element_)[0];
            // this.items_['menuHandle'] = this.items_['viewDom'].find('.sc-left-menu-handle');
            // $(htmlTemplate).appendTo(this.items_['menuItems']);
            // this.items_['mainMenu'] = this.items_['viewDom'].find('[name="mainMenu"]');
        }

        _createClass(DefaultContainerPlugin, [{
            key: "showContainer",
            value: function showContainer(name, dom, option) {
                var t = $(this.items_['viewDom']);
                if (dom) {
                    if (name in this.containers) {
                        this.containers[name].dom.remove();
                    }
                    this.containers[name] = { dom: dom, option: option };
                    t.append(this.containers[name].dom);
                }
                for (var i in this.containers) {
                    var I = this.containers[i].dom;
                    I.addClass('hide');
                }
                if (name in this.containers) {
                    this.containers[name].dom.removeClass('hide');
                    var opt = this.containers[name].option;
                    if (opt && opt.useMinHeight) {
                        t.addClass('use-min-height');
                    } else {
                        t.removeClass('use-min-height');
                    }
                }
            }
        }, {
            key: "destroy",
            value: function destroy() {}
        }, {
            key: "get",
            value: function get(name) {
                return this.items_[name][0] || null;
            }
        }]);

        return DefaultContainerPlugin;
    }();

    DefaultContainerPlugin = __decorate([__param(1, Plugins_1.inject("ui/frame"))], DefaultContainerPlugin);
    exports.DefaultContainerPlugin = DefaultContainerPlugin;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DefaultContainerPlugin;
});