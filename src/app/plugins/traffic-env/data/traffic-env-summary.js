"use strict";
var traffic_env_types_1 = require('./traffic-env-types');
var TrafficEnvSummary = (function () {
    function TrafficEnvSummary(data) {
        this.Name = data.Name;
        this.AliasName1 = data.AliasName1;
        this.AliasName2 = data.AliasName2;
        this.AttachmentGroupKey = data.AttachmentGroupKey;
        this.Comments = data.Comments;
        this.DrawingStyle = data.DrawingStyle;
        this.FullName = data.FullName;
        this.OrganizationId = data.OriganizationId;
        this.PortAreaId = data.PortAreaId;
        this.TrafficEnvType = traffic_env_types_1.TrafficEnvTypes.GetTypeLabel(data.TrafficEnvType);
    }
    return TrafficEnvSummary;
}());
exports.TrafficEnvSummary = TrafficEnvSummary;
