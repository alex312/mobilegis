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
define(["require", "exports", "./EventSource"], function (require, exports, EventSource_1) {
    "use strict";
    var ShipEntity = (function (_super) {
        __extends(ShipEntity, _super);
        function ShipEntity(id, data) {
            var _this = _super.call(this) || this;
            Object.defineProperty(_this, "id", {
                enumerable: true,
                writable: false,
                configurable: false,
                value: id
            });
            _this.move(data);
            return _this;
        }
        Object.defineProperty(ShipEntity.prototype, "width", {
            get: function () {
                return this.dimensions ? this.dimensions[2] + this.dimensions[3] : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShipEntity.prototype, "length", {
            get: function () {
                return this.dimensions ? this.dimensions[0] + this.dimensions[1] : null;
            },
            enumerable: true,
            configurable: true
        });
        ShipEntity.prototype.move = function (to) {
            // console.log("move");
            for (var each in to) {
                if (each !== "id")
                    this[each] = to[each];
            }
            //if(to.id==="MMSI:412700810")
            //    console.log(to.id,to.time,to.lat,to.lon,to.sog,to.cog);
            this.trigger("change");
        };
        return ShipEntity;
    }(EventSource_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipEntity;
});
