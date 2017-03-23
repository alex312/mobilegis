"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
define(["require", "exports", '../seecool/configuration/ConfigParser', "../seecool/plugins/Plugins", "../seecool/datas/EventSource"], function (require, exports, ConfigParser_1, Plugins_1, EventSource_1) {
    "use strict";

    var RootPlugin = function (_EventSource_1$defaul) {
        _inherits(RootPlugin, _EventSource_1$defaul);

        function RootPlugin(options) {
            _classCallCheck(this, RootPlugin);

            var _this = _possibleConstructorReturn(this, (RootPlugin.__proto__ || Object.getPrototypeOf(RootPlugin)).call(this));

            _this.domRoot_ = options.domRoot;
            _this.basePath_ = options.basePath;
            return _this;
        }

        _createClass(RootPlugin, [{
            key: "domRoot",
            get: function get() {
                return this.domRoot_;
            }
        }, {
            key: "basePath",
            get: function get() {
                return this.basePath_;
            }
        }]);

        return RootPlugin;
    }(EventSource_1.default);

    function main(domRoot, basePath) {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
            var configName, config, hash, parts, pageName, pageParams, plugins, rootPlugin;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            basePath = basePath.replace(/\/$/, '');
                            configName = basePath + '/config' + (location.search.replace(/^\?/, '-') || '');
                            _context.t0 = ConfigParser_1;
                            _context.next = 5;
                            return loadConfigs(configName);

                        case 5:
                            _context.t1 = _context.sent;
                            config = _context.t0.parse.call(_context.t0, _context.t1);
                            hash = location.hash.replace(/^#/, '');
                            parts = /^([^?]*)(\?.*)?$/.exec(hash);
                            pageName = parts[1] || 'index';
                            pageParams = (parts[2] || '?').substr(1).split('&');

                            applyParamsToConfig(config, pageParams);
                            define('config', [], config);
                            plugins = (config.pages || {})[pageName];

                            if (plugins) {
                                _context.next = 16;
                                break;
                            }

                            throw new Error("Undefined page name '" + pageName + "'.");

                        case 16:
                            if (!(!Array.isArray(plugins) || !plugins.length)) {
                                _context.next = 18;
                                break;
                            }

                            throw new Error("Invalid configuration for page '" + pageName + "'.");

                        case 18:
                            rootPlugin = new RootPlugin({
                                domRoot: domRoot,
                                basePath: basePath
                            });

                            Plugins_1.Plugins.add('root', rootPlugin);
                            _context.next = 22;
                            return Plugins_1.Plugins.load(plugins, config.plugins);

                        case 22:
                            return _context.abrupt("return", rootPlugin);

                        case 23:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));
    }
    exports.main = main;
    function applyParamsToConfig(config, params) {
        // TODO: allow patch configuration via url
        return config;
    }
    function loadConfigs(configName) {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee2() {
            var config, parent, baseConfigs;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return loadConfig(configName);

                        case 2:
                            config = _context2.sent;
                            parent = config['$extends'];

                            if (parent) {
                                _context2.next = 6;
                                break;
                            }

                            return _context2.abrupt("return", [config]);

                        case 6:
                            parent = configName.replace(/\/.*$/, '/') + parent;
                            _context2.next = 9;
                            return loadConfigs(parent);

                        case 9:
                            baseConfigs = _context2.sent;

                            baseConfigs.push(config);
                            return _context2.abrupt("return", baseConfigs);

                        case 12:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));
    }
    function loadConfig(file) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var script = "(function(define, $expr) {return " + xhr.responseText + "})";
                    var configFactory = window['eval'](script);
                    var config = configFactory(function () {
                        return arguments[0];
                    });
                    resolve(config);
                } else {
                    reject({ status: xhr.status });
                }
            };
            xhr.onerror = function () {
                reject({ status: 0 });
            };
            xhr.open("GET", file + ".js", true);
            xhr.send();
        });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = main;
});