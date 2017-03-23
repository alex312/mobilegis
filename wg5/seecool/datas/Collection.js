"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "../../seecool/datas/EventSource", "../../seecool/utils/JSTool"], function (require, exports, EventSource_1, JSTool_1) {
    "use strict";

    var CollectionA = function () {
        function CollectionA(name) {
            _classCallCheck(this, CollectionA);

            this.name = name || "";
            this.eventSource = new EventSource_1.default();
            //this.bind("changed",function(c){
            //    var n=Math.log(c.target.collection.length)/Math.log(2)
            //    if((n>5)&&(0==(n%1))){
            //        var t=[];
            //        for(var I of c.target.collection){
            //            if(I)t.push(I);
            //        }
            //    }
            //})
            this.init();
        }

        _createClass(CollectionA, [{
            key: "init",
            value: function init() {
                this.collection = [];
            }
        }, {
            key: "bind",
            value: function bind(type, handler) {
                this.eventSource.bind.apply(this, arguments);
            }
        }, {
            key: "unbind",
            value: function unbind(type, handler) {
                this.eventSource.unbind.apply(this, arguments);
            }
        }, {
            key: "trigger",
            value: function trigger(event) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                this.eventSource.trigger.apply(this, arguments);
            }
        }, {
            key: "List",
            value: function List() {
                return JSTool_1.JSTool.cloneWeak(this.collection);
            }
        }, {
            key: "Add",
            value: function Add(list) {
                this.trigger('operating', { op: 'adding', data: list });
                this.trigger('changing', this);
                this.do_add(list);
                this.trigger('changed', this);
                this.trigger('operated', { op: 'added', data: list });
            }
        }, {
            key: "Modify",
            value: function Modify(list) {
                this.trigger('operating', { op: 'modifing', data: list });
                this.trigger('changing', this);
                this.do_modify(list);
                this.trigger('changed', this);
                this.trigger('operated', { op: 'modified', data: list });
            }
        }, {
            key: "Remove",
            value: function Remove(list) {
                this.trigger('operating', { op: 'removing', data: list });
                this.trigger('changing', this);
                this.do_remove(list);
                this.trigger('changed', this);
                this.trigger('operated', { op: 'removed', data: list });
            }
        }, {
            key: "Clear",
            value: function Clear() {
                this.trigger('operating', { op: 'clearing', data: null });
                this.trigger('changing', this);
                this.do_clear();
                this.trigger('changed', this);
                this.trigger('operated', { op: 'cleared', data: null });
            }
        }, {
            key: "map",
            value: function map(callback) {
                var rtn = [];
                this.trigger('operating', { op: 'maping', data: null });
                this.trigger('changing', this);
                for (var i in this.collection) {
                    var t = this.collection[i];
                    rtn[i] = callback(t);
                    if (t !== this.collection[i]) {
                        this.trigger('modifing', [t, this.collection[i]]);
                        this.trigger('modified', [t, this.collection[i]]);
                    }
                }
                this.trigger('changed', this);
                this.trigger('operated', { op: 'maped', data: null });
                return rtn;
            }
        }, {
            key: "do_add",
            value: function do_add(list) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var I = _step.value;

                        this.trigger('adding', I);
                        this.collection.push(I);
                        this.trigger('added', I);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }, {
            key: "do_modify",
            value: function do_modify(list) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var I = _step2.value;

                        var t = this.collection[this.collection.indexOf(I[0])];
                        if (t) {
                            this.trigger('modifing', I);
                            t = I[1];
                            this.trigger('modified', I);
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
        }, {
            key: "do_get",
            value: function do_get(id) {
                if (id in this.collection) {
                    return { id: id, data: this.collection[id] };
                } else {
                    return { id: null, data: null };
                }
            }
        }, {
            key: "do_remove",
            value: function do_remove(list) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = list[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var I = _step3.value;

                        var i = this.collection.indexOf(I[0]);
                        var t = this.collection[i];
                        if (t) {
                            this.trigger('removeing', t);
                            delete this.collection[i];
                            this.trigger('removed', t);
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            }
        }, {
            key: "do_clear",
            value: function do_clear() {
                this.collection = [];
            }
        }]);

        return CollectionA;
    }();

    exports.CollectionA = CollectionA;
    /**
     * 集合
     * 相比于CollectionA,CollectionA2 增加了 isOne自定义函数,用于判断两个成员是否是同一个
     */

    var CollectionA2 = function () {
        function CollectionA2(option) {
            _classCallCheck(this, CollectionA2);

            this.defaultIsOne = function (a, b) {
                return a == b;
            };
            if (option) {
                option.name && (this.name = option.name || "");
                option.isOne && (this.isOne = option.isOne);
            }
            this.eventSource = new EventSource_1.default();
            //this.bind("changed",function(c){
            //    var n=Math.log(c.target.collection.length)/Math.log(2)
            //    if((n>5)&&(0==(n%1))){
            //        var t=[];
            //        for(var I of c.target.collection){
            //            if(I)t.push(I);
            //        }
            //    }
            //})
            this.init();
        }

        _createClass(CollectionA2, [{
            key: "init",
            value: function init() {
                this.collection = [];
            }
        }, {
            key: "bind",
            value: function bind(type, handler) {
                this.eventSource.bind.apply(this, arguments);
            }
        }, {
            key: "unbind",
            value: function unbind(type, handler) {
                this.eventSource.unbind.apply(this, arguments);
            }
        }, {
            key: "trigger",
            value: function trigger(event) {
                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    args[_key2 - 1] = arguments[_key2];
                }

                this.eventSource.trigger.apply(this, arguments);
            }
        }, {
            key: "List",
            value: function List() {
                return JSTool_1.JSTool.cloneWeak(this.collection);
            }
        }, {
            key: "Add",
            value: function Add(list) {
                this.trigger('operating', { op: 'adding', data: list });
                this.trigger('changing', this);
                this.do_add(list);
                this.trigger('changed', this);
                this.trigger('operated', { op: 'added', data: list });
            }
        }, {
            key: "Modify",
            value: function Modify(list) {
                this.trigger('operating', { op: 'modifing', data: list });
                this.trigger('changing', this);
                this.do_modify(list);
                this.trigger('changed', this);
                this.trigger('operated', { op: 'modified', data: list });
            }
        }, {
            key: "Remove",
            value: function Remove(list) {
                this.trigger('operating', { op: 'removing', data: list });
                this.trigger('changing', this);
                this.do_remove(list);
                this.trigger('changed', this);
                this.trigger('operated', { op: 'removed', data: list });
            }
        }, {
            key: "Clear",
            value: function Clear() {
                this.trigger('operating', { op: 'clearing', data: null });
                this.trigger('changing', this);
                this.do_clear();
                this.trigger('changed', this);
                this.trigger('operated', { op: 'cleared', data: null });
            }
        }, {
            key: "map",
            value: function map(callback) {
                var rtn = [];
                this.trigger('operating', { op: 'maping', data: null });
                this.trigger('changing', this);
                for (var i in this.collection) {
                    var t = this.collection[i];
                    rtn[i] = callback(t);
                    if (t !== this.collection[i]) {
                        this.trigger('modifing', [t, this.collection[i]]);
                        this.trigger('modified', [t, this.collection[i]]);
                    }
                }
                this.trigger('changed', this);
                this.trigger('operated', { op: 'maped', data: null });
                return rtn;
            }
        }, {
            key: "do_add",
            value: function do_add(list) {
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = list[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var I = _step4.value;

                        this.trigger('adding', I);
                        this.collection.push(I);
                        this.trigger('added', I);
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }
            }
        }, {
            key: "do_modify",
            value: function do_modify(list) {
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = list[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var I = _step5.value;

                        var t = this.collection.filter(function (v) {
                            return (this.isOne || this.defaultIsOne)(v, I[0]);
                        });
                        t = t[0];
                        if (t) {
                            this.trigger('modifing', I);
                            t = I[1];
                            this.trigger('modified', I);
                        }
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }
            }
        }, {
            key: "do_get",
            value: function do_get(id) {
                if (id in this.collection) {
                    return { id: id, data: this.collection[id] };
                } else {
                    return { id: null, data: null };
                }
            }
        }, {
            key: "do_remove",
            value: function do_remove(list) {
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = list[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var I = _step6.value;

                        var i = this.collection.indexOf(I[0]);
                        var t = this.collection.filter(function (v) {
                            return (this.isOne || this.defaultIsOne)(v, I);
                        });
                        t = t[0];
                        //var t = this.collection[i];
                        if (t) {
                            this.trigger('removeing', t);
                            delete this.collection[i];
                            this.trigger('removed', t);
                        }
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }
            }
        }, {
            key: "do_clear",
            value: function do_clear() {
                this.collection = [];
            }
        }]);

        return CollectionA2;
    }();

    exports.CollectionA2 = CollectionA2;

    var CollectionKO = function () {
        function CollectionKO(name) {
            _classCallCheck(this, CollectionKO);

            this.name = name || "";
            this.eventSource = new EventSource_1.default();
            //this.bind("changed",function(c){
            //    var n=Math.log(c.target.collection.length)/Math.log(2)
            //    if((n>5)&&(0==(n%1))){
            //        var t=[];
            //        for(var I of c.target.collection){
            //            if(I)t.push(I);
            //        }
            //    }
            //})
            this.init();
        }

        _createClass(CollectionKO, [{
            key: "init",
            value: function init() {
                this.collection = [];
            }
        }, {
            key: "bind",
            value: function bind(type, handler) {
                this.eventSource.bind.apply(this, arguments);
            }
        }, {
            key: "unbind",
            value: function unbind(type, handler) {
                this.eventSource.unbind.apply(this, arguments);
            }
        }, {
            key: "trigger",
            value: function trigger(event) {
                for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                    args[_key3 - 1] = arguments[_key3];
                }

                this.eventSource.trigger.apply(this, arguments);
            }
        }, {
            key: "List",
            value: function List() {
                return JSTool_1.JSTool.cloneWeak(this.collection);
            }
        }, {
            key: "Add",
            value: function Add(list) {
                this.trigger('operating', { op: 'adding', data: list });
                this.trigger('changing', this);
                this.do_add(list);
                this.trigger('changed', this);
                this.trigger('operated', { op: 'added', data: list });
            }
        }, {
            key: "Modify",
            value: function Modify(list) {
                this.trigger('operating', { op: 'modifing', data: list });
                this.trigger('changing', this);
                this.do_modify(list);
                this.trigger('changed', this);
                this.trigger('operated', { op: 'modified', data: list });
            }
        }, {
            key: "Remove",
            value: function Remove(list) {
                this.trigger('operating', { op: 'removing', data: list });
                this.trigger('changing', this);
                this.do_remove(list);
                this.trigger('changed', this);
                this.trigger('operated', { op: 'removed', data: list });
            }
        }, {
            key: "Clear",
            value: function Clear() {
                this.trigger('operating', { op: 'clearing', data: null });
                this.trigger('changing', this);
                this.do_clear();
                this.trigger('changed', this);
                this.trigger('operated', { op: 'cleared', data: null });
            }
        }, {
            key: "map",
            value: function map(callback) {
                var rtn = [];
                this.trigger('operating', { op: 'maping', data: null });
                this.trigger('changing', this);
                for (var i in this.collection) {
                    var t = this.collection[i];
                    rtn[i] = callback(t);
                    if (t !== this.collection[i]) {
                        this.trigger('modifing', [t, this.collection[i]]);
                        this.trigger('modified', [t, this.collection[i]]);
                    }
                }
                this.trigger('changed', this);
                this.trigger('operated', { op: 'maped', data: null });
                return rtn;
            }
        }, {
            key: "do_add",
            value: function do_add(list) {
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = list[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var I = _step7.value;

                        this.trigger('adding', I);
                        this.collection.push(I);
                        this.trigger('added', I);
                    }
                } catch (err) {
                    _didIteratorError7 = true;
                    _iteratorError7 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
                            _iterator7.return();
                        }
                    } finally {
                        if (_didIteratorError7) {
                            throw _iteratorError7;
                        }
                    }
                }
            }
        }, {
            key: "do_modify",
            value: function do_modify(list) {
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = list[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var I = _step8.value;

                        var t = this.collection[this.collection.indexOf(I[0])];
                        if (t) {
                            this.trigger('modifing', I);
                            t = I[1];
                            this.trigger('modified', I);
                        }
                    }
                } catch (err) {
                    _didIteratorError8 = true;
                    _iteratorError8 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                            _iterator8.return();
                        }
                    } finally {
                        if (_didIteratorError8) {
                            throw _iteratorError8;
                        }
                    }
                }
            }
        }, {
            key: "do_get",
            value: function do_get(id) {
                if (id in this.collection) {
                    return { id: id, data: this.collection[id] };
                } else {
                    return { id: null, data: null };
                }
            }
        }, {
            key: "do_remove",
            value: function do_remove(list) {
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = list[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var I = _step9.value;

                        var i = this.collection.indexOf(I[0]);
                        var t = this.collection[i];
                        if (t) {
                            this.trigger('removeing', t);
                            delete this.collection[i];
                            this.trigger('removed', t);
                        }
                    }
                } catch (err) {
                    _didIteratorError9 = true;
                    _iteratorError9 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
                            _iterator9.return();
                        }
                    } finally {
                        if (_didIteratorError9) {
                            throw _iteratorError9;
                        }
                    }
                }
            }
        }, {
            key: "do_clear",
            value: function do_clear() {
                this.collection = [];
            }
        }]);

        return CollectionKO;
    }();

    exports.CollectionKO = CollectionKO;
    function CollectionLinkerOption(sourceCollection, targetCollection, filterFunction, convertFunction) {
        return {
            sourceCollection: sourceCollection,
            targetCollection: targetCollection,
            filterFunction: filterFunction,
            convertFunction: convertFunction
        };
    }
    exports.CollectionLinkerOption = CollectionLinkerOption;

    var CollectionLinker = function () {
        function CollectionLinker(option) {
            _classCallCheck(this, CollectionLinker);

            this.sourceCollection = option.sourceCollection;
            this.targetCollection = option.targetCollection;
            this.filterFunction = option.filterFunction;
            this.convertFunction = option.convertFunction;
        }

        _createClass(CollectionLinker, [{
            key: "start",
            value: function start() {
                //this.sourceCollection.bind("adding", this.sourceAdding.bind(this));
                //this.sourceCollection.bind("added", this.sourceAdded.bind(this));
                //this.sourceCollection.bind("modifing", this.sourceModifing.bind(this));
                //this.sourceCollection.bind("modified", this.sourceModified.bind(this));
                //this.sourceCollection.bind("removeing", this.sourceRemoving.bind(this));
                //this.sourceCollection.bind("removed", this.sourceRemoved.bind(this));
                this.sourceCollection.bind("operating", this.sourceOperating.bind(this));
                this.sourceCollection.bind("operated", this.sourceOperated.bind(this));
            }
        }, {
            key: "stop",
            value: function stop() {
                //this.sourceCollection.unbind("adding", this.sourceAdding.bind(this));
                //this.sourceCollection.unbind("added", this.sourceAdded.bind(this));
                //this.sourceCollection.unbind("modifing", this.sourceModifing.bind(this));
                //this.sourceCollection.unbind("modified", this.sourceModified.bind(this));
                //this.sourceCollection.unbind("removeing", this.sourceRemoving.bind(this));
                //this.sourceCollection.unbind("removed", this.sourceRemoved.bind(this));
                this.sourceCollection.unbind("operating", this.sourceOperating.bind(this));
                this.sourceCollection.unbind("operated", this.sourceOperated.bind(this));
            }
        }, {
            key: "sourceOperating",
            value: function sourceOperating(evt, op) {
                //switch(op.op) {
                //    case "adding":
                //        var filted = <Array<any>>op.data.filter(this.filterFunction)
                //        this.targetCollection.Add(this.convertFunction(filted));
                //        break;
                //    case "modifing":
                //        var filted = <Array<any>>op.data.filter(this.filterFunction)
                //        this.targetCollection.Modify(this.convertFunction(filted));
                //        break;
                //    case "removing":
                //        var filted = <Array<any>>op.data.filter(this.filterFunction)
                //        this.targetCollection.Remove(this.convertFunction(filted));
                //        break;
                //    case "clearing":
                //        this.targetCollection.Clear();
                //        break;
                //}
            }
        }, {
            key: "sourceOperated",
            value: function sourceOperated(evt, op) {
                switch (op.op) {
                    case "added":
                        var filted = op.data.filter(this.filterFunction);
                        var converted = filted.map(this.convertFunction);
                        this.targetCollection.Add(converted);
                        break;
                    case "modified":
                        var filted = op.data.filter(this.filterFunction);
                        this.targetCollection.Modify(this.convertFunction(filted));
                        break;
                    case "removed":
                        var filted = op.data.filter(this.filterFunction);
                        this.targetCollection.Remove(this.convertFunction(filted));
                        break;
                    case "cleared":
                        this.targetCollection.Clear();
                        break;
                }
            }
        }]);

        return CollectionLinker;
    }();

    exports.CollectionLinker = CollectionLinker;
});
//class Filter<T> extends Collection<T>{
//
//}
//
//class Proxy<T> extends Collection<T>{
//
//}