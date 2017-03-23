import EventSource from "./EventSource";

const NotifiablePropertyBagProperty:string = "NotifiableObject_notifiableProperties";

class NotifiableObject extends EventSource {
    constructor() {
        super();
        this[NotifiablePropertyBagProperty] = {};
    }

    getnp(name:string):any {
        return this[NotifiablePropertyBagProperty][name];
    }

    setnp(name:string, value:any) {
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
    }

    allnps():{[key:string]:any} {
        return this[NotifiablePropertyBagProperty];
    }

    static swap(a:NotifiableObject, b:NotifiableObject):void {
        var tmp = a[NotifiablePropertyBagProperty];
        a[NotifiablePropertyBagProperty] = b[NotifiablePropertyBagProperty];
        b[NotifiablePropertyBagProperty] = tmp;
    }

    static property():(target:Object, key:string, desc?:PropertyDescriptor)=>any {
        return function (target:Object, key:string, desc?:PropertyDescriptor) {
            if (!desc) {
                desc = {
                    configurable: false,
                    enumerable: true,
                    get: function () {
                        return this.getnp(key);
                    },
                    set: function (value:any) {
                        this.setnp(key, value);
                    }
                };
                Object.defineProperty(target, key, desc);
            }
            return desc;
        }
    }
}


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

export default NotifiableObject;
