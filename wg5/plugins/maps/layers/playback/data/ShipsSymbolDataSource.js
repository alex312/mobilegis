"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "openlayers", 'seecool/utilities', 'kendo'], function (require, exports, ol, utilities) {
    "use strict";

    var DataConverter = function () {
        function DataConverter(fields) {
            _classCallCheck(this, DataConverter);

            this.index_id_ = -1;
            this.index_name_ = -1;
            this.index_device_ = -1;
            this.index_mmsi_ = -1;
            this.index_lon_ = -1;
            this.index_lat_ = -1;
            this.index_sog_ = -1;
            this.index_cog_ = -1;
            this.index_heading_ = -1;
            this.index_rot_ = -1;
            this.index_width_ = -1;
            this.index_length_ = -1;
            this.index_time_ = -1;
            this.index_uid_ = -1;
            this.index_type_ = -1;
            this.index_secondaries_ = -1;
            this.index_id_ = fields.indexOf('ShipId');
            this.index_name_ = fields.indexOf('Name');
            this.index_device_ = fields.indexOf('Type');
            this.index_mmsi_ = fields.indexOf('Mmsi');
            this.index_lon_ = fields.indexOf('Lon');
            this.index_lat_ = fields.indexOf('Lat');
            this.index_sog_ = fields.indexOf('Sog');
            this.index_cog_ = fields.indexOf('Cog');
            this.index_heading_ = fields.indexOf('Heading');
            this.index_rot_ = fields.indexOf('Turn');
            this.index_width_ = fields.indexOf('Width');
            this.index_length_ = fields.indexOf('Length');
            this.index_time_ = fields.indexOf('Time');
            this.index_uid_ = fields.indexOf('UniqueId');
            this.index_type_ = fields.indexOf('Cbzl');
            this.index_secondaries_ = fields.indexOf('Secondaries');
        }

        _createClass(DataConverter, [{
            key: "convert",
            value: function convert(data) {
                var ship = {};
                ship.id = data[this.index_id_];
                ship.name = data[this.index_name_];
                ship.device = data[this.index_device_];
                ship.mmsi = data[this.index_mmsi_];
                ship.lon = data[this.index_lon_];
                ship.lat = data[this.index_lat_];
                ship.sog = data[this.index_sog_];
                ship.cog = data[this.index_cog_];
                ship.heading = data[this.index_heading_];
                ship.width = data[this.index_width_];
                ship.length = data[this.index_length_];
                ship.time = utilities.dateFromWcfJson(data[this.index_time_]);
                ship.uid = data[this.index_uid_];
                ship.type = data[this.index_type_];
                ship.secondaries = [];
                var secondariesData = data[this.index_secondaries_];
                if (secondariesData) {
                    for (var i = 0, l = secondariesData.length; i < l; i++) {
                        ship.secondaries.push(this.convert(secondariesData[i]));
                    }
                }
                return ship;
            }
        }]);

        return DataConverter;
    }();

    var ShipsSymbolDataSource = function (_ol$Observable) {
        _inherits(ShipsSymbolDataSource, _ol$Observable);

        function ShipsSymbolDataSource(options) {
            _classCallCheck(this, ShipsSymbolDataSource);

            var _this = _possibleConstructorReturn(this, (ShipsSymbolDataSource.__proto__ || Object.getPrototypeOf(ShipsSymbolDataSource)).call(this));

            options = options || {};
            _this.dataUrl_ = options.service || undefined;
            _this.xhr_ = null;
            _this.timer_ = null;
            _this.requestId_ = 0;
            _this.extent_ = ol.extent.createEmpty();
            _this.watchs_ = {};
            _this.data_ = null;
            _this.dataConverter_ = null;
            _this.timerRefreshCanvas_ = null;
            _this.timerRefreshShow_ = window.setTimeout(_this.refreshShow.bind(_this), 1);
            _this.load_();
            return _this;
        }

        _createClass(ShipsSymbolDataSource, [{
            key: "getData",
            value: function getData() {
                return this.data_;
            }
        }, {
            key: "refreshShow",
            value: function refreshShow() {
                this.changed();
                this.timerRefreshShow_ = window.setTimeout(this.refreshShow.bind(this), 1);
            }
        }, {
            key: "setExtent",
            value: function setExtent(extent) {
                if (!extent) extent = ol.extent.createEmpty();
                if (!ol.extent.equals(extent, this.extent_)) {
                    this.extent_ = extent;
                    this.requestReload_();
                }
            }
        }, {
            key: "watchShip",
            value: function watchShip(id) {
                console.log(this.watchs_, id);
                if (id in this.watchs_) {
                    this.watchs_[id]++;
                } else {
                    this.watchs_[id] = 1;
                    this.requestReload_();
                }
            }
        }, {
            key: "unwatchShip",
            value: function unwatchShip(id) {
                if (id in this.watchs_) {
                    if (--this.watchs_[id] == 0) delete this.watchs_[id];
                }
            }
        }, {
            key: "requestReload_",
            value: function requestReload_() {
                this.clearTimer_();
                this.timer_ = window.setTimeout(this.load_.bind(this), 1);
            }
        }, {
            key: "dispose",
            value: function dispose() {
                this.clearTimer_();
                if (this.xhr_) {
                    this.xhr_.abort();
                    this.xhr_ = null;
                }
            }
        }, {
            key: "clearTimer_",
            value: function clearTimer_() {
                if (this.timer_) {
                    window.clearTimeout(this.timer_);
                    this.timer_ = null;
                }
            }
        }, {
            key: "isWatchingAnything_",
            value: function isWatchingAnything_() {
                for (var each in this.watchs_) {
                    return true;
                }
                return false;
            }
        }, {
            key: "formatWatches_",
            value: function formatWatches_() {
                var items = [];
                for (var each in this.watchs_) {
                    items.push(each);
                }
                return items.join(",");
            }
        }, {
            key: "SetData",
            value: function SetData(data) {
                var dataArray = [];
                for (var key in data) {
                    //    var ship = /**@type {seecoolx.data.Ship}*/({});
                    //    ship.id = data[key].ID;
                    //    ship.name = data[key].Name;
                    //    //ship.device = data[this.index_device_];
                    //    ship.mmsi = data[key].MMSI;
                    //    ship.lon = data[key].Longitude;
                    //    ship.lat = data[key].Latitude;
                    //    ship.sog = data[key].SOG;
                    //    ship.cog = data[key].COG;
                    //    ship.heading = data[key].Heading;
                    //    ship.track = data[key].track;
                    //    ship.showTrack = data[key].showTrack;
                    //    //ship.width = data[key].Width;
                    //    //ship.length = data[key].Length;
                    //    ship.time = utilities.utilities.dateFromWcfJson(data[key].Time);
                    //    ship.uid = ship.ID;
                    //    ship.type = data[key].Type;
                    //    ship.Secondaries = [];
                    dataArray.push(data[key]);
                }
                if (dataArray.length > 0) {
                    this.data_ = dataArray;
                    this.changed();
                }
            }
        }, {
            key: "ShowTrackPath",
            value: function ShowTrackPath(show) {
                var dataArray = this.data_;
                for (var data in dataArray) {
                    dataArray[data].ShowTrack = show;
                }
            }
        }, {
            key: "ClearData",
            value: function ClearData() {
                var dataArray = [];
                this.data_ = dataArray;
                this.changed();
            }
        }, {
            key: "load_",
            value: function load_() {
                console.log("ship symbol data source load", this.dataUrl_);
                if (!this.dataUrl_) return;
                if (ol.extent.isEmpty(this.extent_) && !this.isWatchingAnything_()) return;
                var data = ['bounds=' + encodeURIComponent(this.extent_.join(',')), 'followee=' + encodeURIComponent("mids:" + this.formatWatches_()), 'merge=false'];
                if (this.xhr_) {
                    this.xhr_.onload = null;
                    this.xhr_.onerror = null;
                }
                this.xhr_ = new XMLHttpRequest();
                this.xhr_.open("GET", this.dataUrl_ + '?' + data.join('&'));
                this.xhr_.onload = this.loadComplete_.bind(this, false);
                this.xhr_.onerror = this.loadComplete_.bind(this, true);
                this.xhr_.send();
                console.log(this.dataUrl_ + '?' + data.join('&'));
            }
        }, {
            key: "loadComplete_",
            value: function loadComplete_(failed, evt) {
                var xhr = evt.target;
                if (!failed && xhr.status === 200) {
                    var obj = JSON.parse(xhr.responseText);
                    this.data_ = this.preprocess_(obj);
                    this.changed();
                }
                this.timer_ = window.setTimeout(this.load_.bind(this), 1000 * 15);
            }
        }, {
            key: "preprocess_",
            value: function preprocess_(result) {
                if (!this.dataConverter_) {
                    var fields = result['fields'];
                    this.dataConverter_ = new DataConverter(fields);
                }
                var data = result['data'];
                var ships = {};
                for (var i = 0, l = data.length; i < l; i++) {
                    var ship = this.dataConverter_.convert(data[i]);
                    ships[ship.id] = ship;
                }
                return ships;
            }
        }]);

        return ShipsSymbolDataSource;
    }(ol.Observable);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipsSymbolDataSource;
});