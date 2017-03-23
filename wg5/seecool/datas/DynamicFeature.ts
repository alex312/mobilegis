import * as ol from "openlayers";

class DynamicFeature extends ol.Feature {
    constructor(option?) {
        super(option);
    }

    public die() {
        this.dispatchEvent("die");
    };

    public focus() {
    };

    public unfocus() {
    };

    public follow() {
    };

    public unfollow() {
    };

    public getData() {
    };

    public getGeometry() {
        return ol.Feature.prototype.getGeometry.apply(this, arguments);
    };

    public setGeometry() {
        return ol.Feature.prototype.setGeometry.apply(this, arguments);
    };

}
export default DynamicFeature;
