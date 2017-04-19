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
define(["require", "exports", "openlayers", "../../../seecool/datas/DynamicFeature", "./layers/SelectOverlay", "./layers/GpsFeature"], function (require, exports, ol, DynamicFeature_1, SelectOverlay_1, GpsFeature_1) {
    "use strict";
    //import {AnyConstractorClass} from "seecool/Interface";
    var SelectInteraction = (function (_super) {
        __extends(SelectInteraction, _super);
        function SelectInteraction() {
            var _this = _super.call(this, {
                handleEvent: function (evt) {
                    return _this.handleMapBrowserEvent(evt);
                }
            }) || this;
            _this.map_ = null;
            _this.focus_ = null;
            _this.select_ = [];
            _this.follow_ = null;
            _this.lastCenter_ = [NaN, NaN];
            _this.focusDeadCallback_ = _this.focusDead_.bind(_this);
            _this.selectDeadCallback_ = _this.selectDead_.bind(_this);
            _this.followDeadCallback_ = _this.followDead_.bind(_this);
            _this.followChangeCallback_ = _this.followChange_.bind(_this);
            _this.gps_ = new GpsFeature_1.default();
            _this.gpsWatchId_ = 0;
            _this.featureOverlay_ = new SelectOverlay_1.default(_this.gps_);
            return _this;
        }
        SelectInteraction.prototype.followGps = function () {
            if (!this.gpsWatchId_) {
                this.gpsWatchId_ = navigator.geolocation.watchPosition(this.geolocationSuccess_.bind(this), this.geolocationError_.bind(this));
            }
            //this.setFollow(this.gps_);
        };
        ;
        SelectInteraction.prototype.geolocationSuccess_ = function (position) {
            var coordinate = [position.coords.longitude, position.coords.latitude];
            coordinate = ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:3857');
            //this.gps_.update(coordinate);
        };
        ;
        SelectInteraction.prototype.geolocationError_ = function (error) {
            console.log(error.code);
            console.log(error.message);
        };
        ;
        SelectInteraction.prototype.getFocus = function () {
            return this.focus_;
        };
        ;
        SelectInteraction.prototype.setFocus = function (feature) {
            if (this.focus_ === feature)
                return;
            if (this.focus_ instanceof DynamicFeature_1.default) {
                this.focus_.unfocus();
                this.focus_.un('die', this.focusDeadCallback_);
            }
            this.focus_ = feature || null;
            if (this.focus_ instanceof DynamicFeature_1.default) {
                this.focus_.on('die', this.focusDeadCallback_);
                this.focus_.focus();
            }
            this.featureOverlay_.setFocus(this.focus_);
            this.dispatchEvent({ type: 'focus', element: this.focus_ });
        };
        ;
        SelectInteraction.prototype.getSelect = function () {
            return this.select_;
        };
        ;
        SelectInteraction.prototype.setSelect = function (feature) {
            if (!feature)
                return;
            var index = this.select_.indexOf(feature);
            if (index > -1) {
                if (this.select_[index] instanceof DynamicFeature_1.default) {
                    this.select_[index].unfocus();
                    this.select_[index].un('die', this.selectDeadCallback_);
                }
                //this.select_.splice(index, 1); //移除直线标绘按钮
                delete this.select_[index];
            }
            ;
            if (index == -1) {
                this.select_.push(feature);
                index = this.select_.indexOf(feature);
                if (this.select_[index] instanceof DynamicFeature_1.default) {
                    this.select_[index].on('die', this.selectDeadCallback_);
                    this.select_[index].focus();
                }
            }
            this.featureOverlay_.setSelect(feature);
            this.dispatchEvent({ type: 'select', element: feature });
        };
        ;
        SelectInteraction.prototype.getFollow = function () {
            return this.follow_;
        };
        ;
        SelectInteraction.prototype.setFollow = function (feature) {
            if (this.follow_ !== feature) {
                if (this.follow_ instanceof DynamicFeature_1.default) {
                    this.follow_.unfollow();
                    this.follow_.un("die", this.followDeadCallback_);
                    this.follow_.un("change", this.followChangeCallback_);
                }
                this.follow_ = feature || null;
                if (this.follow_ instanceof DynamicFeature_1.default) {
                    this.follow_.on('die', this.followDeadCallback_);
                    this.follow_.on('change', this.followChangeCallback_);
                    this.follow_.follow();
                }
                this.featureOverlay_.setFollow(this.follow_);
                this.dispatchEvent({ type: 'follow', element: this.follow_ });
            }
            this.centerFollow();
        };
        ;
        SelectInteraction.prototype.followFocus = function () {
            this.setFollow(this.focus_);
        };
        ;
        SelectInteraction.prototype.centerFollow = function () {
            if (this.follow_ && this.getMap()) {
                var geo = this.follow_.getGeometry();
                if (geo) {
                    this.lastCenter_ = ol.extent.getCenter(geo.getExtent());
                    this.getMap().getView().setCenter(this.lastCenter_);
                }
                else {
                    this.lastCenter_ = (this.getMap().getView().getCenter());
                }
            }
        };
        ;
        SelectInteraction.prototype.centerFocus = function () {
            if (this.focus_ && this.getMap()) {
                this.lastCenter_ = ol.extent.getCenter(this.focus_.getGeometry().getExtent());
                this.getMap().getView().setCenter(this.lastCenter_);
            }
        };
        ;
        SelectInteraction.prototype.focusDead_ = function (evt) {
            if (this.focus_ === evt.target)
                this.setFocus(null);
        };
        ;
        SelectInteraction.prototype.selectDead_ = function (evt) {
            var index = this.select_.indexOf(evt.target);
            if (index > -1) {
                this.setSelect(evt.target);
            }
        };
        ;
        SelectInteraction.prototype.followDead_ = function (evt) {
            if (this.follow_ === evt.target)
                this.setFollow(null);
        };
        ;
        SelectInteraction.prototype.followChange_ = function (evt) {
            if (this.follow_ === evt.target && this.getMap()) {
                var nowCenter = this.getMap().getView().getCenter();
                if (this.lastCenter_[0] === nowCenter[0] && this.lastCenter_[1] === nowCenter[1]) {
                    var newCenter = ol.extent.getCenter(evt.target.getGeometry().getExtent());
                    this.getMap().getView().setCenter(newCenter);
                    this.lastCenter_ = newCenter;
                }
            }
        };
        ;
        SelectInteraction.prototype.pickup = function (evt) {
            var map = evt.map;
            var feature = null;
            var distance = Infinity;
            var layers = map.getLayers();
            var res = map.getView().getResolution();
            var maxOffset = 32 * res;
            for (var i = layers.getLength() - 1; i >= 0; i--) {
                var layer = layers.item(i);
                if (layer.getVisible() !== false && res > layer.getMinResolution() && res < layer.getMaxResolution() && layer.pickup) {
                    /**@type {{feature: ol.Feature, distance: number}}*/
                    var result = layer.pickup(evt.coordinate, maxOffset, res);
                    if (result && (distance > result.distance)) {
                        feature = result.feature;
                        distance = result.distance;
                    }
                    if (distance === 0)
                        break;
                }
            }
            if (feature !== null) {
                if (distance > (maxOffset * maxOffset))
                    feature = null;
            }
            return feature;
        };
        SelectInteraction.prototype.handleMapBrowserEvent = function (mapBrowserEvent) {
            if (!ol.events.condition.singleClick(mapBrowserEvent))
                return true;
            if (ol.events.condition.shiftKeyOnly(mapBrowserEvent)) {
                var evt = mapBrowserEvent;
                var feature = this.pickup(evt);
                this.setSelect(feature);
                return false;
            }
            var evt = mapBrowserEvent;
            var feature = this.pickup(evt);
            this.setFocus(feature);
            return false;
        };
        ;
        SelectInteraction.prototype.extentSelect = function (evt) {
            var r = [];
            var map = evt.map;
            var layers = map.getLayers();
            var res = map.getView().getResolution();
            for (var i = layers.getLength() - 1; i >= 0; i--) {
                var layer = layers.item(i);
                if (layer.getVisible() !== false && layer.extentPickup) {
                    var result = layer.extentPickup(evt.extent, res);
                    r = r.concat(result);
                }
            }
            return r;
        };
        SelectInteraction.prototype.setMap = function (map) {
            if (this.map_ === map)
                return;
            this.setFocus(null);
            this.setFollow(null);
            //super.setMap(map);
            this.map_ = map;
            this.featureOverlay_.setMap(map);
        };
        ;
        return SelectInteraction;
    }(ol.interaction.Interaction));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SelectInteraction;
});
