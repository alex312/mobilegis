import { Subject }    from 'rxjs/Subject';

export class DataManager<T>{


    protected _snapData;
    protected _added;
    protected _changed;
    protected _removed;

    snapData;
    added;
    changed;
    removed;

    Items: T[] = []
    constructor() {
        this._snapData = new Subject<T[]>();
        this._added = new Subject<T>();
        this._changed = new Subject<T>();
        this._removed = new Subject<T>();

        this.snapData = this._snapData.asObservable();
        this.added = this._added.asObservable();
        this.changed = this._changed.asObservable();
        this.removed = this._removed.asObservable();
    }

    reset(datas: T[]) {
        this.Items.splice(0, this.Items.length)
        datas.map(task => this.Items.push(task));
        this._snapData.next(datas);
    }

    private add(data: T) {
        this.Items.push(data);
        this._added.next(data);
    }

    remove(data: T, predicate: (left: T, right: T) => boolean) {
        //TODO 可能在低版本的手机上无法使用
        let index = this.Items.findIndex(item => predicate(item, data));
        let removedData = this.Items[index];
        this.Items.splice(index, 1);
        this._removed.next(removedData);
    }

    private update(index: number, data: T) {
        //TODO: 直接赋值可能会导致界面无法更新
        this.Items[index] = data;
        this._changed.next(data);
    }

    addOrUpdate(data: T, predicate: (left: T, right: T) => boolean) {
        let index = this.Items.findIndex(item => predicate(item, data));
        if (index < 0)
            this.add(data);
        else
            this.update(index, data);
    }

    find(data: T, predicate: (left: T, right: T) => boolean) {
        let index = this.Items.findIndex(item => predicate(item, data));
        if (index < 0)
            return null;
        else
            return this.Items[index];
    }

}