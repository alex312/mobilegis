import ShipShape from "./ShipShape";
import * as ol from "openlayers";
import {rect} from "seecool/utilities";

class ShipsLayerShapeAis {
    center;
    triangle;
    heading;
    rot;
    sog;
    truescaled;

    constructor(option?) {
        this.center = null;
        this.triangle = null;
        this.heading = null;
        this.rot = null;
        this.sog = null;
        this.truescaled = null;

        this.initialize(option);
    }

    draw = function (context) {
        context.strokeStyle = this.COLORS.RESBL;
        context.lineWidth = this.SIZES.THICK_LINE;
        context.fillStyle = this.fillColor;
        if (this.truescaled) {
            context.beginPath();
            context.moveTo(this.truescaled.p1x, this.truescaled.p1y);
            context.lineTo(this.truescaled.p2x, this.truescaled.p2y);
            context.lineTo(this.truescaled.p3x, this.truescaled.p3y);
            context.lineTo(this.truescaled.p4x, this.truescaled.p4y);
            context.lineTo(this.truescaled.p5x, this.truescaled.p5y);
            context.lineTo(this.truescaled.p6x, this.truescaled.p6y);
            context.lineTo(this.truescaled.p7x, this.truescaled.p7y);
            context.closePath();
            context.stroke();
        }
        context.beginPath();
        context.moveTo(this.triangle.p1x, this.triangle.p1y);
        context.lineTo(this.triangle.p2x, this.triangle.p2y);
        context.lineTo(this.triangle.p3x, this.triangle.p3y);
        context.closePath();
        context.fill();
        context.stroke();

        context.beginPath();
        context.arc(0, 0, this.SIZES.THICK_LINE, 0, Math.PI * 2, false);
        context.closePath();
        context.fillStyle = this.COLORS.RESBL;
        context.fill();

        if (this.heading) {
            context.beginPath();
            context.moveTo(this.triangle.p1x, this.triangle.p1y);
            context.lineTo(this.heading.x, this.heading.y);
            context.strokeStyle = this.COLORS.ARPAT;
            context.lineWidth = this.SIZES.THIN_LINE;
            context.stroke();
            if (this.rot) {
                context.beginPath();
                context.moveTo(this.heading.x, this.heading.y);
                context.lineTo(this.rot.x1, this.rot.y1);
                context.lineTo(this.rot.x2, this.rot.y2);
                context.strokeStyle = this.COLORS.RESBL;
                context.stroke();
            }
        }
        if (this.sog) {
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(this.sog.x, this.sog.y);
            context.strokeStyle = this.COLORS.ARPAT;
            context.lineWidth = this.SIZES.THICK_LINE;
            if (context.setLineDash) context.setLineDash([5, 3]);
            context.stroke();
            if (context.setLineDash) context.setLineDash([]);
        }
    };

    box = function () {
        if (!this._box) {
            var tri = this.triangle;
            var l = Math.min(tri.p1x, tri.p2x, tri.p3x),
                t = Math.min(tri.p1y, tri.p2y, tri.p3y),
                r = Math.max(tri.p1x, tri.p2x, tri.p3x),
                b = Math.max(tri.p1y, tri.p2y, tri.p3y);
            this._box = rect.create(l, t, r - l, b - t);
        }
        return this._box;
    };

    contains = function (x, y) {
        var tri = this.triangle;
        var alpha = ((tri.p2y - tri.p3y) * (x - tri.p3x) + (tri.p3x - tri.p2x) * (y - tri.p3y)) /
            ((tri.p2y - tri.p3y) * (tri.p1x - tri.p3x) + (tri.p3x - tri.p2x) * (tri.p1y - tri.p3y));
        var beta = ((tri.p3y - tri.p1y) * (x - tri.p3x) + (tri.p1x - tri.p3x) * (y - tri.p3y)) /
            ((tri.p2y - tri.p3y) * (tri.p1x - tri.p3x) + (tri.p3x - tri.p2x) * (tri.p1y - tri.p3y));
        return alpha > 0 && beta > 0 && (alpha + beta) < 1.0;
    };

    initialize = function (options) {
        var data = options.data;
        var sog = data.sog;
        var cog = data.cog;
        var cbzl = data.type;
        var heading = data.heading;
        var width = data.width;
        var length = data.length;
        var rot = data.rot;
        var lon = data.lon;
        var lat = data.lat;

        var radHeading, sinHeading, cosHeading;
        if (heading === 511) {
            radHeading = sinHeading = cosHeading = NaN;
        } else {
            radHeading = heading / 180 * Math.PI;
            sinHeading = Math.sin(radHeading);
            cosHeading = Math.cos(radHeading);
        }

        this.createTriangle(sog, sinHeading, cosHeading);
        if (!isNaN(radHeading)) {
            width /= options.resolution;
            length /= options.resolution;
            this.createTruescaled(0, 0, width, length, sinHeading, cosHeading);
            this.createHeading(radHeading, sinHeading, cosHeading, rot, length);
        }
        if (sog !== 102.3 && sog !== 0 && cog < 360) {
            var dist = sog * (3 / 60) * 1852;
            var radCog = cog * Math.PI / 180;
            var dx = dist * Math.sin(radCog) / options.resolution;
            var dy = -dist * Math.cos(radCog) / options.resolution;
            this.sog = {x: dx, y: dy};
        }
        this.fillColor = this.isDangerous(cbzl) ? "#ff0000" : "#FFFF00";
    };

