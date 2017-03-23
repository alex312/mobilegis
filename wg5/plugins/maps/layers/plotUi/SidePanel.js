"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "knockout", "text!./htmls/SidePanel.html", "../../../../seecool/StaticLib", "../../ui/uiFrame/WindowView"], function (require, exports, ko, sidePanlDiv, StaticLib_1, WindowView_1) {
    "use strict";

    var SidePanel = function (_WindowView_1$default) {
        _inherits(SidePanel, _WindowView_1$default);

        function SidePanel(options) {
            _classCallCheck(this, SidePanel);

            var _this = _possibleConstructorReturn(this, (SidePanel.__proto__ || Object.getPrototypeOf(SidePanel)).call(this, sidePanlDiv));

            _this.fullSized_ = true;
            _this.plotdata_ = ko.observableArray();
            _this.title("标绘");
            var plotTooldata = [];
            for (var i in StaticLib_1.ShapeTypeLabel) {
                plotTooldata.push({ name: i, label: StaticLib_1.ShapeTypeLabel[i] });
            }
            plotTooldata.splice(1, 1); //移除直线标绘按钮
            _this.plotTool_ = plotTooldata; //
            _this.plotdata_ = options.features; //(options.features());
            _this.plotToolCancel_ = options.plotToolCancel;
            _this.plotToolStart_ = options.plotToolStart;
            _this.plotItemClick_ = options.plotItemClick;
            _this.plotItemDelete_ = options.plotItemDelete;
            _this.plotItemSetting_ = options.plotItemSetting;
            return _this;
        }

        return SidePanel;
    }(WindowView_1.default);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SidePanel;
});