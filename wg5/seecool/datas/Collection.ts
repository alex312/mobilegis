import EventSource from "seecool/datas/EventSource";
import {JSTool} from "seecool/utils/JSTool";

export interface EventObject {
    type: string;
    target?: any;
}

export interface IEventSource {
    bind(type: string, handler: Function);
    unbind(type: string, handler: Function);
    trigger(event: EventObject|string, ...args: any[]);
}

export interface ICollection<T> extends IEventSource {
    Add: Function,
    Modify: Function,
    Remove: Function,
    List: Function,
    Clear: Function
}

export class CollectionA<T> implements ICollection<T> {
    name;

    constructor(name?) {
        this.name = name || "";
        this.eventSource = new EventSource();
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

    init() {
        this.collection = [];
    }

    private eventSource;

    public bind(type: string, handler: Function) {
        this.eventSource.bind.apply(this, arguments);
    }

    public unbind(type: string, handler: Function) {
        this.eventSource.unbind.apply(this, arguments);
    }

    trigger(event: EventObject|string, ...args: any[]) {
        this.eventSource.trigger.apply(this, arguments);
    }

    collection: Array<T>;

    public List() {
        return JSTool.cloneWeak(this.collection);
    }

    public Add(list: Array<T>) {
        this.trigger('operating', {op: 'adding', data: list});
        this.trigger('changing', this);
        this.do_add(list);
        this.trigger('changed', this);
        this.trigger('operated', {op: 'added', data: list});
    }

    public Modify(list: Array<Array<T>>) {
        this.trigger('operating', {op: 'modifing', data: list});
        this.trigger('changing', this)
        this.do_modify(list);
        this.trigger('changed', this)
        this.trigger('operated', {op: 'modified', data: list});
    }

    public Remove(list: Array<T>) {
        this.trigger('operating', {op: 'removing', data: list});
        this.trigger('changing', this)
        this.do_remove(list);
        this.trigger('changed', this)
        this.trigger('operated', {op: 'removed', data: list});
    }

    public Clear() {
        this.trigger('operating', {op: 'clearing', data: null});
        this.trigger('changing', this)
        this.do_clear();
        this.trigger('changed', this)
        this.trigger('operated', {op: 'cleared', data: null});
    }

    public map(callback: (obj: T)=>any): Array<any> {
        var rtn = [];
        this.trigger('operating', {op: 'maping', data: null});
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
        this.trigger('operated', {op: 'maped', data: null});
        return rtn;
    }

    private do_add(list: Array<T>) {
        for (var I of list) {
            this.trigger('adding', I);
            this.collection.push(I);
            this.trigger('added', I);
        }
    }

    private do_modify(list: Array<Array<T>>) {
        for (var I of list) {
            var t = this.collection[this.collection.indexOf(I[0])];
            if (t) {
                this.trigger('modifing', I);
                t = I[1];
                this.trigger('modified', I);
            }
        }
    }

    private do_get(id: string): {id?: string,data: T} {
        if (id in this.collection) {
            return {id: id, data: this.collection[id]};
        } else {
            return {id: null, data: null};
        }
    }

    private do_remove(list: Array<T>) {
        for (var I of list) {
            var i = this.collection.indexOf(I[0]);
            var t = this.collection[i];
            if (t) {
                this.trigger('removeing', t);
                delete this.collection[i];
                this.trigger('removed', t);
            }
        }
    }

    private do_clear() {
        this.collection = [];
    }
}

export interface ICollectionA2Option<T> {
    name?: string,
    isOne?: (a: T, b: T)=>boolean
}

/**
 * 集合
 * 相比于CollectionA,CollectionA2 增加了 isOne自定义函数,用于判断两个成员是否是同一个
 */
export class CollectionA2<T> implements ICollection<T> {
    name;
    isOne: (a: T, b: T)=>boolean;

