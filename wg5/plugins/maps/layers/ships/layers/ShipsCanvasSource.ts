import * as ol from "openlayers";
import ShipFeature from "seecool/datas/ShipFeature";
import ShipsLayerDrawer from "./ShipsLayerDrawer";
import ShipsLayerShapeVts from "./ShipsLayerShapeVts";
import {ExtendFeature} from "seecool/StaticLib";

export class ShipsLayerLable{
}

export class ShipsLayerFeature extends ExtendFeature {
    lonlat;
    shape;
    icons;
    label:ShipsLayerLable;
}

class ShipsCanvasSource extends ol.source.ImageCanvas {
    ships_:{[key:string]:ShipsLayerFeature};
    features_follow_;
    features_focus_;
    drawnShips_;
    drawer_;
    drawnState_;
    mode_;
    maxResolution_;
    shapeFactory_;

    constructor(option?) {
        option = option || {};
        super({
            canvasFunction: (extent, resolution, pixelRatio, size /*, projection*/)=> {
                return this.shipsCanvasFunction_(extent, resolution, pixelRatio, size);
            },
            projection: 'EPSG:3857'
        });

        this.maxResolution_ = option.maxResolution || Infinity;

        this.shapeFactory_ = function (options) {
            var data = options.data;
            //if (data.device === "AISTELE123")
            //    return new ShipsLayer_ShapeAis_(options);
            //if (data.device === "AISTELE18")
            //    return new ShipsLayer_ShapeAis_(options);
            return new ShipsLayerShapeVts(options)
        };

        this.ships_ = {};
        this.features_follow_ = null;
        this.features_focus_ = null;
        this.drawnShips_ = [];
        this.drawer_ = new ShipsLayerDrawer(this.shapeFactory_, option.flagDraw);
        this.drawnState_ = {extent: ol.extent.createEmpty(), resolution: 0, size: [0, 0]};
        this.mode_ = option.mode || "realtime";
    }

    pickup(coordinate, maxOffset, resolution) {
        if (!this.drawnState_)
            return null;

        var min = Infinity;
        var selected = null;
        for (var i = this.drawnShips_.length - 1; i >= 0; i--) {
            var ship = this.drawnShips_[i];
            var c = ship.lonlat;
            var dx = (c[0] - coordinate[0]);
            var dy = (c[1] - coordinate[1]);

            var v = dx * dx + dy * dy;
            if (v < min) {
                min = v;
                selected = ship;
            }
        }

        if (selected === null)
            return null;

        if (min < maxOffset * maxOffset)
            min = 0;
        return {feature: selected, distance: min};
    };

    extentPickup(extent, resolution) {
        if (!this.drawnState_)
            return null;
        var r = [];
        for (var i = this.drawnShips_.length - 1; i >= 0; i--) {
            var ship = this.drawnShips_[i];
            var c = ship.lonlat;
            if (c[0] > extent[0] && c[0] < extent[2] && c[1] > extent[1] && c[1] < extent[3]) {
                r.push(ship);
            }
        }
        return r;
    };

    getFeatureGeometry(feature) {
        var pt = feature.lonlat;
        var res = this.drawnState_.resolution;
        return new ol.geom.Circle(pt, 15 * res);
    };

    getFeatureData(feature) {
        return feature.data;
    };

    focusFeature(feature) {
        if (this.ships_[feature.id] !== feature)
            return false;

        if (this.features_focus_ !== feature) {
            this.features_focus_ = feature;
            this.changed();
        }
        return true;
    };

    unfocusFeature(feature) {
        if (this.ships_[feature.id] !== feature)
            return false;

        if (this.features_focus_ === feature) {
            this.features_focus_ = null;
            this.changed();
        }
        return true;
    };

    followFeature(feature) {
        if (this.ships_[feature.id] !== feature)
            return false;

        if (this.features_follow_ !== feature) {
            this.features_follow_ = feature;
            this.changed();
        }
        return true;
    };

    unfollowFeature(feature) {
        if (this.ships_[feature.id] !== feature)
            return false;

        if (this.features_follow_ === feature) {
            this.features_follow_ = null;
            this.changed();
        }
        return true;
    };

