import * as Long from "long";
import * as ByteBuffer from "bytebuffer";

namespace exprs {
    export class Expression {
        static deserialize(data:ArrayBuffer):Expression {
            return new ExpressionDeserializer().deserialize(data);
        }

        serialize():ArrayBuffer {
            return new ExpressionSerializer().serialize(this);
        }

        describe():string {
            return "(?)";
        }
    }

    export class Scope extends Expression {
        private _context:string;
        private _content:Expression;
        private _fallback:Expression;

        constructor(context:string, content:Expression, fallback:Expression) {
            super();
            this._context = context;
            this._content = content;
            this._fallback = fallback;
        }

        get context():string {
            return this._context;
        }

        get content():Expression {
            return this._content;
        }

        get fallback():Expression {
            return this._fallback;
        }

        describe():string {
            return "(this is " + this._context
                + " ? " + this._content.describe()
                + " : " + this._fallback.describe()
                + ")";
        }
    }

    export class Field extends Expression {
        private _name:string;

        constructor(name:string) {
            super();
            this._name = name;
        }

        get name():string {
            return this._name;
        }

        describe():string {
            return "this." + this._name;
        }
    }

    export class Cast extends Expression {
        private _type:string;
        private _value:Expression;

        constructor(type:string, value:Expression) {
            super();
            this._type = type;
            this._value = value;
        }

        get type():string {
            return this._type;
        }

        get value():Expression {
            return this._value;
        }

        describe():string {
            return "(" + this._type + ")" + this._value.describe();
        }
    }

    export class Function extends Expression {
        private _name:string;
        private _args:Array<Expression>;

        constructor(name:string, param0?:Expression[]|Expression, ...params:Expression[])
        {
            super();
            this._name = name;
            if (param0 === undefined)
                this._args = [];
            else if (param0 instanceof Array)
                this._args = param0.slice();
            else
                this._args = Array.prototype.slice.apply(arguments, [1]);
        }

        get name():string {
            return this._name;
        }

        get args():Array<Expression> {
            return this._args.slice();
        }

        describe():string {
            var subs = this._args.map(function (item) {
                return item.describe();
            });
            if (/\(\)$/.test(this._name)) {
                return this._name.replace(/\(\)$/, "(" + subs.join(", ") + ")");
            } else {
                var parts = this._name.split(' ', subs.length - 1);
                var str = "(";
                for (var i = 0; i < subs.length - 1; i++)
                    str += subs[i] + parts[i];
                str += subs[subs.length - 1];
                str += ")";
                return str;
            }
        }
    }

    export class Constant extends Expression {
        private _type:string;
        private _data:ByteBuffer;

        constructor(type:string, data:ArrayBuffer) {
            super();
            if (type && data) {
                this._type = type;
                this._data = new ByteBuffer(data.byteLength, true, true).append(data);
            }
        }

        get type():string {
            return this._type;
        }

        get data():ArrayBuffer {
            return this._data.toBuffer(true);
        }

        describe():string {
            return this._type + "(" + this._data.toHex() + ")";
        }

        static bool(value:boolean):Constant {
            return Constant.create("bool", new ByteBuffer(1, true, true).writeUint8(value ? 1 : 0));
        }

        static sbyte(value:number):Constant {
            return Constant.create("sbyte", new ByteBuffer(1, true, true).writeInt8(value));

        }

        static byte(value:number):Constant {
            return Constant.create("byte", new ByteBuffer(1, true, true).writeUint8(value));
        }

        static short(value:number):Constant {
            return Constant.create("short", new ByteBuffer(2, true, true).writeInt16(value));
        }

        static ushort(value:number):Constant {
            return Constant.create("ushort", new ByteBuffer(2, true, true).writeUint16(value));
        }

        static int(value:number):Constant {
            return Constant.create("int", new ByteBuffer(4, true, true).writeInt32(value));
        }

        static uint(value:number):Constant {
            return Constant.create("uint", new ByteBuffer(4, true, true).writeUint32(value));
        }

        static long(value:Long):Constant {
            return Constant.create("long", new ByteBuffer(8, true, true).writeInt64(value));
        }

        static ulong(value:Long):Constant {
            return Constant.create("ulong", new ByteBuffer(8, true, true).writeUint64(value));
        }

        static float(value:number):Constant {
            return Constant.create("float", new ByteBuffer(4, true, true).writeFloat32(value));
        }

        static double(value:number):Constant {
            return Constant.create("double", new ByteBuffer(8, true, true).writeFloat64(value));
        }

        static string(value:string):Constant {
            return Constant.create("istring", ByteBuffer.wrap(value, "utf8"));
        }

