"use strict";
var moment = require('moment');
var base_1 = require('../../../base');
var ShipSummary = (function () {
    function ShipSummary(featureData) {
        this.featureData = featureData;
        this.callsign = featureData.callsign ? featureData.callsign : '未知';
        this.cog = featureData.cog === 511 ? '未知' : base_1.Format.FormatNumber(featureData.cog) + '°';
        this.destination = featureData.destination;
        this.dynamicTime = moment(featureData.dynamicTime.getTime()).format('YYYY-MM-DD HH:mm:ss');
        this.heading = featureData.heading === 511 || !featureData.heading ? '未知' : base_1.Format.FormatNumber(featureData.heading) + '°';
        this.imo = featureData.imo ? featureData.imo.toString() : '未知';
        this.length = featureData.length ? featureData.length + '米' : '未知';
        this.width = featureData.width ? featureData.width + '米' : '未知';
        this.lon = base_1.Format.FormatDegree(featureData.lon, 'ddd-cc-mm.mmL');
        this.lat = base_1.Format.FormatDegree(featureData.lat, 'ddd-cc-mm.mmB');
        this.mmsi = featureData.mmsi ? featureData.mmsi : '未知';
        this.name = featureData.v_name ? featureData.v_name : featureData.name;
        this.sog = featureData.sog ? base_1.Format.FormatNumber(featureData.sog) + '节' : '未知';
        this.timeout = featureData.timeout;
        this.v_length = featureData.v_length;
        this.v_type = featureData.v_type;
        this.v_width = featureData.v_width;
        this.type = featureData.v_type;
    }
    return ShipSummary;
}());
exports.ShipSummary = ShipSummary;
