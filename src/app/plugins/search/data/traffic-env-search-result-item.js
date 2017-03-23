"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var search_result_item_1 = require('./search-result-item');
var TrafficEnvSearchResultItem = (function (_super) {
    __extends(TrafficEnvSearchResultItem, _super);
    function TrafficEnvSearchResultItem(data) {
        _super.call(this, data);
    }
    TrafficEnvSearchResultItem.prototype.init = function (data) {
        this.uid = data.Id;
        this.name = data.Name;
        this.type = data.TrafficEnvType;
    };
    return TrafficEnvSearchResultItem;
}(search_result_item_1.SearchResultItem));
exports.TrafficEnvSearchResultItem = TrafficEnvSearchResultItem;
