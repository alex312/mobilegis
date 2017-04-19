var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    var ShipsSymbolDataSource = (function (_super) {
        __extends(ShipsSymbolDataSource, _super);
        function ShipsSymbolDataSource(option) {
            var _this = _super.call(this) || this;
            option = option || {};
            _this.ds_ = option.datasource;
            _this.dataUrl_ = option.service || undefined;
            _this.xhr_ = null;
            _this.timer_ = null;
            _this.requestId_ = 0;
            _this.extent_ = ol.extent.createEmpty();
            _this.watchs_ = {};
            _this.data_ = {};
            _this.dataConverter_ = null;
            _this.timerRefreshCanvas_ = null;
            _this.timerRefreshShow_ = window.setTimeout(_this.refreshShow.bind(_this), 1);
            _this.bindDataSource();
            return _this;
            //this.load_();
            //this.feature=[];
            //this.featureChangeHandler_=this.onFeatureChange_.bind(this);
            //feature.bind("change", this.featureChangeHandler_);
        }
        ShipsSymbolDataSource.prototype.bindDataSource = function () {
            //var that=this;
            //this.ds_.bind('change', function (evt) {
            //     evt.removed.forEach(function (item) {
            //        if(!that.data_ && that.data_.length>0)
            //           delete that.data_[item.id];
            //        //layer.removeFeature(features[item.id]);
            //        //delete features[item.id];
            //    });
            //    evt.added.forEach(function (item) {
            //        //this.data_.push(item);
            //        that.data_[item.id]=item;
            //        //layer.addFeature(features[item.id] = new ShipFeature(item));
            //    });
            //
            //    //this.data_ = this.preprocess_(obj);
            //    this.changed();
            //}.bind(this));
        };
        ;
        //onFeatureChange_=function() {
        //    this.changed();
        //}
        //onFeatureChange=function(features_){
        //   console.log("========",this.data_);
        //    console.log("==features_======",features_);
        //};
        ShipsSymbolDataSource.prototype.getData = function () {
            return this.data_;
        };
        ;
        ShipsSymbolDataSource.prototype.refreshShow = function () {
            this.changed();
            this.timerRefreshShow_ = window.setTimeout(this.refreshShow.bind(this), 1);
        };
        ShipsSymbolDataSource.prototype.setExtent = function (extent) {
            if (!extent)
                extent = ol.extent.createEmpty();
            if (!ol.extent.equals(extent, this.extent_)) {
                this.extent_ = extent;
                this.requestReload_();
            }
        };
        ;
        ShipsSymbolDataSource.prototype.watchShip = function (id) {
            console.log(this.watchs_, id);
            if (id in this.watchs_) {
                this.watchs_[id]++;
            }
            else {
                this.watchs_[id] = 1;
                this.requestReload_();
            }
        };
        ;
        ShipsSymbolDataSource.prototype.unwatchShip = function (id) {
            if (id in this.watchs_) {
                if (--this.watchs_[id] == 0)
                    delete this.watchs_[id];
            }
        };
        ;
        ShipsSymbolDataSource.prototype.requestReload_ = function () {
            this.clearTimer_();
            this.timer_ = window.setTimeout(this.load_.bind(this), 1);
        };
        ;
        ShipsSymbolDataSource.prototype.dispose = function () {
            this.clearTimer_();
            if (this.xhr_) {
                this.xhr_.abort();
                this.xhr_ = null;
            }
        };
        ;
        ShipsSymbolDataSource.prototype.clearTimer_ = function () {
            if (this.timer_) {
                window.clearTimeout(this.timer_);
                this.timer_ = null;
            }
        };
        ;
        ShipsSymbolDataSource.prototype.isWatchingAnything_ = function () {
            for (var each in this.watchs_) {
                return true;
            }
            return false;
        };
        ;
        ShipsSymbolDataSource.prototype.formatWatches_ = function () {
            var items = [];
            for (var each in this.watchs_) {
                items.push(each);
            }
            return items.join(",");
        };
        ;
        ShipsSymbolDataSource.prototype.load_ = function () {
            console.log("ship symbol data source load", this.dataUrl_);
            if (!this.dataUrl_)
                return;
            if (ol.extent.isEmpty(this.extent_) && !this.isWatchingAnything_())
                return;
            var data = [
                'bounds=' + encodeURIComponent(this.extent_.join(',')),
                'followee=' + encodeURIComponent("mids:" + this.formatWatches_()),
                'merge=false'
            ];
            if (this.xhr_) {
                this.xhr_.onload = null;
                this.xhr_.onerror = null;
            }
            this.xhr_ = new XMLHttpRequest();
            this.xhr_.open("GET", this.dataUrl_ + '?' + data.join('&'));
            this.xhr_.onload = this.loadComplete_.bind(this, false);
            this.xhr_.onerror = this.loadComplete_.bind(this, true);
            this.xhr_.send();
            console.log(this.dataUrl_ + '?' + data.join('&'));
        };
        ;
        ShipsSymbolDataSource.prototype.loadComplete_ = function (failed, evt) {
            var xhr = evt.target;
            if (!failed && xhr.status === 200) {
                var obj = JSON.parse(xhr.responseText);
                this.data_ = this.preprocess_(obj);
                this.changed();
            }
            this.timer_ = window.setTimeout(this.load_.bind(this), 1000 * 15);
        };
        ;
        ShipsSymbolDataSource.prototype.preprocess_ = function (result) {
            var ships = ({});
            for (var i = 0, l = result.length; i < l; i++) {
                var ship = result[i];
                ships[ship.id] = ship;
            }
            return ships;
        };
        ;
        return ShipsSymbolDataSource;
    }(ol.Observable));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipsSymbolDataSource;
});
