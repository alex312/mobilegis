"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

define(["require", "exports"], function (require, exports) {
    "use strict";

    var JSTool;
    (function (JSTool) {
        function cloneWeak(A) {
            var r;
            if (A instanceof Array) {
                r = [];
            } else {
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
                if (key[0] === "_") continue;
                var val = node[key];
                if (val) {
                    if (val.type) {
                        val = cloneDeep(val);
                    } else if (Array.isArray(val)) {
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
            if (typeof A == 'undefined') return B;
            if (typeof B == 'undefined') return A;
            if (A instanceof Array && B instanceof Array) {
                return A;
            } else if ((typeof A === "undefined" ? "undefined" : _typeof(A)) == (typeof B === "undefined" ? "undefined" : _typeof(B)) && (typeof A === "undefined" ? "undefined" : _typeof(A)) == 'object') {
                var C = {};
                for (var key in A) {
                    C[key] = A[key];
                }
                for (var key in B) {
                    if (key in C) {
                        C[key] = priorConfig(C[key], B[key]);
                    } else {
                        C[key] = B[key];
                    }
                }
                return C;
            } else {
                return A;
            }
        }
        JSTool.priorConfig = priorConfig;
        function ArraysH2V() {
            var r = [];

            for (var _len = arguments.length, restOfName = Array(_len), _key = 0; _key < _len; _key++) {
                restOfName[_key] = arguments[_key];
            }

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
            for (var i = 0; i < num; i++) {
                r.push(obj);
            }return r;
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
            for (var i = 0; i < num; i++) {
                r.push(i);
            }return r;
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
            var r = [];

            for (var _len2 = arguments.length, restOfName = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                restOfName[_key2 - 1] = arguments[_key2];
            }

            var l = restOfName.length;
            if (l == 0) return A;
            var f = restOfName[l - 1];
            var ps = [A].concat(restOfName);
            ps.pop();
            ps = this.ArraysH2V.apply(this, _toConsumableArray(ps));
            for (var i = 0; i < A.length; i++) {
                r[i] = f.apply(undefined, _toConsumableArray(ps[i]));
            }
            return r;
        }
        JSTool.ArraysDo = ArraysDo;
        //此函数多余
        //[c,r]=ArraysDoContext(A1,A2,A3...,function(context,a1,a2,a3...){return x})
        function ArraysDoContext(A) {
            var c = {};
            var r = [];

            for (var _len3 = arguments.length, restOfName = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                restOfName[_key3 - 1] = arguments[_key3];
            }

            var l = restOfName.length;
            if (l == 0) return A;
            var f = restOfName[l - 1];
            var ps = [A].concat(restOfName);
            ps.pop();
            ps = this.ArraysH2V.apply(this, _toConsumableArray(ps));
            for (var i = 0; i < A.length; i++) {
                r[i] = f.apply(undefined, [c].concat(_toConsumableArray(ps[i])));
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
            if (arguments.length == 0) return null;
            var str = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
                str = str.replace(re, arguments[i]);
            }
            return str;
        }
        JSTool.StringFormat = StringFormat;
    })(JSTool = exports.JSTool || (exports.JSTool = {}));
});