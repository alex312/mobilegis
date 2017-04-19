define(["require", "exports", "../../seecool/datas/EventSource", "../../seecool/utils/JSTool"], function (require, exports, EventSource_1, JSTool_1) {
    "use strict";
    var CollectionA0 = (function () {
        function CollectionA0(name) {
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
        CollectionA0.prototype.init = function () {
            this.collection = [];
        };
        CollectionA0.prototype.bind = function (type, handler) {
            this.eventSource.bind.apply(this, arguments);
        };
        CollectionA0.prototype.unbind = function (type, handler) {
            this.eventSource.unbind.apply(this, arguments);
        };
        CollectionA0.prototype.trigger = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.eventSource.trigger.apply(this, arguments);
        };
        CollectionA0.prototype.List = function () {
            return JSTool_1.JSTool.cloneWeak(this.collection);
        };
        CollectionA0.prototype.Add = function (list) {
            this.trigger('operating', { op: 'adding', data: list });
            this.trigger('changing', this);
            this.do_add(list);
            this.trigger('changed', this);
            this.trigger('operated', { op: 'added', data: list });
        };
        CollectionA0.prototype.Modify = function (list) {
            this.trigger('operating', { op: 'modifing', data: list });
            this.trigger('changing', this);
            this.do_modify(list);
            this.trigger('changed', this);
            this.trigger('operated', { op: 'modified', data: list });
        };
        CollectionA0.prototype.Remove = function (list) {
            this.trigger('operating', { op: 'removing', data: list });
            this.trigger('changing', this);
            this.do_remove(list);
            this.trigger('changed', this);
            this.trigger('operated', { op: 'removed', data: list });
        };
        CollectionA0.prototype.Clear = function () {
            this.trigger('operating', { op: 'clearing', data: null });
            this.trigger('changing', this);
            this.do_clear();
            this.trigger('changed', this);
            this.trigger('operated', { op: 'cleared', data: null });
        };
        CollectionA0.prototype.map = function (callback) {
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
        };
        CollectionA0.prototype.do_add = function (list) {
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var I = list_1[_i];
                this.trigger('adding', I);
                this.collection.push(I);
                this.trigger('added', I);
            }
        };
        CollectionA0.prototype.do_modify = function (list) {
            for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                var I = list_2[_i];
                var t = this.collection[this.collection.indexOf(I[0])];
                if (t) {
                    this.trigger('modifing', I);
                    t = I[1];
                    this.trigger('modified', I);
                }
            }
        };
        CollectionA0.prototype.do_get = function (id) {
            if (id in this.collection) {
                return { id: id, data: this.collection[id] };
            }
            else {
                return { id: null, data: null };
            }
        };
        CollectionA0.prototype.do_remove = function (list) {
            for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
                var I = list_3[_i];
                var i = this.collection.indexOf(I[0]);
                var t = this.collection[i];
                if (t) {
                    this.trigger('removeing', t);
                    delete this.collection[i];
                    this.trigger('removed', t);
                }
            }
        };
        CollectionA0.prototype.do_clear = function () {
            this.collection = [];
        };
        return CollectionA0;
    }());
    exports.CollectionA0 = CollectionA0;
    var CollectionA = (function () {
        function CollectionA(option) {
            this.defaultIsOne = function (a, b) {
                return (a == b);
            };
            if (option) {
                if (typeof (option) == "string") {
                    this.name = option || "";
                }
                else {
                    option.name && (this.name = option.name || "");
                    option.isOne && (this.isOne = option.isOne);
                }
            }
            this.eventSource = new EventSource_1.default();
            this.init();
        }
        CollectionA.prototype.init = function () {
            this.collection = [];
        };
        CollectionA.prototype.bind = function (type, handler) {
            this.eventSource.bind.apply(this, arguments);
        };
        CollectionA.prototype.unbind = function (type, handler) {
            this.eventSource.unbind.apply(this, arguments);
        };
        CollectionA.prototype.trigger = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.eventSource.trigger.apply(this, arguments);
        };
        CollectionA.prototype.List = function () {
            return JSTool_1.JSTool.cloneWeak(this.collection);
        };
        CollectionA.prototype.Add = function (list) {
            this.trigger('operating', { op: 'adding', data: list });
            this.trigger('changing', this);
            this.do_add(list);
            this.trigger('changed', this);
            this.trigger('operated', { op: 'added', data: list });
        };
        CollectionA.prototype.Modify = function (list) {
            this.trigger('operating', { op: 'modifing', data: list });
            this.trigger('changing', this);
            this.do_modify(list);
            this.trigger('changed', this);
            this.trigger('operated', { op: 'modified', data: list });
        };
        CollectionA.prototype.Remove = function (list) {
            this.trigger('operating', { op: 'removing', data: list });
            this.trigger('changing', this);
            this.do_remove(list);
            this.trigger('changed', this);
            this.trigger('operated', { op: 'removed', data: list });
        };
        CollectionA.prototype.Clear = function () {
            this.trigger('operating', { op: 'clearing', data: null });
            this.trigger('changing', this);
            this.do_clear();
            this.trigger('changed', this);
            this.trigger('operated', { op: 'cleared', data: null });
        };
        CollectionA.prototype.map = function (callback) {
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
        };
        CollectionA.prototype.do_add = function (list) {
            for (var _i = 0, list_4 = list; _i < list_4.length; _i++) {
                var I = list_4[_i];
                this.trigger('adding', I);
                this.collection.push(I);
                this.trigger('added', I);
            }
        };
        CollectionA.prototype.do_modify = function (list) {
            for (var _i = 0, list_5 = list; _i < list_5.length; _i++) {
                var I = list_5[_i];
                var index = "", theOld, theNew;
                if (I instanceof Array) {
                    theOld = I[0];
                    theNew = I[1];
                }
                else {
                    theOld = I;
                    theNew = I;
                }
                for (var i in this.collection) {
                    if ((this.isOne || this.defaultIsOne)(this.collection[i], theOld)) {
                        index = i;
                        break;
                    }
                }
                if (index !== "") {
                    this.trigger('modifing', I);
                    this.collection[index] = theNew;
                    this.trigger('modified', I);
                }
            }
        };
        CollectionA.prototype.do_remove = function (list) {
            for (var _i = 0, list_6 = list; _i < list_6.length; _i++) {
                var I = list_6[_i];
                var index = "";
                for (var i in this.collection) {
                    if ((this.isOne || this.defaultIsOne)(this.collection[i], I)) {
                        index = i;
                        break;
                    }
                }
                if (index !== "") {
                    this.trigger('removing', I);
                    this.collection.splice(Number(index), 1);
                    this.trigger('removed', I);
                }
            }
        };
        CollectionA.prototype.do_clear = function () {
            this.collection.splice(0, this.collection.length);
        };
        return CollectionA;
    }());
    exports.CollectionA = CollectionA;
    //todo take a ol.Source as Collection
    //todo take a ko.observable as Collection
    var CollectionKO = (function () {
        function CollectionKO(name) {
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
        CollectionKO.prototype.init = function () {
            this.collection = [];
        };
        CollectionKO.prototype.bind = function (type, handler) {
            this.eventSource.bind.apply(this, arguments);
        };
        CollectionKO.prototype.unbind = function (type, handler) {
            this.eventSource.unbind.apply(this, arguments);
        };
        CollectionKO.prototype.trigger = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.eventSource.trigger.apply(this, arguments);
        };
        CollectionKO.prototype.List = function () {
            return JSTool_1.JSTool.cloneWeak(this.collection);
        };
        CollectionKO.prototype.Add = function (list) {
            this.trigger('operating', { op: 'adding', data: list });
            this.trigger('changing', this);
            this.do_add(list);
            this.trigger('changed', this);
            this.trigger('operated', { op: 'added', data: list });
        };
        CollectionKO.prototype.Modify = function (list) {
            this.trigger('operating', { op: 'modifing', data: list });
            this.trigger('changing', this);
            this.do_modify(list);
            this.trigger('changed', this);
            this.trigger('operated', { op: 'modified', data: list });
        };
        CollectionKO.prototype.Remove = function (list) {
            this.trigger('operating', { op: 'removing', data: list });
            this.trigger('changing', this);
            this.do_remove(list);
            this.trigger('changed', this);
            this.trigger('operated', { op: 'removed', data: list });
        };
        CollectionKO.prototype.Clear = function () {
            this.trigger('operating', { op: 'clearing', data: null });
            this.trigger('changing', this);
            this.do_clear();
            this.trigger('changed', this);
            this.trigger('operated', { op: 'cleared', data: null });
        };
        CollectionKO.prototype.map = function (callback) {
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
        };
        CollectionKO.prototype.do_add = function (list) {
            for (var _i = 0, list_7 = list; _i < list_7.length; _i++) {
                var I = list_7[_i];
                this.trigger('adding', I);
                this.collection.push(I);
                this.trigger('added', I);
            }
        };
        CollectionKO.prototype.do_modify = function (list) {
            for (var _i = 0, list_8 = list; _i < list_8.length; _i++) {
                var I = list_8[_i];
                var t = this.collection[this.collection.indexOf(I[0])];
                if (t) {
                    this.trigger('modifing', I);
                    t = I[1];
                    this.trigger('modified', I);
                }
            }
        };
        CollectionKO.prototype.do_get = function (id) {
            if (id in this.collection) {
                return { id: id, data: this.collection[id] };
            }
            else {
                return { id: null, data: null };
            }
        };
        CollectionKO.prototype.do_remove = function (list) {
            for (var _i = 0, list_9 = list; _i < list_9.length; _i++) {
                var I = list_9[_i];
                var i = this.collection.indexOf(I[0]);
                var t = this.collection[i];
                if (t) {
                    this.trigger('removeing', t);
                    delete this.collection[i];
                    this.trigger('removed', t);
                }
            }
        };
        CollectionKO.prototype.do_clear = function () {
            this.collection = [];
        };
        return CollectionKO;
    }());
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
    var CollectionLinker = (function () {
        function CollectionLinker(option) {
            this.sourceCollection = option.sourceCollection;
            this.targetCollection = option.targetCollection;
            this.filterFunction = option.filterFunction;
            this.convertFunction = option.convertFunction;
        }
        CollectionLinker.prototype.start = function () {
            //this.sourceCollection.bind("adding", this.sourceAdding.bind(this));
            //this.sourceCollection.bind("added", this.sourceAdded.bind(this));
            //this.sourceCollection.bind("modifing", this.sourceModifing.bind(this));
            //this.sourceCollection.bind("modified", this.sourceModified.bind(this));
            //this.sourceCollection.bind("removeing", this.sourceRemoving.bind(this));
            //this.sourceCollection.bind("removed", this.sourceRemoved.bind(this));
            this.sourceCollection.bind("operating", this.sourceOperating.bind(this));
            this.sourceCollection.bind("operated", this.sourceOperated.bind(this));
        };
        CollectionLinker.prototype.stop = function () {
            //this.sourceCollection.unbind("adding", this.sourceAdding.bind(this));
            //this.sourceCollection.unbind("added", this.sourceAdded.bind(this));
            //this.sourceCollection.unbind("modifing", this.sourceModifing.bind(this));
            //this.sourceCollection.unbind("modified", this.sourceModified.bind(this));
            //this.sourceCollection.unbind("removeing", this.sourceRemoving.bind(this));
            //this.sourceCollection.unbind("removed", this.sourceRemoved.bind(this));
            this.sourceCollection.unbind("operating", this.sourceOperating.bind(this));
            this.sourceCollection.unbind("operated", this.sourceOperated.bind(this));
        };
        CollectionLinker.prototype.sourceOperating = function (evt, op) {
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
        };
        CollectionLinker.prototype.sourceOperated = function (evt, op) {
            switch (op.op) {
                case "added":
                    var filted = op.data.filter(this.filterFunction);
                    var converted = filted.map(this.convertFunction);
                    this.targetCollection.Add(converted);
                    break;
                case "modified":
                    var modify = [], remove = [];
                    for (var _i = 0, _a = op.data; _i < _a.length; _i++) {
                        var I = _a[_i];
                        var theOld, theNew;
                        if (I instanceof Array) {
                            theOld = I[0];
                            theNew = I[1];
                        }
                        else {
                            theOld = I;
                            theNew = I;
                        }
                        if (this.filterFunction(theOld)) {
                            if (this.filterFunction(theNew)) {
                                modify.push([this.convertFunction(theOld), this.convertFunction(theNew)]);
                            }
                            else {
                                remove.push(this.convertFunction(theOld));
                            }
                        }
                    }
                    this.targetCollection.Modify(modify);
                    this.targetCollection.Remove(remove);
                    break;
                case "removed":
                    var filted = op.data.filter(this.filterFunction);
                    var converted = filted.map(this.convertFunction);
                    this.targetCollection.Remove(converted);
                    break;
                case "cleared":
                    this.targetCollection.Clear();
                    break;
            }
        };
        return CollectionLinker;
    }());
    exports.CollectionLinker = CollectionLinker;
});
//class Filter<T> extends Collection<T>{
//
//}
//
//class Proxy<T> extends Collection<T>{
//
//} 
