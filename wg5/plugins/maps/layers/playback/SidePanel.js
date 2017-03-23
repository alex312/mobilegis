"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "text!./htmls/PlaybackSetting.html", "../../ui/uiFrame/WindowView"], function (require, exports, sidePanlDiv, WindowView_1) {
    "use strict";

    var SidePanel = function (_WindowView_1$default) {
        _inherits(SidePanel, _WindowView_1$default);

        function SidePanel(options) {
            _classCallCheck(this, SidePanel);

            var _this = _possibleConstructorReturn(this, (SidePanel.__proto__ || Object.getPrototypeOf(SidePanel)).call(this, sidePanlDiv));

            _this.fullSized_ = true;
            _this.title("回放");
            _this.options_ = options;
            _this.startTime_ = options.startTime;
            _this.endTime_ = options.endTime;
            _this.ships_ = options.ships;
            _this.startPlayback_ = options.startPlayback;
            _this.stopPlayback_ = options.stopPlayback;
            _this.selectShip_ = options.selectShip;
            _this.selectArea_ = options.selectArea;
            _this.showTrackPath_ = options.showTrackPath;
            _this.focusShip_ = options.focusShip;
            return _this;
        }

        _createClass(SidePanel, [{
            key: "startStopPlayback_",
            value: function startStopPlayback_() {
                if (!this.isActive_) {
                    this.isActive_ = true;
                    this.options_.startPlayback();
                } else {
                    this.isActive_ = false;
                    this.options_.stopPlayback();
                }
            }
        }, {
            key: "detach",
            value: function detach(parent) {
                _get(SidePanel.prototype.__proto__ || Object.getPrototypeOf(SidePanel.prototype), "detach", this).call(this, parent);
                this.options_.stopPlayback();
            }
        }]);

        return SidePanel;
    }(WindowView_1.default);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SidePanel;
});