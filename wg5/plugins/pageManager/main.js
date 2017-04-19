var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
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
define(["require", "exports", "../../seecool/plugins/Plugins", "utils"], function (require, exports, Plugins_1, utils) {
    "use strict";
    var PageManagerPlugin = (function () {
        function PageManagerPlugin(config, plugins, root) {
            this.actions_ = {};
            this.config_ = config;
            this.plugins_ = plugins;
            this.root_ = root;
            this.pages_ = this.config_.pages || {};
            this.menu_ = [];
            for (var name in this.pages_) {
                var m = this.pages_[name];
                var action = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            this.toPage(name);
                            return [2 /*return*/];
                        });
                    });
                };
                this.menu_[name] = { name: name, label: m.label, action: action, style: m.style };
            }
            var hash = ''; //location.hash.replace(/^#/, '');
            this.toPage(hash);
            //this.initItems_();
            console.time("pageLoadTime");
        }
        Object.defineProperty(PageManagerPlugin.prototype, "menu", {
            get: function () {
                return this.menu_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageManagerPlugin.prototype, "pageFrame", {
            set: function (frame) {
                this.pageFrame_ = frame;
            },
            enumerable: true,
            configurable: true
        });
        PageManagerPlugin.prototype.pageLoading_ = function () {
            // if (!this.modeDiv_) {
            //     this.modeDiv_ = utils.modeDiv(undefined, undefined, 9999).data('modeDiv');
            // }
            // this.modeDiv_.show();
        };
        PageManagerPlugin.prototype.pageLoaded_ = function () {
            // if (this.modeDiv_) {
            //     this.modeDiv_.close();
            // }
        };
        PageManagerPlugin.prototype.rigisterAction = function (params) {
            this.actions_[params.name] = params;
        };
        //hash e.g. #index/x../x?x=...
        PageManagerPlugin.prototype.toPage = function (hash) {
            return __awaiter(this, void 0, void 0, function () {
                var parts, pageName, pageParamsStr, page, pagePlugins, dalayPlugins, mainP, parseQueryString, pageParams, mp, actions, _i, actions_1, action, mp;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            parts = /^([^?]*)(\?.*)?$/.exec(hash);
                            pageName = parts[1] || this.getDefault_();
                            pageParamsStr = parts[2] || "";
                            page = this.pages_[pageName];
                            if (!page)
                                throw new Error("Undefined page name '" + pageName + "'.");
                            if (!page.plugins)
                                throw new Error("Undefined page name '" + pageName + "'.");
                            if (!Array.isArray(page.plugins) || !page.plugins.length)
                                throw new Error("Invalid configuration for page '" + pageName + "'.");
                            pagePlugins = page.plugins;
                            dalayPlugins = page.delayPlugins;
                            this.pageLoading_(); //if (this.pageFrame_)this.pageFrame_.pageLoading();
                            return [4 /*yield*/, this.plugins_.load(pagePlugins)];
                        case 1:
                            _a.sent();
                            if (!page.mainPlugin)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.plugins_.load(page.mainPlugin)];
                        case 2:
                            mainP = _a.sent();
                            if (!this.pageFrame_) return [3 /*break*/, 9];
                            //location.hash = pageName + pageParamsStr;
                            //var pageParams = ( pageParamsStr || '?').substr(1).split('&');
                            this.pageFrame_.toPage(pageName, mainP);
                            parseQueryString = function (url) {
                                var reg_url = /^[^\?]+\?([\w\W]+)$/, reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g, arr_url = reg_url.exec(url), ret = {};
                                if (arr_url && arr_url[1]) {
                                    var str_para = arr_url[1], result;
                                    while ((result = reg_para.exec(str_para)) != null) {
                                        ret[result[1]] = result[2];
                                    }
                                }
                                return ret;
                            };
                            pageParams = {};
                            if (!(pageParams.action in this.config_.actions)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.plugins_.load(this.config_.actions[pageParams.action])];
                        case 3:
                            mp = _a.sent();
                            this.actions_[pageParams.action].callback.apply(mp, [pageParams]); //mp.urlAction
                            _a.label = 4;
                        case 4:
                            actions = [];
                            if (pageParams.actions) {
                                actions = JSON.parse(pageParams.actions);
                            }
                            _i = 0, actions_1 = actions;
                            _a.label = 5;
                        case 5:
                            if (!(_i < actions_1.length)) return [3 /*break*/, 8];
                            action = actions_1[_i];
                            if (!(action.action in this.config_.actions)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.plugins_.load(this.config_.actions[pageParams.action])];
                        case 6:
                            mp = _a.sent();
                            this.actions_[action.action].callback.apply(mp, [action]); //mp.urlAction
                            _a.label = 7;
                        case 7:
                            _i++;
                            return [3 /*break*/, 5];
                        case 8:
                            console.timeEnd("pageLoadTime");
                            _a.label = 9;
                        case 9:
                            this.pageLoaded_(); //if (this.pageFrame_)this.pageFrame_.pageLoaded();
                            this.delayLoad(dalayPlugins);
                            return [2 /*return*/];
                    }
                });
            });
        };
        PageManagerPlugin.prototype.delayLoad = function (dalayPlugins) {
            var _this = this;
            if (!dalayPlugins)
                return;
            var t = 1000;
            dalayPlugins.map(function (v) {
                var pluginType;
                if (typeof (v) == "object") {
                    t = t + v.dalayTime;
                    pluginType = v.plugin;
                }
                else if (typeof (v) == "string") {
                    pluginType = v;
                }
                setTimeout(function () {
                    _this.plugins_.load(pluginType);
                }, t);
            });
        };
        PageManagerPlugin.prototype.getDefault_ = function () {
            var r;
            for (var name in this.pages_) {
                var m = this.pages_[name];
                r = r || name;
                if (m.default) {
                    r = name;
                    break;
                }
            }
            return r;
        };
        return PageManagerPlugin;
    }());
    PageManagerPlugin = __decorate([
        __param(1, Plugins_1.inject("plugins")),
        __param(2, Plugins_1.inject("root"))
    ], PageManagerPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PageManagerPlugin;
});
