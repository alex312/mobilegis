"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "../../../../../seecool/StaticLib"], function (require, exports, StaticLib_1) {
    "use strict";

    var EventDealApi = function (_StaticLib_1$WebApi) {
        _inherits(EventDealApi, _StaticLib_1$WebApi);

        function EventDealApi() {
            _classCallCheck(this, EventDealApi);

            return _possibleConstructorReturn(this, (EventDealApi.__proto__ || Object.getPrototypeOf(EventDealApi)).apply(this, arguments));
        }

        _createClass(EventDealApi, [{
            key: "Get$start_end",
            value: function Get$start_end(start, end) {
                return this.baseApi({
                    url: this.url,
                    type: "get",
                    data: { start: start, end: end }
                });
            }
        }, {
            key: "Get_StatDealType$year",
            value: function Get_StatDealType$year(year) {
                return this.baseApi({
                    url: this.url + '/StatDealType',
                    type: "get",
                    data: { year: year }
                });
            }
        }, {
            key: "Get_StatDealType$year_month",
            value: function Get_StatDealType$year_month(year, month) {
                return this.baseApi({
                    url: this.url + '/StatDealType',
                    type: "get",
                    data: { year: year, month: month }
                });
            }
        }]);

        return EventDealApi;
    }(StaticLib_1.WebApi);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventDealApi;
});