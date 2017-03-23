import * as ol from "openlayers";
import {inject} from "seecool/plugins/Plugins";
import {MapTool} from "seecool/utils/MapTool";
import EventSource from "../../../seecool/datas/EventSource";
import SelectInteraction from "./SelectInteraction";
import "css!./map.css";

class MapPlugin extends EventSource{
    map:ol.Map;
    interactionSelect_;
    currentSelected_;

    constructor(config,
                @inject('ui/frame')frame) {
        super();
        this.map = new ol.Map({
            target: frame.get('map'),
            pixelRatio: 1,
            logo: false,
            controls: ol.control.defaults({
                zoom: true,
                rotate: false,
                attribution: false
            }),
            interactions: [
                new ol.interaction.DoubleClickZoom(),
                new ol.interaction.DragPan(),
                new ol.interaction.PinchZoom(),
                new ol.interaction.KeyboardPan(),
                new ol.interaction.KeyboardZoom(),
                new ol.interaction.MouseWheelZoom(),
                new ol.interaction.DragZoom()
            ],
            view: new ol.View({
                center: ol.proj.transform(config.center || defaultConfig.center, 'EPSG:4326', 'EPSG:3857'),
                zoom: config.zoom || defaultConfig.zoom,
                minZoom: config.minZoom || defaultConfig.minZoom,
                maxZoom: config.maxZoom || defaultConfig.maxZoom,
                extent: ol.proj.transformExtent(config.extent || defaultConfig.extent, 'EPSG:4326', 'EPSG:3857'),
                enableRotation: false
            })
        });

        var baseLayerConfig = this.getDefaultBaseLayerConfig_(config);
        var sourceType:{new(options?:any)};
        if(/^ol\.source\./.test(baseLayerConfig.provider)) {
            sourceType = ol.source[baseLayerConfig.provider.substr('ol.source.'.length)];
        } else {
            throw new Error("Not supported yet.");
        }
        var baseLayer = new ol.layer.Tile({
            source: new sourceType(baseLayerConfig.options)
        });
        this.map.addLayer(baseLayer);

        this.interactionSelect_ = new SelectInteraction();
        this.map.addInteraction(this.interactionSelect_);
        this.interactionSelect_.on("focus", this.handleSelectFocus_, this);
    }

    public showFeatureFully(feature) {
        if (!feature)return;
        var g = feature.getGeometry();
        var extent = g.getExtent();
        this.showExtent(extent);
    }

    //showExtent[minx,miny,maxx,maxy]
    //showExtent[lonmin,latmin,lonmax,latmax]
    public showExtent(extent: Array<number>) {
        var view = this.map.getView();
        var resolution = view.getResolution();
        var size = this.map.getSize();
        var zoomd = MapTool.ExtentToApprZoomD(extent, resolution, size);
        for (var i in extent) {
            if (isNaN(extent[i]))return;
        }
        var center = MapTool.ExtentToCenter(extent);
        view.setZoom(view.getZoom() - zoomd);
        view.setCenter(center);
    }

    public setCenter(Coordinate, zoom) {
        var view = this.map.getView();
        if (Coordinate) {
            view.setCenter(Coordinate);
        }
        if (zoom) {
            zoom = zoom > 18 ? 18 : zoom;
            zoom = zoom < 0 ? 0 : zoom;
            view.setZoom(zoom);
        }
    }

    public setFocus(feature) {
        this.interactionSelect_.setFocus(feature);
        this.showFeatureFully(feature);
    }

    private handleSelectFocus_(evt) {
        var feature = evt.element;
        if (this.currentSelected_ === feature)
            return;
        this.currentSelected_ = feature;
        this.trigger("selectFeatureChange", this.currentSelected_);
    };

    private getDefaultBaseLayerConfig_(config) {
        if (!config.baseLayer || !config.baseLayer.sources || !config.baseLayer.sources.length)
            return null;

        for (var x of config.baseLayer.sources) {
            if (x.default)
                return x;
        }

        return config.baseLayer.sources[0];
    }
}

const defaultConfig = {
    center: [117.8, 38.95],
    zoom: 14,
    minZoom: 3,
    maxZoom: 18,
    extent: [-179, -60, 179, 60]
};

export default MapPlugin;
