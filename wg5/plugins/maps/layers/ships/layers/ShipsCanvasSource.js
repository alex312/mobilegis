var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "openlayers", "../../../../../seecool/StaticLib", "./ShipsLayerDrawer", "./ShipsLayerShapeVts"], function (require, exports, ol, StaticLib_1, ShipsLayerDrawer_1, ShipsLayerShapeVts_1) {
    "use strict";
    var ShipsLayerLable = (function () {
        function ShipsLayerLable() {
        }
        return ShipsLayerLable;
    }());
    exports.ShipsLayerLable = ShipsLayerLable;
    var ShipsLayerFeature = (function (_super) {
        __extends(ShipsLayerFeature, _super);
        function ShipsLayerFeature() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ShipsLayerFeature;
    }(StaticLib_1.ExtendFeature));
    exports.ShipsLayerFeature = ShipsLayerFeature;
    var ShipsCanvasSource = (function (_super) {
        __extends(ShipsCanvasSource, _super);
        function ShipsCanvasSource(option) {
            var _this = this;
            option = option || {};
            _this = _super.call(this, {
                canvasFunction: function (extent, resolution, pixelRatio, size /*, projection*/) {
                    return _this.shipsCanvasFunction_(extent, resolution, pixelRatio, size);
                },
                projection: 'EPSG:3857'
            }) || this;
            _this.maxResolution_ = option.maxResolution || Infinity;
            _this.shapeFactory_ = function (options) {
                var data = options.data;
                //if (data.device === "AISTELE123")
                //    return new ShipsLayer_ShapeAis_(options);
                //if (data.device === "AISTELE18")
                //    return new ShipsLayer_ShapeAis_(options);
                return new ShipsLayerShapeVts_1.default(options);
            };
            _this.ships_ = {};
            _this.features_follow_ = null;
            _this.features_focus_ = null;
            _this.drawnShips_ = [];
            _this.drawer_ = new ShipsLayerDrawer_1.default(_this.shapeFactory_, option.flagDraw);
            _this.drawnState_ = { extent: ol.extent.createEmpty(), resolution: 0, size: [0, 0] };
            _this.mode_ = option.mode || "realtime";
            return _this;
        }
        ShipsCanvasSource.prototype.pickup = function (coordinate, maxOffset, resolution) {
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
            return { feature: selected, distance: min };
        };
        ;
        ShipsCanvasSource.prototype.extentPickup = function (extent, resolution) {
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
        ;
        ShipsCanvasSource.prototype.getFeatureGeometry = function (feature) {
            var pt = feature.lonlat;
            var res = this.drawnState_.resolution;
            return new ol.geom.Circle(pt, 15 * res);
        };
        ;
        ShipsCanvasSource.prototype.getFeatureData = function (feature) {
            return feature.data;
        };
        ;
        ShipsCanvasSource.prototype.focusFeature = function (feature) {
            if (this.ships_[feature.id] !== feature)
                return false;
            if (this.features_focus_ !== feature) {
                this.features_focus_ = feature;
                this.changed();
            }
            return true;
        };
        ;
        ShipsCanvasSource.prototype.unfocusFeature = function (feature) {
            if (this.ships_[feature.id] !== feature)
                return false;
            if (this.features_focus_ === feature) {
                this.features_focus_ = null;
                this.changed();
            }
            return true;
        };
        ;
        ShipsCanvasSource.prototype.followFeature = function (feature) {
            if (this.ships_[feature.id] !== feature)
                return false;
            if (this.features_follow_ !== feature) {
                this.features_follow_ = feature;
                this.changed();
            }
            return true;
        };
        ;
        ShipsCanvasSource.prototype.unfollowFeature = function (feature) {
            if (this.ships_[feature.id] !== feature)
                return false;
            if (this.features_follow_ === feature) {
                this.features_follow_ = null;
                this.changed();
            }
            return true;
        };
        ;
        ShipsCanvasSource.prototype.shipsCanvasFunction_ = function (extent, resolution, pixelRatio, size /*, projection*/) {
            var ships;
            if (this.mode_ == "history" || resolution < this.maxResolution_) {
                ships = this.ships_;
            }
            else {
                ships = {};
                if (this.features_follow_)
                    ships[this.features_follow_.id] = this.features_follow_;
                if (this.features_focus_)
                    ships[this.features_focus_.id] = this.features_focus_;
            }
            this.drawnState_ = { extent: extent, resolution: resolution, size: size };
            for (var i in ships) {
                if (!ships[i].data) {
                    console.log(ships[i]);
                }
            }
            this.drawer_.setParameters(extent, resolution, size, ships);
            this.drawnShips_ = this.drawer_.draw();
            return this.drawer_.getCanvas();
        };
        ;
        ShipsCanvasSource.prototype.addPrefix = function (value) {
            return 'shipLayer:' + value;
        };
        ShipsCanvasSource.prototype.removePrefix = function (value) {
            return value.substr(value.indexOf(":") + 1);
        };
        ShipsCanvasSource.prototype.setData = function (items) {
            var dead = [];
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
            for (var i_1 = 0; i_1 < dead.length; i_1++) {
                var s = dead[i_1];
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
                }
                else {
                    var s2 = new ShipsLayerFeature(this);
                    s2.id = shipsId;
                    s2.data = di;
                    s2.lonlat = trans([di.lon, di.lat]);
                    s2.shape = null;
                    s2.icons = [];
                    s2.label = {};
                    this.ships_[s2.id] = s2;
                }
            }
            this.changed();
        };
        ;
        ShipsCanvasSource.prototype.getShipFeature = function (id) {
            for (var each in this.ships_) {
                var ship = this.ships_[each];
                if (ship.id === id)
                    return ship;
            }
            return null;
        };
        ;
        ShipsCanvasSource.prototype.getShipFeatureByDataId = function (dataId) {
            for (var each in this.ships_) {
                var ship = this.ships_[each];
                if (ship.data.id === dataId)
                    return ship;
            }
            return null;
        };
        ;
        ShipsCanvasSource.prototype.getAllShipFeature = function () {
            var sfs = [];
            for (var each in this.ships_) {
                var ship = this.ships_[each];
                sfs.push(ship);
            }
            return sfs;
        };
        ;
        ShipsCanvasSource.prototype.search = function (key) {
            var r = [];
            //id
            var mmsikey = key.toLowerCase().replace('mmsi:');
            for (var each in this.ships_) {
                var ship = this.ships_[each].data;
                var mmsi = ship.id.toLowerCase().replace('mmsi:');
                if (this.searchString(mmsi, mmsikey)) {
                    r.push({ type: "id", data: ship.id, target: this.ships_[each] });
                }
            }
            //name
            for (var each in this.ships_) {
                var ship = this.ships_[each].data;
                if (this.searchString(ship.name, key)) {
                    r.push({ type: "name", data: ship.name, target: this.ships_[each] });
                }
            }
            return r;
        };
        ShipsCanvasSource.prototype.searchString = function (thestring, str) {
            var r = false;
            var t = thestring.toLowerCase().replace(/\s/g, "");
            var k = str.toLowerCase();
            r = r ? r : (t.indexOf(k) >= 0);
            return r;
        };
        return ShipsCanvasSource;
    }(ol.source.ImageCanvas));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipsCanvasSource;
});
