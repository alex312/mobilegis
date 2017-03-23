"use strict";
var Subject_1 = require('rxjs/Subject');
var DataSource = (function () {
    function DataSource() {
        this._keyValues = {};
        this._snapshot = new Subject_1.Subject();
        this._createData = new Subject_1.Subject();
        this._changedData = new Subject_1.Subject();
        this._removedData = new Subject_1.Subject();
        this.Snapshot = this._snapshot.asObservable();
        this.CreatedData = this._createData.asObservable();
        this.ChangedData = this._changedData.asObservable();
        this.RemovedData = this._removedData.asObservable();
    }
    DataSource.prototype.AddOrUpdate = function (key, value) {
        if (this._keyValues[key]) {
            this._keyValues[key] = value;
            this._changedData.next(value);
        }
        else {
            this._keyValues[key] = value;
            this._createData.next(value);
        }
    };
    DataSource.prototype.Remove = function (key) {
        var val = this._keyValues[key];
        if (val) {
            delete this._keyValues[key];
            this._removedData.next(val);
        }
    };
    DataSource.prototype.Clear = function () {
        var keyValues = {};
        this.Reset(keyValues);
    };
    DataSource.prototype.Reset = function (keyValues) {
        this._keyValues = keyValues;
        var values = this.DataSource();
        this._snapshot.next(values);
    };
    DataSource.prototype.Reset2 = function (values, keySelector) {
        var keyValues = {};
        values.forEach(function (p) {
            var key = keySelector(p);
            keyValues[key] = p;
        });
        this.Reset(keyValues);
    };
    DataSource.prototype.ContainsKey = function (key) {
        return false;
    };
    DataSource.prototype.GetOrDefault = function (key) {
        return this._keyValues[key];
    };
    DataSource.prototype.DataSource = function () {
        var values = [];
        for (var item in this._keyValues) {
            if (this._keyValues.hasOwnProperty(item))
                values.push(this._keyValues[item]);
        }
        return values;
    };
    DataSource.prototype.Keys = function () {
        var keys = [];
        for (var item in this._keyValues) {
            if (this._keyValues.hasOwnProperty(item))
                keys.push(item);
        }
        return keys;
    };
    return DataSource;
}());
exports.DataSource = DataSource;
