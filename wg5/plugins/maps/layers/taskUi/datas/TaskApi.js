"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "../../../../../seecool/StaticLib"], function (require, exports, StaticLib_1) {
    "use strict";

    var TaskApi = function (_StaticLib_1$WebApi) {
        _inherits(TaskApi, _StaticLib_1$WebApi);

        function TaskApi() {
            _classCallCheck(this, TaskApi);

            return _possibleConstructorReturn(this, (TaskApi.__proto__ || Object.getPrototypeOf(TaskApi)).apply(this, arguments));
        }

        _createClass(TaskApi, [{
            key: "Get$executantId",

            //api/task?executantId={executantId}
            value: function Get$executantId(executantId) {
                return this.baseApi({
                    url: this.url + ("?executantId=" + executantId),
                    type: 'get'
                });
            }
            //api/task?executantId=32&status=&pageIndex=0&pageSize=10000

        }, {
            key: "Get$executantId_status_pageIndex_pageSize",
            value: function Get$executantId_status_pageIndex_pageSize(executantId, status) {
                var pageIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                var pageSize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10000;

                return this.baseApi({
                    url: this.url + ("?executantId=" + executantId + "&status=" + status + "&pageIndex=" + pageIndex + "&pageSize=" + pageSize),
                    type: 'get'
                });
            }
            //api/task?executantId=&depCode=WH&status=BeginExecuted&type=&startTime=&endTime=&pageIndex=0&pageSize=100

        }, {
            key: "Get$executantId_depCode_status_type_startTime_endTime_pageIndex_pageSize",
            value: function Get$executantId_depCode_status_type_startTime_endTime_pageIndex_pageSize() {
                var executantId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
                var depCode = arguments[1];
                var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "BeginExecuted";
                var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
                var startTime = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
                var endTime = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
                var pageIndex = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
                var pageSize = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 100;

                return this.baseApi({
                    url: this.url + ("?executantId=" + executantId + "&depCode=" + depCode + "&status=" + status + "&type=" + type + "&startTime=" + startTime + "&endTime=" + endTime + "&pageIndex=" + pageIndex + "&pageSize=" + pageSize),
                    type: 'get'
                });
            }
        }]);

        return TaskApi;
    }(StaticLib_1.WebApi);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TaskApi;
});