var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "openlayers", "../../../seecool/utilities"], function (require, exports, ol, utilities) {
    "use strict";
    var MapInfoControl = (function (_super) {
        __extends(MapInfoControl, _super);
        function MapInfoControl(options) {
            var _this = this;
            //var options = options;
            var mapInfo = $('<div class="MapInfoControl ol-unselectable ol-control"></div>');
            _this = _super.call(this, {
                element: mapInfo[0],
                target: options.target || undefined
            }) || this;
            var lonLat;
            var zoom;
            var mapInfoRefresh = function (e) {
                if (!lonLat)
                    return;
                var Lon = utilities.formatDegree(lonLat[0], 'ddd-cc-mm.mmL');
                var Lat = utilities.formatDegree(lonLat[1], 'dd-cc-mm.mmB');
                var info = $("<table><tr><td style='width:100px'>" + Lon + "</td><td style='width:100px'>" + Lat + "</td><td style='width:52px'>图级:" + zoom + "</td></tr></table>");
                mapInfo.empty();
                info.appendTo(mapInfo);
            };
            var map = options.map; //this.getMap();
            map.on("pointermove", function (e) {
                var view = e.map.getView();
                if (e.coordinate)
                    lonLat = ol.proj.toLonLat(e.coordinate);
                zoom = view.getZoom();
                mapInfoRefresh({ lonLat: lonLat, zoom: zoom });
            });
            map.getView().on("propertychange", function (e) {
                zoom = e.target.getZoom();
                mapInfoRefresh({ lonLat: lonLat, zoom: zoom });
            });
            return _this;
        }
        return MapInfoControl;
    }(ol.control.Control));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MapInfoControl;
});
