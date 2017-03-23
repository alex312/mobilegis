"use strict";
var ship_1 = require('../../ship');
var traffic_env_1 = require('../../traffic-env');
(function (FeatureType) {
    FeatureType[FeatureType["Ship"] = 0] = "Ship";
    FeatureType[FeatureType["TrafficEnv"] = 1] = "TrafficEnv";
})(exports.FeatureType || (exports.FeatureType = {}));
var FeatureType = exports.FeatureType;
var Feature = (function () {
    function Feature(layerType, data) {
        this.layerType = layerType;
        this.data = data;
        this.type = this.mapToFeatureType(layerType);
        this.summary = this.mapToSummary(this.type, data);
    }
    Object.defineProperty(Feature.prototype, "id", {
        get: function () {
            return this.type === FeatureType.Ship ? this.data.id : this.data.Id;
        },
        enumerable: true,
        configurable: true
    });
    Feature.prototype.mapToFeatureType = function (layerType) {
        if (layerType === 'shipLayer')
            return FeatureType.Ship;
        else if (layerType === 'thhj')
            return FeatureType.TrafficEnv;
        else
            return undefined;
    };
    Feature.prototype.mapToSummary = function (featureType, data) {
        if (featureType === FeatureType.Ship)
            return new ship_1.ShipSummary(data);
        if (featureType === FeatureType.TrafficEnv) {
            return new traffic_env_1.TrafficEnvSummary(data);
        }
    };
    return Feature;
}());
exports.Feature = Feature;
