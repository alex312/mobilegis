define(["require", "exports"], function (require, exports) {
    "use strict";
    var EventSource2 = (function () {
        function EventSource2(target) {
            this.target_ = target ? target : this; //如果别的类B组合关联此类,可以指定target为B类
        }
        EventSource2.prototype.bind = function (type, fun) {
            var handler = { type: type, fun: fun };
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
            return handler;
            var _a;
        };
        EventSource2.prototype.unbind = function (handler) {
            if (!this.eventHandlers_ || !(handler.type in this.eventHandlers_))
                return;
            var handlers = this.eventHandlers_[handler.type];
            var idx = handlers.indexOf(handler);
            if (idx < 0)
                return;
            handlers.splice(idx, 1);
        };
        EventSource2.prototype.trigger = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var evt, r = [];
            evt = { type: type, target: this.target_ };
            if (!this.eventHandlers_ || !(type in this.eventHandlers_))
                return r;
            var handlers = this.eventHandlers_[type];
            var args2 = Array.prototype.slice.call(arguments);
            args2[0] = evt;
            for (var i = 0; i < handlers.length; i++) {
                r.push(handlers[i].fun.apply(this, args2));
            }
            return r;
        };
        return EventSource2;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventSource2;
});
