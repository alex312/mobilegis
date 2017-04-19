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
define(["require", "exports", "long", "bytebuffer"], function (require, exports, Long, ByteBuffer) {
    "use strict";
    var exprs;
    (function (exprs) {
        var Expression = (function () {
            function Expression() {
            }
            Expression.deserialize = function (data) {
                return new ExpressionDeserializer().deserialize(data);
            };
            Expression.prototype.serialize = function () {
                return new ExpressionSerializer().serialize(this);
            };
            Expression.prototype.describe = function () {
                return "(?)";
            };
            return Expression;
        }());
        exprs.Expression = Expression;
        var Scope = (function (_super) {
            __extends(Scope, _super);
            function Scope(context, content, fallback) {
                var _this = _super.call(this) || this;
                _this._context = context;
                _this._content = content;
                _this._fallback = fallback;
                return _this;
            }
            Object.defineProperty(Scope.prototype, "context", {
                get: function () {
                    return this._context;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Scope.prototype, "content", {
                get: function () {
                    return this._content;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Scope.prototype, "fallback", {
                get: function () {
                    return this._fallback;
                },
                enumerable: true,
                configurable: true
            });
            Scope.prototype.describe = function () {
                return "(this is " + this._context
                    + " ? " + this._content.describe()
                    + " : " + this._fallback.describe()
                    + ")";
            };
            return Scope;
        }(Expression));
        exprs.Scope = Scope;
        var Field = (function (_super) {
            __extends(Field, _super);
            function Field(name) {
                var _this = _super.call(this) || this;
                _this._name = name;
                return _this;
            }
            Object.defineProperty(Field.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Field.prototype.describe = function () {
                return "this." + this._name;
            };
            return Field;
        }(Expression));
        exprs.Field = Field;
        var Cast = (function (_super) {
            __extends(Cast, _super);
            function Cast(type, value) {
                var _this = _super.call(this) || this;
                _this._type = type;
                _this._value = value;
                return _this;
            }
            Object.defineProperty(Cast.prototype, "type", {
                get: function () {
                    return this._type;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Cast.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            Cast.prototype.describe = function () {
                return "(" + this._type + ")" + this._value.describe();
            };
            return Cast;
        }(Expression));
        exprs.Cast = Cast;
        var Function = (function (_super) {
            __extends(Function, _super);
            function Function(name, param0) {
                var params = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    params[_i - 2] = arguments[_i];
                }
                var _this = _super.call(this) || this;
                _this._name = name;
                if (param0 === undefined)
                    _this._args = [];
                else if (param0 instanceof Array)
                    _this._args = param0.slice();
                else
                    _this._args = Array.prototype.slice.apply(arguments, [1]);
                return _this;
            }
            Object.defineProperty(Function.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Function.prototype, "args", {
                get: function () {
                    return this._args.slice();
                },
                enumerable: true,
                configurable: true
            });
            Function.prototype.describe = function () {
                var subs = this._args.map(function (item) {
                    return item.describe();
                });
                if (/\(\)$/.test(this._name)) {
                    return this._name.replace(/\(\)$/, "(" + subs.join(", ") + ")");
                }
                else {
                    var parts = this._name.split(' ', subs.length - 1);
                    var str = "(";
                    for (var i = 0; i < subs.length - 1; i++)
                        str += subs[i] + parts[i];
                    str += subs[subs.length - 1];
                    str += ")";
                    return str;
                }
            };
            return Function;
        }(Expression));
        exprs.Function = Function;
        var Constant = (function (_super) {
            __extends(Constant, _super);
            function Constant(type, data) {
                var _this = _super.call(this) || this;
                if (type && data) {
                    _this._type = type;
                    _this._data = new ByteBuffer(data.byteLength, true, true).append(data);
                }
                return _this;
            }
            Object.defineProperty(Constant.prototype, "type", {
                get: function () {
                    return this._type;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Constant.prototype, "data", {
                get: function () {
                    return this._data.toBuffer(true);
                },
                enumerable: true,
                configurable: true
            });
            Constant.prototype.describe = function () {
                return this._type + "(" + this._data.toHex() + ")";
            };
            Constant.bool = function (value) {
                return Constant.create("bool", new ByteBuffer(1, true, true).writeUint8(value ? 1 : 0));
            };
            Constant.sbyte = function (value) {
                return Constant.create("sbyte", new ByteBuffer(1, true, true).writeInt8(value));
            };
            Constant.byte = function (value) {
                return Constant.create("byte", new ByteBuffer(1, true, true).writeUint8(value));
            };
            Constant.short = function (value) {
                return Constant.create("short", new ByteBuffer(2, true, true).writeInt16(value));
            };
            Constant.ushort = function (value) {
                return Constant.create("ushort", new ByteBuffer(2, true, true).writeUint16(value));
            };
            Constant.int = function (value) {
                return Constant.create("int", new ByteBuffer(4, true, true).writeInt32(value));
            };
            Constant.uint = function (value) {
                return Constant.create("uint", new ByteBuffer(4, true, true).writeUint32(value));
            };
            Constant.long = function (value) {
                return Constant.create("long", new ByteBuffer(8, true, true).writeInt64(value));
            };
            Constant.ulong = function (value) {
                return Constant.create("ulong", new ByteBuffer(8, true, true).writeUint64(value));
            };
            Constant.float = function (value) {
                return Constant.create("float", new ByteBuffer(4, true, true).writeFloat32(value));
            };
            Constant.double = function (value) {
                return Constant.create("double", new ByteBuffer(8, true, true).writeFloat64(value));
            };
            Constant.string = function (value) {
                return Constant.create("istring", ByteBuffer.wrap(value, "utf8"));
            };
            Constant.time = function (value) {
                var epoch = Long.fromBits(0xf7b58000, 0x89f7ff5);
                var t = Long.fromNumber(value.getTime())
                    .multiply(Long.fromNumber(10000))
                    .add(epoch);
                return Constant.create("time", new ByteBuffer(8, true, true).writeInt64(t));
            };
            Constant.duration = function (milliseconds) {
                var d = Long.fromNumber(milliseconds).multiply(Long.fromNumber(10000));
                return this.create("duration", new ByteBuffer(8, true, true).writeInt64(d));
            };
            Constant.create = function (type, data) {
                var c = new Constant(null, null);
                c._type = type;
                c._data = data.reset();
                return c;
            };
            return Constant;
        }(Expression));
        exprs.Constant = Constant;
        var ExpressionSerializer = (function () {
            function ExpressionSerializer() {
                this._ids = [];
            }
            ExpressionSerializer.prototype.serialize = function (expr) {
                this._ids = [];
                var size = this.calcExpression(expr);
                var p = new ByteBuffer(size, true, true);
                this._ids = [];
                this.writeExpression(p, expr);
                this._ids = [];
                p.reset();
                return p.toBuffer(false);
            };
            ExpressionSerializer.prototype.writeExpression = function (p, expr) {
                var r = this.getId(expr);
                p.writeUint16(r.id);
                if (!r.sent) {
                    if (expr instanceof Scope) {
                        p.writeUint8('s'.charCodeAt(0));
                        p.writeUint8(ByteBuffer.calculateUTF8Bytes(expr.context));
                        p.writeUTF8String(expr.context);
                        this.writeExpression(p, expr.content);
                        this.writeExpression(p, expr.fallback);
                    }
                    else if (expr instanceof Function) {
                        p.writeUint8('f'.charCodeAt(0));
                        p.writeUint8(ByteBuffer.calculateUTF8Bytes(expr.name));
                        p.writeUTF8String(expr.name);
                        this.writeExpressions(p, expr.args);
                    }
                    else if (expr instanceof Field) {
                        p.writeUint8('F'.charCodeAt(0));
                        p.writeUint8(ByteBuffer.calculateUTF8Bytes(expr.name));
                        p.writeUTF8String(expr.name);
                    }
                    else if (expr instanceof Cast) {
                        p.writeUint8('c'.charCodeAt(0));
                        p.writeUint8(ByteBuffer.calculateUTF8Bytes(expr.type));
                        p.writeUTF8String(expr.type);
                        this.writeExpression(p, expr.value);
                    }
                    else if (expr instanceof Constant) {
                        p.writeUint8('C'.charCodeAt(0));
                        p.writeUint8(ByteBuffer.calculateUTF8Bytes(expr.type));
                        p.writeUTF8String(expr.type);
                        p.writeUint8(expr.data.byteLength);
                        p.append(expr.data);
                    }
                    else
                        throw ExpressionSerializer.unsupportedExpressionType(expr);
                }
            };
            ExpressionSerializer.prototype.writeExpressions = function (p, items) {
                p.writeUint8(items.length);
                for (var i = 0; i < items.length; i++)
                    this.writeExpression(p, items[i]);
            };
            ExpressionSerializer.prototype.calcExpression = function (expr) {
                if (this.getId(expr).sent)
                    return 2;
                if (expr instanceof Scope) {
                    return 2 + 1
                        + ExpressionSerializer.calcString(expr.context)
                        + this.calcExpression(expr.content)
                        + this.calcExpression(expr.fallback);
                }
                else if (expr instanceof Function) {
                    return 2 + 1
                        + ExpressionSerializer.calcString(expr.name)
                        + this.calcExpressions(expr.args);
                }
                else if (expr instanceof Field) {
                    return 2 + 1
                        + ExpressionSerializer.calcString(expr.name);
                }
                else if (expr instanceof Cast) {
                    return 2 + 1
                        + ExpressionSerializer.calcString(expr.type)
                        + this.calcExpression(expr.value);
                }
                else if (expr instanceof Constant) {
                    return 2 + 1
                        + ExpressionSerializer.calcString(expr.type)
                        + ExpressionSerializer.calcBinary(expr.data.byteLength);
                }
                else {
                    throw ExpressionSerializer.unsupportedExpressionType(expr);
                }
            };
            ExpressionSerializer.prototype.calcExpressions = function (items) {
                var size = 1;
                for (var i = 0; i < items.length; i++)
                    size += this.calcExpression(items[i]);
                return size;
            };
            ExpressionSerializer.calcBinary = function (size) {
                return 1 + size;
            };
            ExpressionSerializer.calcString = function (s) {
                return 1 + ByteBuffer.calculateUTF8Bytes(s);
            };
            ExpressionSerializer.prototype.getId = function (exp) {
                var idx = this._ids.indexOf(exp);
                if (idx < 0) {
                    idx = this._ids.length;
                    this._ids.push(exp);
                    return { id: (idx + 1), sent: false };
                }
                else {
                    return { id: (idx + 1), sent: true };
                }
            };
            ExpressionSerializer.unsupportedExpressionType = function (expr) {
                return new Error("Unsupported expression type " + expr);
            };
            return ExpressionSerializer;
        }());
        var ExpressionDeserializer = (function () {
            function ExpressionDeserializer() {
                this._items = {};
            }
            ExpressionDeserializer.prototype.deserialize = function (buffer) {
                var p = ByteBuffer.wrap(buffer, true, true, true);
                return this.readExpression(p);
            };
            ExpressionDeserializer.prototype.readExpression = function (p) {
                var id = p.readUint16();
                var expr = this._items[id];
                if (expr)
                    if (expr)
                        return expr;
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
            };
            ExpressionDeserializer.prototype.readFunction = function (p) {
                var name = ExpressionDeserializer.readString(p);
                if (!name)
                    throw ExpressionDeserializer.invalidFormat();
                var args = this.readExpressions(p);
                return new Function(name, args);
            };
            ExpressionDeserializer.readField = function (p) {
                var name = ExpressionDeserializer.readString(p);
                if (!name)
                    throw ExpressionDeserializer.invalidFormat();
                return new Field(name);
            };
            ExpressionDeserializer.prototype.readCast = function (p) {
                var type = ExpressionDeserializer.readString(p);
                if (!type)
                    throw ExpressionDeserializer.invalidFormat();
                var value = this.readExpression(p);
                return new Cast(type, value);
            };
            ExpressionDeserializer.prototype.readScope = function (p) {
                var s = ExpressionDeserializer.readString(p);
                if (!s)
                    throw ExpressionDeserializer.invalidFormat();
                var left = this.readExpression(p);
                var right = this.readExpression(p);
                return new Scope(s, left, right);
            };
            ExpressionDeserializer.readConstant = function (p) {
                var type = ExpressionDeserializer.readString(p);
                if (!type)
                    throw ExpressionDeserializer.invalidFormat();
                var size = p.readUint8();
                var data = p.copy(p.offset, p.offset + size).toBuffer(false);
                return new Constant(type, data);
            };
            ExpressionDeserializer.prototype.readExpressions = function (p) {
                var count = p.readUint8();
                var args = new Array(count);
                for (var i = 0; i < count; i++)
                    args[i] = this.readExpression(p);
                return args;
            };
            ExpressionDeserializer.readString = function (p) {
                return p.readUTF8String(p.readUint8(), ByteBuffer.METRICS_BYTES);
            };
            ExpressionDeserializer.invalidFormat = function () {
                return new Error("Invalid data format.");
            };
            return ExpressionDeserializer;
        }());
    })(exprs || (exprs = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = exprs;
});
