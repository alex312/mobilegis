import * as ol from 'openlayers';

class ShipsTileSource extends ol.source.XYZ {
    url_;
    version_;

    constructor(options?) {
        options = options || {};
        options.tileUrlFunction = (coord:ol.TileCoord, pixelRatio:number, projection:ol.proj.Projection)=> {
            return this.tileUrlFunction_(coord, pixelRatio, projection);
        };
        super(options);

        this.url_ = options.tileUrl;
        this.version_ = options.titleVersionUrl;
    }

    setUrlWithVersion(url, version) {
        var urlChanged = false;
        var versionChanged = false;
        if (this.url_ !== url) {
            this.url_ = url;
            urlChanged = true;
        }
        if (this.version_ !== version) {
            this.version_ = version;
            versionChanged = true;
        }
        if (urlChanged) {
            //ol
            (<any>this).setTileLoadFunction((<any>this).getTileLoadFunction());
        } else {
            this.versionChanged_();
        }
    };

    tileUrlFunction_(tileCoord, pixelRatio, projection) {
        if (!this.url_ || !this.version_)
            return undefined;

        if (!tileCoord)
            return undefined;

        /**@type {string}*/
        var url = /**@type {string}*/(this.url_);

        return url
            .replace('{v}', this.version_.toString())
            .replace('{x}', tileCoord[1].toString())
            .replace('{y}', (-tileCoord[2] - 1).toString())
            .replace('{-y}', (-tileCoord[2]).toString())
            .replace('{z}', tileCoord[0].toString());
    };

    versionChanged_() {
        this.changed();
    };

}
export default ShipsTileSource;
