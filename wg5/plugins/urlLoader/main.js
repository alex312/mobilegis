var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "../../seecool/plugins/Plugins"], function (require, exports, Plugins_1) {
    "use strict";
    var UrlLoader = (function () {
        function UrlLoader(config, pageManager) {
            this.config_ = config;
            this.pageManager_ = pageManager;
        }
        UrlLoader.prototype.urlLoad = function (data) {
            return this.urlLoad_(data);
        };
        UrlLoader.prototype.urlLoad_ = function (data) {
            var urlLoadBase = this.config_["UrlLoadBase"] || "";
            var url = "";
            if (data.url == 'Login') {
                url += 'login.html';
            }
            else if (data.url == 'Logout') {
                url += '';
            }
            else {
                if (data.target == 'page') {
                    url += data.url;
                }
                else {
                    url += urlLoadBase + '#' + data.url;
                }
            }
            url += (data.search ? '?' : "") + data.search;
            if (data.target == 'page') {
                this.pageManager_.toPage(url);
            }
            else {
                window.open(url, data.target);
            }
        };
        return UrlLoader;
    }());
    UrlLoader = __decorate([
        __param(1, Plugins_1.inject("pageManager"))
    ], UrlLoader);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UrlLoader;
});
