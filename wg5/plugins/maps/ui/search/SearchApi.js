"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "../../../../seecool/StaticLib"], function (require, exports, StaticLib_1) {
    "use strict";

    var SearchApi = function (_StaticLib_1$WebApi) {
        _inherits(SearchApi, _StaticLib_1$WebApi);

        function SearchApi() {
            _classCallCheck(this, SearchApi);

            return _possibleConstructorReturn(this, (SearchApi.__proto__ || Object.getPrototypeOf(SearchApi)).apply(this, arguments));
        }

        _createClass(SearchApi, [{
            key: "Get$type_key",

            //GET api/search/{type}?key={key}
            value: function Get$type_key(type, key) {
                return this.baseApi({
                    url: this.url + ("/" + type + "?key=" + key),
                    type: 'get'
                });
            }
            //GET api/Search?key={key}

        }, {
            key: "Get$key",
            value: function Get$key(key) {
                return this.baseApi({
                    url: this.url + ("?key=" + key),
                    type: 'get'
                });
            }
        }]);

        return SearchApi;
    }(StaticLib_1.WebApi);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SearchApi;
});