"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";

    var ShipsSymbolDataSource = function (_ol$Observable) {
        _inherits(ShipsSymbolDataSource, _ol$Observable);

        function ShipsSymbolDataSource(option) {
            _classCallCheck(this, ShipsSymbolDataSource);

            var _this = _possibleConstructorReturn(this, (ShipsSymbolDataSource.__proto__ || Object.getPrototypeOf(ShipsSymbolDataSource)).call(this));

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
            //this.load_();
            //this.feature=[];
            //this.featureChangeHandler_=this.onFeatureChange_.bind(this);
            //feature.bind("change", this.featureChangeHandler_);
            return _this;
        }

        _createClass(ShipsSymbolDataSource, [{
            key: "bindDataSource",
            value: function bindDataSource() {
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
            }
        }, {
            key: "getData",

            //onFeatureChange_=function() {
            //    this.changed();
            //}
            //onFeatureChange=function(features_){
            //   console.log("========",this.data_);
            //    console.log("==features_======",features_);
            //};
            value: function getData() {
                return this.data_;
            }
        }, {
            key: "refreshShow",
            value: function refreshShow() {
                this.changed();
                this.timerRefreshShow_ = window.setTimeout(this.refreshShow.bind(this), 1);
            }
        }, {
            key: "setExtent",
            value: function setExtent(extent) {
                if (!extent) extent = ol.extent.createEmpty();
                if (!ol.extent.equals(extent, this.extent_)) {
                    this.extent_ = extent;
                    this.requestReload_();
                }
            }
        }, {
            key: "watchShip",
            value: function watchShip(id) {
                console.log(this.watchs_, id);
                if (id in this.watchs_) {
                    this.watchs_[id]++;
                } else {
                    this.watchs_[id] = 1;
                    this.requestReload_();
                }
            }
        }, {
            key: "unwatchShip",
            value: function unwatchShip(id) {
                if (id in this.watchs_) {
                    if (--this.watchs_[id] == 0) delete this.watchs_[id];
                }
            }
        }, {
            key: "requestReload_",
            value: function requestReload_() {
                this.clearTimer_();
                this.timer_ = window.setTimeout(this.load_.bind(this), 1);
            }
        }, {
            key: "dispose",
            value: function dispose() {
                this.clearTimer_();
                if (this.xhr_) {
                    this.xhr_.abort();
                    this.xhr_ = null;
                }
            }
        }, {
            key: "clearTimer_",
            value: function clearTimer_() {
                if (this.timer_) {
                    window.clearTimeout(this.timer_);
                    this.timer_ = null;
                }
            }
        }, {
            key: "isWatchingAnything_",
            value: function isWatchingAnything_() {
                for (var each in this.watchs_) {
                    return true;
                }
                return false;
            }
        }, {
            key: "formatWatches_",
            value: function formatWatches_() {
                var items = [];
                for (var each in this.watchs_) {
                    items.push(each);
                }
                return items.join(",");
            }
        }, {
            key: "load_",
            value: function load_() {
                console.log("ship symbol data source load", this.dataUrl_);
                if (!this.dataUrl_) return;
                if (ol.extent.isEmpty(this.extent_) && !this.isWatchingAnything_()) return;
                var data = ['bounds=' + encodeURIComponent(this.extent_.join(',')), 'followee=' + encodeURIComponent("mids:" + this.formatWatches_()), 'merge=false'];
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
            }
        }, {
            key: "loadComplete_",
            value: function loadComplete_(failed, evt) {
                var xhr = evt.target;
                if (!failed && xhr.status === 200) {
                    var obj = JSON.parse(xhr.responseText);
                    this.data_ = this.preprocess_(obj);
                    this.changed();
                }
                this.timer_ = window.setTimeout(this.load_.bind(this), 1000 * 15);
            }
        }, {
            key: "preprocess_",
            value: function preprocess_(result) {
                var ships = {};
                for (var i = 0, l = result.length; i < l; i++) {
                    var ship = result[i];
                    ships[ship.id] = ship;
                }
                return ships;
            }
        }]);

        return ShipsSymbolDataSource;
    }(ol.Observable);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipsSymbolDataSource;
});