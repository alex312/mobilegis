import * as ol from "openlayers";
import DynamicFeature from "seecool/datas/DynamicFeature";
import SelectOverlay from "./layers/SelectOverlay";
import GpsFeature from "./layers/GpsFeature";
import {AnyConstractorClass} from "seecool/Interface";

class SelectInteraction extends ol.interaction.Interaction {
    map_;
    focus_;
    select_;
    follow_;
    lastCenter_;
    focusDeadCallback_;
    selectDeadCallback_;
    followDeadCallback_;
    followChangeCallback_;
    gps_;
    gpsWatchId_;
    featureOverlay_;

    constructor() {
        super({
            handleEvent: (evt)=>{
                return this.handleMapBrowserEvent(evt);
            }
        });

        this.map_ = null;
        this.focus_ = null;
        this.select_ = [];
        this.follow_ = null;
        this.lastCenter_ = [NaN, NaN];
        this.focusDeadCallback_ = this.focusDead_.bind(this);
        this.selectDeadCallback_ = this.selectDead_.bind(this);
        this.followDeadCallback_ = this.followDead_.bind(this);
        this.followChangeCallback_ = this.followChange_.bind(this);


        this.gps_ = new GpsFeature();
        this.gpsWatchId_ = 0;
        this.featureOverlay_ = new SelectOverlay(this.gps_);
    }

    followGps () {
        if (!this.gpsWatchId_) {
            this.gpsWatchId_ = navigator.geolocation.watchPosition(
                this.geolocationSuccess_.bind(this),
                this.geolocationError_.bind(this));
        }

        //this.setFollow(this.gps_);
    };

    geolocationSuccess_ (position) {
        var coordinate = [position.coords.longitude, position.coords.latitude];
        coordinate = ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:3857');
        //this.gps_.update(coordinate);
    };

    geolocationError_ (error) {
        console.log(error.code);
        console.log(error.message);
    };


    getFocus () {
        return this.focus_;
    };

    setFocus (feature) {
        if (this.focus_ === feature) return;

        if (this.focus_ instanceof DynamicFeature) {
            this.focus_.unfocus();
            this.focus_.un('die', this.focusDeadCallback_);
        }

        this.focus_ = feature || null;

        if (this.focus_ instanceof DynamicFeature) {
            this.focus_.on('die', this.focusDeadCallback_);
            this.focus_.focus();
        }

        this.featureOverlay_.setFocus(this.focus_);

        this.dispatchEvent({type: 'focus', element: this.focus_});
    };

    getSelect () {
        return this.select_;
    };

    setSelect (feature) {
        if (!feature)return;
        var index = this.select_.indexOf(feature)
        if (index > -1) {
            if (this.select_[index] instanceof DynamicFeature) {
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
            if (this.select_[index] instanceof DynamicFeature) {
                this.select_[index].on('die', this.selectDeadCallback_);
                this.select_[index].focus();
            }
        }
        this.featureOverlay_.setSelect(feature);
        this.dispatchEvent({type: 'select', element: feature});
    };

    getFollow () {
        return this.follow_;
    };

    setFollow (feature) {
        if (this.follow_ !== feature) {
            if (this.follow_ instanceof DynamicFeature) {
                this.follow_.unfollow();
                this.follow_.un("die", this.followDeadCallback_);
                this.follow_.un("change", this.followChangeCallback_);
            }

            this.follow_ = feature || null;

            if (this.follow_ instanceof DynamicFeature) {
                this.follow_.on('die', this.followDeadCallback_);
                this.follow_.on('change', this.followChangeCallback_);
                this.follow_.follow();
            }

            this.featureOverlay_.setFollow(this.follow_);

            this.dispatchEvent({type: 'follow', element: this.follow_});
        }
        this.centerFollow();
    };

    followFocus () {
        this.setFollow(this.focus_);
    };

    centerFollow () {
        if (this.follow_ && this.getMap()) {
            var geo = this.follow_.getGeometry();
            if (geo) {
                this.lastCenter_ = ol.extent.getCenter(geo.getExtent());
                this.getMap().getView().setCenter(this.lastCenter_);
            } else {
                this.lastCenter_ = /**@type {ol.Coordinate}*/(this.getMap().getView().getCenter());
            }
        }
    };

    centerFocus () {
        if (this.focus_ && this.getMap()) {
            this.lastCenter_ = ol.extent.getCenter(this.focus_.getGeometry().getExtent());
            this.getMap().getView().setCenter(this.lastCenter_);
        }
    };

    focusDead_ (evt) {
        if (this.focus_ === evt.target)
            this.setFocus(null);
    };

    selectDead_ (evt) {
        var index = this.select_.indexOf(evt.target);
        if (index > -1) {
            this.setSelect(evt.target);
        }
    };

    followDead_ (evt) {
        if (this.follow_ === evt.target)
            this.setFollow(null);
    };

    followChange_ (evt) {
        if (this.follow_ === evt.target && this.getMap()) {
            var nowCenter = this.getMap().getView().getCenter();
            if (this.lastCenter_[0] === nowCenter[0] && this.lastCenter_[1] === nowCenter[1]) {
                var newCenter = ol.extent.getCenter(evt.target.getGeometry().getExtent());
                this.getMap().getView().setCenter(newCenter);
                this.lastCenter_ = newCenter;
            }
        }
    };

    pickup (evt) {
        var map = evt.map;
        var feature = null;
        var distance = Infinity;
        var layers = map.getLayers();
        var res = map.getView().getResolution();
        var maxOffset = 32 * res;
        for (var i = layers.getLength() - 1; i >= 0; i--) {
            var layer = layers.item(i);
            if (layer.getVisible() !== false && layer.pickup) {
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
    }

    handleMapBrowserEvent (mapBrowserEvent) {
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

    extentSelect (evt) {
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
    }

    setMap (map) {
        if (this.map_ === map)
            return;

        this.setFocus(null);
        this.setFollow(null);

        //super.setMap(map);
        this.map_ = map;
        this.featureOverlay_.setMap(map);
    };
}
export default SelectInteraction;
