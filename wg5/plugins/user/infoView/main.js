var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "jquery", "text!./UserInfo.html", "knockout", "../../../seecool/plugins/Plugins", "../../../seecool/StaticLib", "bootstrap", "css!fontawesome"], function (require, exports, $, htmlTemplate, ko, Plugins_1, StaticLib_1) {
    "use strict";
    //import "css!./layout.css";
    var UserPlugin = (function () {
        function UserPlugin(config, user, urlLoader, info) {
            this.items_ = {};
            this.user_ = user;
            this.config_ = config;
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
                index: this.config_.infoIndex,
                name: 'userInfo',
                viewField: new StaticLib_1.DivViewField({
                    viewModel: this,
                    viewDom: $(this.items_['viewDom'])
                })
            });
            this.initUserInfo_();
        }
        UserPlugin.prototype.logout_ = function () {
            this.user_.clearUser();
            // var w: any = window;
            // w.location = "login.html";
            this.urlLoader_.urlLoad({ url: 'Login', search: '', target: '_top' });
        };
        UserPlugin.prototype.initUserInfo_ = function () {
            var user = this.user_.getUser();
            if (user) {
                this.userName_(user.RealName /*user.UserName*/);
            }
            else {
                // var w: any = window;
                // w.location = "login.html";
                this.urlLoader_.urlLoad({ url: 'Login', search: '', target: '_top' });
            }
        };
        UserPlugin.prototype.destroy = function () {
        };
        UserPlugin.prototype.get = function (name) {
            return this.items_[name] || null;
        };
        return UserPlugin;
    }());
    UserPlugin = __decorate([
        __param(1, Plugins_1.inject("user/info")),
        __param(2, Plugins_1.inject("urlLoader")),
        __param(3, Plugins_1.inject("ui/defaultInfo"))
    ], UserPlugin);
    exports.UserPlugin = UserPlugin;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UserPlugin;
});
