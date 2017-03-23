"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports"], function (require, exports) {
    "use strict";

    var UrlLoader = function () {
        function UrlLoader(config) {
            _classCallCheck(this, UrlLoader);

            this.config_ = config;
        }

        _createClass(UrlLoader, [{
            key: "urlLoad",
            value: function urlLoad(data) {
                return this.urlLoad_(data);
            }
        }, {
            key: "urlLoad_",
            value: function urlLoad_(data) {
                var urlLoadBase = this.config_["UrlLoadBase"] || "";
                var url = "";
                if (data.url == 'Login') {
                    data.url = 'login.html';
                } else if (data.url == 'Logout') {
                    data.url = '';
                } else {
                    url += urlLoadBase + '#';
                }
                var url = url + data.url + (data.search ? '?' : "") + data.search;
                window.open(url, data.target);
            }
        }]);

        return UrlLoader;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UrlLoader;
});