"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "./EventSource"], function (require, exports, EventSource_1) {
    "use strict";

    var ShipEntity = function (_EventSource_1$defaul) {
        _inherits(ShipEntity, _EventSource_1$defaul);

        function ShipEntity(id, data) {
            _classCallCheck(this, ShipEntity);

            var _this = _possibleConstructorReturn(this, (ShipEntity.__proto__ || Object.getPrototypeOf(ShipEntity)).call(this));

            Object.defineProperty(_this, "id", {
                enumerable: true,
                writable: false,
                configurable: false,
                value: id
            });
            _this.move(data);
            return _this;
        }

        _createClass(ShipEntity, [{
            key: "move",
            value: function move(to) {
                // console.log("move");
                for (var each in to) {
                    if (each !== "id") this[each] = to[each];
                }
                //if(to.id==="MMSI:412700810")
                //    console.log(to.id,to.time,to.lat,to.lon,to.sog,to.cog);
                this.trigger("change");
            }
        }, {
            key: "width",
            get: function get() {
                return this.dimensions ? this.dimensions[2] + this.dimensions[3] : null;
            }
        }, {
            key: "length",
            get: function get() {
                return this.dimensions ? this.dimensions[0] + this.dimensions[1] : null;
            }
        }]);

        return ShipEntity;
    }(EventSource_1.default);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipEntity;
});