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
define(["require", "exports", "../../../seecool/plugins/Plugins", "text!./htmls/DepartmentDisplay.html", "text!./htmls/UserDisplay.html", "text!./htmls/RoleDisplay.html", "text!./htmls/ActionDisplay.html", "./data/DepartmentUserView", "./data/RoleActionView", "css!./htmls/DisplayLayout.css"], function (require, exports, Plugins_1, depDisplayDiv, userDisplayDiv, roleDisplayDiv, actionDisplayDiv, DepartmentUserView_1, RoleActionView_1) {
    "use strict";

    var UserManagePlugin = function () {
        function UserManagePlugin(config, menu, container) {
            _classCallCheck(this, UserManagePlugin);

            this.config_ = config || {};
            this.container_ = container;
            this.menu_ = menu || {};
            menu.registerMainMenu(null, "userManageMenuLink", "用户管理", null);
            menu.registerMainMenu("userManageMenuLink", "departmentManage", "部门管理", this.departmentManageClick_.bind(this));
            menu.registerMainMenu("userManageMenuLink", "usersManage", "人员管理", this.usersManageClick_.bind(this));
            menu.registerMainMenu("userManageMenuLink", "rolesManage", "角色管理", this.rolesManageClick_.bind(this));
            menu.registerMainMenu("userManageMenuLink", "actionsManage", "权限管理", this.actionsManageClick_.bind(this));
        }

        _createClass(UserManagePlugin, [{
            key: "departmentManageClick_",
            value: function departmentManageClick_() {
                var that = this;
                var depDisplay = $(depDisplayDiv);
                that.container_.showContainer('defaultContainer', depDisplay);
                var depView = new DepartmentUserView_1.default({ viewDom: depDisplay }, true);
                depView.init();
            }
        }, {
            key: "usersManageClick_",
            value: function usersManageClick_() {
                var that = this;
                var userDisplay = $(userDisplayDiv);
                that.container_.showContainer('defaultContainer', userDisplay);
                var userView = new DepartmentUserView_1.default({ viewDom: userDisplay }, false);
                userView.init();
            }
        }, {
            key: "rolesManageClick_",
            value: function rolesManageClick_() {
                var that = this;
                var roleDisplay = $(roleDisplayDiv);
                that.container_.showContainer('defaultContainer', roleDisplay);
                var roleView = new RoleActionView_1.default({ viewDom: roleDisplay }, true);
                roleView.init();
            }
        }, {
            key: "actionsManageClick_",
            value: function actionsManageClick_() {
                var that = this;
                var actionDisplay = $(actionDisplayDiv);
                that.container_.showContainer('defaultContainer', actionDisplay);
                var actionDisplayView = new RoleActionView_1.default({ viewDom: actionDisplay }, false);
                actionDisplayView.init();
            }
        }]);

        return UserManagePlugin;
    }();

    UserManagePlugin = __decorate([__param(1, Plugins_1.inject("ui/menu")), __param(2, Plugins_1.inject("ui/defaultContainer"))], UserManagePlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UserManagePlugin;
});