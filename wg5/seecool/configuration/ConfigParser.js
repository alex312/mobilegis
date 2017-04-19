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
define(["require", "exports"], function (require, exports) {
    "use strict";
    function parse(configs) {
        var cfg = {};
        for (var i = configs.length - 1; i >= 0; i--) {
            merge(cfg, configs[i]);
        }
        return resolve(cfg);
    }
    exports.parse = parse;
    var Expression = (function () {
        function Expression() {
        }
        Expression.ref = function (key) {
            if (typeof (key) === "string")
                key = key ? key.split('.') : [];
            return new RefExpression(key);
        };
        Expression.val = function (key) {
            if (typeof (key) === "string")
                key = key ? key.split('.') : [];
            else
                key = key.slice();
            key.unshift('values');
            return this.ref(key);
        };
        Expression.format = function (template) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var reg = /(\$[\$#]?)\{([^\}]+)\}/g;
            var parts = [];
            var start = 0;
            while (true) {
                var match = reg.exec(template);
                if (!match) {
                    parts.push(template.substr(start));
                    break;
                }
                else {
                    parts.push(template.substring(start, match.index));
                    if (match[1] === '$$')
                        parts.push(this.ref(match[2]));
                    if (match[1] === '$#')
                        parts.push(args[parseInt(match[2])]);
                    else
                        parts.push(this.val(match[2]));
                    start = reg.lastIndex;
                }
            }
            return this.calc.apply(this, [parts, function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return args.join('');
                }]);
        };
        Expression.calc = function (argsOrFunction, fn) {
            var args;
            if (argsOrFunction instanceof Function) {
                args = [argsOrFunction];
            }
            else {
                args = argsOrFunction.concat([fn]);
            }
            return new CalcExpression(args);
        };
        Expression.action = function (page, plugin, method, args) {
            return new ActionExpression([page, plugin, method].concat(args));
        };
        Expression.remove = function () {
            return new RemoveExpression();
        };
        Expression.before = function (anchor, items) {
            return PatchExpression.before(anchor, items);
        };
        Expression.after = function (anchor, items) {
            return PatchExpression.after(anchor, items);
        };
        Expression.erase = function (indices) {
            return PatchExpression.erase(indices);
        };
        Expression.clear = function () {
            return PatchExpression.clear();
        };
        Expression.merge = function (index, value) {
            return PatchExpression.merge(index, value);
        };
        return Expression;
    }());
    exports.Expression = Expression;
    var DynamicExpression = (function (_super) {
        __extends(DynamicExpression, _super);
        function DynamicExpression(args) {
            var _this = _super.call(this) || this;
            _this.args = args;
            return _this;
        }
        return DynamicExpression;
    }(Expression));
    var RefExpression = (function (_super) {
        __extends(RefExpression, _super);
        function RefExpression() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RefExpression.prototype.resolve = function (config) {
            for (var i = 0; i < this.args.length; i++) {
                var arg = this.args[i];
                if (arg instanceof DynamicExpression)
                    this.args[i] = arg.resolve(config);
            }
            var cfg = config;
            for (var i = 0; i < this.args.length; i++) {
                var key = this.args[i];
                if (cfg instanceof Array) {
                    if (typeof (key) === "string")
                        key = parseInt(key);
                    if (!(typeof (key) === "number" && !isNaN(key)) || key < 0 || key >= cfg.length)
                        return void (0);
                }
                else if (isPlainObject(cfg)) {
                    if (!cfg.hasOwnProperty(key))
                        return void (0);
                }
                else
                    return void (0);
                var v = cfg[key];
                if (v instanceof DynamicExpression)
                    cfg[key] = v = v.resolve(config);
                cfg = v;
            }
            return cfg;
        };
        return RefExpression;
    }(DynamicExpression));
    var CalcExpression = (function (_super) {
        __extends(CalcExpression, _super);
        function CalcExpression() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CalcExpression.prototype.resolve = function (config) {
            for (var i = 0; i < this.args.length; i++) {
                var arg = this.args[i];
                if (arg instanceof DynamicExpression)
                    this.args[i] = arg.resolve(config);
            }
            return this.args[this.args.length - 1].apply(null, this.args.slice(0, this.args.length - 1));
        };
        return CalcExpression;
    }(DynamicExpression));
    var ActionExpression = (function (_super) {
        __extends(ActionExpression, _super);
        function ActionExpression() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ActionExpression.prototype.resolve = function (config) {
            for (var i = 0; i < this.args.length; i++) {
                var arg = this.args[i];
                if (arg instanceof DynamicExpression)
                    this.args[i] = arg.resolve(config);
            }
            return {
                page: this.args[0],
                plugin: this.args[1],
                method: this.args[2],
                args: this.args.slice(3)
            };
        };
        return ActionExpression;
    }(DynamicExpression));
    var RemoveExpression = (function (_super) {
        __extends(RemoveExpression, _super);
        function RemoveExpression() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return RemoveExpression;
    }(Expression));
    var PatchExpression = (function (_super) {
        __extends(PatchExpression, _super);
        function PatchExpression(type, args) {
            var _this = _super.call(this) || this;
            _this.type = type;
            _this.args = args;
            return _this;
        }
        PatchExpression.insert = function (anchor, items) {
            return new PatchExpression("insert", [anchor].concat(items));
        };
        PatchExpression.erase = function (indices) {
            return new PatchExpression("erase", indices.slice());
        };
        PatchExpression.clear = function () {
            return new PatchExpression("clear", []);
        };
        PatchExpression.merge = function (index, value) {
            return new PatchExpression("merge", [index, value]);
        };
        PatchExpression.prototype.insert = function (anchor, items) {
            var exp = PatchExpression.insert(anchor, items);
            return PatchExpression.composite_(this, exp);
        };
        PatchExpression.prototype.erase = function (indices) {
            var exp = PatchExpression.erase(indices);
            return PatchExpression.composite_(this, exp);
        };
        PatchExpression.prototype.clear = function () {
            var exp = PatchExpression.clear();
            return PatchExpression.composite_(this, exp);
        };
        PatchExpression.prototype.merge = function (index, value) {
            var exp = PatchExpression.merge(index, value);
            return PatchExpression.composite_(this, exp);
        };
        PatchExpression.composite_ = function (left, right) {
            if (left.type === 'composite') {
                left.args.push(right);
                return left;
            }
            return new PatchExpression("composite", [left, right]);
        };
        return PatchExpression;
    }(Expression));
    function resolve(config) {
        return doResolve(config, config);
    }
    function doResolve(config, section) {
        if (isPlainObject(section)) {
            for (var _i = 0, _a = Object.getOwnPropertyNames(section); _i < _a.length; _i++) {
                var key = _a[_i];
                section[key] = doResolve(config, section[key]);
            }
            return section;
        }
        else if (section instanceof Array) {
            for (var i = 0; i < section.length; i++)
                section[i] = doResolve(config, section[i]);
            return section;
        }
        else if (section instanceof DynamicExpression) {
            return section.resolve(config);
        }
        else {
            return section;
        }
    }
    function merge(base, patch) {
        for (var _i = 0, _a = Object.getOwnPropertyNames(patch); _i < _a.length; _i++) {
            var key = _a[_i];
            var pv = patch[key], bv;
            if (pv instanceof RemoveExpression)
                delete base[key];
            else if (pv instanceof PatchExpression)
                applyArrayPatch(base, key, pv);
            else if (base.hasOwnProperty(key) && isPlainObject(pv) && isPlainObject(bv = base[key]))
                merge(bv, pv);
            else
                base[key] = pv;
        }
    }
    function applyArrayPatch(base, key, patch) {
        if (!base.hasOwnProperty(key))
            throw new Error("Patch array failed.");
        var arr = base[key];
        if (!(arr instanceof Array))
            throw new Error("Patch array failed.");
        switch (patch.type) {
            case "composite":
                for (var i = 0; i < patch.args.length; i++)
                    patch.args[i].apply(arr);
                break;
            case "insert":
                var anchor = patch.args[0];
                patch.args[0] = 0;
                patch.args.unshift(anchor < 0 ? arr.length + anchor + 1 : anchor);
                arr.splice.apply(arr, patch.args);
                break;
            case "erase":
                for (var i = 0; i < patch.args.length; i++)
                    arr.splice(i, 1);
                break;
            case "clear":
                arr.splice(0, arr.length);
                break;
            case "merge":
                var idx = this.args[0];
                arr[idx] = merge(arr[idx], this.args[1]);
                break;
        }
    }
    function isPlainObject(obj) {
        return obj !== null && typeof (obj) === "object" && Object.getPrototypeOf(obj) === Object.prototype;
    }
});
