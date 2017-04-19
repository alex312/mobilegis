var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "../seecool/configuration/ConfigParser", "../seecool/plugins/Plugins", "../seecool/datas/EventSource"], function (require, exports, ConfigParser_1, Plugins_1, EventSource_1) {
    "use strict";
    var RootPlugin = (function (_super) {
        __extends(RootPlugin, _super);
        function RootPlugin(options) {
            var _this = _super.call(this) || this;
            _this.domRoot_ = options.domRoot;
            _this.basePath_ = options.basePath;
            return _this;
        }
        Object.defineProperty(RootPlugin.prototype, "domRoot", {
            get: function () {
                return this.domRoot_;
            },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(RootPlugin.prototype, "basePath", {
            get: function () {
                return this.basePath_;
            },
            enumerable: true,
            configurable: true
        });
        return RootPlugin;
    }(EventSource_1.default));
    function main(domRoot, basePath, proxyObj) {
        return __awaiter(this, void 0, void 0, function () {
            var configName, configs, config, pagePlugins, rootPlugin, pluginManager, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        basePath = basePath.replace(/\/$/, '');
                        configName = basePath + '/config' + (location.search.replace(/^\?/, '-') || '');
                        return [4 /*yield*/, loadConfigs(configName)];
                    case 1:
                        configs = _a.sent();
                        config = ConfigParser_1.parse(configs);
                        //applyParamsToConfig(config, pageParams);
                        define('config', [], config);
                        if (!config.pages)
                            throw new Error('Need a pages in config');
                        if (!config.plugins)
                            throw new Error('Need a plugins in config');
                        if (!config.plugins)
                            throw new Error('Need a plugins in config');
                        if (!config.pageManager)
                            throw new Error('Need a pageManager in config');
                        if (!config.plugins[config.pageManager])
                            config.plugins[config.pageManager] = {};
                        if (config.plugins[config.pageManager].pages)
                            throw new Error('should not set pages in the plugin pointed by pageManager');
                        config.plugins[config.pageManager].pages = config.pages;
                        pagePlugins = [config.pageManager];
                        rootPlugin = new RootPlugin({
                            domRoot: domRoot,
                            basePath: basePath
                        });
                        if (proxyObj) {
                            proxyObj.__proto__ = rootPlugin;
                            proxyObj._initFun && proxyObj._initFun.call(rootPlugin, rootPlugin);
                        }
                        pluginManager = new Plugins_1.Plugins(config.manifest || {}, config.plugins || {});
                        pluginManager.add('root', rootPlugin);
                        pluginManager.add('plugins', pluginManager);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, pluginManager.load(pagePlugins)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error(error_1);
                        throw error_1;
                    case 5: return [2 /*return*/, rootPlugin];
                }
            });
        });
    }
    exports.main = main;
    function applyParamsToConfig(config, params) {
        // TODO: allow patch configuration via url
        return config;
    }
    function loadConfigs(configName) {
        return __awaiter(this, void 0, void 0, function () {
            var config, parents, keys, promises, parentConfigs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loadConfig(configName)];
                    case 1:
                        config = _a.sent();
                        parents = config['$includes'];
                        keys = parents ? Object.getOwnPropertyNames(parents) : [];
                        if (!keys.length)
                            return [2 /*return*/, [config]];
                        promises = keys.map(function (item) {
                            var namespace = parents[item];
                            item = configName.replace(/\/.*$/, '/') + item;
                            return loadConfigs(item).then(function (configs) {
                                if (typeof (namespace) === "string")
                                    namespace = namespace.split('.');
                                if (namespace.length) {
                                    for (var i = 0; i < configs.length; i++) {
                                        configs[i] = wrapInNamespace(configs[i], namespace);
                                    }
                                }
                                return configs;
                            });
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        parentConfigs = _a.sent();
                        parentConfigs.push(config);
                        return [2 /*return*/, parentConfigs];
                }
            });
        });
    }
    function wrapInNamespace(obj, namespace) {
        for (var i = namespace.length - 1; i >= 0; i--) {
            var key = namespace[i];
            obj = (_a = {}, _a[key] = obj, _a);
        }
        return obj;
        var _a;
    }
    function loadConfig(file) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var script = "(function(define, $) {return " + xhr.responseText + "})";
                    var configFactory = window['eval'](script);
                    var config = configFactory(function () {
                        return arguments[0];
                    }, ConfigParser_1.Expression);
                    resolve(config);
                }
                else {
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
