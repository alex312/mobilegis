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
    var ShipDataSource = (function (_super) {
        __extends(ShipDataSource, _super);
        function ShipDataSource(dataItemFactories) {
            var _this = _super.call(this) || this;
            _this._items = {};
            _this._length = 0;
            _this._dataItemFactories = dataItemFactories;
            return _this;
        }
        ShipDataSource.prototype.createItem = function (type, id, data) {
            if (type in this._dataItemFactories)
                return this._dataItemFactories[type](id, data);
            return null;
        };
        ShipDataSource.prototype.replace = function (olds, news) {
            var items = this._items;
            var evt = {
                added: [],
                removed: [],
                type: 'change'
            };
            //console.log("replace:",olds,news);
            if (olds && olds.length)
                for (var i = 0; i < olds.length; i++) {
                    var o = olds[i];
                    if (o.id in items) {
                        evt.removed.push(o);
                        delete items[o.id];
                    }
                }
            if (news && news.length) {
                for (var j = 0; j < news.length; j++) {
                    var n = news[j];
                    var no = items[n.id];
                    if (n !== no) {
                        if (no)
                            evt.removed.push(no);
                        items[n.id] = n;
                        evt.added.push(n);
                    }
                }
            }
            this._length = this._length + (evt.added.length - evt.removed.length);
            if (evt.added.length || evt.removed.length)
                this.trigger(evt);
        };
        ShipDataSource.prototype.add_immediately = function (item1) {
            var evt = {
                type: 'change_immediately'
            };
            this.add(item1);
            this.trigger(evt);
        };
        ShipDataSource.prototype.add = function (item1) {
            if (item1 instanceof Array) {
                this.replace(null, item1);
            }
            else {
                this.replace(null, arguments);
            }
        };
        ShipDataSource.prototype.remove = function (item1) {
            if (item1 instanceof Array) {
                this.replace(item1, null);
            }
            else {
                this.replace(arguments, null);
            }
        };
        ShipDataSource.prototype.item = function (id) {
            return this._items[id] || null;
        };
        ShipDataSource.prototype.each = function (callback) {
            for (var each in this._items)
                callback(this._items[each]);
        };
        Object.defineProperty(ShipDataSource.prototype, "size", {
            get: function () {
                return this._length;
            },
            enumerable: true,
            configurable: true
        });
        return ShipDataSource;
    }(EventSource_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipDataSource;
});
