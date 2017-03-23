import * as ol from "openlayers";
import DynamicFeature from "seecool/datas/DynamicFeature";

class ShipFeature extends DynamicFeature {
    owner_;
    focusing_;
    following_;
    constructor(owner) {
        super({});
        this.owner_ = owner;
        this.focusing_ = false;
        this.following_ = false;
    }

    focus () {
        this.owner_.focusFeature(this);
        this.focusing_ = true;
    };

    unfocus () {
        this.focusing_ = false;
        this.owner_.unfocusFeature(this);
    };

    follow () {
        this.owner_.followFeature(this);
        this.following_ = true;
    };

    unfollow () {
        this.following_ = false;
        this.owner_.unfollowFeature(this);
    };

    getGeometry () {
        return this.owner_.getFeatureGeometry(this);
    };

    getData () {
        return this.owner_.getFeatureData(this);
    };

    isFocused () {
        return this.focusing_;
    };
    isFollowed () {
        return this.following_;
    };
}
export default ShipFeature;
