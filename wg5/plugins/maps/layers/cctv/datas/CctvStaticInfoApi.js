"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "../../../../../seecool/StaticLib"], function (require, exports, StaticLib_1) {
    "use strict";

    var BerthApi = function (_StaticLib_1$WebApi) {
        _inherits(BerthApi, _StaticLib_1$WebApi);

        function BerthApi() {
            _classCallCheck(this, BerthApi);

            return _possibleConstructorReturn(this, (BerthApi.__proto__ || Object.getPrototypeOf(BerthApi)).apply(this, arguments));
        }

        _createClass(BerthApi, [{
            key: "Get_CctvDynamic$version",

            //GET api/StaticInfo/CCTVDynamic?version={version}
            value: function Get_CctvDynamic$version(version) {
                return this.baseApi({
                    url: this.url + ("/CCTVDynamic?version=" + version),
                    type: 'get'
                });
            }
            //GET api/StaticInfo/CCTVStatic?version={version}

        }, {
            key: "Get_CctvStatic$version",
            value: function Get_CctvStatic$version(version) {
                return this.baseApi({
                    url: this.url + ("/CCTVStatic?version=" + version),
                    type: 'get'
                });
            }
            //GET api/StaticInfo/CCTVPosition?version={version}

        }, {
            key: "Get_CctvPosition$version",
            value: function Get_CctvPosition$version(version) {
                return this.baseApi({
                    url: this.url + ("/CCTVPosition?version=" + version),
                    type: 'get'
                });
            }
            //GET api/StaticInfo/CCTVHierarchy.default?version={version}

        }, {
            key: "Get_CctvHierarchy$$default$version",
            value: function Get_CctvHierarchy$$default$version(version) {
                return this.baseApi({
                    url: this.url + ("/CCTVHierarchy.default?version=" + version),
                    type: 'get'
                });
            }
        }]);

        return BerthApi;
    }(StaticLib_1.WebApi);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BerthApi;
});