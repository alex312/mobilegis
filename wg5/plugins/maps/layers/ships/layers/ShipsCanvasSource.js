"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "openlayers", "../../../../../seecool/StaticLib", "./ShipsLayerDrawer", "./ShipsLayerShapeVts"], function (require, exports, ol, StaticLib_1, ShipsLayerDrawer_1, ShipsLayerShapeVts_1) {
    "use strict";

    var ShipsLayerLable = function ShipsLayerLable() {
        _classCallCheck(this, ShipsLayerLable);
    };

    exports.ShipsLayerLable = ShipsLayerLable;

    var ShipsLayerFeature = function (_StaticLib_1$ExtendFe) {
        _inherits(ShipsLayerFeature, _StaticLib_1$ExtendFe);

        function ShipsLayerFeature() {
            _classCallCheck(this, ShipsLayerFeature);

            return _possibleConstructorReturn(this, (ShipsLayerFeature.__proto__ || Object.getPrototypeOf(ShipsLayerFeature)).apply(this, arguments));
        }

        return ShipsLayerFeature;
    }(StaticLib_1.ExtendFeature);

    exports.ShipsLayerFeature = ShipsLayerFeature;

    var ShipsCanvasSource = function (_ol$source$ImageCanva) {
        _inherits(ShipsCanvasSource, _ol$source$ImageCanva);

        function ShipsCanvasSource(option) {
            _classCallCheck(this, ShipsCanvasSource);

            option = option || {};

            var _this2 = _possibleConstructorReturn(this, (ShipsCanvasSource.__proto__ || Object.getPrototypeOf(ShipsCanvasSource)).call(this, {
                canvasFunction: function canvasFunction(extent, resolution, pixelRatio, size /*, projection*/) {
                    return _this2.shipsCanvasFunction_(extent, resolution, pixelRatio, size);
                },
                projection: 'EPSG:3857'
            }));

            _this2.maxResolution_ = option.maxResolution || Infinity;
            _this2.shapeFactory_ = function (options) {
                var data = options.data;
                //if (data.device === "AISTELE123")
                //    return new ShipsLayer_ShapeAis_(options);
                //if (data.device === "AISTELE18")
                //    return new ShipsLayer_ShapeAis_(options);
                return new ShipsLayerShapeVts_1.default(options);
            };
            _this2.ships_ = {};
            _this2.features_follow_ = null;
            _this2.features_focus_ = null;
            _this2.drawnShips_ = [];
            _this2.drawer_ = new ShipsLayerDrawer_1.default(_this2.shapeFactory_, option.flagDraw);
            _this2.drawnState_ = { extent: ol.extent.createEmpty(), resolution: 0, size: [0, 0] };
            _this2.mode_ = option.mode || "realtime";
            return _this2;
        }

        _createClass(ShipsCanvasSource, [{
            key: "pickup",
            value: function pickup(coordinate, maxOffset, resolution) {
                if (!this.drawnState_) return null;
                var min = Infinity;
                var selected = null;
                for (var i = this.drawnShips_.length - 1; i >= 0; i--) {
                    var ship = this.drawnShips_[i];
                    var c = ship.lonlat;
                    var dx = c[0] - coordinate[0];
                    var dy = c[1] - coordinate[1];
                    var v = dx * dx + dy * dy;
                    if (v < min) {
                        min = v;
                        selected = ship;
                    }
                }
                if (selected === null) return null;
                if (min < maxOffset * maxOffset) min = 0;
                return { feature: selected, distance: min };
            }
        }, {
            key: "extentPickup",
            value: function extentPickup(extent, resolution) {
                if (!this.drawnState_) return null;
                var r = [];
                for (var i = this.drawnShips_.length - 1; i >= 0; i--) {
                    var ship = this.drawnShips_[i];
                    var c = ship.lonlat;
                    if (c[0] > extent[0] && c[0] < extent[2] && c[1] > extent[1] && c[1] < extent[3]) {
                        r.push(ship);
                    }
                }
                return r;
            }
        }, {
            key: "getFeatureGeometry",
            value: function getFeatureGeometry(feature) {
                var pt = feature.lonlat;
                var res = this.drawnState_.resolution;
                return new ol.geom.Circle(pt, 15 * res);
            }
        }, {
            key: "getFeatureData",
            value: function getFeatureData(feature) {
                return feature.data;
            }
        }, {
            key: "focusFeature",
            value: function focusFeature(feature) {
                if (this.ships_[feature.id] !== feature) return false;
                if (this.features_focus_ !== feature) {
                    this.features_focus_ = feature;
                    this.changed();
                }
                return true;
            }
        }, {
            key: "unfocusFeature",
            value: function unfocusFeature(feature) {
                if (this.ships_[feature.id] !== feature) return false;
                if (this.features_focus_ === feature) {
                    this.features_focus_ = null;
                    this.changed();
                }
                return true;
            }
        }, {
            key: "followFeature",
            value: function followFeature(feature) {
                if (this.ships_[feature.id] !== feature) return false;
                if (this.features_follow_ !== feature) {
                    this.features_follow_ = feature;
                    this.changed();
                }
                return true;
            }
        }, {
            key: "unfollowFeature",
            value: function unfollowFeature(feature) {
                if (this.ships_[feature.id] !== feature) return false;
                if (this.features_follow_ === feature) {
                    this.features_follow_ = null;
                    this.changed();
                }
                return true;
            }
        }, {
            key: "shipsCanvasFunction_",
            value: function shipsCanvasFunction_(extent, resolution, pixelRatio, size /*, projection*/) {
                var ships;
                if (this.mode_ == "history" || resolution < this.maxResolution_) {
                    ships = this.ships_;
                } else {
                    ships = {};
                    if (this.features_follow_) ships[this.features_follow_.id] = this.features_follow_;
                    if (this.features_focus_) ships[this.features_focus_.id] = this.features_focus_;
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
            }
        }, {
            key: "addPrefix",
            value: function addPrefix(value) {
                return 'shipLayer:' + value;
            }
        }, {
            key: "removePrefix",
            value: function removePrefix(value) {
                return value.substr(value.indexOf(":") + 1);
            }
        }, {
            key: "setData",
            value: function setData(items) {
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
                for (var _i = 0; _i < dead.length; _i++) {
                    var s = dead[_i];
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
                        s2.label = {};
                        this.ships_[s2.id] = s2;
                    }
                }
                this.changed();
            }
        }, {
            key: "getShipFeature",
            value: function getShipFeature(id) {
                for (var each in this.ships_) {
                    var ship = this.ships_[each];
                    if (ship.id === id) return ship;
                }
                return null;
            }
        }, {
            key: "getShipFeatureByDataId",
            value: function getShipFeatureByDataId(dataId) {
                for (var each in this.ships_) {
                    var ship = this.ships_[each];
                    if (ship.data.id === dataId) return ship;
                }
                return null;
            }
        }, {
            key: "getAllShipFeature",
            value: function getAllShipFeature() {
                var sfs = [];
                for (var each in this.ships_) {
                    var ship = this.ships_[each];
                    sfs.push(ship);
                }
                return sfs;
            }
        }, {
            key: "search",
            value: function search(key) {
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
            }
        }, {
            key: "searchString",
            value: function searchString(thestring, str) {
                var r = false;
                var t = thestring.toLowerCase().replace(/\s/g, "");
                var k = str.toLowerCase();
                r = r ? r : t.indexOf(k) >= 0;
                return r;
            }
        }]);

        return ShipsCanvasSource;
    }(ol.source.ImageCanvas);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipsCanvasSource;
});