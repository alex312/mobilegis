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
define(["require", "exports", "text!./htmls/Layout.html", "../../../seecool/plugins/Plugins", "../../../seecool/datas/EventSource", "css!./htmls/Layout.css"], function (require, exports, htmlLayout, Plugins_1, EventSource_1) {
    "use strict";
    var EmbededFrame = (function (_super) {
        __extends(EmbededFrame, _super);
        function EmbededFrame(config, user,
            // @inject("ui/menu")menu: IMainMenu,
            plugins, pageManager, urlLoader,
            // @inject("ui/defaultContainer")container,
            dom) {
            var _this = _super.call(this) || this;
            _this.items_ = {};
            _this.pageMap_ = {};
            _this.containers = {};
            _this.user_ = user;
            _this.config_ = config;
            _this.pageManager_ = pageManager;
            pageManager.pageFrame = _this;
            var layout = $(htmlLayout).appendTo(dom.domRoot);
            // this.items_['menu'] = $('<div></div>');//layout.find('.sc-layout-left-menu');
            // this.items_['info'] = $('<div></div>');//layout.find('.sc-layout-page-head');
            _this.items_['container'] = layout.find('.sc-layout-container');
            _this.items_['lightAlert'] = layout.find('.sc-layout-light-alert');
            //this.items_['map'] = layout.find('.sc-layout-container');
            _this.element_ = $('<div></div>')[0]; //frame.get("container");
            var temp = $("<div style=\"height:100px\">\n                <div class=\"map\"></div>\n                <div class=\"map-ui\"></div>\n            </div>");
            var layout = $(_this.element_)
                .append(temp.children())
                .addClass(temp[0].className);
            _this.items_['viewDom'] = layout;
            _this.items_['map'] = layout.find('.map');
            _this.items_['map-ui'] = layout.find('.map-ui');
            //this.items_['map'] = dom.domRoot;
            _this.registerPages([{
                parentName: null,
                name: "mobile",
                label: "mobile",
                callback: _this.menuClick_.bind(_this),
                style: { iconFont: "si-map", index: _this.config_.menuIndex },
                type: _this.config_.type,
                plugin: _this
            }]);
            return _this;
        }
        EmbededFrame.prototype.menuClick_ = function () {
            if (!this.isShow_) {
                this.isShow_ = true;
                this.showContainer('embededUIContainer', $(this.items_['viewDom']), { useMinHeight: true });
            }
            else {
                this.showContainer('embededUIContainer', undefined, { useMinHeight: true });
            }
            var v = $(this.items_['map']); //('[name="container_"]');
            var size = [v.width(), v.height()]; //[width,height];//
            this.trigger('containerSizeChange', size);
        };
        EmbededFrame.prototype.registerPages = function (list) {
            var _this = this;
            return list.map(function (v) {
                if (v.permission && !_this.user_.havePermission(v.permission))
                    return;
                var pageName = (v.parentName && v.parentName + "/" || '') + v.name;
                _this.pageMap_[pageName] = v;
            });
        };
        EmbededFrame.prototype.toPage = function (page, pagePlugin) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    //var mainP = pagePlugin;
                    //mainP.toPage(page);
                    if (this.pageMap_[page]) {
                        return [2 /*return*/, this.pageMap_[page].callback.apply(this.pageMap_[page].plugin)];
                    }
                    else {
                        return [2 /*return*/, Promise.reject("the function you required can't use")];
                    }
                    return [2 /*return*/];
                });
            });
        };
        EmbededFrame.prototype.showContainer = function (name, dom, option) {
            var t = this.items_['container'];
            //var t = $(this.items_['viewDom']);
            if (dom) {
                if (name in this.containers) {
                    this.containers[name].dom.detach();
                }
                this.containers[name] = { dom: dom, option: option };
                t.append(this.containers[name].dom);
            }
            for (var i in this.containers) {
                var I = this.containers[i].dom;
                I.addClass('hide');
            }
            if (name in this.containers) {
                this.containers[name].dom.removeClass('hide');
                var opt = this.containers[name].option;
                if (opt && opt.useMinHeight) {
                    t.addClass('use-min-height');
                }
                else {
                    t.removeClass('use-min-height');
                }
            }
        };
        EmbededFrame.prototype.destroy = function () {
        };
        EmbededFrame.prototype.get = function (name) {
            return this.items_[name][0] || null;
        };
        return EmbededFrame;
    }(EventSource_1.default));
    EmbededFrame = __decorate([
        __param(1, Plugins_1.inject("user/info")),
        __param(2, Plugins_1.inject("plugins")),
        __param(3, Plugins_1.inject("pageManager")),
        __param(4, Plugins_1.inject("urlLoader")),
        __param(5, Plugins_1.inject('root'))
    ], EmbededFrame);
    exports.EmbededFrame = EmbededFrame;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EmbededFrame;
});
