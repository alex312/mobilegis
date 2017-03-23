import * as ol from "openlayers";
import ShipsCanvasSource from "../../ships/layers/ShipsCanvasSource";

class PlaybackLayer extends ol.layer.Group {
    criticalResolution_;
    sourceImage_;
    layerImage_;
    drawer_;
    drawSource_;
    drawLayer_;
    listenKeySymbolic_;
    commitAreaFeature_;

    constructor(options) {
        options = options || {};
        var criticalResolution = options.criticalResolution || 152.8740565703525;
        var sourceImage = new ShipsCanvasSource({
            maxResolution: criticalResolution,
            mode: "history"
        });
        var layerImage = new ol.layer.Image({
            source: sourceImage
        });
        var drawSource = new ol.source.Vector({wrapX: false});
        var drawLayer = new ol.layer.Vector({
            source: drawSource,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });

        super({
            layers: [layerImage, drawLayer]
        });

        this.criticalResolution_ = criticalResolution;
        this.sourceImage_ = sourceImage;
        this.layerImage_ = layerImage;
        this.drawLayer_ = drawLayer;

        this.drawer_ = {};
        this.drawSource_ = drawSource;

        if (options.symbol) {
            this.listenKeySymbolic_ = options.symbol.on("change", this.dataSourceSymbolChanged_, this);
        }

    };

    getCriticalResolution() {
        return this.criticalResolution_;
    };

    addDrawAreaInteraction(map, onCommit) {
        this.commitAreaFeature_ = onCommit;
        var value = 'LineString';
        var geometryFunction, maxPoints;
        maxPoints = 2;
        geometryFunction = function (coordinates, geometry) {
            if (!geometry) {
                geometry = new ol.geom.Polygon(null);
            }
            var start = coordinates[0];
            var end = coordinates[1];
            geometry.setCoordinates([
                [start, [start[0], end[1]], end, [end[0], start[1]], start]
            ]);
            return geometry;
        };

        this.drawer_ = new ol.interaction.Draw({
            source: this.drawSource_,
            type: /** @type {ol.geom.GeometryType} */ (value),
            geometryFunction: geometryFunction,
            maxPoints: maxPoints
        });

        this.drawer_.on('drawend', this.drawAreaEnd.bind(this));

        map.addInteraction(this.drawer_);
    }

    removeDrawAreaInteraction(map) {
        map.removeInteraction(this.drawer_)
    }

    removeDrawArea(feature) {
        if (feature)
            this.drawSource_.removeFeature(feature);
    }

    drawAreaEnd(evt) {
        if (this.commitAreaFeature_)
            this.commitAreaFeature_(evt.feature);
    }

    dispose() {
        if (this.listenKeySymbolic_) {
            ol.Observable.unByKey(this.listenKeySymbolic_);
            delete this.listenKeySymbolic_;
        }
    };

    getCanvasLayer() {
        return this.layerImage_;
    };

    dataSourceSymbolChanged_(ev) {
        var data = /**@type {data.Base}*/(ev.target);
        this.sourceImage_.setData(data.getData());
    };

    pickup(coordinate, maxOffset, res) {
        return this.sourceImage_.pickup(coordinate, maxOffset, res);
    };

    getShipFeature(id) {
        return this.sourceImage_.getShipFeature(id);
    };

    getAllShipFeature() {
        return this.sourceImage_.getAllShipFeature();
    };
}
export default PlaybackLayer
