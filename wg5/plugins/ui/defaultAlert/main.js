var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "jquery", "text!./Layout.html", "../../../seecool/plugins/Plugins", "css!./Layout.css"], function (require, exports, $, htmlTemplate, Plugins_1) {
    "use strict";
    var DefaultInfoPlugin = (function () {
        function DefaultInfoPlugin(config, frame) {
            this.mainMenuMap_ = {};
            this.items_ = {};
            var element = frame.get("lightAlert");
            var template = $(htmlTemplate);
            var layout = $(element)
                .append(template.children())
                .addClass(template[0].className);
            this.items_['viewDom'] = layout;
            this.items_['default-alert'] = layout.find('.default-alert');
            this.items_['alert-message'] = layout.find('[name="alert-message"]');
            //this.lightAlert("船舶定位无效船舶定位无效船舶定位无效船舶定位无效船舶定位无效船舶定位无效");
        }
        DefaultInfoPlugin.prototype.lightAlert = function (message) {
            var panel = this.items_['default-alert'];
            var span = this.items_['alert-message'];
            var close = function () {
                //panel.css('display', 'none'); //.hide();
                panel.css('opacity', '0');
                panel.css('transform', 'translate( 0,-100%)');
            };
            if (this.lightAlertTimer_) {
                clearTimeout(this.lightAlertTimer_.closeTimer);
                this.lightAlertTimer_ = undefined;
                close();
            }
            this.lightAlertTimer_ = {
                openTimer: setTimeout(function () {
                    panel.css('display', 'inline-block'); //.show();
                    panel.css('transform', 'translate(0, 0)');
                    panel.css('opacity', '1');
                    span.empty();
                    span.append(message);
                }, 200),
                closeTimer: setTimeout(close, 1500)
            };
            //alert(message);
        };
        DefaultInfoPlugin.prototype.destroy = function () {
        };
        DefaultInfoPlugin.prototype.get = function (name) {
            return this.items_[name][0] || null;
        };
        return DefaultInfoPlugin;
    }());
    DefaultInfoPlugin = __decorate([
        __param(1, Plugins_1.inject("ui/frame"))
    ], DefaultInfoPlugin);
    exports.DefaultInfoPlugin = DefaultInfoPlugin;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DefaultInfoPlugin;
});
