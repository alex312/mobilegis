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
define(["require", "exports", "jquery", "../../../../seecool/plugins/Plugins", "jquery-ui"], function (require, exports, $, Plugins_1) {
    "use strict";

    var SettingPlugin = function () {
        function SettingPlugin(config, frame) {
            _classCallCheck(this, SettingPlugin);

            this.settingsGroupMap = {};
            this.frame_ = frame;
            //$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
            //    _title: function(title) {
            //        var $title = this.options.title || '&nbsp;'
            //        if( ("title_html" in this.options) && this.options.title_html == true )
            //            title.html($title);
            //        else title.text($title);
            //    }
            //}));
            this.settingPanal_ = $('<div></div>').removeClass('hide').dialog({
                title: "设置",
                //title_html : true,
                // position: {//['right','top'],
                //     of: $("#container_"),
                //     my: "right top",
                //     at: "right top",
                //     collision: "flip flip"
                // },
                autoOpen: false
            });
            var toolbar = this.frame_.toolbars['right'];
            toolbar.addButton({
                text: '设置',
                icon: 'fa fa-gear',
                click: this.showSettingPanel_.bind(this)
            });
            //this.ui_.RegisterToolButton("settingTool", "setting", "设置", this.showSettingPanel_.bind(this));
        }

        _createClass(SettingPlugin, [{
            key: "registerSettingElement",
            value: function registerSettingElement(groupName, element) {
                return this.registerSettingElement_(groupName, element);
            }
            //list:{[index:string]:any}
            //RegisterSeting(option:{type:string,name:string,data:{[index:string]:Function},}){
            //    this.list[name]=option;
            //}

        }, {
            key: "registerSettingElement_",
            value: function registerSettingElement_(groupName, element) {
                var groupPanel = null;
                if (groupName in this.settingsGroupMap) groupPanel = this.settingsGroupMap[groupName];else {
                    groupPanel = $('<div class="panel-group settings-panel-group"></div>');
                    this.settingsGroupMap[groupName] = groupPanel;
                    groupPanel.appendTo(this.settingPanal_);
                }
                element.appendTo(groupPanel);
                return element;
            }
        }, {
            key: "showSettingPanel_",
            value: function showSettingPanel_() {
                if (this.settingPanal_.dialog('isOpen')) {
                    this.settingPanal_.dialog('close');
                } else {
                    //var t='<div style="background: url(' + texture.src + ') -'+ frame.x + 'px -' + frame.y + 'px; float: left; width:'+ frame.width + 'px; height: ' + frame.height + 'px; margin: 11px 0px 10px 7px;">'
                    this.settingPanal_.dialog('open');
                }
            }
        }]);

        return SettingPlugin;
    }();

    SettingPlugin = __decorate([__param(1, Plugins_1.inject('maps/ui/uiFrame'))], SettingPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SettingPlugin;
});