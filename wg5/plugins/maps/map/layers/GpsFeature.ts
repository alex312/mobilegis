import * as ol from "openlayers";
import DynamicFeature from "../../../../seecool/datas/DynamicFeature";

export var GpsFeatureState = {
    EMPTY: 0,
    NORMAL: 1,
    EXPIRED: 2
};
class GpsFeature extends DynamicFeature {
    geo_;
    timer_;
    ttl_;
    state_;
    isFollowed_;

    constructor() {
        super();
        this.geo_ = null;
        this.timer_ = 0;
        this.ttl_ = 30 * 1000;
        this.state_ = GpsFeatureState.EMPTY;
        this.isFollowed_ = false;
    }

    getGeometry () {
        return this.geo_;
    };

    update (coordinate) {
        this.geo_ = new ol.geom.Point(coordinate);
        this.state_ = GpsFeatureState.NORMAL;
        if (this.timer_)
            window.clearTimeout(this.timer_);
        this.timer_ = window.setTimeout(this.timeOut_.bind(this), this.ttl_);
        this.changed();
    };

    timeOut_ () {
        this.timer_ = 0;
        this.state_ = GpsFeatureState.EXPIRED;
    };

    focus () {
        throw new Error('Not implemented.');
    };

    unfocus () {
        throw new Error('Not implemented.');
    };

    follow () {
        this.isFollowed_ = true;
    };

    unfollow () {
        this.isFollowed_ = false;
    };

    isFocused () {
        throw new Error('Not implemented.');
    };
    isFollowed () {
        return this.isFollowed_;
    };
}
export default GpsFeature
