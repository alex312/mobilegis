"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    //if (!('Permission' in window)) window['Permission'] = {};

    var User = function () {
        function User(config) {
            _classCallCheck(this, User);

            this.defaultPermission = {
                test: {
                    plotMenuLink: true,
                    thhjMenuLink: true,
                    userMenuLink: true,
                    loginMenuLink: true,
                    registerMenuLink: true,
                    logoutMenuLink: true
                },
                user: {
                    plotMenuLink: true,
                    thhjMenuLink: true,
                    userMenuLink: true,
                    logoutMenuLink: true,
                    measureMenuLink: true,
                    menureCancal: true,
                    menureLength: true,
                    menureArea: true
                },
                guest: {},
                normalUser: {
                    pudongVTS: true
                },
                marineUser: {
                    userManager: true,
                    pudongVTSMarine: true
                },
                fujianAdmin: {
                    userManager: true
                },
                fujianDeclare: {
                    declare: true
                },
                fujianWaterWork: {
                    waterwork: true
                }
            };
            this.config_ = config;
        }

        _createClass(User, [{
            key: "setUser",
            value: function setUser(user) {
                this.userInfo_ = user;
                var storage = window.localStorage;
                storage["User"] = JSON.stringify(this.userInfo_);
            }
        }, {
            key: "getUser",
            value: function getUser() {
                if (!this.userInfo_) {
                    var t = window.localStorage["User"];
                    t = t || "null";
                    this.userInfo_ = JSON.parse(t);
                }
                return this.userInfo_;
            }
        }, {
            key: "setPermission",
            value: function setPermission(permission) {
                this.userPermission_ = permission;
                var storage = window.localStorage;
                storage["UserPermission"] = JSON.stringify(this.userPermission_);
            }
        }, {
            key: "getPermission",
            value: function getPermission() {
                //return true;
                if (!this.userPermission_) {
                    var t = window.localStorage["UserPermission"];
                    t = t || "{}";
                    this.userPermission_ = JSON.parse(t);
                }
                return this.userPermission_;
            }
        }, {
            key: "havePermission",
            value: function havePermission(key) {
                //return true;
                if (!this.userPermission_) {
                    var t = window.localStorage["UserPermission"];
                    t = t || "{}";
                    this.userPermission_ = JSON.parse(t);
                }
                return this.userPermission_[key];
            }
        }, {
            key: "setSetting",
            value: function setSetting(setting) {
                this.userSetting_ = setting;
                var storage = window.localStorage;
                storage["UserSetting"] = JSON.stringify(this.userSetting_);
            }
        }, {
            key: "getSetting",
            value: function getSetting() {
                if (!this.userSetting_) {
                    var t = window.localStorage["UserSetting"];
                    t = t || "{}";
                    this.userSetting_ = JSON.parse(t);
                }
                return this.userSetting_;
            }
        }, {
            key: "clearUser",
            value: function clearUser() {
                var storage = window.localStorage;
                delete storage["UserSetting"];
                delete storage["UserSettingObject"];
                delete storage["UserPermission"];
                delete storage["User"];
            }
        }, {
            key: "upLoadSetting",
            value: function upLoadSetting() {
                var storage = window.localStorage;
                storage["UserSetting"] = JSON.stringify(this.userSetting_);
                var userId = this.userInfo_.Id || this.userInfo_.UserId || "";
                var setting = storage["UserSetting"];
                var sto = storage["UserSettingObject"] || "{}";
                sto = JSON.parse(sto);
                var userConfigData = this.config_.userConfigData || "api/UserConfigData";
                if (sto.Id) {
                    return $.ajax({
                        url: userConfigData + "?Id=" + sto.Id,
                        type: "put",
                        data: {
                            Id: sto.Id,
                            UserId: userId,
                            Category: "Webgis5_UserSetting",
                            Content: setting
                        }
                    });
                } else {
                    return $.ajax({
                        url: userConfigData,
                        type: "post",
                        data: {
                            Id: 0,
                            UserId: userId,
                            Category: "Webgis5_UserSetting",
                            Content: setting
                        }
                    }).done(function (data, state) {
                        storage["UserSettingObject"] = JSON.stringify(data);
                    }).fail(function (data, state) {
                        console.error(data);
                    });
                }
            }
        }]);

        return User;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = User;
});