        static time(value:Date):Constant {
            var epoch = Long.fromBits(0xf7b58000, 0x89f7ff5);
            var t = Long.fromNumber(value.getTime())
                .multiply(Long.fromNumber(10000))
                .add(epoch);
            return Constant.create("time", new ByteBuffer(8, true, true).writeInt64(t));
        }

        static duration(milliseconds:number):Constant {
            var d = Long.fromNumber(milliseconds).multiply(Long.fromNumber(10000));
            return this.create("duration", new ByteBuffer(8, true, true).writeInt64(d));
        }

        private static create(type:string, data:ByteBuffer):Constant {
            var c = new Constant(null, null);
            c._type = type;
            c._data = data.reset();
            return c;
        }
    }

    class ExpressionSerializer {
        serialize(expr:Expression):ArrayBuffer {
            this._ids = [];
            var size = this.calcExpression(expr);
            var p = new ByteBuffer(size, true, true);
            this._ids = [];
            this.writeExpression(p, expr);
            this._ids = [];
            p.reset();
            return p.toBuffer(false);
        }

        private writeExpression(p:ByteBuffer, expr:Expression):void {
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
        }

        private writeExpressions(p:ByteBuffer, items:Array<Expression>):void {
            p.writeUint8(items.length);
            for (var i = 0; i < items.length; i++)
                this.writeExpression(p, items[i]);
        }

        private calcExpression(expr:Expression):number {
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
        }


        private calcExpressions(items:Array<Expression>):number {
            var size = 1;
            for (var i = 0; i < items.length; i++)
                size += this.calcExpression(items[i]);
            return size;
        }

        private static calcBinary(size:number):number {
            return 1 + size;
        }

        private static calcString(s:string):number {
            return 1 + ByteBuffer.calculateUTF8Bytes(s);
        }

        private getId(exp:Expression):{id:number; sent:boolean} {
            var idx = this._ids.indexOf(exp);
            if (idx < 0) {
                idx = this._ids.length;
                this._ids.push(exp);
                return {id: (idx + 1), sent: false};
            } else {
                return {id: (idx + 1), sent: true};
            }
        }

        private static unsupportedExpressionType(expr:Expression):Error {
            return new Error("Unsupported expression type " + expr);
        }

        private _ids:Array<Expression> = [];
    }

    class ExpressionDeserializer {
        public deserialize(buffer:ArrayBuffer):Expression {
            var p = ByteBuffer.wrap(buffer, true, true, true);
            return this.readExpression(p);
        }

        private readExpression(p:ByteBuffer):Expression {
            var id = p.readUint16();
            var expr:Expression = this._items[id];
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
        }

        private  readFunction(p:ByteBuffer):Function {
            var name:string = ExpressionDeserializer.readString(p);
            if (!name)
                throw ExpressionDeserializer.invalidFormat();

            var args = this.readExpressions(p);
            return new Function(name, args);
        }

        private static readField(p:ByteBuffer):Field {
            var name:string = ExpressionDeserializer.readString(p);
            if (!name)
                throw ExpressionDeserializer.invalidFormat();
            return new Field(name);
        }

        private readCast(p:ByteBuffer):Cast {
            var type:string = ExpressionDeserializer.readString(p);
            if (!type)
                throw ExpressionDeserializer.invalidFormat();
            var value = this.readExpression(p);
            return new Cast(type, value);
        }

        private  readScope(p:ByteBuffer):Scope {
            var s:string = ExpressionDeserializer.readString(p);
            if (!s)
                throw ExpressionDeserializer.invalidFormat();
            var left = this.readExpression(p);
            var right = this.readExpression(p);
            return new Scope(s, left, right);
        }

        private static readConstant(p:ByteBuffer):Constant {
            var type:string = ExpressionDeserializer.readString(p);
            if (!type)
                throw ExpressionDeserializer.invalidFormat();
            var size:number = p.readUint8();
            var data = p.copy(p.offset, p.offset + size).toBuffer(false);
            return new Constant(type, data);
        }


        private readExpressions(p:ByteBuffer):Array<Expression> {
            var count = p.readUint8();
            var args = new Array<Expression>(count);
            for (var i = 0; i < count; i++)
                args[i] = this.readExpression(p);
            return args;
        }

        private static readString(p:ByteBuffer):string {
            return p.readUTF8String(p.readUint8(), ByteBuffer.METRICS_BYTES);
        }

        private static invalidFormat():Error {
            return new Error("Invalid data format.");
        }

        private _items = {};
    }
}
export default exprs;
