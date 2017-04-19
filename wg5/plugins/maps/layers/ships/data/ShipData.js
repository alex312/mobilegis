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
define(["require", "exports", "../../../../../seecool/utilities", "../../../../../seecool/utilities", "./Feature"], function (require, exports, utilities_1, utilities_2, Feature_1) {
    "use strict";
    var ShipData = (function (_super) {
        __extends(ShipData, _super);
        function ShipData(entity) {
            var _this = _super.call(this, entity) || this;
            _this.version_ = 0;
            _this.lon3857_ = NaN;
            _this.lat3857_ = NaN;
            _this.track_ = [];
            _this.track3857_ = [];
            _this.entity_change_handler_ = _this.onEntityChange_.bind(_this);
            _this.hoveredPiece_ = null;
            var en = (_this.entity);
            en.bind("change", _this.entity_change_handler_);
            _this.onEntityChange_();
            return _this;
        }
        ShipData.prototype.destroy = function () {
            (this.entity).unbind("change", this.entity_change_handler_);
            _super.prototype.destroy.call(this);
        };
        ShipData.prototype.focus = function (piece) {
            _super.prototype.focus.call(this, piece);
            this.version_++;
            this.trigger("change");
        };
        ShipData.prototype.hover = function (piece) {
            _super.prototype.hover.call(this, piece);
            this.hoveredPiece_ = piece;
        };
        Object.defineProperty(ShipData.prototype, "hoveredPiece", {
            get: function () {
                return this.hoveredPiece_;
            },
            enumerable: true,
            configurable: true
        });
        ShipData.prototype.updateLonLat_ = function () {
            var en = (this.entity);
            var lon = en.lon;
            var lat = en.lat;
            this.lon3857_ = utilities_1.lon3857(lon);
            this.lat3857_ = utilities_2.lat3857(lat);
        };
        ShipData.prototype.onEntityChange_ = function () {
            //console.log("onEntityChange_");
            this.updateLonLat_();
            var entity = this.entity;
            //if (!this.track_.length || this.track_[this.track_.length - 1].time !== entity.time) {
            //    let tp = new (<new(id:string, data:any)=>ShipEntity>entity.constructor)(this.id, entity);
            //    this.track_.push(tp);
            //    this.track3857_.push([this.lon3857_, this.lat3857_]);
            //}
            this.version_++;
            this.trigger("change");
        };
        Object.defineProperty(ShipData.prototype, "version", {
            get: function () {
                return this.version_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShipData.prototype, "lon3857", {
            get: function () {
                return this.lon3857_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShipData.prototype, "lat3857", {
            get: function () {
                return this.lat3857_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShipData.prototype, "track", {
            get: function () {
                return this.track_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShipData.prototype, "track3857", {
            get: function () {
                return this.track3857_;
            },
            enumerable: true,
            configurable: true
        });
        ShipData.prototype.prependTrack = function (points) {
            if (points.length) {
                var cstr = this.entity.constructor;
                var track = new Array(points.length);
                var track3857 = new Array(points.length);
                for (var i = 0; i < points.length; i++) {
                    var item = points[i];
                    track[i] = new cstr(item.id, item);
                    track3857[i] = [utilities_1.lon3857(item.lon), utilities_2.lat3857(item.lat)];
                }
                this.track_.unshift.apply(this.track_, track);
                this.track3857_.unshift.apply(this.track3857_, track3857);
                this.version_++;
                this.trigger("change");
            }
        };
        return ShipData;
    }(Feature_1.default));
    exports.ShipData = ShipData;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipData;
});
