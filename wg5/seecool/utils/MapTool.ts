export module MapTool {
    export var BaseResolution = 40075016.68557849;//2*20037508.34;

    export function ZoomToResolution(zoom) {
        return MapTool.BaseResolution / Math.pow(2, zoom + 8) //1.194328566955879-17  0.5971642834779395-18
    }

    export function ResolutionToZoom(reso) {
        return Math.log(MapTool.BaseResolution / reso) / Math.LN2 - 8;
        //baseResolution/Math.pow(2,reso+8) //1.194328566955879-17  0.5971642834779395-18
    }

    export function ExtentToCenter(extent) {
        var dLon = extent[2] - extent[0];
        var dLat = extent[3] - extent[1];
        return [extent[0] + dLon / 2, extent[1] + dLat / 2];
    }

    export function ExtentToApprZoomD(extent, resolution, size) {
        var dLon = extent[2] - extent[0];
        var dLat = extent[3] - extent[1];
        var dx = dLon / resolution;
        var dy = dLat / resolution;
        var x = Math.log(Math.min(size[0] / dx, size[1] / dy)) / Math.log(2);
        x = -Math.floor(x);
        return x;
    }

    export function ExtentToCenterFullZoomD(extent, resolution, size) {
        var dLon = extent[2] - extent[0];
        var dLat = extent[3] - extent[1];
        var x = 0;
        do {
            x++;
            var dx = (dLon / resolution) / x;
            var dy = (dLat / resolution) / x;
        }
        while (dx > size[0] || dy > size[1]);
        x--;
        var Cg = [extent[0] + dLon / 2, extent[1] + dLat / 2];
        return {center: Cg, d: x};
    }

    //olColorParse('#HHHHHHHH') //#AARRGGBB
    export function olColorParseARGB(str) {
        var r = [];
        r[3] = parseInt(str.substr(1, 2), 16);
        r[0] = parseInt(str.substr(3, 2), 16);
        r[1] = parseInt(str.substr(5, 2), 16);
        r[2] = parseInt(str.substr(7, 2), 16);
        r[3] = Math.round(100 * r[3] / 255) / 100;
        return ol.color.asArray(ol.color.asString(r));
    }

    //olColorParse('#HHHHHHHH') //#AArrggbb
    export function olColorParseArgb(str) {
        var r = [];
        r[3] = parseInt(str.substr(1, 2), 16);
        r[0] = 255 - parseInt(str.substr(3, 2), 16);
        r[1] = 255 - parseInt(str.substr(5, 2), 16);
        r[2] = 255 - parseInt(str.substr(7, 2), 16);
        r[3] = Math.round(100 * r[3] / 255) / 100;
        return ol.color.asArray(ol.color.asString(r));
    }

    //olColorParse('#HHHHHHHH') //#RRGGBBAA
    export function olColorParse(str) {
        var r = ol.color.asArray(str.substr(0, str.length - 2));
        r[3] = parseInt(str.substr(str.length - 2, 2), 16);
        r[3] = Math.round(100 * r[3] / 255) / 100;
        return ol.color.asArray(ol.color.asString(r));
    }

    export function olColorFormat(colorasArray, option?) {//'#HHHHHHHH'
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
}