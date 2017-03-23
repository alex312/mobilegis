"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "text!./ResultViewTemplate.html", "../uiFrame/WindowView"], function (require, exports, ResultViewTemplate, WindowView_1) {
    "use strict";

    var ResultView = function (_WindowView_1$default) {
        _inherits(ResultView, _WindowView_1$default);

        function ResultView(options) {
            _classCallCheck(this, ResultView);

            var _this = _possibleConstructorReturn(this, (ResultView.__proto__ || Object.getPrototypeOf(ResultView)).call(this, ResultViewTemplate));

            _this.title('详情');
            _this.items_['viewDom'] = _this.element_;
            _this.items_['tabTitle'] = _this.items_['viewDom'].find('[name="tabTitle"]');
            _this.items_['tabContent'] = _this.items_['viewDom'].find('[name="tabContent"]');
            return _this;
        }

        return ResultView;
    }(WindowView_1.default);

    exports.ResultView = ResultView;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ResultView;
});