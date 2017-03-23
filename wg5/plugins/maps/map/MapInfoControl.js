"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "openlayers", "../../../seecool/utilities"], function (require, exports, ol, utilities) {
    "use strict";

    var MapInfoControl = function (_ol$control$Control) {
        _inherits(MapInfoControl, _ol$control$Control);

        function MapInfoControl(options) {
            _classCallCheck(this, MapInfoControl);

            //var options = options;
            var mapInfo = $('<div class="MapInfoControl ol-unselectable ol-control"></div>');

            var _this = _possibleConstructorReturn(this, (MapInfoControl.__proto__ || Object.getPrototypeOf(MapInfoControl)).call(this, {
                element: mapInfo[0],
                target: options.target || undefined
            }));

            var lonLat;
            var zoom;
            var mapInfoRefresh = function mapInfoRefresh(e) {
                if (!lonLat) return;
                var Lon = utilities.formatDegree(lonLat[0], 'ddd-cc-mm.mmL');
                var Lat = utilities.formatDegree(lonLat[1], 'dd-cc-mm.mmB');
                var info = $("<table><tr><td style='width:100px'>" + Lon + "</td><td style='width:100px'>" + Lat + "</td><td style='width:52px'>图级:" + zoom + "</td></tr></table>");
                mapInfo.empty();
                info.appendTo(mapInfo);
            };
            var map = options.map; //this.getMap();
            map.on("pointermove", function (e) {
                var view = e.map.getView();
                if (e.coordinate) lonLat = ol.proj.toLonLat(e.coordinate);
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
    }(ol.control.Control);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MapInfoControl;
});