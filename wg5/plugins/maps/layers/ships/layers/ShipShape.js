define(["require", "exports"], function (require, exports) {
    "use strict";
    var ShipShape = (function () {
        function ShipShape() {
            this.draw = function (context) {
            };
            this.box = function () {
            };
            this.contains = function (x, y) {
            };
        }
        return ShipShape;
    }());
    ShipShape.IMPLEMENTED_BY_PROP = 'ShipShape$' + ((Math.random() * 1e6) | 0);
    ShipShape.addImplementation = function (cls) {
        cls.prototype[ShipShape.IMPLEMENTED_BY_PROP] = true;
    };
    ShipShape.isImplementedBy = function (obj) {
        return !!(obj && obj[ShipShape.IMPLEMENTED_BY_PROP]);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipShape;
});
