define(["require", "exports"], function (require, exports) {
    "use strict";
    var JSTool;
    (function (JSTool) {
        function cloneWeak(A) {
            var r;
            if (A instanceof Array) {
                r = [];
            }
            else {
                r = {};
            }
            for (var i in A) {
                r[i] = A[i];
            }
            return r;
        }
        JSTool.cloneWeak = cloneWeak;
        //export function cloneDeep(objClone) {
        //    if(!objClone)return null;
        //    if  (this.constructor == Object) {
        //        objClone = new this.constructor();
        //    } else {
        //        objClone = new this.constructor(this.valueOf());
        //    }
        //    for (var key in this) {
        //        if (objClone[key] !=  this[key]  ) {
        //            if  (typeof(this[key])  ==  'object'  ) {
        //                objClone[key] = this[key].Clone();
        //            } else {
        //                objClone[key] = this[key];
        //            }
        //        }
        //    }
        //    objClone.toString = this.toString;
        //    objClone.valueOf = this.valueOf;
        //    return objClone;
        //}
        function cloneDeep(node) {
            var newNode = {};
            for (var key in node) {
                if (key[0] === "_")
                    continue;
                var val = node[key];
                if (val) {
                    if (val.type) {
                        val = cloneDeep(val);
                    }
                    else if (Array.isArray(val)) {
                        val = val.map(cloneDeep);
                    }
                }
                newNode[key] = val;
            }
            return newNode;
        }
        JSTool.cloneDeep = cloneDeep;
        /**
         * A的属性优先于B合并,后返回
         * @param A
         * @param B
         * @returns {any}
         * @example priorConfig(low,hight) //
         */
        function priorConfig(A, B) {
            if (typeof (A) == 'undefined')
                return B;
            if (typeof (B) == 'undefined')
                return A;
            if (A instanceof Array && B instanceof Array) {
                return A;
            }
            else if (typeof (A) == typeof (B) && typeof (A) == 'object') {
                var C = {};
                for (var key in A) {
                    C[key] = A[key];
                }
                for (var key in B) {
                    if (key in C) {
                        C[key] = priorConfig(C[key], B[key]);
                    }
                    else {
                        C[key] = B[key];
                    }
                }
                return C;
            }
            else {
                return A;
            }
        }
        JSTool.priorConfig = priorConfig;
        function ArraysH2V() {
            var restOfName = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                restOfName[_i] = arguments[_i];
            }
            var r = [];
            var a = restOfName[0];
            for (var i = 0; i < a.length; i++) {
                var l = [];
                for (var j = 0; j < restOfName.length; j++) {
                    l.push(restOfName[j][i]);
                }
                r.push(l);
            }
            return r;
        }
        JSTool.ArraysH2V = ArraysH2V;
        /**
         * 重复n次的数组
         * @param obj
         * @param num
         * @returns {Array}
         * @constructor
         */
        function ArrayRepeated(obj, num) {
            var r = [];
            for (var i = 0; i < num; i++)
                r.push(obj);
            return r;
        }
        JSTool.ArrayRepeated = ArrayRepeated;
        /**
         * 新建0-n的数组
         * @param num
         * @returns {Array}
         * @constructor
         */
        function ArrayIndex(num) {
            var r = [];
            for (var i = 0; i < num; i++)
                r.push(i);
            return r;
        }
        JSTool.ArrayIndex = ArrayIndex;
        function CrossId(ID) {
            var r = {};
            for (var i in ID) {
                r[i] = ID[i];
                r[ID[i]] = i;
            }
            return r;
        }
        JSTool.CrossId = CrossId;
        function CrossId2(ID) {
            var r = { v: {}, i: {} };
            for (var i in ID) {
                r.v[i] = ID[i];
                r.i[ID[i]] = i;
            }
            return r;
        }
        JSTool.CrossId2 = CrossId2;
        function ArraysDo(A) {
            var restOfName = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                restOfName[_i - 1] = arguments[_i];
            }
            var r = [];
            var l = restOfName.length;
            if (l == 0)
                return A;
            var f = restOfName[l - 1];
            var ps = [A].concat(restOfName);
            ps.pop();
            ps = this.ArraysH2V.apply(this, ps);
            for (var i = 0; i < A.length; i++) {
                r[i] = f.apply(void 0, ps[i]);
            }
            return r;
        }
        JSTool.ArraysDo = ArraysDo;
        //此函数多余
        //[c,r]=ArraysDoContext(A1,A2,A3...,function(context,a1,a2,a3...){return x})
        function ArraysDoContext(A) {
            var restOfName = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                restOfName[_i - 1] = arguments[_i];
            }
            var c = {};
            var r = [];
            var l = restOfName.length;
            if (l == 0)
                return A;
            var f = restOfName[l - 1];
            var ps = [A].concat(restOfName);
            ps.pop();
            ps = this.ArraysH2V.apply(this, ps);
            for (var i = 0; i < A.length; i++) {
                r[i] = f.apply(void 0, [c].concat(ps[i]));
            }
            return [c, r];
        }
        JSTool.ArraysDoContext = ArraysDoContext;
        function ArrayIAToObject(ID, A) {
            var r = {};
            for (var i = 0; i < ID.length; i++) {
                r[ID[i]] = A[i];
            }
            return r;
        }
        JSTool.ArrayIAToObject = ArrayIAToObject;
        //分割
        //ArrayToArraysSplit([1,2,3,4,5,6,7],2) -> [[1,2],[3,4],[5,6],[7]]
        function ArrayToArraysSplit(A, n) {
            var r = [];
            for (var i = 0; i < A.length / n; i++) {
                r[i] = [];
                for (var j = 0; j < n; j++) {
                    r[i][j] = A[i * n + j];
                }
            }
            return r;
        }
        JSTool.ArrayToArraysSplit = ArrayToArraysSplit;
        //分发
        //ArrayToArraysSplit([1,2,3,4,5,6,7],2) -> [[1,3,5,7],[2,4,6]]
        function ArrayToArraysServe(A, n) {
            var r = [];
            for (var i = 0; i < n; i++) {
                r[i] = [];
                for (var j = 0; j < A.length / n; j++) {
                    r[i][j] = A[j * n + i];
                }
            }
            return r;
        }
        JSTool.ArrayToArraysServe = ArrayToArraysServe;
        function StringFormat() {
            if (arguments.length == 0)
                return null;
            var str = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
                str = str.replace(re, arguments[i]);
            }
            return str;
        }
        JSTool.StringFormat = StringFormat;
        ////..{0:}..{1}..
        //export function format(fmtstr,obj) {
        //    if (arguments.length == 0)
        //        returnnull;
        //    var str = arguments[0];
        //    for (var i = 1; i < arguments.length; i++) {
        //        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        //        str = str.replace(re, arguments[i]);
        //    }
        //    return str;
        //}
        //format.Formats={};
        //format.Formats.push({R:'/dsd/f',F:(v)=>{}})
    })(JSTool = exports.JSTool || (exports.JSTool = {}));
});
