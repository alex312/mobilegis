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
define(["require", "exports", "jquery", "text!./UserInfo.html", "knockout", "../../../seecool/plugins/Plugins", "../../../seecool/StaticLib", "bootstrap", "css!fontawesome"], function (require, exports, $, htmlTemplate, ko, Plugins_1, StaticLib_1) {
    "use strict";
    //import "css!./layout.css";

    var UserPlugin = function () {
        function UserPlugin(config, user, urlLoader, info) {
            _classCallCheck(this, UserPlugin);

            this.items_ = {};
            this.user_ = user;
            this.userName_ = ko.observable();
            this.urlLoader_ = urlLoader;
            // this.element_ = $('<div></div>')[0]; //frame.get("container");
            // var temp = $(htmlTemplate);
            // var layout = $(this.element_)
            //     .append(temp.children())
            //     .addClass(temp[0].className);
            var layout = $(htmlTemplate).children();
            this.element_ = layout[0];
            this.items_['viewDom'] = layout[0];
            // this.items_['map'] = layout.find('.map')[0];
            // this.items_['map-ui'] = layout.find('.map-ui')[0];
            info.registerInfoPanel({
                name: 'userInfo',
                viewField: new StaticLib_1.DivViewField({
                    viewModel: this,
                    viewDom: $(this.items_['viewDom'])
                })
            });
            this.initUserInfo_();
        }

        _createClass(UserPlugin, [{
            key: "logout_",
            value: function logout_() {
                this.user_.clearUser();
                // var w: any = window;
                // w.location = "login.html";
                this.urlLoader_.urlLoad({ url: 'Login', search: '', target: '_top' });
            }
        }, {
            key: "initUserInfo_",
            value: function initUserInfo_() {
                var user = this.user_.getUser();
                if (user) {
                    this.userName_(user.UserName);
                } else {
                    // var w: any = window;
                    // w.location = "login.html";
                    this.urlLoader_.urlLoad({ url: 'Login', search: '', target: '_top' });
                }
            }
        }, {
            key: "destroy",
            value: function destroy() {}
        }, {
            key: "get",
            value: function get(name) {
                return this.items_[name] || null;
            }
        }]);

        return UserPlugin;
    }();

    UserPlugin = __decorate([__param(1, Plugins_1.inject("user/info")), __param(2, Plugins_1.inject("urlLoader")), __param(3, Plugins_1.inject("ui/defaultInfo"))], UserPlugin);
    exports.UserPlugin = UserPlugin;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UserPlugin;
});