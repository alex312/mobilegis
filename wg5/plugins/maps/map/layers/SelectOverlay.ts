import * as ol from "openlayers";
import * as utilities from 'seecool/utilities';
import ShipFeature from "seecool/datas/ShipFeature";

class SelectOverlay {
    map_;
    postComposeListenerKey_;
    featureChangeListenerKeys_;
    focus_;
    select_;
    follow_;
    gps_;
    followStyle_;
    time_;
    constructor(gps) {
        this.map_ = null;
        this.postComposeListenerKey_ = null;
        this.featureChangeListenerKeys_ = {};
        this.focus_ = null;
        this.select_ = [];
        this.follow_ = null;
        this.gps_ = gps;

        this.followStyle_ = new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({color: [0x80, 0, 0x80, 1]}),
                stroke: new ol.style.Stroke({color: [0x80, 0, 0x80, .5], width: 3}),
                radius: 2,
                snapToPixel: true
            }),
            stroke: new ol.style.Stroke({color: [0x80, 0, 0x80, .8], width: 2})
        });
        this.time_ = 0.3;
    }

    setMap = function (map) {
        if (this.map_ !== null) {
            ol.Observable.unByKey(this.postComposeListenerKey_);
            this.postComposeListenerKey_ = null;
            this.map_.render();
        }

        this.map_ = map || null;

        if (this.map_ !== null) {
            this.postComposeListenerKey_ = this.map_.on('postcompose', this.handleMapPostCompose_, this);
            this.map_.render();
        }
    };

    getFocus = function () {
        return this.focus_;
    };

    setFocus = function (feature) {
        if (this.focus_ === feature) return;

        if (this.focus_) {
            var key = this.focus_['select_overlay_focus_event_key'] || (this.focus_['select_overlay_focus_event_key'] = utilities.uniqueId());
            ol.Observable.unByKey(this.featureChangeListenerKeys_[key]);
            delete this.featureChangeListenerKeys_[key];
        }

        this.focus_ = feature || null;

        if (this.focus_) {
            var key = this.focus_['select_overlay_focus_event_key'] || (this.focus_['select_overlay_focus_event_key'] = utilities.uniqueId());
            this.featureChangeListenerKeys_[key] = this.focus_.on("change", this.handleFocusChange_, this);
        }

        this.map_ && this.map_.render();
    };

    getSelect = function () {
        return this.select_;
    };

    setSelect = function (feature) {
        if (!feature)return;
        var index = this.select_.indexOf(feature);
        if (index > -1) {
            var key = this.select_[index]['select_overlay_focus_event_key'] || (this.select_[index]['select_overlay_focus_event_key'] = utilities.uniqueId());
            ol.Observable.unByKey(this.featureChangeListenerKeys_[key]);
            delete this.featureChangeListenerKeys_[key];
            delete this.select_[index];
        }

        if (index == -1) {
            this.select_.push(feature);
            index = this.select_.indexOf(feature);
            var key = this.select_[index]['select_overlay_focus_event_key'] || (this.select_[index]['select_overlay_focus_event_key'] = utilities.uniqueId());
            this.featureChangeListenerKeys_[key] = this.select_[index].on("change", this.handleFocusChange_, this);
        }

        this.map_ && this.map_.render();
    };

    getFollow = function () {
        return this.follow_;
    };

    setFollow = function (feature) {
        if (this.follow_ === feature) return;

        if (this.follow_) {
            var key = this.follow_['select_overlay_focus_event_key'] || (this.follow_['select_overlay_focus_event_key'] = utilities.uniqueId());
            ol.Observable.unByKey(this.featureChangeListenerKeys_[key]);
            delete this.featureChangeListenerKeys_[key];
        }

        this.follow_ = feature || null;

        if (this.follow_) {
            var key = this.follow_['select_overlay_focus_event_key'] || (this.follow_['select_overlay_focus_event_key'] = utilities.uniqueId());
            this.featureChangeListenerKeys_[key] = this.follow_.bind("change", this.handleFollowChange_, this);
        }
        this.map_ && this.map_.render();
    };

    handleFocusChange_ = function () {
        this.map_ && this.map_.render();
    };

    handleFollowChange_ = function () {
        this.map_ && this.map_.render();
    };

    handleMapPostCompose_ = function (event) {
        var geo = /**@type {ol.geom.Point}*/(this.gps_.getGeometry());

        if (!this.focus_ && !this.follow_ && !geo && this.select_.length == 0)
            return;

        var resolution = event.frameState.viewState.resolution;
        var vectorContext = event.vectorContext;
        var center;
        var extent;
        var radius;
        var circle;
        if (this.focus_) {
            var t = this.time_ * 3;
            t = t - Math.floor(t);
            var alpha = t > 0.5 ? t : 1 - t;
            var stroke = new ol.style.Stroke({color: [255, 0, 0, alpha], width: 2});
            var style1 = new ol.style.Style({
                stroke: stroke
            });

            if (this.focus_ instanceof ShipFeature) {
                extent = this.focus_.getGeometry().getExtent();
                center = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
                radius = Math.max(extent[2] - extent[0], extent[3] - extent[1]) / 2;
                circle = new ol.geom.Circle(center, radius);
                var style2 = new ol.style.Style({
                    stroke: new ol.style.Stroke({color: [255, 255, 0, alpha], width: 5})
                });
                vectorContext.drawFeature(new ol.Feature(circle), style2);
                vectorContext.drawFeature(new ol.Feature(circle), style1);
            } else {
                var fill = new ol.style.Fill({color: [255, 255, 255, alpha / 2 - 0.1]});
                var style3 = new ol.style.Style({
                    fill: fill,
                    stroke: stroke,
                    image: new ol.style.Circle({radius: 15, fill: fill, stroke: stroke})
                });
                var f = new ol.Feature({
                    geometry: this.focus_.getGeometry()
                });
                vectorContext.drawFeature(f, style3);
                //vectorContext.drawFeature(f, style1);
            }
        }

        if (this.select_ && this.select_.length > 0) {

            //var t = this.time_ * 3;
            //t = t - Math.floor(t);
            //var alpha = t > 0.5 ? t : 1 - t;
            //var stroke = new ol.style.Stroke({color: [255, 0, 0, alpha], width: 2});
            //var style1 = new ol.style.Style({
            //    stroke: stroke
            //});
            for (var i in this.select_) {
                var I = this.select_[i];
                var stroke = new ol.style.Stroke({color: [0, 0, 255, 1], width: 2});
                var fill = new ol.style.Fill({color: [255, 255, 255, 0.2 / 2 - 0.1]});
                var style3 = new ol.style.Style({
                    stroke: stroke,
                    fill: fill,
                    image: new ol.style.Circle({radius: 15, fill: fill, stroke: stroke}),
                });
                if (!I) {
                    delete this.select_[i];
                    return;
                }
                var f = new ol.Feature({
                    geometry: I.getGeometry()
                });
                vectorContext.drawFeature(f, style3);
                //vectorContext.drawFeature(f, style1);
            }
        }

        if (this.follow_) {
        }

        if (geo) {
            var t = this.time_ * 5;
            t = t - Math.floor(t);
            var alpha = t > 0.5 ? t : 1 - t;
            var style = new ol.style.Style({
                stroke: new ol.style.Stroke({color: [255, 255, 0, alpha], width: 3}),
                fill: new ol.style.Fill({color: [83, 25, 231, 1]})
            });
            circle = new ol.geom.Circle(geo.getCoordinates(), 6 * resolution);
            vectorContext.drawFeature(new ol.Feature(circle), style);
        }

        this.time_ += 0.01;
        if (this.time_ >= 1)
            this.time_ = 0;

        this.map_ && this.map_.render();
    };
}
export default SelectOverlay;
