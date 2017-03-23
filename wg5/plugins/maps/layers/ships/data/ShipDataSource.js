"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "./EventSource"], function (require, exports, EventSource_1) {
    "use strict";

    var ShipDataSource = function (_EventSource_1$defaul) {
        _inherits(ShipDataSource, _EventSource_1$defaul);

        function ShipDataSource(dataItemFactories) {
            _classCallCheck(this, ShipDataSource);

            var _this = _possibleConstructorReturn(this, (ShipDataSource.__proto__ || Object.getPrototypeOf(ShipDataSource)).call(this));

            _this._items = {};
            _this._length = 0;
            _this._dataItemFactories = dataItemFactories;
            return _this;
        }

        _createClass(ShipDataSource, [{
            key: "createItem",
            value: function createItem(type, id, data) {
                if (type in this._dataItemFactories) return this._dataItemFactories[type](id, data);
                return null;
            }
        }, {
            key: "replace",
            value: function replace(olds, news) {
                var items = this._items;
                var evt = {
                    added: [],
                    removed: [],
                    type: 'change'
                };
                //console.log("replace:",olds,news);
                if (olds && olds.length) for (var i = 0; i < olds.length; i++) {
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
                            if (no) evt.removed.push(no);
                            items[n.id] = n;
                            evt.added.push(n);
                        }
                    }
                }
                var dlen = evt.added.length - evt.removed.length;
                this._length = this._length + dlen;
                if (dlen) this.trigger(evt);
            }
        }, {
            key: "add_immediately",
            value: function add_immediately(item1) {
                var evt = {
                    type: 'change_immediately'
                };
                this.add(item1);
                this.trigger(evt);
            }
        }, {
            key: "add",
            value: function add(item1) {
                if (item1 instanceof Array) {
                    this.replace(null, item1);
                } else {
                    this.replace(null, arguments);
                }
            }
        }, {
            key: "remove",
            value: function remove(item1) {
                if (item1 instanceof Array) {
                    this.replace(item1, null);
                } else {
                    this.replace(arguments, null);
                }
            }
        }, {
            key: "item",
            value: function item(id) {
                return this._items[id] || null;
            }
        }, {
            key: "each",
            value: function each(callback) {
                for (var each in this._items) {
                    callback(this._items[each]);
                }
            }
        }, {
            key: "size",
            get: function get() {
                return this._length;
            }
        }]);

        return ShipDataSource;
    }(EventSource_1.default);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipDataSource;
});