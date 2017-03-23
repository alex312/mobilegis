"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports"], function (require, exports) {
    "use strict";

    var LabelRectManager = function () {
        function LabelRectManager() {
            _classCallCheck(this, LabelRectManager);

            this.rects = [];
        }

        _createClass(LabelRectManager, [{
            key: "tryPut",
            value: function tryPut(rect) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.rects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var R = _step.value;

                        if (!(R.left + R.width < rect.left || R.top + R.height < rect.top || R.left > rect.left + rect.width || R.top > rect.top + rect.height)) {
                            //if((Math.abs(R.left-rect.left)<R.width)&&(Math.abs(R.top-rect.top)<R.height)){
                            return false;
                        }
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

                this.rects.push(rect);
                return true;
            }
        }, {
            key: "clear",
            value: function clear() {
                this.rects = [];
            }
        }]);

        return LabelRectManager;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LabelRectManager;
});