    shipsCanvasFunction_(extent, resolution, pixelRatio, size/*, projection*/) {
        var ships;
        if (this.mode_ == "history" || resolution < this.maxResolution_) {
            ships = this.ships_;
        } else {
            ships = {};
            if (this.features_follow_)
                ships[this.features_follow_.id] = this.features_follow_;
            if (this.features_focus_)
                ships[this.features_focus_.id] = this.features_focus_;
        }
        this.drawnState_ = {extent: extent, resolution: resolution, size: size};
        for (var i in ships) {
            if (!ships[i].data) {
                console.log(ships[i])
            }
        }
        this.drawer_.setParameters(extent, resolution, size, ships);
        this.drawnShips_ = this.drawer_.draw();
        return this.drawer_.getCanvas();
    };

    addPrefix(value) {
        return 'shipLayer:' + value;
    }

    removePrefix(value) {
        return value.substr(value.indexOf(":") + 1);
    }

    setData(items) {
        var dead:ShipsLayerFeature[] = [];
        var itemsDic = {};
        for (var i in items) {
            itemsDic[items[i].id] = items[i];
        }

        for (var shipsId in this.ships_) {
            if (!(this.removePrefix(shipsId) in itemsDic)) {
                var s = this.ships_[shipsId];
                dead.push(s);
            }
        }

        //for (var shipsId in this.ships_) {
        //    var s = this.ships_[shipsId];
        //    if (!(this.removePrefix(s.id) in items)){
        //        dead.push(s);
        //    }
        //}

        for (let i = 0; i < dead.length; i++) {
            var s = dead[i];
            s.die();
            delete this.ships_[s.id];
        }
        var trans = ol.proj.getTransform('EPSG:4326', "EPSG:3857");
        for (var i in items) {
            var di = items[i];
            var shipsId = this.addPrefix(di.id);
            if (shipsId in this.ships_) {
                var s1 = this.ships_[shipsId];
                s1.data = di;
                s1.lonlat = trans([di.lon, di.lat]);
                s1.changed();
            } else {
                var s2 = new ShipsLayerFeature(this);
                s2.id = shipsId;
                s2.data = di;
                s2.lonlat = trans([di.lon, di.lat]);
                s2.shape = null;
                s2.icons = [];
                s2.label = (<ShipsLayerLable>{});
                this.ships_[s2.id] = s2;
            }
        }
        this.changed();
    };

    getShipFeature(id) {
        for (var each in this.ships_) {
            var ship = this.ships_[each];
            if (ship.id === id)
                return ship;

            //for(var i=0; i<data.secondaries.length; i++) {
            //    var sdata = data.secondaries[i];
            //    if (sdata.uid === id)
            //        return ship;
            //}
        }

        return null;
    };

    getShipFeatureByDataId(dataId) {
        for (var each in this.ships_) {
            var ship = this.ships_[each];
            if (ship.data.id === dataId)
                return ship;

            //for(var i=0; i<data.secondaries.length; i++) {
            //    var sdata = data.secondaries[i];
            //    if (sdata.uid === id)
            //        return ship;
            //}
        }

        return null;
    };


    getAllShipFeature() {
        var sfs = [];
        for (var each in this.ships_) {
            var ship = this.ships_[each];
            sfs.push(ship);
        }
        return sfs;
    };

    search(key) {
        var r = [];
        //id
        var mmsikey = key.toLowerCase().replace('mmsi:');
        for (var each in this.ships_) {
            var ship = this.ships_[each].data;
            var mmsi = ship.id.toLowerCase().replace('mmsi:')
            if (this.searchString(mmsi, mmsikey)) {//ship.id.toString().toLowerCase().startsWith(mmsi.toLowerCase())
                r.push({type: "id", data: ship.id, target: this.ships_[each]});
            }
        }
        //name
        for (var each in this.ships_) {
            var ship = this.ships_[each].data;
            if (this.searchString(ship.name, key)) { //ship.name.toString().toLowerCase().indexOf(key.toString().toLowerCase())>=0
                r.push({type: "name", data: ship.name, target: this.ships_[each]});
            }
        }
        return r;
    }

    searchString(thestring, str) {
        var r = false;
        var t = thestring.toLowerCase().replace(/\s/g, "");
        var k = str.toLowerCase();
        r = r ? r : (t.indexOf(k) >= 0);
        return r;
    }
}
export default ShipsCanvasSource;
