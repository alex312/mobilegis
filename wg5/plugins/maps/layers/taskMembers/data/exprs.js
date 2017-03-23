"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "long", "bytebuffer"], function (require, exports, Long, ByteBuffer) {
    "use strict";

    var exprs;
    (function (exprs) {
        var Expression = function () {
            function Expression() {
                _classCallCheck(this, Expression);
            }

            _createClass(Expression, [{
                key: "serialize",
                value: function serialize() {
                    return new ExpressionSerializer().serialize(this);
                }
            }, {
                key: "describe",
                value: function describe() {
                    return "(?)";
                }
            }], [{
                key: "deserialize",
                value: function deserialize(data) {
                    return new ExpressionDeserializer().deserialize(data);
                }
            }]);

            return Expression;
        }();

        exprs.Expression = Expression;

        var Scope = function (_Expression) {
            _inherits(Scope, _Expression);

            function Scope(context, content, fallback) {
                _classCallCheck(this, Scope);

                var _this = _possibleConstructorReturn(this, (Scope.__proto__ || Object.getPrototypeOf(Scope)).call(this));

                _this._context = context;
                _this._content = content;
                _this._fallback = fallback;
                return _this;
            }

            _createClass(Scope, [{
                key: "describe",
                value: function describe() {
                    return "(this is " + this._context + " ? " + this._content.describe() + " : " + this._fallback.describe() + ")";
                }
            }, {
                key: "context",
                get: function get() {
                    return this._context;
                }
            }, {
                key: "content",
                get: function get() {
                    return this._content;
                }
            }, {
                key: "fallback",
                get: function get() {
                    return this._fallback;
                }
            }]);

            return Scope;
        }(Expression);

        exprs.Scope = Scope;

        var Field = function (_Expression2) {
            _inherits(Field, _Expression2);

            function Field(name) {
                _classCallCheck(this, Field);

                var _this2 = _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this));

                _this2._name = name;
                return _this2;
            }

            _createClass(Field, [{
                key: "describe",
                value: function describe() {
                    return "this." + this._name;
                }
            }, {
                key: "name",
                get: function get() {
                    return this._name;
                }
            }]);

            return Field;
        }(Expression);

        exprs.Field = Field;

        var Cast = function (_Expression3) {
            _inherits(Cast, _Expression3);

            function Cast(type, value) {
                _classCallCheck(this, Cast);

                var _this3 = _possibleConstructorReturn(this, (Cast.__proto__ || Object.getPrototypeOf(Cast)).call(this));

                _this3._type = type;
                _this3._value = value;
                return _this3;
            }

            _createClass(Cast, [{
                key: "describe",
                value: function describe() {
                    return "(" + this._type + ")" + this._value.describe();
                }
            }, {
                key: "type",
                get: function get() {
                    return this._type;
                }
            }, {
                key: "value",
                get: function get() {
                    return this._value;
                }
            }]);

            return Cast;
        }(Expression);

        exprs.Cast = Cast;

        var Function = function (_Expression4) {
            _inherits(Function, _Expression4);

            function Function(name, param0) {
                for (var _len = arguments.length, params = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                    params[_key - 2] = arguments[_key];
                }

                _classCallCheck(this, Function);

                var _this4 = _possibleConstructorReturn(this, (Function.__proto__ || Object.getPrototypeOf(Function)).call(this));

                _this4._name = name;
                if (param0 === undefined) _this4._args = [];else if (param0 instanceof Array) _this4._args = param0.slice();else _this4._args = Array.prototype.slice.apply(arguments, [1]);
                return _this4;
            }

            _createClass(Function, [{
                key: "describe",
                value: function describe() {
                    var subs = this._args.map(function (item) {
                        return item.describe();
                    });
                    if (/\(\)$/.test(this._name)) {
                        return this._name.replace(/\(\)$/, "(" + subs.join(", ") + ")");
                    } else {
                        var parts = this._name.split(' ', subs.length - 1);
                        var str = "(";
                        for (var i = 0; i < subs.length - 1; i++) {
                            str += subs[i] + parts[i];
                        }str += subs[subs.length - 1];
                        str += ")";
                        return str;
                    }
                }
            }, {
                key: "name",
                get: function get() {
                    return this._name;
                }
            }, {
                key: "args",
                get: function get() {
                    return this._args.slice();
                }
            }]);

            return Function;
        }(Expression);

        exprs.Function = Function;

        var Constant = function (_Expression5) {
            _inherits(Constant, _Expression5);

            function Constant(type, data) {
                _classCallCheck(this, Constant);

                var _this5 = _possibleConstructorReturn(this, (Constant.__proto__ || Object.getPrototypeOf(Constant)).call(this));

                if (type && data) {
                    _this5._type = type;
                    _this5._data = new ByteBuffer(data.byteLength, true, true).append(data);
                }
                return _this5;
            }

            _createClass(Constant, [{
                key: "describe",
                value: function describe() {
                    return this._type + "(" + this._data.toHex() + ")";
                }
            }, {
                key: "type",
                get: function get() {
                    return this._type;
                }
            }, {
                key: "data",
                get: function get() {
                    return this._data.toBuffer(true);
                }
            }], [{
                key: "bool",
                value: function bool(value) {
                    return Constant.create("bool", new ByteBuffer(1, true, true).writeUint8(value ? 1 : 0));
                }
            }, {
                key: "sbyte",
                value: function sbyte(value) {
                    return Constant.create("sbyte", new ByteBuffer(1, true, true).writeInt8(value));
                }
            }, {
                key: "byte",
                value: function byte(value) {
                    return Constant.create("byte", new ByteBuffer(1, true, true).writeUint8(value));
                }
            }, {
                key: "short",
                value: function short(value) {
                    return Constant.create("short", new ByteBuffer(2, true, true).writeInt16(value));
                }
            }, {
                key: "ushort",
                value: function ushort(value) {
                    return Constant.create("ushort", new ByteBuffer(2, true, true).writeUint16(value));
                }
            }, {
                key: "int",
                value: function int(value) {
                    return Constant.create("int", new ByteBuffer(4, true, true).writeInt32(value));
                }
            }, {
                key: "uint",
                value: function uint(value) {
                    return Constant.create("uint", new ByteBuffer(4, true, true).writeUint32(value));
                }
            }, {
                key: "long",
                value: function long(value) {
                    return Constant.create("long", new ByteBuffer(8, true, true).writeInt64(value));
                }
            }, {
                key: "ulong",
                value: function ulong(value) {
                    return Constant.create("ulong", new ByteBuffer(8, true, true).writeUint64(value));
                }
            }, {
                key: "float",
                value: function float(value) {
                    return Constant.create("float", new ByteBuffer(4, true, true).writeFloat32(value));
                }
            }, {
                key: "double",
                value: function double(value) {
                    return Constant.create("double", new ByteBuffer(8, true, true).writeFloat64(value));
                }
            }, {
                key: "string",
                value: function string(value) {
                    return Constant.create("istring", ByteBuffer.wrap(value, "utf8"));
                }
            }, {
                key: "time",
                value: function time(value) {
                    var epoch = Long.fromBits(0xf7b58000, 0x89f7ff5);
                    var t = Long.fromNumber(value.getTime()).multiply(Long.fromNumber(10000)).add(epoch);
                    return Constant.create("time", new ByteBuffer(8, true, true).writeInt64(t));
                }
            }, {
                key: "duration",
                value: function duration(milliseconds) {
                    var d = Long.fromNumber(milliseconds).multiply(Long.fromNumber(10000));
                    return this.create("duration", new ByteBuffer(8, true, true).writeInt64(d));
                }
            }, {
                key: "create",
                value: function create(type, data) {
                    var c = new Constant(null, null);
                    c._type = type;
                    c._data = data.reset();
                    return c;
                }
            }]);

            return Constant;
        }(Expression);

        exprs.Constant = Constant;

        var ExpressionSerializer = function () {
            function ExpressionSerializer() {
                _classCallCheck(this, ExpressionSerializer);

                this._ids = [];
            }

            _createClass(ExpressionSerializer, [{
                key: "serialize",
                value: function serialize(expr) {
                    this._ids = [];
                    var size = this.calcExpression(expr);
                    var p = new ByteBuffer(size, true, true);
                    this._ids = [];
                    this.writeExpression(p, expr);
                    this._ids = [];
                    p.reset();
                    return p.toBuffer(false);
                }
            }, {
                key: "writeExpression",
                value: function writeExpression(p, expr) {
                    var r = this.getId(expr);
                    p.writeUint16(r.id);
                    if (!r.sent) {
                        if (expr instanceof Scope) {
                            p.writeUint8('s'.charCodeAt(0));
                            p.writeUint8(ByteBuffer.calculateUTF8Bytes(expr.context));
                            p.writeUTF8String(expr.context);
                            this.writeExpression(p, expr.content);
                            this.writeExpression(p, expr.fallback);
                        } else if (expr instanceof Function) {
                            p.writeUint8('f'.charCodeAt(0));
                            p.writeUint8(ByteBuffer.calculateUTF8Bytes(expr.name));
                            p.writeUTF8String(expr.name);
                            this.writeExpressions(p, expr.args);
                        } else if (expr instanceof Field) {
                            p.writeUint8('F'.charCodeAt(0));
                            p.writeUint8(ByteBuffer.calculateUTF8Bytes(expr.name));
                            p.writeUTF8String(expr.name);
                        } else if (expr instanceof Cast) {
                            p.writeUint8('c'.charCodeAt(0));
                            p.writeUint8(ByteBuffer.calculateUTF8Bytes(expr.type));
                            p.writeUTF8String(expr.type);
                            this.writeExpression(p, expr.value);
                        } else if (expr instanceof Constant) {
                            p.writeUint8('C'.charCodeAt(0));
                            p.writeUint8(ByteBuffer.calculateUTF8Bytes(expr.type));
                            p.writeUTF8String(expr.type);
                            p.writeUint8(expr.data.byteLength);
                            p.append(expr.data);
                        } else throw ExpressionSerializer.unsupportedExpressionType(expr);
                    }
                }
            }, {
                key: "writeExpressions",
                value: function writeExpressions(p, items) {
                    p.writeUint8(items.length);
                    for (var i = 0; i < items.length; i++) {
                        this.writeExpression(p, items[i]);
                    }
                }
            }, {
                key: "calcExpression",
                value: function calcExpression(expr) {
                    if (this.getId(expr).sent) return 2;
                    if (expr instanceof Scope) {
                        return 2 + 1 + ExpressionSerializer.calcString(expr.context) + this.calcExpression(expr.content) + this.calcExpression(expr.fallback);
                    } else if (expr instanceof Function) {
                        return 2 + 1 + ExpressionSerializer.calcString(expr.name) + this.calcExpressions(expr.args);
                    } else if (expr instanceof Field) {
                        return 2 + 1 + ExpressionSerializer.calcString(expr.name);
                    } else if (expr instanceof Cast) {
                        return 2 + 1 + ExpressionSerializer.calcString(expr.type) + this.calcExpression(expr.value);
                    } else if (expr instanceof Constant) {
                        return 2 + 1 + ExpressionSerializer.calcString(expr.type) + ExpressionSerializer.calcBinary(expr.data.byteLength);
                    } else {
                        throw ExpressionSerializer.unsupportedExpressionType(expr);
                    }
                }
            }, {
                key: "calcExpressions",
                value: function calcExpressions(items) {
                    var size = 1;
                    for (var i = 0; i < items.length; i++) {
                        size += this.calcExpression(items[i]);
                    }return size;
                }
            }, {
                key: "getId",
                value: function getId(exp) {
                    var idx = this._ids.indexOf(exp);
                    if (idx < 0) {
                        idx = this._ids.length;
                        this._ids.push(exp);
                        return { id: idx + 1, sent: false };
                    } else {
                        return { id: idx + 1, sent: true };
                    }
                }
            }], [{
                key: "calcBinary",
                value: function calcBinary(size) {
                    return 1 + size;
                }
            }, {
                key: "calcString",
                value: function calcString(s) {
                    return 1 + ByteBuffer.calculateUTF8Bytes(s);
                }
            }, {
                key: "unsupportedExpressionType",
                value: function unsupportedExpressionType(expr) {
                    return new Error("Unsupported expression type " + expr);
                }
            }]);

            return ExpressionSerializer;
        }();

        var ExpressionDeserializer = function () {
            function ExpressionDeserializer() {
                _classCallCheck(this, ExpressionDeserializer);

                this._items = {};
            }

            _createClass(ExpressionDeserializer, [{
                key: "deserialize",
                value: function deserialize(buffer) {
                    var p = ByteBuffer.wrap(buffer, true, true, true);
                    return this.readExpression(p);
                }
            }, {
                key: "readExpression",
                value: function readExpression(p) {
                    var id = p.readUint16();
                    var expr = this._items[id];
                    if (expr) if (expr) return expr;
                    var type = String.fromCharCode(p.readUint8());
                    switch (type) {
                        case 's':
                            expr = this.readScope(p);
                            break;
                        case 'f':
                            expr = this.readFunction(p);
                            break;
                        case 'F':
                            expr = ExpressionDeserializer.readField(p);
                            break;
                        case 'c':
                            expr = this.readCast(p);
                            break;
                        case 'C':
                            expr = ExpressionDeserializer.readConstant(p);
                            break;
                        default:
                            throw ExpressionDeserializer.invalidFormat();
                    }
                    this._items[id] = expr;
                    return expr;
                }
            }, {
                key: "readFunction",
                value: function readFunction(p) {
                    var name = ExpressionDeserializer.readString(p);
                    if (!name) throw ExpressionDeserializer.invalidFormat();
                    var args = this.readExpressions(p);
                    return new Function(name, args);
                }
            }, {
                key: "readCast",
                value: function readCast(p) {
                    var type = ExpressionDeserializer.readString(p);
                    if (!type) throw ExpressionDeserializer.invalidFormat();
                    var value = this.readExpression(p);
                    return new Cast(type, value);
                }
            }, {
                key: "readScope",
                value: function readScope(p) {
                    var s = ExpressionDeserializer.readString(p);
                    if (!s) throw ExpressionDeserializer.invalidFormat();
                    var left = this.readExpression(p);
                    var right = this.readExpression(p);
                    return new Scope(s, left, right);
                }
            }, {
                key: "readExpressions",
                value: function readExpressions(p) {
                    var count = p.readUint8();
                    var args = new Array(count);
                    for (var i = 0; i < count; i++) {
                        args[i] = this.readExpression(p);
                    }return args;
                }
            }], [{
                key: "readField",
                value: function readField(p) {
                    var name = ExpressionDeserializer.readString(p);
                    if (!name) throw ExpressionDeserializer.invalidFormat();
                    return new Field(name);
                }
            }, {
                key: "readConstant",
                value: function readConstant(p) {
                    var type = ExpressionDeserializer.readString(p);
                    if (!type) throw ExpressionDeserializer.invalidFormat();
                    var size = p.readUint8();
                    var data = p.copy(p.offset, p.offset + size).toBuffer(false);
                    return new Constant(type, data);
                }
            }, {
                key: "readString",
                value: function readString(p) {
                    return p.readUTF8String(p.readUint8(), ByteBuffer.METRICS_BYTES);
                }
            }, {
                key: "invalidFormat",
                value: function invalidFormat() {
                    return new Error("Invalid data format.");
                }
            }]);

            return ExpressionDeserializer;
        }();
    })(exprs || (exprs = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = exprs;
});