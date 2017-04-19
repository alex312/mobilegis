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
    var NotifiablePropertyBagProperty = "NotifiableObject_notifiableProperties";
    var NotifiableObject = (function (_super) {
        __extends(NotifiableObject, _super);
        function NotifiableObject() {
            var _this = _super.call(this) || this;
            _this[NotifiablePropertyBagProperty] = {};
            return _this;
        }
        NotifiableObject.prototype.getnp = function (name) {
            return this[NotifiablePropertyBagProperty][name];
        };
        NotifiableObject.prototype.setnp = function (name, value) {
            var bag = this[NotifiablePropertyBagProperty];
            var old = bag[name];
            if (old !== value) {
                bag[name] = value;
                this.trigger({
                    type: 'propertychange',
                    property: name,
                    oldValue: old,
                    newValue: value
                });
            }
        };
        NotifiableObject.prototype.allnps = function () {
            return this[NotifiablePropertyBagProperty];
        };
        NotifiableObject.swap = function (a, b) {
            var tmp = a[NotifiablePropertyBagProperty];
            a[NotifiablePropertyBagProperty] = b[NotifiablePropertyBagProperty];
            b[NotifiablePropertyBagProperty] = tmp;
        };
        NotifiableObject.property = function () {
            return function (target, key, desc) {
                if (!desc) {
                    desc = {
                        configurable: false,
                        enumerable: true,
                        get: function () {
                            return this.getnp(key);
                        },
                        set: function (value) {
                            this.setnp(key, value);
                        }
                    };
                    Object.defineProperty(target, key, desc);
                }
                return desc;
            };
        };
        return NotifiableObject;
    }(EventSource_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    //function wrappSetter(key, getter, setter, equaler) {
    //    if (equaler) {
    //        return function (value:any) {
    //            var old = getter.apply(this);
    //            if (!equaler(old, value)) {
    //                setter.apply(this, [value]);
    //                this.trigger({
    //                    type: "propertychange",
    //                    property: key,
    //                    oldValue: old,
    //                    newValue: value
    //                });
    //            }
    //        };
    //    } else {
    //        return function (value:any) {
    //            var old = getter.apply(this);
    //            if (old !== value) {
    //                setter.apply(this, [value]);
    //                this.trigger({
    //                    type: "propertychange",
    //                    property: key,
    //                    oldValue: old,
    //                    newValue: value
    //                });
    //            }
    //        };
    //    }
    //}
    //interface DependencyPropertyOptions {
    //    setter?:string;
    //    equaler?:Function;
    //    value?:any;
    //}
    //function NotifiableProperty(options?:DependencyPropertyOptions) {
    //    options = options || {};
    //    return function (target:Object, key:string, desc?:PropertyDescriptor) {
    //        var defined = !!desc;
    //        if (!defined) {
    //            var defaultValue = options.value;
    //            desc = {
    //                get: function () {
    //                    var bag = this[NotifiablePropertyBagProperty];
    //                    return bag !== undefined && (key in bag) ? bag[key] : defaultValue;
    //                },
    //                set: function (value:any) {
    //                    var bag = this[NotifiablePropertyBagProperty];
    //                    if (!bag)
    //                        this[NotifiablePropertyBagProperty] = bag = {};
    //                    bag[key] = value;
    //                }
    //            };
    //        }
    //        var getter = desc.get;
    //        if ("setter" in options)
    //            target[options.setter] = wrappSetter(key, getter, target[options.setter], options.equaler);
    //        if (desc.set)
    //            desc.set = wrappSetter(key, getter, desc.set, options.equaler);
    //
    //        if (!defined)
    //            Object.defineProperty(target, key, desc);
    //        return desc;
    //    }
    //}
    exports.default = NotifiableObject;
});
