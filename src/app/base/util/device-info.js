"use strict";
var ionic_native_1 = require('ionic-native');
var DeviceInfo = (function () {
    function DeviceInfo() {
    }
    DeviceInfo.UUID = function () {
        return ionic_native_1.Device.uuid;
    };
    return DeviceInfo;
}());
exports.DeviceInfo = DeviceInfo;
