"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports"], function (require, exports) {
    "use strict";

    var SideView = function () {
        function SideView(element) {
            _classCallCheck(this, SideView);

            this.element_ = element;
            this.stack_ = [];
            this.layout_ = [0, 0, 0, 0];
        }

        _createClass(SideView, [{
            key: "open",
            value: function open(view) {
                while (this.stack_.length > 1) {
                    var _stack_$shift = this.stack_.shift();

                    var _stack_$shift2 = _slicedToArray(_stack_$shift, 1);

                    var v = _stack_$shift2[0];

                    v.detach(this);
                    this.element_.removeChild(v.element);
                }
                if (this.stack_.length) {
                    var _stack_$pop = this.stack_.pop();

                    var _stack_$pop2 = _slicedToArray(_stack_$pop, 1);

                    var cv = _stack_$pop2[0];

                    cv.element.style.transform = 'translate(-70%, 0)';
                    cv.element.style.opacity = '0';
                    cv.detach(this);
                    setTimeout(function () {
                        this.element_.removeChild(cv.element);
                    }, 300);
                }
                this.push(view);
            }
        }, {
            key: "push",
            value: function push(view) {
                if (this.stack_.length) {
                    var entry = this.stack_[this.stack_.length - 1];

                    var _entry = _slicedToArray(entry, 2);

                    var cv = _entry[0];
                    var mark = _entry[1];

                    cv.element.style.transform = 'translate(-70%, 0)';
                    cv.element.style.opacity = '0';
                    setTimeout(function () {
                        if (entry[1] == mark) cv.element.style.display = 'none';
                    }, 300);
                }
                view.element.classList.add('sc-view');
                view.element.style.transform = "translate(70%, 0)";
                this.element_.appendChild(view.element);
                view.attach(this);
                this.stack_.push([view, 0]);
                view.syncLayout(0, 0, this.layout_[2], this.layout_[3]);
                requestAnimationFrame(function () {
                    view.element.style.transform = "translate(0, 0)";
                    view.element.style.opacity = '1';
                });
            }
        }, {
            key: "pop",
            value: function pop() {
                var _this = this;

                var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

                if (n <= 0) n = this.stack_.length + n;
                if (n > this.stack_.length) throw new RangeError();
                var removing = this.stack_.splice(this.stack_.length - n, n);

                var _removing = _slicedToArray(removing[n - 1], 1);

                var tmv = _removing[0];

                tmv.element.style.display = 'block';
                requestAnimationFrame(function () {
                    tmv.element.style.transform = "translate(70%, 0)";
                    tmv.element.style.opacity = '0';
                });
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = removing[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _step$value = _slicedToArray(_step.value, 1);

                        var _v2 = _step$value[0];

                        _v2.detach(this);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                setTimeout(function () {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = removing[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var _step2$value = _slicedToArray(_step2.value, 1);

                            var _v = _step2$value[0];

                            _this.element_.removeChild(_v.element);
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }, 300);
                if (this.stack_.length) {
                    var entry = this.stack_[this.stack_.length - 1];

                    var _entry2 = _slicedToArray(entry, 1);

                    var v = _entry2[0];

                    v.element.style.display = 'block';
                    v.syncLayout(0, 0, this.layout_[2], this.layout_[3]);
                    requestAnimationFrame(function () {
                        v.element.style.transform = "translate(0, 0)";
                        v.element.style.opacity = '1';
                    });
                    entry[1]++;
                }
            }
        }, {
            key: "attach",
            value: function attach(view) {}
        }, {
            key: "detach",
            value: function detach(view) {}
        }, {
            key: "syncLayout",
            value: function syncLayout(left, top, width, height) {
                this.layout_ = [left, top, width, height];
                if (this.stack_.length) {
                    var _stack_ = _slicedToArray(this.stack_[this.stack_.length - 1], 1);

                    var v = _stack_[0];

                    v.syncLayout(0, 0, width, height);
                }
            }
        }, {
            key: "element",
            get: function get() {
                return this.element_;
            }
        }, {
            key: "navigationView",
            get: function get() {
                return this;
            }
        }]);

        return SideView;
    }();

    exports.SideView = SideView;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SideView;
});