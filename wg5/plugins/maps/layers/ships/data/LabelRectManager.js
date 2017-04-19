define(["require", "exports"], function (require, exports) {
    "use strict";
    var LabelRectManager = (function () {
        function LabelRectManager() {
            this.rects = [];
        }
        LabelRectManager.prototype.tryPut = function (rect) {
            for (var _i = 0, _a = this.rects; _i < _a.length; _i++) {
                var R = _a[_i];
                if (!((R.left + R.width < rect.left) || (R.top + R.height < rect.top) || (R.left > rect.left + rect.width) || (R.top > rect.top + rect.height))) {
                    //if((Math.abs(R.left-rect.left)<R.width)&&(Math.abs(R.top-rect.top)<R.height)){
                    return false;
                }
            }
            this.rects.push(rect);
            return true;
        };
        LabelRectManager.prototype.clear = function () {
            this.rects = [];
        };
        return LabelRectManager;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LabelRectManager;
});
