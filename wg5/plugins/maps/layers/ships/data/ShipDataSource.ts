import EventSource from "./EventSource";
import ShipEntity from "./ShipEntity";

class ShipDataSource extends EventSource {
    private _items:{[key:string]:ShipEntity} = {};
    private _length:number = 0;
    private _dataItemFactories:{[key:string]:(id:string, data:any)=>ShipEntity};

    constructor(dataItemFactories:{[key:string]:(id:string, data:any)=>ShipEntity}) {
        super();
        this._dataItemFactories = dataItemFactories;
    }

    createItem(type:string, id:string, data:any) {
        if (type in this._dataItemFactories)
            return this._dataItemFactories[type](id, data);
        return null;
    }

    replace(olds:ShipEntity[]|IArguments, news:ShipEntity[]|IArguments) {

        var items = this._items;
        var evt = {
            added: [],
            removed: [],
            type: 'change'
        };
        //console.log("replace:",olds,news);
        if (olds && olds.length)
            for (var i = 0; i < olds.length; i++) {
                var o = olds[i];
                if (o.id in items) {
                    evt.removed.push(o);
                    delete items[o.id];
                }
            }

        if (news && news.length) {
            for (var j = 0; j < news.length; j++) {
                var n = news[j];
                var no = items[n.id];
                if (n !== no) {
                    if (no)
                        evt.removed.push(no);
                    items[n.id] = n;
                    evt.added.push(n);
                }
            }
        }
        var dlen = evt.added.length - evt.removed.length;
        this._length = this._length + dlen;

        if (dlen)
            this.trigger(evt);
    }
    add_immediately(item1:ShipEntity|ShipEntity[]){
        var evt = {
            type: 'change_immediately'
        };
        this.add(item1);
        this.trigger(evt);
    }

    add(item1:ShipEntity|ShipEntity[]) {
        if (item1 instanceof Array) {
            this.replace(null, item1);
        } else {
            this.replace(null, arguments);
        }
    }

    remove(item1:ShipEntity|ShipEntity[]) {
        if (item1 instanceof Array) {
            this.replace(item1, null);
        } else {
            this.replace(arguments, null);
        }
    }

    item(id) {
        return this._items[id] || null;
    }

    each(callback) {
        for (var each in this._items)
            callback(this._items[each]);
    }

    get size():number {
        return this._length;
    }
}

export default ShipDataSource;
