"use strict";
var VesselGroupMember = (function () {
    function VesselGroupMember(data) {
        this.Id = data.Id;
        this.GroupId = data.GroupId;
        this.MMSI = data.MMSI;
        this.LocalName = data.LocalName;
        this.EnName = data.EnName;
        this.Comment = data.Comment;
    }
    Object.defineProperty(VesselGroupMember.prototype, "Name", {
        get: function () {
            var name = '';
            if (this.LocalName) {
                name = this.LocalName;
                if (this.EnName)
                    name += "(" + this.EnName + ")";
            }
            else if (this.EnName)
                name = this.EnName;
            else
                name = this.MMSI;
            return name;
        },
        enumerable: true,
        configurable: true
    });
    return VesselGroupMember;
}());
exports.VesselGroupMember = VesselGroupMember;
