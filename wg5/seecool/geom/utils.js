define(["require", "exports"], function (require, exports) {
    "use strict";
    function squaredDistance(lon0, lat0, lon1, lat1) {
        var dx = lon0 - lon1;
        var dy = lat0 - lat1;
        return dx * dx + dy * dy;
    }
    exports.squaredDistance = squaredDistance;
});
