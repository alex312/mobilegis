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
define(["require", "exports"], function (require, exports) {
    "use strict";
    function inject(name) {
        return function (target, propertyKey, parameterIndex) {
            var dependencies = Reflect.getMetadata('sc-plugin-dependency', target, void (0));
            if (dependencies)
                dependencies[parameterIndex] = name;
            else {
                dependencies = [];
                dependencies[parameterIndex] = name;
                Reflect.defineMetadata('sc-plugin-dependency', dependencies, target, void (0));
            }
        };
    }
    exports.inject = inject;
    var Plugins = (function () {
        function Plugins(manifest, pluginConfigs) {
            this.instances_ = {};
            this.manifest_ = {};
            this.pluginConfigs_ = {};
            this.manifest_ = manifest;
            this.pluginConfigs_ = pluginConfigs;
        }
        Plugins.prototype.add = function (name, theClass) {
            return this.instances_[name] = Promise.resolve(theClass);
        };
        Plugins.prototype.load = function (names) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(Object.prototype.toString.call(names) == '[object Array]')) return [3 /*break*/, 2];
                            return [4 /*yield*/, Promise.all(names.map(function (name) {
                                    return _this.load_.call(_this, name);
                                }))];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            if (!(Object.prototype.toString.call(names) == '[object String]')) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.load_.call(this, names)];
                        case 3: return [2 /*return*/, _a.sent()];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        Plugins.prototype.exec = function (plugin, method, args) {
            return __awaiter(this, void 0, void 0, function () {
                var p, ret;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.load(plugin)];
                        case 1:
                            p = _a.sent();
                            if (!method) return [3 /*break*/, 4];
                            ret = p[method].apply(p, args || []);
                            if (!(ret instanceof Promise)) return [3 /*break*/, 3];
                            return [4 /*yield*/, ret];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3: return [2 /*return*/, ret];
                        case 4: return [2 /*return*/, p];
                    }
                });
            });
        };
        Plugins.prototype.load_ = function (name) {
            return __awaiter(this, void 0, void 0, function () {
                var type, dependencyMappings, manifestItem, config;
                return __generator(this, function (_a) {
                    if (name in this.instances_) {
                    }
                    else {
                        if (name in this.manifest_) {
                            manifestItem = this.manifest_[name];
                            if (manifestItem.type) {
                                type = manifestItem.type;
                                dependencyMappings = manifestItem.deps;
                            }
                            else {
                                type = name;
                                dependencyMappings = manifestItem;
                            }
                        }
                        else {
                            type = name;
                            dependencyMappings = this.manifest_[name];
                        }
                        config = this.pluginConfigs_[name] || this.pluginConfigs_[type] || {};
                        config.type = type;
                        this.instances_[name] = this.create_(type, config, dependencyMappings || {}, name);
                    }
                    return [2 /*return*/, this.instances_[name]];
                });
            });
        };
        Plugins.prototype.create_ = function (type, config, dependencyMappings, name) {
            return __awaiter(this, void 0, void 0, function () {
                var dependencyNames, theClass, dependencies, promiseDependencyInstances, i, dependencyName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dependencyNames = [];
                            return [4 /*yield*/, this.loadModule_(type)];
                        case 1:
                            theClass = _a.sent();
                            dependencies = Reflect.getMetadata('sc-plugin-dependency', theClass, void (0)) || [];
                            promiseDependencyInstances = [Promise.resolve(config)];
                            for (i = 1; i < dependencies.length; i++) {
                                dependencyName = dependencies[i];
                                dependencyName = dependencyMappings[dependencyName] || dependencyName;
                                dependencyNames.push(dependencyName);
                                promiseDependencyInstances.push(this.load_(dependencyName));
                            }
                            if (name === "urlLoader") {
                                name;
                            }
                            console.log("instances:" + name + "(" + type + "):");
                            dependencyNames.forEach(function (name) {
                                console.log('---' + name);
                            });
                            return [2 /*return*/, Promise.all(promiseDependencyInstances)
                                    .catch(function (error) {
                                    throw new PluginLoadError(type, dependencyMappings, error, "Load plugin failed.");
                                })
                                    .then(function (deps) {
                                    return new (theClass.bind.apply(theClass, [void 0].concat(deps)))();
                                })];
                    }
                });
            });
        };
        Plugins.prototype.loadModule_ = function (type) {
            var path = 'plugins/' + type + '/main';
            return new Promise(function (resolve, reject) {
                require([path], resolve, reject);
            }).then(function (m) {
                return m['default'];
            });
        };
        return Plugins;
    }());
    exports.Plugins = Plugins;
    function PluginLoadError(plugin, dependencies, inner, message) {
        this.name = 'PluginLoadError';
        this.message = message;
        this.plugin = plugin;
        this.dependencies = dependencies;
        this.inner = inner;
        this.stack = (new Error()).stack;
    }
    PluginLoadError.prototype = new Error();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Plugins;
});
