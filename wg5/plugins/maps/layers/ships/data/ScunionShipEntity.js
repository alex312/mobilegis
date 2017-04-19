var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./ShipEntity"], function (require, exports, ShipEntity_1) {
    "use strict";
    var ScunionShipEntity = (function (_super) {
        __extends(ScunionShipEntity, _super);
        function ScunionShipEntity() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ScunionShipEntity;
    }(ShipEntity_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ScunionShipEntity;
});
