"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports"], function (require, exports) {
    "use strict";

    var EventSource = function () {
        function EventSource() {
            _classCallCheck(this, EventSource);
        }

        _createClass(EventSource, [{
            key: "bind",
            value: function bind(type, handler) {
                if (!this.eventHandlers_) {
                    var handlers = _defineProperty({}, type, [handler]);
                    Object.defineProperty(this, "eventHandlers_", {
                        configurable: false,
                        enumerable: false,
                        writable: false,
                        value: handlers
                    });
                } else if (type in this.eventHandlers_) {
                    this.eventHandlers_[type].push(handler);
                } else {
                    this.eventHandlers_[type] = [handler];
                }
            }
        }, {
            key: "unbind",
            value: function unbind(type, handler) {
                if (!this.eventHandlers_ || !(type in this.eventHandlers_)) return;
                var handlers = this.eventHandlers_[type];
                var idx = handlers.indexOf(handler);
                if (idx < 0) return;
                handlers.splice(idx, 1);
            }
        }, {
            key: "trigger",
            value: function trigger(event) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                var evt;
                if (typeof event === 'string') evt = { type: event, target: this };else {
                    evt = event;
                    evt.target = this;
                }
                var type = evt.type;
                if (!this.eventHandlers_ || !(type in this.eventHandlers_)) return;
                var handlers = this.eventHandlers_[type];
                var args2 = Array.prototype.slice.call(arguments);
                args2[0] = evt;
                for (var i = 0; i < handlers.length; i++) {
                    handlers[i].apply(this, args2);
                }
            }
        }]);

        return EventSource;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventSource;
});