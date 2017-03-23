"use strict";
var menu_config_1 = require('../../../menu-config');
var MenuUtil = (function () {
    function MenuUtil() {
    }
    MenuUtil.Grouping = function (items, group) {
        var rowCount = Math.ceil(items.length / this._colCount);
        for (var i = 0; i < rowCount; i++) {
            var start = i * this._colCount;
            var end = start + this._colCount;
            if (end > items.length)
                end = items.length;
            group.push(items.slice(start, end));
        }
    };
    MenuUtil.GroupingWithColCount = function (items, group, colCount) {
        if (colCount === void 0) { colCount = 3; }
        var rowCount = Math.ceil(items.length / colCount);
        for (var i = 0; i < rowCount; i++) {
            var start = i * colCount;
            var end = start + colCount;
            if (end > items.length)
                end = items.length;
            group.push(items.slice(start, end));
        }
    };
    MenuUtil.SelectIconSize = function () {
        return window.innerWidth < menu_config_1.MenuConfig.WidthThreshold ? '2' : '3';
    };
    MenuUtil._colCount = 3;
    return MenuUtil;
}());
exports.MenuUtil = MenuUtil;
