"use strict";
var NearbyShip = (function () {
    function NearbyShip(data) {
        this.ID = data.ID;
        this.MMSI = data.MMSI;
        this.Name = this.getStringTrim(data.Name);
        this.NameCN = this.getStringTrim(data.NameCN);
    }
    Object.defineProperty(NearbyShip.prototype, "DisplayName", {
        get: function () {
            if (this.NameCN && this.NameCN.length > 0)
                return this.NameCN;
            else
                return this.MMSI;
        },
        enumerable: true,
        configurable: true
    });
    NearbyShip.prototype.getStringTrim = function (str) {
        if (str)
            return str.trim();
        else
            return undefined;
    };
    return NearbyShip;
}());
exports.NearbyShip = NearbyShip;
