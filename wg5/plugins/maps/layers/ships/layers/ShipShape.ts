class ShipShape {

    draw = function (context) {
    };

    box = function () {
    };

    contains = function (x, y) {
    };

    static IMPLEMENTED_BY_PROP =
        'ShipShape$' + ((Math.random() * 1e6) | 0);

    static addImplementation = function (cls) {
        cls.prototype[ShipShape.IMPLEMENTED_BY_PROP] = true;
    };

    static isImplementedBy = function (obj) {
        return !!(obj && obj[ShipShape.IMPLEMENTED_BY_PROP]);
    };
}

export default ShipShape;
