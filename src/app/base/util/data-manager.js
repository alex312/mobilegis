"use strict";
var Subject_1 = require('rxjs/Subject');
var DataManager = (function () {
    function DataManager() {
        this.Items = [];
        this._snapData = new Subject_1.Subject();
        this._added = new Subject_1.Subject();
        this._changed = new Subject_1.Subject();
        this._removed = new Subject_1.Subject();
        this.snapData = this._snapData.asObservable();
        this.added = this._added.asObservable();
        this.changed = this._changed.asObservable();
        this.removed = this._removed.asObservable();
    }
    DataManager.prototype.reset = function (datas) {
        var _this = this;
        this.Items.splice(0, this.Items.length);
        datas.map(function (task) { return _this.Items.push(task); });
        this._snapData.next(datas);
    };
    DataManager.prototype.add = function (data) {
        this.Items.push(data);
        this._added.next(data);
    };
    DataManager.prototype.remove = function (data, predicate) {
        //TODO 可能在低版本的手机上无法使用
        var index = this.Items.findIndex(function (item) { return predicate(item, data); });
        var removedData = this.Items[index];
        this.Items.splice(index, 1);
        this._removed.next(removedData);
    };
    DataManager.prototype.update = function (index, data) {
        //TODO: 直接赋值可能会导致界面无法更新
        this.Items[index] = data;
        this._changed.next(data);
    };
    DataManager.prototype.addOrUpdate = function (data, predicate) {
        var index = this.Items.findIndex(function (item) { return predicate(item, data); });
        if (index < 0)
            this.add(data);
        else
            this.update(index, data);
    };
    DataManager.prototype.find = function (data, predicate) {
        var index = this.Items.findIndex(function (item) { return predicate(item, data); });
        if (index < 0)
            return null;
        else
            return this.Items[index];
    };
    return DataManager;
}());
exports.DataManager = DataManager;
