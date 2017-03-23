"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var search_result_item_1 = require('./search-result-item');
var ShipSearchResultItem = (function (_super) {
    __extends(ShipSearchResultItem, _super);
    function ShipSearchResultItem(data) {
        _super.call(this, data);
    }
    ShipSearchResultItem.prototype.init = function (data) {
        this.uid = data.ShipId;
        this.name = data.Name;
        this.type = data.ShipType;
        this.mmsi = data.MMSI;
    };
    return ShipSearchResultItem;
}(search_result_item_1.SearchResultItem));
exports.ShipSearchResultItem = ShipSearchResultItem;