    constructor(option?: ICollectionA2Option<T>) {
        if (option) {
            option.name && (this.name = option.name || "");
            option.isOne && (this.isOne = option.isOne);
        }
        this.eventSource = new EventSource();
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

    init() {
        this.collection = [];
    }

    private eventSource;

    public bind(type: string, handler: Function) {
        this.eventSource.bind.apply(this, arguments);
    }

    public unbind(type: string, handler: Function) {
        this.eventSource.unbind.apply(this, arguments);
    }

    trigger(event: EventObject|string, ...args: any[]) {
        this.eventSource.trigger.apply(this, arguments);
    }

    collection: Array<T>;

    public List() {
        return JSTool.cloneWeak(this.collection);
    }

    public Add(list: Array<T>) {
        this.trigger('operating', {op: 'adding', data: list});
        this.trigger('changing', this);
        this.do_add(list);
        this.trigger('changed', this);
        this.trigger('operated', {op: 'added', data: list});
    }

    public Modify(list: Array<Array<T>>) {
        this.trigger('operating', {op: 'modifing', data: list});
        this.trigger('changing', this)
        this.do_modify(list);
        this.trigger('changed', this)
        this.trigger('operated', {op: 'modified', data: list});
    }

    public Remove(list: Array<T>) {
        this.trigger('operating', {op: 'removing', data: list});
        this.trigger('changing', this)
        this.do_remove(list);
        this.trigger('changed', this)
        this.trigger('operated', {op: 'removed', data: list});
    }

    public Clear() {
        this.trigger('operating', {op: 'clearing', data: null});
        this.trigger('changing', this)
        this.do_clear();
        this.trigger('changed', this)
        this.trigger('operated', {op: 'cleared', data: null});
    }

    public map(callback: (obj: T)=>any): Array<any> {
        var rtn = [];
        this.trigger('operating', {op: 'maping', data: null});
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
        this.trigger('operated', {op: 'maped', data: null});
        return rtn;
    }

    private do_add(list: Array<T>) {
        for (var I of list) {
            this.trigger('adding', I);
            this.collection.push(I);
            this.trigger('added', I);
        }
    }

    private do_modify(list: Array<Array<T>>) {
        for (var I of list) {
            var t: any = this.collection.filter(function (v: T) {
                return (this.isOne || this.defaultIsOne)(v, I[0]);
            });
            t = t[0];
            if (t) {
                this.trigger('modifing', I);
                t = I[1];
                this.trigger('modified', I);
            }
        }
    }

    private do_get(id: string): {id?: string,data: T} {
        if (id in this.collection) {
            return {id: id, data: this.collection[id]};
        } else {
            return {id: null, data: null};
        }
    }

    private do_remove(list: Array<T>) {
        for (var I of list) {
            var i = this.collection.indexOf(I[0]);
            var t: any = this.collection.filter(function (v: T) {
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
    }

    private do_clear() {
        this.collection = [];
    }

    private defaultIsOne = function (a: T, b: T) {
        return (a == b);
    };
}

export class CollectionKO<T> implements ICollection<T> {
    name;

    constructor(name?) {
        this.name = name || "";
        this.eventSource = new EventSource();
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

    init() {
        this.collection = [];
    }

    private eventSource;

    public bind(type: string, handler: Function) {
        this.eventSource.bind.apply(this, arguments);
    }

    public unbind(type: string, handler: Function) {
        this.eventSource.unbind.apply(this, arguments);
    }

    trigger(event: EventObject|string, ...args: any[]) {
        this.eventSource.trigger.apply(this, arguments);
    }

    collection: Array<T>;

    public List() {
        return JSTool.cloneWeak(this.collection);
    }

    public Add(list: Array<T>) {
        this.trigger('operating', {op: 'adding', data: list});
        this.trigger('changing', this);
        this.do_add(list);
        this.trigger('changed', this);
        this.trigger('operated', {op: 'added', data: list});
    }

    public Modify(list: Array<Array<T>>) {
        this.trigger('operating', {op: 'modifing', data: list});
        this.trigger('changing', this)
        this.do_modify(list);
        this.trigger('changed', this)
        this.trigger('operated', {op: 'modified', data: list});
    }

    public Remove(list: Array<T>) {
        this.trigger('operating', {op: 'removing', data: list});
        this.trigger('changing', this)
        this.do_remove(list);
        this.trigger('changed', this)
        this.trigger('operated', {op: 'removed', data: list});
    }

    public Clear() {
        this.trigger('operating', {op: 'clearing', data: null});
        this.trigger('changing', this)
        this.do_clear();
        this.trigger('changed', this)
        this.trigger('operated', {op: 'cleared', data: null});
    }

    public map(callback: (obj: T)=>any): Array<any> {
        var rtn = [];
        this.trigger('operating', {op: 'maping', data: null});
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
        this.trigger('operated', {op: 'maped', data: null});
        return rtn;
    }

    private do_add(list: Array<T>) {
        for (var I of list) {
            this.trigger('adding', I);
            this.collection.push(I);
            this.trigger('added', I);
        }
    }

    private do_modify(list: Array<Array<T>>) {
        for (var I of list) {
            var t = this.collection[this.collection.indexOf(I[0])];
            if (t) {
                this.trigger('modifing', I);
                t = I[1];
                this.trigger('modified', I);
            }
        }
    }

    private do_get(id: string): {id?: string,data: T} {
        if (id in this.collection) {
            return {id: id, data: this.collection[id]};
        } else {
            return {id: null, data: null};
        }
    }

    private do_remove(list: Array<T>) {
        for (var I of list) {
            var i = this.collection.indexOf(I[0]);
            var t = this.collection[i];
            if (t) {
                this.trigger('removeing', t);
                delete this.collection[i];
                this.trigger('removed', t);
            }
        }
    }

    private do_clear() {
        this.collection = [];
    }
}

export interface ICollectionLinkerOption<A,B> {
    sourceCollection: ICollection<B>,
    targetCollection: ICollection<A>,
    filterFunction: (B)=>boolean,
    convertFunction: (B)=>A
}
export function CollectionLinkerOption<A,B>(sourceCollection: ICollection<B>,
                                            targetCollection: ICollection<A>,
                                            filterFunction: (B)=>boolean,
                                            convertFunction: (B)=>A) {
    return {
        sourceCollection: sourceCollection,
        targetCollection: targetCollection,
        filterFunction: filterFunction,
        convertFunction: convertFunction
    }
}

export class CollectionLinker<A,B> {
    sourceCollection: ICollection<B>;
    targetCollection: ICollection<A>;
    filterFunction;
    convertFunction;

    constructor(option: ICollectionLinkerOption<A,B>) {
        this.sourceCollection = option.sourceCollection;
        this.targetCollection = option.targetCollection;
        this.filterFunction = option.filterFunction;
        this.convertFunction = option.convertFunction;
    }

    start() {
        //this.sourceCollection.bind("adding", this.sourceAdding.bind(this));
        //this.sourceCollection.bind("added", this.sourceAdded.bind(this));
        //this.sourceCollection.bind("modifing", this.sourceModifing.bind(this));
        //this.sourceCollection.bind("modified", this.sourceModified.bind(this));
        //this.sourceCollection.bind("removeing", this.sourceRemoving.bind(this));
        //this.sourceCollection.bind("removed", this.sourceRemoved.bind(this));

        this.sourceCollection.bind("operating", this.sourceOperating.bind(this));
        this.sourceCollection.bind("operated", this.sourceOperated.bind(this));
    }

    stop() {
        //this.sourceCollection.unbind("adding", this.sourceAdding.bind(this));
        //this.sourceCollection.unbind("added", this.sourceAdded.bind(this));
        //this.sourceCollection.unbind("modifing", this.sourceModifing.bind(this));
        //this.sourceCollection.unbind("modified", this.sourceModified.bind(this));
        //this.sourceCollection.unbind("removeing", this.sourceRemoving.bind(this));
        //this.sourceCollection.unbind("removed", this.sourceRemoved.bind(this));

        this.sourceCollection.unbind("operating", this.sourceOperating.bind(this));
        this.sourceCollection.unbind("operated", this.sourceOperated.bind(this));
    }

    sourceOperating(evt: EventObject, op) {
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

    sourceOperated(evt: EventObject, op) {
        switch (op.op) {
            case "added":
                var filted = <Array<any>>op.data.filter(this.filterFunction);
                var converted = filted.map(this.convertFunction);
                this.targetCollection.Add(converted);
                break;
            case "modified":
                var filted = <Array<any>>op.data.filter(this.filterFunction)
                this.targetCollection.Modify(this.convertFunction(filted));
                break;
            case "removed":
                var filted = <Array<any>>op.data.filter(this.filterFunction)
                this.targetCollection.Remove(this.convertFunction(filted));
                break;
            case "cleared":
                this.targetCollection.Clear();
                break;
        }
    }

    //sourceAdding(evt:EventObject,obj:B){}
    //sourceAdded(evt:EventObject,obj:B) {
    //    if(this.filterFunction(obj)){
    //        this.targetCollection.Add(this.convertFunction([obj]));
    //    }
    //}
    //sourceModifing(evt:EventObject,I:Array<B>){}
    //sourceModified(evt:EventObject,I:Array<B>){
    //    if(this.filterFunction(I[0])){
    //        this.targetCollection.Modify(this.convertFunction(I[1]));
    //    }
    //}
    //sourceRemoving(evt:EventObject,obj:B){}
    //sourceRemoved(evt:EventObject,obj:B){
    //    if(this.filterFunction(obj)){
    //        this.targetCollection.Remove(this.convertFunction([obj]));
    //    }
    //}
}

//class Filter<T> extends Collection<T>{
//
//}
//
//class Proxy<T> extends Collection<T>{
//
//}