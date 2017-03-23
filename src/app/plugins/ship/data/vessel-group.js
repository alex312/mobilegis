"use strict";
var vessel_group_member_1 = require('./vessel-group-member');
var VesselGroup = (function () {
    function VesselGroup(data) {
        var _this = this;
        this.Members = [];
        this.Id = data.Id;
        this.Name = data.Name;
        this.GroupType = data.GroupType;
        this.Param = data.Param;
        this.Fill = data.Fill;
        data.Members.forEach(function (p) {
            var member = new vessel_group_member_1.VesselGroupMember(p);
            _this.Members.push(member);
        });
    }
    Object.defineProperty(VesselGroup.prototype, "FillColor", {
        get: function () {
            if (this.Fill)
                return '#' + this.Fill.substring(3);
            else
                return '#222';
        },
        enumerable: true,
        configurable: true
    });
    return VesselGroup;
}());
exports.VesselGroup = VesselGroup;
