"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "../../../../../seecool/StaticLib"], function (require, exports, StaticLib_1) {
    "use strict";

    var DefaultTrafficEnvStyleApi = function (_StaticLib_1$WebApi) {
        _inherits(DefaultTrafficEnvStyleApi, _StaticLib_1$WebApi);

        function DefaultTrafficEnvStyleApi() {
            _classCallCheck(this, DefaultTrafficEnvStyleApi);

            return _possibleConstructorReturn(this, (DefaultTrafficEnvStyleApi.__proto__ || Object.getPrototypeOf(DefaultTrafficEnvStyleApi)).apply(this, arguments));
        }

        return DefaultTrafficEnvStyleApi;
    }(StaticLib_1.WebApi);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DefaultTrafficEnvStyleApi;
});