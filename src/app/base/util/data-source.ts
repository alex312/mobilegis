import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

interface IDataSource<T> {
    AddOrUpdate(key: string, value: T): void;
    Remove(key: string): void;
    Clear(): void;
    Reset(keyValues: { [key: string]: T });
    Reset2(values: T[], keySelector: (value: T) => string);
    ContainsKey(key: string): boolean;
    GetOrDefault(key: string): T;
    DataSource(): T[];
    Keys(): string[];
    Snapshot: Observable<T[]>;
    CreatedData: Observable<T>;
    ChangedData: Observable<T>;
    RemovedData: Observable<T>;
}
export class DataSource<T> implements IDataSource<T> {
    Snapshot: Observable<T[]>;
    CreatedData: Observable<T>;
    ChangedData: Observable<T>;
    RemovedData: Observable<T>;
    private _snapshot: Subject<T[]>;
    private _createData: Subject<T>;
    private _changedData: Subject<T>;
    private _removedData: Subject<T>;
    private _keyValues: { [key: string]: T } = {};
    constructor() {
        this._snapshot = new Subject<T[]>();
        this._createData = new Subject<T>();
        this._changedData = new Subject<T>();
        this._removedData = new Subject<T>();
        this.Snapshot = this._snapshot.asObservable();
        this.CreatedData = this._createData.asObservable();
        this.ChangedData = this._changedData.asObservable();
        this.RemovedData = this._removedData.asObservable();
    }

    AddOrUpdate(key: string, value: T): void {
        if (this._keyValues[key]) {
            this._keyValues[key] = value;
            this._changedData.next(value);
        }
        else {
            this._keyValues[key] = value;
            this._createData.next(value);
        }
    }
    Remove(key: string): void {
        let val = this._keyValues[key];
        if (val) {
            delete this._keyValues[key];
            this._removedData.next(val);
        }
    }
    Clear(): void {
        let keyValues: { [key: string]: T } = {};
        this.Reset(keyValues);
    }
    Reset(keyValues: { [key: string]: T }) {
        this._keyValues = keyValues;
        let values = this.DataSource();
        this._snapshot.next(values);
    }
    Reset2(values: T[], keySelector: (value: T) => string) {
        let keyValues: { [key: string]: T } = {};
        values.forEach(p => {
            let key: string = keySelector(p);
            keyValues[key] = p;
        });
        this.Reset(keyValues);
    }
    ContainsKey(key: string): boolean {
        return false;
    }
    GetOrDefault(key: string): T {
        return this._keyValues[key];
    }
    DataSource(): T[] {
        let values: T[] = []
        for (var item in this._keyValues) {
            if (this._keyValues.hasOwnProperty(item))
                values.push(this._keyValues[item]);
        }
        return values;
    }
    Keys(): string[] {
        let keys: string[] = [];
        for (var item in this._keyValues) {
            if (this._keyValues.hasOwnProperty(item))
                keys.push(item);
        }
        return keys;
    }
}