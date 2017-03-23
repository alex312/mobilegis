import * as ol from "openlayers";
import ShipsTileSource from "./ShipsTileSource";
import ShipsCanvasSource from "./ShipsCanvasSource";

class ShipsLayer extends ol.layer.Group {
    layerTile_;
    layerImage_;
    criticalResolution_;
    sourceTile_;
    sourceImage_;
    listenKeyTile_;
    listenKeySymbolic_;

    constructor(options?) {
        options = options || {};
        var criticalResolution = options.criticalResolution || 152.8740565703525;
        var sourceTile = new ShipsTileSource({
            tileUrl: options.tileUrl,
            titleVersionUrl: options.titleVersionUrl
        });
        var sourceImage = new ShipsCanvasSource({
            maxResolution: criticalResolution,
            flagDraw: options.flagDraw
        });
        var layerTile = new ol.layer.Tile({
            minResolution: criticalResolution,
            source: sourceTile
        });
        var layerImage = new ol.layer.Image({
            source: sourceImage
        });
        super({
            layers: [layerTile, layerImage]
        });

        this.criticalResolution_ = criticalResolution;
        this.sourceTile_ = sourceTile;
        this.sourceImage_ = sourceImage;
        this.layerTile_ = layerTile;
        this.layerImage_ = layerImage;

        if (options.tile)
            this.listenKeyTile_ = options.tile.on("change", this.dataSourceTileChanged_, this);

        if (options.symbol) {
            this.listenKeySymbolic_ = options.symbol.on("change", this.dataSourceSymbolChanged_, this);
        }
    }

    getCriticalResolution () {
        return this.criticalResolution_;
    };

    dispose () {
        if (this.listenKeyTile_) {
            ol.Observable.unByKey(this.listenKeyTile_);
            delete this.listenKeyTile_;
        }
        if (this.listenKeySymbolic_) {
            ol.Observable.unByKey(this.listenKeySymbolic_);
            delete this.listenKeySymbolic_;
        }
    };

    getTileLayer () {
        return this.layerTile_;
    };

    getCanvasLayer () {
        return this.layerImage_;
    };

    dataSourceTileChanged_ (ev) {
        var d = ev.target.getData();
        this.sourceTile_.setUrlWithVersion(d.url, d.version);
    };

    dataSourceSymbolChanged_ (ev) {
        //console.log("dataSourceSymbolChanged_",ev.target);
        var data = /**@type {data.Base}*/(ev.target);
        this.sourceImage_.setData(data.getData());
    };

    pickup (coordinate, maxOffset, res) {
        return this.sourceImage_.pickup(coordinate, maxOffset, res);
    };

    extentPickup (extent, res) {
        return this.sourceImage_.extentPickup(extent, res);
    };

    getShipFeature (id) {
        return this.sourceImage_.getShipFeature(id);
    };

    search (key) {
        return this.sourceImage_.search(key);
    };
}
export default ShipsLayer;
