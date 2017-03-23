"use strict";
var RestoreWrapper = (function () {
    function RestoreWrapper() {
    }
    RestoreWrapper.prototype.setItem = function (item) {
        this.originalItem = item;
        this.currentItem = this.clone(item);
    };
    RestoreWrapper.prototype.getItem = function () {
        return this.currentItem;
    };
    RestoreWrapper.prototype.restoreItem = function () {
        this.currentItem = this.originalItem;
        return this.getItem();
    };
    RestoreWrapper.prototype.clone = function (item) {
        // super poor clone implementation
        return JSON.parse(JSON.stringify(item));
    };
    return RestoreWrapper;
}());
exports.RestoreWrapper = RestoreWrapper;
