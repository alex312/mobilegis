"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "./EventSource"], function (require, exports, EventSource_1) {
    "use strict";

    var NotifiablePropertyBagProperty = "NotifiableObject_notifiableProperties";

    var NotifiableObject = function (_EventSource_1$defaul) {
        _inherits(NotifiableObject, _EventSource_1$defaul);

        function NotifiableObject() {
            _classCallCheck(this, NotifiableObject);

            var _this = _possibleConstructorReturn(this, (NotifiableObject.__proto__ || Object.getPrototypeOf(NotifiableObject)).call(this));

            _this[NotifiablePropertyBagProperty] = {};
            return _this;
        }

        _createClass(NotifiableObject, [{
            key: "getnp",
            value: function getnp(name) {
                return this[NotifiablePropertyBagProperty][name];
            }
        }, {
            key: "setnp",
            value: function setnp(name, value) {
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
        }, {
            key: "allnps",
            value: function allnps() {
                return this[NotifiablePropertyBagProperty];
            }
        }], [{
            key: "swap",
            value: function swap(a, b) {
                var tmp = a[NotifiablePropertyBagProperty];
                a[NotifiablePropertyBagProperty] = b[NotifiablePropertyBagProperty];
                b[NotifiablePropertyBagProperty] = tmp;
            }
        }, {
            key: "property",
            value: function property() {
                return function (target, key, desc) {
                    if (!desc) {
                        desc = {
                            configurable: false,
                            enumerable: true,
                            get: function get() {
                                return this.getnp(key);
                            },
                            set: function set(value) {
                                this.setnp(key, value);
                            }
                        };
                        Object.defineProperty(target, key, desc);
                    }
                    return desc;
                };
            }
        }]);

        return NotifiableObject;
    }(EventSource_1.default);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NotifiableObject;
});