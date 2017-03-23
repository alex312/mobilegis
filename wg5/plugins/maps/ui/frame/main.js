"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
define(["require", "exports", "jquery", "text!./Layout.html", "../../../../seecool/plugins/Plugins", "../../../../seecool/datas/EventSource", "bootstrap", "css!fontawesome"], function (require, exports, $, htmlTemplate, Plugins_1, EventSource_1) {
    "use strict";
    //import "css!./layout.css";

    var DefaultFrame = function (_EventSource_1$defaul) {
        _inherits(DefaultFrame, _EventSource_1$defaul);

        function DefaultFrame(config, menu, container) {
            _classCallCheck(this, DefaultFrame);

            var _this = _possibleConstructorReturn(this, (DefaultFrame.__proto__ || Object.getPrototypeOf(DefaultFrame)).call(this));

            _this.items_ = {};
            _this.container_ = container;
            _this.element_ = $('<div></div>')[0]; //frame.get("container");
            var temp = $(htmlTemplate);
            var layout = $(_this.element_).append(temp.children()).addClass(temp[0].className);
            // var element = $(htmlTemplate);
            // element.children().appendTo(this.element_);
            // var layout =$(this.element_).addClass(element[0].className);
            _this.items_['viewDom'] = layout[0];
            _this.items_['map'] = layout.find('.map')[0];
            _this.items_['map-ui'] = layout.find('.map-ui')[0];
            menu.registerMainMenu(null, "webgisMenuLink", "Webgis", _this.menuClick_.bind(_this), { iconFont: "fa-map" });
            // menu.registerMainMenu(null, "userManagerMenuLink", "用户管理", null);//,{iconFont:"fa-random"}
            // menu.registerMainMenu("userManagerMenuLink", "departmentTree", "部门管理", this.menuClick_.bind(this));//,{iconFont:"fa-random"}
            // menu.registerMainMenu("userManagerMenuLink", "departmentUserTree", "人员管理", this.menuClick_.bind(this));//,{iconFont:"fa-random"}
            // menu.registerMainMenu("userManagerMenuLink", "departmentRoleTree", "角色权限管理", this.menuClick_.bind(this));//,{iconFont:"fa-random"}
            _this.menuClick_();
            return _this;
        }

        _createClass(DefaultFrame, [{
            key: "menuClick_",
            value: function menuClick_() {
                if (!this.isShow_) {
                    this.isShow_ = true;
                    this.container_.showContainer('webgisUIContainer', $(this.items_['viewDom']), { useMinHeight: true });
                } else {
                    this.container_.showContainer('webgisUIContainer', undefined, { useMinHeight: true });
                }
                var v = $(this.items_['map']); //('[name="container_"]');
                var size = [v.width(), v.height()]; //[width,height];//
                this.trigger('containerSizeChange', size);
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

        return DefaultFrame;
    }(EventSource_1.default);

    DefaultFrame = __decorate([__param(1, Plugins_1.inject("ui/menu")), __param(2, Plugins_1.inject("ui/defaultContainer"))], DefaultFrame);
    exports.DefaultFrame = DefaultFrame;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DefaultFrame;
});