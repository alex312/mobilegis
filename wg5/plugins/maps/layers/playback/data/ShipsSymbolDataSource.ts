import * as ol from "openlayers";
import * as utilities from 'seecool/utilities';
import 'kendo';

class DataConverter {
    index_id_: number = -1;
    index_name_: number = -1;
    index_device_: number = -1;
    index_mmsi_: number = -1;
    index_lon_: number = -1;
    index_lat_: number = -1;
    index_sog_: number = -1;
    index_cog_: number = -1;
    index_heading_: number = -1;
    index_rot_: number = -1;
    index_width_: number = -1;
    index_length_: number = -1;
    index_time_: number = -1;
    index_uid_: number = -1;
    index_type_: number = -1;
    index_secondaries_: number = -1;

    constructor(fields) {
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
    };

    convert(data) {
        var ship: any = /**@type {seecoolx.data.Ship}*/({});
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
    };
}

class ShipsSymbolDataSource extends ol.Observable {
    dataUrl_;
    xhr_;
    timer_;
    requestId_;
    extent_;
    watchs_;
    data_: {[key: string]: any};
    dataConverter_;
    timerRefreshCanvas_;
    timerRefreshShow_;

    constructor(options) {
        super();

        options = options || {};
        this.dataUrl_ = options.service || undefined;
        this.xhr_ = null;
        this.timer_ = null;
        this.requestId_ = 0;
        this.extent_ = ol.extent.createEmpty();
        this.watchs_ = {};
        this.data_ = null;
        this.dataConverter_ = null;
        this.timerRefreshCanvas_ = null;
        this.timerRefreshShow_ = window.setTimeout(this.refreshShow.bind(this), 1);
        this.load_();
    };

    getData() {
        return this.data_;
    };

    refreshShow() {
        this.changed();
        this.timerRefreshShow_ = window.setTimeout(this.refreshShow.bind(this), 1);
    }

    setExtent(extent) {
        if (!extent) extent = ol.extent.createEmpty();
        if (!ol.extent.equals(extent, this.extent_)) {
            this.extent_ = extent;
            this.requestReload_();
        }
    };

    watchShip(id) {
        console.log(this.watchs_, id);
        if (id in this.watchs_) {
            this.watchs_[id]++;
        } else {
            this.watchs_[id] = 1;
            this.requestReload_();
        }
    };

    unwatchShip(id) {
        if (id in this.watchs_) {
            if (--this.watchs_[id] == 0)
                delete this.watchs_[id];
        }
    };

    requestReload_() {
        this.clearTimer_();
        this.timer_ = window.setTimeout(this.load_.bind(this), 1);
    };

    dispose() {
        this.clearTimer_();
        if (this.xhr_) {
            this.xhr_.abort();
            this.xhr_ = null;
        }
    };

    clearTimer_() {
        if (this.timer_) {
            window.clearTimeout(this.timer_);
            this.timer_ = null;
        }
    };

    isWatchingAnything_() {
        for (var each in this.watchs_) {
            return true;
        }
        return false;
    };

    formatWatches_() {
        var items = [];
        for (var each in this.watchs_) {
            items.push(each);
        }
        return items.join(",");
    };

    SetData(data) {
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

    ShowTrackPath(show) {
        var dataArray = this.data_;
        for (var data in dataArray)
            dataArray[data].ShowTrack = show;
    }

    ClearData() {
        var dataArray = [];
        this.data_ = dataArray;
        this.changed();
    }

    load_() {
        console.log("ship symbol data source load", this.dataUrl_);
        if (!this.dataUrl_)
            return;

        if (ol.extent.isEmpty(this.extent_) && !this.isWatchingAnything_())
            return;

        var data = [
            'bounds=' + encodeURIComponent(this.extent_.join(',')),
            'followee=' + encodeURIComponent("mids:" + this.formatWatches_()),
            'merge=false'
        ];

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

    };

    loadComplete_(failed, evt) {
        var xhr = evt.target;
        if (!failed && xhr.status === 200) {
            var obj = JSON.parse(xhr.responseText);
            this.data_ = this.preprocess_(obj);
            this.changed();
        }

        this.timer_ = window.setTimeout(this.load_.bind(this), 1000 * 15);
    };

    preprocess_(result) {
        if (!this.dataConverter_) {
            var fields = /**@type {Array.<string>}*/(result['fields']);
            this.dataConverter_ = new DataConverter(fields);
        }
        var data = /**@type{Array.<Array>}*/(result['data']);

        var ships = /**@type {Object.<string, seecoolx.data.Ship>}*/({});
        for (var i = 0, l = data.length; i < l; i++) {
            var ship = this.dataConverter_.convert(data[i]);
            ships[ship.id] = ship;
        }
        return ships;
    };
}
export default ShipsSymbolDataSource;
