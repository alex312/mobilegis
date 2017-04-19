define(["require", "exports"], function (require, exports) {
    "use strict";
    var EventSource = (function () {
        function EventSource() {
        }
        EventSource.prototype.bind = function (type, handler) {
            if (!this.eventHandlers_) {
                var handlers = (_a = {}, _a[type] = [handler], _a);
                Object.defineProperty(this, "eventHandlers_", {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: handlers
                });
            }
            else if (type in this.eventHandlers_) {
                this.eventHandlers_[type].push(handler);
            }
            else {
                this.eventHandlers_[type] = [handler];
            }
            var _a;
        };
        EventSource.prototype.unbind = function (type, handler) {
            if (!this.eventHandlers_ || !(type in this.eventHandlers_))
                return;
            var handlers = this.eventHandlers_[type];
            var idx = handlers.indexOf(handler);
            if (idx < 0)
                return;
            handlers.splice(idx, 1);
        };
        EventSource.prototype.trigger = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var evt;
            if (typeof (event) === 'string')
                evt = { type: event, target: this };
            else {
                evt = event;
                evt.target = this;
            }
            var type = evt.type;
            if (!this.eventHandlers_ || !(type in this.eventHandlers_))
                return;
            var handlers = this.eventHandlers_[type];
            var args2 = Array.prototype.slice.call(arguments);
            args2[0] = evt;
            for (var i = 0; i < handlers.length; i++) {
                handlers[i].apply(this, args2);
            }
        };
        return EventSource;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventSource;
});
