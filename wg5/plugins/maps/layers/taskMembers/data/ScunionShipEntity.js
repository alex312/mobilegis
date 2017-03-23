"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "./ShipEntity"], function (require, exports, ShipEntity_1) {
    "use strict";

    var ScunionShipEntity = function (_ShipEntity_1$default) {
        _inherits(ScunionShipEntity, _ShipEntity_1$default);

        function ScunionShipEntity() {
            _classCallCheck(this, ScunionShipEntity);

            return _possibleConstructorReturn(this, (ScunionShipEntity.__proto__ || Object.getPrototypeOf(ScunionShipEntity)).apply(this, arguments));
        }

        return ScunionShipEntity;
    }(ShipEntity_1.default);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ScunionShipEntity;
});