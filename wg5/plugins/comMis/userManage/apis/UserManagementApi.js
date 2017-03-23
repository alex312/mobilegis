"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "../../../../seecool/StaticLib"], function (require, exports, StaticLib_1) {
    "use strict";

    var UserManagementApi = function (_StaticLib_1$WebApi) {
        _inherits(UserManagementApi, _StaticLib_1$WebApi);

        function UserManagementApi() {
            _classCallCheck(this, UserManagementApi);

            return _possibleConstructorReturn(this, (UserManagementApi.__proto__ || Object.getPrototypeOf(UserManagementApi)).apply(this, arguments));
        }

        _createClass(UserManagementApi, [{
            key: "Get$pageIndex_pageSize",
            value: function Get$pageIndex_pageSize(pageIndex, pageSize) {
                return _get(UserManagementApi.prototype.__proto__ || Object.getPrototypeOf(UserManagementApi.prototype), "baseApi", this).call(this, {
                    url: this.url + "/?pageIndex=" + pageIndex + "&pageSize=" + pageSize,
                    type: 'get'
                });
            }
        }, {
            key: "GetUserTree",
            value: function GetUserTree() {
                return _get(UserManagementApi.prototype.__proto__ || Object.getPrototypeOf(UserManagementApi.prototype), "baseApi", this).call(this, {
                    url: this.url + "/tree",
                    type: "get"
                });
            }
            //api/User?pageIndex={pageIndex}&pageSize={pageSize}

        }, {
            key: "GetUser$pageIndex_pageSize",
            value: function GetUser$pageIndex_pageSize(pageIndex, pageSize) {
                return _get(UserManagementApi.prototype.__proto__ || Object.getPrototypeOf(UserManagementApi.prototype), "baseApi", this).call(this, {
                    url: this.url + "/?pageIndex=" + pageIndex + "&pageSize=" + pageSize,
                    type: 'get'
                });
            }
        }, {
            key: "GetRole$pageIndex_pageSize",
            value: function GetRole$pageIndex_pageSize(pageIndex, pageSize) {
                return _get(UserManagementApi.prototype.__proto__ || Object.getPrototypeOf(UserManagementApi.prototype), "baseApi", this).call(this, {
                    url: this.url + "/?pageIndex=" + pageIndex + "&pageSize=" + pageSize,
                    type: 'get'
                });
            }
        }, {
            key: "GetAction$pageIndex_pageSize",
            value: function GetAction$pageIndex_pageSize(pageIndex, pageSize) {
                return _get(UserManagementApi.prototype.__proto__ || Object.getPrototypeOf(UserManagementApi.prototype), "baseApi", this).call(this, {
                    url: this.url + "?pageIndex=" + pageIndex + "&pageSize=" + pageSize,
                    type: 'get'
                });
            }
        }, {
            key: "Post$UserRole",
            value: function Post$UserRole(data) {
                return _get(UserManagementApi.prototype.__proto__ || Object.getPrototypeOf(UserManagementApi.prototype), "baseApi", this).call(this, {
                    url: this.url + "/UserRole",
                    type: 'post',
                    data: data
                });
            }
        }, {
            key: "Post$RoleAction",
            value: function Post$RoleAction(data) {
                return _get(UserManagementApi.prototype.__proto__ || Object.getPrototypeOf(UserManagementApi.prototype), "baseApi", this).call(this, {
                    url: this.url + "/RoleAction",
                    type: 'post',
                    data: data
                });
            }
        }]);

        return UserManagementApi;
    }(StaticLib_1.WebApi);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UserManagementApi;
});