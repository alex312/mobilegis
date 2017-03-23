"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "openlayers", "../../../../../seecool/StaticLib", "../../../../../seecool/utilities", "../../../../../seecool/utils/JSTool", "../../../../../seecool/utils/MapTool", "../../../../../seecool/utilities", './ShipShape'], function (require, exports, ol, StaticLib, utilities, JSTool_1, MapTool_1, utilities_1, ShipShape_1) {
    "use strict";

    var ShipsLayerShapeVts = function ShipsLayerShapeVts(option) {
        _classCallCheck(this, ShipsLayerShapeVts);

        this.draw = function (context) {
            var ang = -Math.PI / 2;
            if (this.sog_) {
                context.beginPath();
                context.moveTo(0, 0);
                context.lineTo(this.sog_[0] / 3, this.sog_[1] / 3);
                context.strokeStyle = this.isGPS ? "#0000ff" : '#40AAA5'; //this.COLORS.ARPAT;
                context.lineWidth = this.SIZES.THICK_LINE;
                if (context.setLineDash) context.setLineDash([5, 3]);
                context.stroke();
                if (context.setLineDash) context.setLineDash([]);
                ang = Math.atan2(this.sog_[1], this.sog_[0]);
            }
            if (typeof this.heading_ != 'undefined') {
                if (this.heading_ == 511) {} else {
                    ang = -Math.PI / 2 + this.heading_ * Math.PI / 180;
                }
            }
            //画船
            context.rotate(ang); //旋转
            // if (this.distinc_) {
            //     StaticLib.distinctPath(context, this.distinc_.length / 2, this.distinc_.width / 2, this.distinc_.length / 2, this.distinc_.width / 2);
            // } else {
            //     StaticLib.trianglePath(context);
            // }
            //context.moveTo(10, 0);
            //context.lineTo(-9, 4);
            //context.lineTo(-9, -4);
            //context.closePath();
            // var w = (l + r) / 2;
            // var tl = (t + b) / 3;
            // context.moveTo(t, l - w);
            // context.lineTo(t - tl, -r);
            // context.lineTo(-b + tl / 2, -r);
            // context.lineTo(-b, -r + w / 2);
            // context.lineTo(-b, l - w / 2);
            // context.lineTo(-b + tl / 2, l);
            // context.lineTo(t - tl, l);
            // context.closePath();
            context.beginPath();
            context.arc(0, 0, 8, 0, Math.PI * 2);
            context.closePath();
            context.fillStyle = '#2B6EFF';
            context.fill();
            context.beginPath();
            context.arc(0, 0, 5, 0, Math.PI * 2);
            context.closePath();
            context.fillStyle = this.getColor(this.ship.type, this.ship.v_type);
            context.fill();
            context.strokeStyle = '#000000';
            context.lineWidth = 1; //this.SIZES.THICK_LINE;
            context.stroke();
            context.rotate(-ang); //旋转
        };
        this.getColor = function (shipType, shipVType) {
            //var a = shipType % 10;
            //var b = (shipType - a) / 10;
            var color = StaticLib.getShipTypeInfo(shipType, shipVType, "Colors");
            //var b=StaticLib.getShipTypeLocalCode(shipType,shipVType);
            //b=b||Infinity;
            //var typeCode_crossId2=JSTool.CrossId2(StaticLib.ShipType.LocalShipTypeCode);
            //var color = StaticLib.ShipType.Colors[typeCode_crossId2.i[Infinity]];
            //if(b in typeCode_crossId2.i)
            //    color=StaticLib.ShipType.Colors[typeCode_crossId2.i[b]];
            //switch (b){
            //    case 6:  //客船
            //        color = this.COLORS.BLUE;
            //        break;
            //    case 7:  //货船
            //        color = this.COLORS.ARPAT;
            //        break;
            //    case 8:  //油船
            //        color = this.COLORS.RED;
            //        break;
            //    case 3:  //渔船
            //        color = this.COLORS.GREEN;
            //        break;
            //    case 5:  //作业
            //        color = this.COLORS.PURPLE_RED;
            //        break;
            //    default:
            //        break;
            //}
            return color;
        };
        this.box = function () {
            if (!this.box_) {
                var r = this.SIZES.RADAR_DIAMETER / 2;
                var d = this.SIZES.RADAR_DIAMETER;
                this.box_ = utilities_1.rect.create(-r, -r, d, d);
            }
            return this.box_;
        };
        this.contains = function (x, y) {
            var r = this.SIZES.RADAR_DIAMETER / 2;
            return r * r > x * x + y * y;
        };
        this.SHIPCOLORS = JSTool_1.JSTool.ArrayIAToObject(StaticLib.ShipType.Names, StaticLib.ShipType.Colors);
        this.SIZES = {
            THIN_LINE: 0.3 * 0.039370 * 96,
            THICK_LINE: 0.6 * 0.039370 * 96,
            RADAR_DIAMETER: 3 * 0.039370 * 96,
            AIS_WIDTH: 4 * 0.039370 * 96,
            AIS_HEIGHT: 6 * 0.039370 * 96,
            AIS_SLEEP_WIDTH: 3 * 0.039370 * 96,
            AIS_SLEEP_HEIGHT: 4.5 * 0.039370 * 96,
            HEADING_LINE_LENGTH: 4 * 0.039370 * 96,
            TURN_INDICATOR_SEG_LENGTH: 2 * 0.039370 * 96
        };
        this.sog_ = null;
        this.box_ = null;
        this.ship = option.data;
        var data = option.data;
        this.heading_ = data.heading;
        this.type_ = data.type;
        var sog = data.sog;
        var cog = data.cog;
        if (sog !== 102.3 && sog !== 0 && cog < 360) {
            var dist = sog * (3 / 60) * 1852;
            var radCog = cog * Math.PI / 180;
            var dx = dist * Math.sin(radCog) / option.resolution;
            var dy = -dist * Math.cos(radCog) / option.resolution;
            this.sog_ = [dx, dy];
        }
        var projection = new ol.proj.Projection({ code: "EPSG:3857" });
        var pointResolution = projection.getPointResolution(option.resolution, ol.proj.fromLonLat([data.lon, data.lat]));
        //console.log(pointResolution);
        var length, width;
        if (data.length, data.width) {
            length = data.length / pointResolution;
            width = data.width / pointResolution;
        }
        if (data.v_length, data.v_width) {
            length = data.v_length / pointResolution;
            width = data.v_width / pointResolution;
        }
        var zoom = MapTool_1.MapTool.ResolutionToZoom(option.resolution);
        var nu = utilities.DC.GN([data], '0.dimensions,0.dimensions.*');
        this.distinc_ = zoom > 14 && length && width ? { length: length, width: width } : null;
    };

    ShipShape_1.default.addImplementation(ShipsLayerShapeVts);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipsLayerShapeVts;
});