define(["require", "exports"], function (require, exports) {
    "use strict";
    var MapTool;
    (function (MapTool) {
        MapTool.BaseResolution = 40075016.68557849; //2*20037508.34;
        function ZoomToResolution(zoom) {
            return MapTool.BaseResolution / Math.pow(2, zoom + 8); //1.194328566955879-17  0.5971642834779395-18
        }
        MapTool.ZoomToResolution = ZoomToResolution;
        function ResolutionToZoom(reso) {
            return Math.log(MapTool.BaseResolution / reso) / Math.LN2 - 8;
            //baseResolution/Math.pow(2,reso+8) //1.194328566955879-17  0.5971642834779395-18
        }
        MapTool.ResolutionToZoom = ResolutionToZoom;
        function LatitudeResolution(latitude) {
            return Math.cos(latitude * Math.PI / 180) * MapTool.BaseResolution;
        }
        MapTool.LatitudeResolution = LatitudeResolution;
        function ExtentToCenter(extent) {
            var dLon = extent[2] - extent[0];
            var dLat = extent[3] - extent[1];
            return [extent[0] + dLon / 2, extent[1] + dLat / 2];
        }
        MapTool.ExtentToCenter = ExtentToCenter;
        function ExtentToApprZoomD(extent, resolution, size) {
            var dLon = extent[2] - extent[0];
            var dLat = extent[3] - extent[1];
            var dx = dLon / resolution;
            var dy = dLat / resolution;
            var x = Math.log(Math.min(size[0] / dx, size[1] / dy)) / Math.log(2);
            x = -Math.floor(x);
            return x;
        }
        MapTool.ExtentToApprZoomD = ExtentToApprZoomD;
        function ExtentToEnoughZoomD(extent, resolution, size) {
            var dLon = extent[2] - extent[0];
            var dLat = extent[3] - extent[1];
            var x = 0;
            do {
                x++;
                var dx = (dLon / resolution) / x;
                var dy = (dLat / resolution) / x;
            } while (dx > size[0] || dy > size[1]);
            x--;
            return x;
        }
        MapTool.ExtentToEnoughZoomD = ExtentToEnoughZoomD;
        function ExtentToCenterFullZoomD(extent, resolution, size) {
            var dLon = extent[2] - extent[0];
            var dLat = extent[3] - extent[1];
            var x = 0;
            do {
                x++;
                var dx = (dLon / resolution) / x;
                var dy = (dLat / resolution) / x;
            } while (dx > size[0] || dy > size[1]);
            x--;
            var Cg = [extent[0] + dLon / 2, extent[1] + dLat / 2];
            return { center: Cg, d: x };
        }
        MapTool.ExtentToCenterFullZoomD = ExtentToCenterFullZoomD;
        //olColorParse('#HHHHHHHH') //#AARRGGBB
        function olColorParseARGB(str) {
            var r = [];
            r[3] = parseInt(str.substr(1, 2), 16);
            r[0] = parseInt(str.substr(3, 2), 16);
            r[1] = parseInt(str.substr(5, 2), 16);
            r[2] = parseInt(str.substr(7, 2), 16);
            r[3] = Math.round(100 * r[3] / 255) / 100;
            return ol.color.asArray(ol.color.asString(r));
        }
        MapTool.olColorParseARGB = olColorParseARGB;
        //olColorParse('#HHHHHHHH') //#AArrggbb
        function olColorParseArgb(str) {
            var r = [];
            r[3] = parseInt(str.substr(1, 2), 16);
            r[0] = 255 - parseInt(str.substr(3, 2), 16);
            r[1] = 255 - parseInt(str.substr(5, 2), 16);
            r[2] = 255 - parseInt(str.substr(7, 2), 16);
            r[3] = Math.round(100 * r[3] / 255) / 100;
            return ol.color.asArray(ol.color.asString(r));
        }
        MapTool.olColorParseArgb = olColorParseArgb;
        //olColorParse('#HHHHHHHH') //#RRGGBBAA
        function olColorParse(str) {
            var r = ol.color.asArray(str.substr(0, str.length - 2));
            r[3] = parseInt(str.substr(str.length - 2, 2), 16);
            r[3] = Math.round(100 * r[3] / 255) / 100;
            return ol.color.asArray(ol.color.asString(r));
        }
        MapTool.olColorParse = olColorParse;
        function olColorFormat(colorasArray, option) {
            option = option || 'rgba';
            var a = ol.color.asArray(colorasArray);
            switch (option) {
                case '#AARRGGBB':
                    a[3] = Math.floor(a[3] * 255);
                    return '#'
                        + (a[3] < 16 ? '0' + a[3].toString(16) : a[3].toString(16))
                        + (a[0] < 16 ? '0' + a[0].toString(16) : a[0].toString(16))
                        + (a[1] < 16 ? '0' + a[1].toString(16) : a[1].toString(16))
                        + (a[2] < 16 ? '0' + a[2].toString(16) : a[2].toString(16));
                case '#HH4':
                    a[3] = Math.floor(a[3] * 255);
                    return '#'
                        + (a[0] < 16 ? '0' + a[0].toString(16) : a[0].toString(16))
                        + (a[1] < 16 ? '0' + a[1].toString(16) : a[1].toString(16))
                        + (a[2] < 16 ? '0' + a[2].toString(16) : a[2].toString(16))
                        + (a[3] < 16 ? '0' + a[3].toString(16) : a[3].toString(16));
                case '#HH3':
                    return '#'
                        + (a[0] < 16 ? '0' + a[0].toString(16) : a[0].toString(16))
                        + (a[1] < 16 ? '0' + a[1].toString(16) : a[1].toString(16))
                        + (a[2] < 16 ? '0' + a[2].toString(16) : a[2].toString(16));
                case 'rgba':
                    return ol.color.asString(colorasArray);
            }
        }
        MapTool.olColorFormat = olColorFormat;
        //convertLonLatGroup([[[0, 0], [127, 60], [127, 70]], [[127, 38], [126, 37]]]);
        function convertLonLatGroup(group) {
            if (group.length === 2 && (typeof (group[0]) === "number")) {
                return ol.proj.fromLonLat(group);
            }
            else {
                return group.map(function (g) {
                    return convertLonLatGroup(g);
                });
            }
        }
        MapTool.convertLonLatGroup = convertLonLatGroup;
    })(MapTool = exports.MapTool || (exports.MapTool = {}));
});
