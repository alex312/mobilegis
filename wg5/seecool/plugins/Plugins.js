"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
define(["require", "exports"], function (require, exports) {
    "use strict";

    function inject(name) {
        return function (target, propertyKey, parameterIndex) {
            var dependencies = Reflect.getMetadata('sc-plugin-dependency', target, void 0);
            if (dependencies) dependencies[parameterIndex] = name;else {
                dependencies = [];
                dependencies[parameterIndex] = name;
                Reflect.defineMetadata('sc-plugin-dependency', dependencies, target, void 0);
            }
        };
    }
    exports.inject = inject;
    var plugins = new Map(); //存储 各个 plugin 的实例

    var Plugins = function () {
        function Plugins() {
            _classCallCheck(this, Plugins);
        }

        _createClass(Plugins, null, [{
            key: "add",
            value: function add(name, value) {
                plugins.set(name, Promise.resolve(value));
            }
        }, {
            key: "load",
            value: function load(list, configs) {
                return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                    var tlist, a, b, mappings, aliases, allPlugins;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    tlist = [];

                                    list.map(function (str) {
                                        var _parsePluginName = parsePluginName(str);

                                        var _parsePluginName2 = _slicedToArray(_parsePluginName, 2);

                                        a = _parsePluginName2[0];
                                        b = _parsePluginName2[1];

                                        var t = a.split(",");
                                        t.map(function (tstr) {
                                            tlist.push([tstr, b]);
                                        });
                                    });
                                    mappings = new Map(tlist);
                                    //var mappings = new Map<string, string>(list.map(parsePluginName));

                                    aliases = Array.from(mappings.keys());
                                    allPlugins = new Map();
                                    _context.next = 7;
                                    return this.collectRequiredPlugins_(mappings, allPlugins, aliases);

                                case 7:
                                    _context.next = 9;
                                    return this.createPlugins_(aliases, configs, mappings, allPlugins);

                                case 9:
                                    return _context.abrupt("return", _context.sent);

                                case 10:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));
            }
        }, {
            key: "createPlugins_",
            value: function createPlugins_(aliases, configs, mappings, allPlugins) {
                var _this = this;

                return Promise.all(aliases.map(function (alias) {
                    if (!alias) return Promise.resolve(null);
                    if (alias[alias.length - 1] === '?') alias = alias.substr(0, alias.length - 1);
                    if (plugins.has(alias)) return plugins.get(alias);
                    while (true) {
                        var type = mappings.has(alias) ? mappings.get(alias) : alias;
                        if (type == alias) {
                            break;
                        } else {
                            alias = type;
                            if (plugins.has(alias)) return plugins.get(alias);
                        }
                    }
                    var type = mappings.has(alias) ? mappings.get(alias) : alias;
                    if (!allPlugins.has(type)) return Promise.resolve(null);
                    var promise = allPlugins.get(type).then(function (cstr) {
                        if (!cstr) return Promise.resolve(null);
                        var dependencyAliases = Reflect.getMetadata('sc-plugin-dependency', cstr, void 0);
                        return _this.createPlugins_(dependencyAliases || [], configs, mappings, allPlugins).then(function (deps) {
                            deps[0] = configs && configs[alias] || {};
                            return new (Function.prototype.bind.apply(cstr, [null].concat(_toConsumableArray(deps))))();
                        });
                    });
                    plugins.set(alias, promise);
                    return promise;
                }));
            }
            /**
             * 加载aliases指定的Plugin ,参考mapping表,结果集在result中
             * @param mappings configMap
             * @param result result
             * @param aliases aliases List
             * @private
             */

        }, {
            key: "collectRequiredPlugins_",
            value: function collectRequiredPlugins_(mappings, result, aliases) {
                return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee2() {
                    var _this2 = this;

                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    _context2.next = 2;
                                    return Promise.all(aliases.map(function (alias) {
                                        if (!plugins.has(alias)) {
                                            var type = mappings.has(alias) ? mappings.get(alias) : alias;
                                            if (!result.has(type)) {
                                                result.set(type, _this2.loadPlugin_(type).then(function (_ref) {
                                                    var _ref2 = _slicedToArray(_ref, 2);

                                                    var cstr = _ref2[0];
                                                    var dependencyAliases = _ref2[1];

                                                    return _this2.collectRequiredPlugins_(mappings, result, dependencyAliases).then(function () {
                                                        return cstr;
                                                    });
                                                }));
                                            }
                                        }
                                    }));

                                case 2:
                                case "end":
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));
            }
            /**
             * loadPlugin by type(as path)
             * @param type
             * @returns {any|Array[]}
             * @private
             */

        }, {
            key: "loadPlugin_",
            value: function loadPlugin_(type) {
                return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee3() {
                    var esm, cstr, dependencyAliases, requiredDependencyAliases, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, n;

                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    _context3.next = 2;
                                    return importModule(mapTypeNameToModuleName(type));

                                case 2:
                                    esm = _context3.sent;
                                    cstr = esm['default'];
                                    dependencyAliases = Reflect.getMetadata('sc-plugin-dependency', cstr, void 0);
                                    requiredDependencyAliases = [];

                                    if (!dependencyAliases) {
                                        _context3.next = 26;
                                        break;
                                    }

                                    _iteratorNormalCompletion = true;
                                    _didIteratorError = false;
                                    _iteratorError = undefined;
                                    _context3.prev = 10;

                                    for (_iterator = dependencyAliases[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                        n = _step.value;

                                        if (n && n[n.length - 1] !== '?') requiredDependencyAliases.push(n);
                                    }
                                    _context3.next = 18;
                                    break;

                                case 14:
                                    _context3.prev = 14;
                                    _context3.t0 = _context3["catch"](10);
                                    _didIteratorError = true;
                                    _iteratorError = _context3.t0;

                                case 18:
                                    _context3.prev = 18;
                                    _context3.prev = 19;

                                    if (!_iteratorNormalCompletion && _iterator.return) {
                                        _iterator.return();
                                    }

                                case 21:
                                    _context3.prev = 21;

                                    if (!_didIteratorError) {
                                        _context3.next = 24;
                                        break;
                                    }

                                    throw _iteratorError;

                                case 24:
                                    return _context3.finish(21);

                                case 25:
                                    return _context3.finish(18);

                                case 26:
                                    return _context3.abrupt("return", [cstr, requiredDependencyAliases]);

                                case 27:
                                case "end":
                                    return _context3.stop();
                            }
                        }
                    }, _callee3, this, [[10, 14, 18, 26], [19,, 21, 25]]);
                }));
            }
        }]);

        return Plugins;
    }();

    exports.Plugins = Plugins;
    function mapTypeNameToModuleName(typeName) {
        return 'plugins/' + typeName + '/main';
    }
    function parsePluginName(name) {
        if (name.indexOf(":") > 0) return name.split(":");
        return [name, name];
    }
    function importModule(name) {
        return new Promise(function (resolve) {
            require([name], resolve);
        });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Plugins;
});