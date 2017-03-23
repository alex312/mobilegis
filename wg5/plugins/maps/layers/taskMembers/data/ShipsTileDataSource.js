"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";

    var ShipsTileDataSource = function (_ol$Observable) {
        _inherits(ShipsTileDataSource, _ol$Observable);

        function ShipsTileDataSource(option) {
            _classCallCheck(this, ShipsTileDataSource);

            var _this = _possibleConstructorReturn(this, (ShipsTileDataSource.__proto__ || Object.getPrototypeOf(ShipsTileDataSource)).call(this));

            _this.getData = function () {
                return { url: this.tileUrl_, version: this.version_ };
            };
            _this.dispose = function () {
                if (this.timer_) {
                    window.clearTimeout(this.timer_);
                    this.timer_ = null;
                }
                if (this.xhr_) {
                    this.xhr_.abort();
                    this.xhr_ = null;
                }
            };
            _this.check_ = function () {
                this.xhr_ = new XMLHttpRequest();
                this.xhr_.open("get", this.versionUrl_, true);
                this.xhr_.onload = this.checkComplete_.bind(this, false);
                this.xhr_.onerror = this.checkComplete_.bind(this, true);
                this.xhr_.send();
            };
            _this.checkComplete_ = function (failed, evt) {
                var xhr = evt.target;
                if (!failed && xhr.status === 200) {
                    var version = JSON.parse(xhr.responseText);
                    if (version !== this.version_) {
                        this.version_ = version;
                        this.changed();
                    }
                }
                this.timer_ = window.setTimeout(this.check_.bind(this), this.checkInterval_);
            };
            option = option || {};
            _this.tileUrl_ = option.tileUrl || null;
            _this.versionUrl_ = option.versionUrl || null;
            _this.checkInterval_ = option.checkInterval || 1000 * 60;
            _this.xhr_ = null;
            _this.timer_ = null;
            _this.version_ = null;
            if (_this.tileUrl_ && _this.versionUrl_ && _this.checkInterval_) {
                _this.check_();
            }
            return _this;
        }

        return ShipsTileDataSource;
    }(ol.Observable);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipsTileDataSource;
});