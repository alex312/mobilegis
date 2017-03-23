"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = undefined && undefined.__param || function (paramIndex, decorator) {
    return function (target, key) {
        decorator(target, key, paramIndex);
    };
};
define(["require", "exports", "jquery", "text!./Layout.html", "../../../../seecool/plugins/Plugins", "./Toolbar", "./SideView", "css!./Style.css", "css!./webgisUI.css"], function (require, exports, $, htmlTemplate, Plugins_1, Toolbar_1, SideView_1) {
    "use strict";

    var Frame = function () {
        function Frame(config, frame) {
            _classCallCheck(this, Frame);

            this.element_ = frame.get("map-ui");
            var element = $(htmlTemplate);
            element.children().appendTo(this.element_);
            $(this.element_).addClass(element[0].className);
            var toolbarLeft = $('.map-toolbar.map-toolbar-left', this.element_);
            var toolbarRight = $('.map-toolbar.map-toolbar-right', this.element_);
            this.toolbarLeft_ = new Toolbar_1.default(toolbarLeft[0]);
            this.toolbarRight_ = new Toolbar_1.default(toolbarRight[0]);
            var sideView = $('.map-side-view', this.element_);
            this.sideView_ = new SideView_1.default(sideView[0]);
            this.startConstraintMapUiElements_(this.element_);
        }

        _createClass(Frame, [{
            key: "destroy",
            value: function destroy() {
                this.stopConstraintMapUiElements_();
            }
        }, {
            key: "startConstraintMapUiElements_",
            value: function startConstraintMapUiElements_(mapUi) {
                var toolbarLeft = $('.map-toolbar.map-toolbar-left', this.element_);
                var toolbarRight = $('.map-toolbar.map-toolbar-right', this.element_);
                var sideView = $('.map-side-view', mapUi);
                window['toolbarLeft'] = toolbarLeft;
                window['toolbarRight'] = toolbarRight;
                window['sideView'] = sideView;
                this.layoutSpySideView_ = $('.map-side-view-layout-spy', mapUi)[0];
                this.layoutSideView_ = [0, 0, 0, 0];
                if (!this.layoutTimer_) this.layoutTimer_ = requestAnimationFrame(this.doRelayout_.bind(this));
            }
        }, {
            key: "stopConstraintMapUiElements_",
            value: function stopConstraintMapUiElements_() {
                if (this.layoutTimer_) cancelAnimationFrame(this.layoutTimer_);
            }
        }, {
            key: "doRelayout_",
            value: function doRelayout_() {
                this.layoutTimer_ = null;
                var element = this.layoutSpySideView_;
                var previous = this.layoutSideView_;
                var current = [element.offsetLeft, element.offsetTop, element.offsetWidth, element.offsetHeight];
                if (current[0] !== previous[0] || current[1] !== previous[1] || current[2] !== previous[2] || current[3] !== previous[3]) {
                    this.layoutSideView_ = current;
                    this.sideView_.syncLayout(current[0], current[1], current[2], current[3]);
                }
                this.layoutTimer_ = requestAnimationFrame(this.doRelayout_.bind(this));
            }
        }, {
            key: "sideView",
            get: function get() {
                return this.sideView_;
            }
        }, {
            key: "toolbars",
            get: function get() {
                return {
                    left: this.toolbarLeft_,
                    right: this.toolbarRight_
                };
            }
        }]);

        return Frame;
    }();

    Frame = __decorate([__param(1, Plugins_1.inject("maps/ui/iUiFrame"))], Frame);
    exports.Frame = Frame;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Frame;
});