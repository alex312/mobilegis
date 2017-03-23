import * as ol from "openlayers";
import * as utilities from "seecool/utilities";
import Feature from "./Feature";
import ShipEntity from "./ShipEntity";

class ShipsSymbolDataSource extends ol.Observable {
    ds_;
    dataUrl_;
    xhr_;
    timer_;
    requestId_;
    extent_;
    watchs_;
    data_;
    dataConverter_;
    timerRefreshCanvas_;
    timerRefreshShow_;

    constructor(option?) {
        super()

        option = option || {};

        this.ds_ = option.datasource;
        this.dataUrl_ = option.service || undefined;
        this.xhr_ = null;
        this.timer_ = null;
        this.requestId_ = 0;
        this.extent_ = ol.extent.createEmpty();
        this.watchs_ = {};
        this.data_ = {};
        this.dataConverter_ = null;
        this.timerRefreshCanvas_ = null;
        this.timerRefreshShow_ = window.setTimeout(this.refreshShow.bind(this), 1);
        this.bindDataSource();
        //this.load_();

        //this.feature=[];
        //this.featureChangeHandler_=this.onFeatureChange_.bind(this);
        //feature.bind("change", this.featureChangeHandler_);
    }

    bindDataSource () {
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

    //onFeatureChange_=function() {
    //    this.changed();
    //}

    //onFeatureChange=function(features_){
    //   console.log("========",this.data_);
    //    console.log("==features_======",features_);
    //};


    getData () {
        return this.data_;
    };

    refreshShow () {
        this.changed();
        this.timerRefreshShow_ = window.setTimeout(this.refreshShow.bind(this), 1);
    }

    setExtent (extent) {
        if (!extent) extent = ol.extent.createEmpty();
        if (!ol.extent.equals(extent, this.extent_)) {
            this.extent_ = extent;
            this.requestReload_();
        }
    };

    watchShip (id) {
        console.log(this.watchs_, id);
        if (id in this.watchs_) {
            this.watchs_[id]++;
        } else {
            this.watchs_[id] = 1;
            this.requestReload_();
        }
    };

    unwatchShip (id) {
        if (id in this.watchs_) {
            if (--this.watchs_[id] == 0)
                delete this.watchs_[id];
        }
    };

    requestReload_ () {
        this.clearTimer_();
        this.timer_ = window.setTimeout(this.load_.bind(this), 1);
    };

    dispose () {
        this.clearTimer_();
        if (this.xhr_) {
            this.xhr_.abort();
            this.xhr_ = null;
        }
    };

    clearTimer_ () {
        if (this.timer_) {
            window.clearTimeout(this.timer_);
            this.timer_ = null;
        }
    };

    isWatchingAnything_ () {
        for (var each in this.watchs_) {
            return true;
        }
        return false;
    };

    formatWatches_ () {
        var items = [];
        for (var each in this.watchs_) {
            items.push(each);
        }
        return items.join(",");
    };

    load_ () {
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

    loadComplete_ (failed, evt) {
        var xhr = evt.target;
        if (!failed && xhr.status === 200) {
            var obj = JSON.parse(xhr.responseText);
            this.data_ = this.preprocess_(obj);
            this.changed();
        }

        this.timer_ = window.setTimeout(this.load_.bind(this), 1000 * 15);
    };

    preprocess_ (result) {
        var ships = /**@type {Object.<string, seecoolx.data.Ship>}*/({});
        for (var i = 0, l = result.length; i < l; i++) {
            var ship = result[i];
            ships[ship.id] = ship;
        }
        return ships;
    };

}
export default ShipsSymbolDataSource;
