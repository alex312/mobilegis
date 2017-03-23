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
define(["require", "exports", "jquery", "text!./Layout.html", "../../../seecool/plugins/Plugins", "css!./Layout.css"], function (require, exports, $, htmlTemplate, Plugins_1) {
    "use strict";

    var DefaultInfoPlugin = function () {
        function DefaultInfoPlugin(config, frame) {
            _classCallCheck(this, DefaultInfoPlugin);

            this.mainMenuMap_ = {};
            this.items_ = {};
            this.element_ = frame.get("info");
            var template = $(htmlTemplate);
            var layout = $(this.element_).append(template.children()).addClass(template[0].className);
            this.items_['viewDom'] = layout[0];
            this.items_['infoPanel'] = layout.find('ul')[0];
        }

        _createClass(DefaultInfoPlugin, [{
            key: "registerInfoPanel",
            value: function registerInfoPanel(option) {
                //option.name;
                //option.viewField.BaseDom;
                $(this.items_['infoPanel']).append(option.viewField.ViewDom); //view.appendTo("#InfoPanel");
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

        return DefaultInfoPlugin;
    }();

    DefaultInfoPlugin = __decorate([__param(1, Plugins_1.inject("ui/frame"))], DefaultInfoPlugin);
    exports.DefaultInfoPlugin = DefaultInfoPlugin;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DefaultInfoPlugin;
});