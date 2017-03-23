"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "text!./htmls/SidePanel.html", "../../ui/uiFrame/WindowView"], function (require, exports, sidePanlDiv, WindowView_1) {
    "use strict";

    var SidePanel = function (_WindowView_1$default) {
        _inherits(SidePanel, _WindowView_1$default);

        function SidePanel(options) {
            _classCallCheck(this, SidePanel);

            var _this = _possibleConstructorReturn(this, (SidePanel.__proto__ || Object.getPrototypeOf(SidePanel)).call(this, sidePanlDiv));

            _this.fullSized_ = true;
            _this.title("锚泊事件");
            _this.startTime_ = options.startTime;
            _this.endTime_ = options.endTime;
            _this.query_ = options.query;
            _this.dataList_ = options.dataList;
            _this.calcTime_ = options.calcTime;
            _this.calcYear_ = options.calcYear;
            _this.calcMonth_ = options.calcMonth;
            return _this;
        }

        return SidePanel;
    }(WindowView_1.default);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SidePanel;
});