    createTriangle = function (sog, sinHeading, cosHeading) {
        var width, height;
        if (sog > 0) {
            width = this.SIZES.AIS_WIDTH;
            height = this.SIZES.AIS_HEIGHT;
        } else {
            width = this.SIZES.AIS_SLEEP_WIDTH;
            height = this.SIZES.AIS_SLEEP_HEIGHT;
        }

        var op1x = 0;
        var op1y = -height / 2;
        var op2x = width / 2;
        var op2y = height / 2;
        var op3x = -width / 2;
        var op3y = height / 2;

        var sin_heading = isNaN(sinHeading) ? 0 : sinHeading;
        var cos_heading = isNaN(cosHeading) ? 1 : cosHeading;

        var p1x = op1x * cos_heading - op1y * sin_heading;
        var p1y = op1x * sin_heading + op1y * cos_heading;
        var p2x = op2x * cos_heading - op2y * sin_heading;
        var p2y = op2x * sin_heading + op2y * cos_heading;
        var p3x = op3x * cos_heading - op3y * sin_heading;
        var p3y = op3x * sin_heading + op3y * cos_heading;

        this.triangle = {
            p1x: p1x,
            p1y: p1y,
            p2x: p2x,
            p2y: p2y,
            p3x: p3x,
            p3y: p3y
        };
    };

    createTruescaled = function (x, y, width, length, sinHeading, cosHeading) {
        if (!width || !length
            || width < this.SIZES.AIS_WIDTH
            || length < this.SIZES.AIS_HEIGHT)
            return;

        var hh = length / 2;
        var hw = width / 2;
        var qw = width / 4;
        var p15h = length * 0.15;

        var p1x = 0 + x;
        var p1y = -hh + y;
        var p2x = qw + x;
        var p2y = -hh + y;
        var p3x = hw + x;
        var p3y = -hh + p15h + y;
        var p4x = hw + x;
        var p4y = hh + y;
        var p5x = -hw + x;
        var p5y = hh + y;
        var p6x = -hw + x;
        var p6y = -hh + p15h + y;
        var p7x = -qw + x;
        var p7y = -hh + y;

        var ts:any = {};
        ts.p1x = p1x * cosHeading - p1y * sinHeading;
        ts.p1y = p1x * sinHeading + p1y * cosHeading;
        ts.p2x = p2x * cosHeading - p2y * sinHeading;
        ts.p2y = p2x * sinHeading + p2y * cosHeading;
        ts.p3x = p3x * cosHeading - p3y * sinHeading;
        ts.p3y = p3x * sinHeading + p3y * cosHeading;
        ts.p4x = p4x * cosHeading - p4y * sinHeading;
        ts.p4y = p4x * sinHeading + p4y * cosHeading;
        ts.p5x = p5x * cosHeading - p5y * sinHeading;
        ts.p5y = p5x * sinHeading + p5y * cosHeading;
        ts.p6x = p6x * cosHeading - p6y * sinHeading;
        ts.p6y = p6x * sinHeading + p6y * cosHeading;
        ts.p7x = p7x * cosHeading - p7y * sinHeading;
        ts.p7y = p7x * sinHeading + p7y * cosHeading;
        this.truescaled = ts;
    };

    createHeading = function (radHeading, sinHeading, cosHeading, rot, length) {
        var x0 = this.triangle.p1x;
        var y0 = this.triangle.p1y;
        var headLineLength = this.SIZES.HEADING_LINE_LENGTH;

        if (this.truescaled) {
            var bowDist = length / 2;
            var bowDistSqr = bowDist * bowDist;
            var distSqr = (x0 * x0 + y0 * y0);
            if (distSqr < bowDistSqr)
                headLineLength += bowDist - Math.sqrt(distSqr);
        }

        var hlx = x0 + headLineLength * sinHeading;
        var hly = y0 - headLineLength * cosHeading;
        this.heading = {x: hlx, y: hly};
        if (rot && rot !== -128) {
            var a = rot > 0 ? radHeading + Math.PI / 2 : radHeading - Math.PI / 2;
            var sin_a = Math.sin(a);
            var cos_a = Math.cos(a);

            var rotx1 = hlx + this.SIZES.TURN_INDICATOR_SEG_LENGTH * sinHeading;
            var roty1 = hly - this.SIZES.TURN_INDICATOR_SEG_LENGTH * cosHeading;

            var rotx2 = rotx1 + this.SIZES.TURN_INDICATOR_SEG_LENGTH * sin_a;
            var roty2 = roty1 - this.SIZES.TURN_INDICATOR_SEG_LENGTH * cos_a;

            this.rot = {x1: rotx1, y1: roty1, x2: rotx2, y2: roty2};
        }
    };

    isDangerous = function (ais_cbzl) {
        var a = ais_cbzl % 10;
        var b = (ais_cbzl - a) / 10;
        if (b === 8)
            return true;
        if ((a === 1 || a === 2 || a === 3 || a === 4)
            && (b === 2 || b === 4 || b === 6 || b === 7 || b === 9))
            return true;

        return false;
    };

    SIZES = {
        THIN_LINE: (0.3) * 0.039370 * 96,
        THICK_LINE: (0.6) * 0.039370 * 96,
        RADAR_DIAMETER: (3) * 0.039370 * 96,
        AIS_WIDTH: (4) * 0.039370 * 96,
        AIS_HEIGHT: (6) * 0.039370 * 96,
        AIS_SLEEP_WIDTH: (3) * 0.039370 * 96,
        AIS_SLEEP_HEIGHT: (4.5) * 0.039370 * 96,
        HEADING_LINE_LENGTH: (4) * 0.039370 * 96,
        TURN_INDICATOR_SEG_LENGTH: (2) * 0.039370 * 96
    };

    COLORS = {
        ARPAT: '#40AAA5',
        RESBL: '#4C87E3',
        TRNSPT: 'transparent'
    };
}

ShipShape.addImplementation(ShipsLayerShapeAis);

export default ShipsLayerShapeAis;
