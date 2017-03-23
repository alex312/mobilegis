"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "text!./htmls/TaskSidePanel.html", "fecha", "../../ui/uiFrame/WindowView"], function (require, exports, sidePanlDiv, fecha, WindowView_1) {
    "use strict";

    var TaskSidePanel = function (_WindowView_1$default) {
        _inherits(TaskSidePanel, _WindowView_1$default);

        function TaskSidePanel(options) {
            _classCallCheck(this, TaskSidePanel);

            var _this = _possibleConstructorReturn(this, (TaskSidePanel.__proto__ || Object.getPrototypeOf(TaskSidePanel)).call(this, sidePanlDiv));

            _this.fullSized_ = false;
            _this.title("任务信息");
            //this.feature_ = options.feature();
            // for (var data in options){
            //     var ele = data;
            //     ele.Date = fecha.format(data.Date, "YYYY-MM-DD HH:mm:ss");
            //     ele.RequiredCompletionDate = fecha.format(data.RequiredCompletionDate, "YYYY-MM-DD HH:mm:ss");
            //     this.feature_.push(ele);
            // }
            var updata = function () {
                this.feature_ = options.feature();
                this.date_ = fecha.format(options.feature().Date, "YYYY-MM-DD HH:mm:ss");
                this.requiredCompletionDate_ = fecha.format(options.feature().RequiredCompletionDate, "YYYY-MM-DD HH:mm:ss");
            }.bind(_this);
            updata();
            // this.currentStatus_ = options.feature.CurrentStatus;
            // this.type_ = options.feature.Type;
            options.feature.subscribe(updata.bind(_this));
            _this.tastMembersSetFocus_ = function (data, evt) {
                options.tastMembersSetFocus(data.feature_, evt);
            };
            return _this;
        }

        return TaskSidePanel;
    }(WindowView_1.default);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TaskSidePanel;
});