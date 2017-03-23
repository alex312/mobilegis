"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", 'openlayers'], function (require, exports, ol) {
    "use strict";

    var ShipsTileSource = function (_ol$source$XYZ) {
        _inherits(ShipsTileSource, _ol$source$XYZ);

        function ShipsTileSource(options) {
            _classCallCheck(this, ShipsTileSource);

            options = options || {};
            options.tileUrlFunction = function (coord, pixelRatio, projection) {
                return _this.tileUrlFunction_(coord, pixelRatio, projection);
            };

            var _this = _possibleConstructorReturn(this, (ShipsTileSource.__proto__ || Object.getPrototypeOf(ShipsTileSource)).call(this, options));

            _this.url_ = options.tileUrl;
            _this.version_ = options.titleVersionUrl;
            return _this;
        }

        _createClass(ShipsTileSource, [{
            key: "setUrlWithVersion",
            value: function setUrlWithVersion(url, version) {
                var urlChanged = false;
                var versionChanged = false;
                if (this.url_ !== url) {
                    this.url_ = url;
                    urlChanged = true;
                }
                if (this.version_ !== version) {
                    this.version_ = version;
                    versionChanged = true;
                }
                if (urlChanged) {
                    //ol
                    this.setTileLoadFunction(this.getTileLoadFunction());
                } else {
                    this.versionChanged_();
                }
            }
        }, {
            key: "tileUrlFunction_",
            value: function tileUrlFunction_(tileCoord, pixelRatio, projection) {
                if (!this.url_ || !this.version_) return undefined;
                if (!tileCoord) return undefined;
                /**@type {string}*/
                var url = this.url_;
                return url.replace('{v}', this.version_.toString()).replace('{x}', tileCoord[1].toString()).replace('{y}', (-tileCoord[2] - 1).toString()).replace('{-y}', (-tileCoord[2]).toString()).replace('{z}', tileCoord[0].toString());
            }
        }, {
            key: "versionChanged_",
            value: function versionChanged_() {
                this.changed();
            }
        }]);

        return ShipsTileSource;
    }(ol.source.XYZ);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipsTileSource;
});