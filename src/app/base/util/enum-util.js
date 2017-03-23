"use strict";
var EnumUtil = (function () {
    function EnumUtil() {
    }
    EnumUtil.GetEnumString = function (enumType, enumValue) {
        var key = enumValue;
        if (typeof (enumValue) === "number")
            key = enumType[enumValue];
        else if (typeof (enumValue) === "string")
            key = enumValue;
        else
            key = undefined;
        return key;
    };
    return EnumUtil;
}());
exports.EnumUtil = EnumUtil;
