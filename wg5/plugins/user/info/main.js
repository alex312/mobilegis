define(["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    //if (!('Permission' in window)) window['Permission'] = {};
    var User = (function () {
        function User(config) {
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
                    declare: true,
                },
                fujianWaterWork: {
                    waterwork: true,
                }
            };
            this.config_ = config;
        }
        User.prototype.setUser = function (user) {
            this.userInfo_ = user;
            var storage = window.localStorage;
            storage["User"] = JSON.stringify(this.userInfo_);
        };
        User.prototype.getUser = function () {
            if (!this.userInfo_) {
                var t = window.localStorage["User"];
                t = t || "null";
                this.userInfo_ = JSON.parse(t);
            }
            return this.userInfo_;
        };
        User.prototype.setPermission = function (permission) {
            this.userPermission_ = permission;
            var storage = window.localStorage;
            storage["UserPermission"] = JSON.stringify(this.userPermission_);
        };
        User.prototype.getPermission = function () {
            //return true;
            if (!this.userPermission_) {
                var t = window.localStorage["UserPermission"];
                t = t || "{}";
                this.userPermission_ = JSON.parse(t);
            }
            return this.userPermission_;
        };
        User.prototype.havePermission = function (key) {
            //return true;
            if (!this.userPermission_) {
                var t = window.localStorage["UserPermission"];
                t = t || "{}";
                this.userPermission_ = JSON.parse(t);
            }
            return this.userPermission_[key];
        };
        User.prototype.setSetting = function (setting) {
            this.userSetting_ = setting;
            var storage = window.localStorage;
            storage["UserSetting"] = JSON.stringify(this.userSetting_);
        };
        User.prototype.getSetting = function () {
            if (!this.userSetting_) {
                var t = window.localStorage["UserSetting"];
                t = t || "{}";
                this.userSetting_ = JSON.parse(t);
            }
            return this.userSetting_;
        };
        User.prototype.clearUser = function () {
            var storage = window.localStorage;
            delete storage["UserSetting"];
            delete storage["UserSettingObject"];
            delete storage["UserPermission"];
            delete storage["User"];
        };
        User.prototype.upLoadSetting = function () {
            var storage = window.localStorage;
            storage["UserSetting"] = JSON.stringify(this.userSetting_);
            var userId = this.userInfo_.Id || this.userInfo_.UserId || "";
            var setting = storage["UserSetting"];
            var sto = storage["UserSettingObject"] || "{}";
            sto = JSON.parse(sto);
            var userConfigData = this.config_.userConfigData || "api/userConfigData";
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
            }
            else {
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
                })
                    .fail(function (data, state) {
                    console.error(data);
                });
            }
        };
        return User;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = User;
});
