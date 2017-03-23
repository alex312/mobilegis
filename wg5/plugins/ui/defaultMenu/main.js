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

    var DefaultMenuPlugin = function () {
        function DefaultMenuPlugin(config, urlLoader, frame) {
            _classCallCheck(this, DefaultMenuPlugin);

            this.mainMenuMap_ = {};
            this.config_ = config;
            this.urlLoader_ = urlLoader;
            this.items_ = {};
            this.element_ = frame.get("menu");
            this.items_['viewDom'] = $(this.element_);
            this.items_['menuHandle'] = this.items_['viewDom'].find('.sc-left-menu-handle');
            this.items_['menuItems'] = this.items_['viewDom'].find('.sc-left-menu-items');
            this.items_['mainMenu'] = $(htmlTemplate).appendTo(this.items_['menuItems']);
            this.initPage_();
        }

        _createClass(DefaultMenuPlugin, [{
            key: "initPage_",
            value: function initPage_() {
                $(document).ready(function () {
                    var menus = this.config_.defaultMenuItems || [{ label: 'RITS历史查询', href: 'index_ace.html#historyRITSQuery' }]; //,style:{iconFont:'fa-play'}
                    if (menus) {
                        menus.map(function (m) {
                            var menu = this.registerMainMenu(null, m.label + 'MenuLink', m.label, this.otherMenuClick_.bind(this), m.style);
                            menu.data('MenuLink', m);
                        }.bind(this));
                    }
                }.bind(this));
            }
        }, {
            key: "otherMenuClick_",
            value: function otherMenuClick_(e) {
                var data = $(e.target).closest('li').data('MenuLink');
                //var w:any = window;w.open//w.location = 'index_ace.html#playback';
                this.urlLoader_.urlLoad({ url: data.href, search: '', target: '_blank' });
            }
        }, {
            key: "registerMainMenu",
            value: function registerMainMenu(parentMenuName, menuName, menuLabel, callback, style) {
                var item = this.registrMainMenu_(parentMenuName, menuName, menuLabel, callback, style);
                // this.trigger('registedMainMenu', {
                //     parentMenuName: parentMenuName,
                //     menuName: menuName,
                //     menuLabel: menuLabel,
                //     callback: callback,
                //     style: style
                // }, item);
                var sideListOpen = this.config_.defaultOpenItem || '';
                if (sideListOpen) {
                    if (sideListOpen == menuName) {
                        //setTimeout(function(){
                        item.find('a').click();
                    }
                }
                return item;
            }
        }, {
            key: "registrMainMenu_",
            value: function registrMainMenu_(parentMenuName, menuName, menuLabel, callback, style) {
                var iconFont = 'fa-reorder';
                if (style && style.iconFont) iconFont = style.iconFont;
                var mainMenu = this.items_['mainMenu']; //var mainMenu = this.viewDom.find('[name="mainMenu"]')[0]; //
                if (parentMenuName == null) {
                    var menuItem = $("\n                    <li class=\"nav-item start\">\n                        <a href=\"javascript:void(0)\">\n                            <i class=\"fa " + iconFont + "\"></i>\n                        </a>\n                        <div class=\"sub-menu\">\n                            <ul><li class=\"title\">" + menuLabel + "</li></ul>\n                        </div>\n                    </li>\n                ");
                    if (callback) menuItem.find('a').bind("click", callback);
                    menuItem.appendTo(mainMenu);
                    this.mainMenuMap_[menuName] = menuItem;
                    return menuItem;
                } else {
                    if (parentMenuName in this.mainMenuMap_) {
                        var menuItem = $("\n                    <li>\n                        <a href=\"javascript:void(0)\">\n                            <i class=\"fa " + iconFont + "\"></i>\n                            <span class=\"title\">" + menuLabel + "</span>\n                        </a>\n                    </li>\n                ");
                        if (callback) menuItem.find('a').bind("click", callback);
                        var parentItem = this.mainMenuMap_[parentMenuName];
                        menuItem.appendTo(parentItem.find('ul'));
                        return menuItem;
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

        return DefaultMenuPlugin;
    }();

    DefaultMenuPlugin = __decorate([__param(1, Plugins_1.inject("urlLoader")), __param(2, Plugins_1.inject("ui/frame"))], DefaultMenuPlugin);
    exports.DefaultMenuPlugin = DefaultMenuPlugin;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DefaultMenuPlugin;
});