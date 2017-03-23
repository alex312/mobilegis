"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "knockout", "text!./WindowView.html"], function (require, exports, ko, htmlTemplate) {
    "use strict";

    var WindowView = function () {
        function WindowView() {
            _classCallCheck(this, WindowView);

            this.fullSized_ = false;
            this.title = ko.observable(null);
            this.lastLayoutSize_ = [0, 0];
            this.element_ = $(htmlTemplate);
            this.items_ = [];
            this.head_ = this.element_.find('.head');
            this.body_ = this.element_.find('.body');
        }

        _createClass(WindowView, [{
            key: "get",
            value: function get(name) {
                return this.items_[name] || null;
            }
        }, {
            key: "onCommandClose_",
            value: function onCommandClose_() {
                this.doClose_();
            }
        }, {
            key: "doClose_",
            value: function doClose_() {
                this.navigationView.pop();
            }
        }, {
            key: "doLayout_",
            value: function doLayout_() {
                var _lastLayoutSize_ = _slicedToArray(this.lastLayoutSize_, 2);

                var width = _lastLayoutSize_[0];
                var height = _lastLayoutSize_[1];

                var ele = this.element_[0];
                var body = this.body_[0];
                ele.style.width = width + "px";
                ele.style.maxHeight = height + "px";
                ele.style.height = 'auto';
                body.style.height = 'auto';
                var diff = ele.scrollHeight - ele.offsetHeight;
                if (diff > 0) {
                    var bodyHeight = body.offsetHeight - diff;
                    body.style.height = Math.max(0, bodyHeight) + "px";
                } else if (this.fullSized_) {
                    diff = height - ele.offsetHeight;
                    var _bodyHeight = body.offsetHeight + diff;
                    body.style.height = Math.max(0, _bodyHeight) + "px";
                }
            }
        }, {
            key: "syncLayout",
            value: function syncLayout(left, top, width, height) {
                this.lastLayoutSize_ = [width, height];
                this.doLayout_();
            }
        }, {
            key: "attach",
            value: function attach(parent) {
                this.parent_ = parent;
                ko.applyBindings(this, this.element_[0]);
            }
        }, {
            key: "detach",
            value: function detach(parent) {
                ko.cleanNode(this.element_[0]);
                this.parent_ = null;
            }
        }, {
            key: "element",
            get: function get() {
                return this.element_[0];
            }
        }, {
            key: "navigationView",
            get: function get() {
                return this.parent_ && this.parent_.navigationView || null;
            }
        }]);

        return WindowView;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WindowView;
});