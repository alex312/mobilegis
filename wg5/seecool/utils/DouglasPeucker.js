"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports"], function (require, exports) {
    "use strict";

    var DouglasPeucker = function () {
        function DouglasPeucker() {
            _classCallCheck(this, DouglasPeucker);

            this.medium_ = [];
        }

        _createClass(DouglasPeucker, [{
            key: "calcUseDistance",
            value: function calcUseDistance(originalPoints, threshold1, threshold2) {
                var length = originalPoints.length;
                if (length < 3) return originalPoints;
                this.medium_ = [];
                var start = 0,
                    end = 0,
                    mid = 0;
                for (end = 0; end < length; end++) {
                    var p = originalPoints[end];
                    this.medium_.push({
                        p: p,
                        flag: true
                    });
                    if (p.fixed) mid = end;
                }
                if (start < mid) this.douglasOptimizerUseDistance(this.medium_, start, mid, threshold1, threshold2);
                if (end > mid) this.douglasOptimizerUseDistance(this.medium_, mid, end - 1, threshold1, threshold2);
                var temp = [];
                for (var i = 0; i < length; i++) {
                    if (this.medium_[i].flag) {
                        temp.push(this.medium_[i].p);
                    }
                }
                return temp;
            }
        }, {
            key: "douglasOptimizerUseDistance",
            value: function douglasOptimizerUseDistance(medium_, start, last, threshold1, threshold2) {
                var pl = {};
                var plCount = 0;
                var lastPoint = medium_[last].p;
                for (var i = start + 1; i < last; i++) {
                    if (medium_[i].flag) {
                        pl[i] = this.distanceToLine(medium_[start].p, lastPoint, medium_[i].p);
                        plCount++;
                    }
                }
                if (plCount == 0) return;
                var middle = this.maxDistance(pl);
                if (middle.value.line < threshold1 && (middle.value.start < threshold2 || middle.value.end < threshold2)) {
                    for (var key in pl) {
                        medium_[key].flag = false;
                    }
                    return;
                }
                if (middle.key === null) return;
                this.douglasOptimizerUseDistance(medium_, start, middle.key, threshold1, threshold2);
                this.douglasOptimizerUseDistance(medium_, middle.key, last, threshold1, threshold2);
            }
        }, {
            key: "distanceToLine",
            value: function distanceToLine(startp, endp, outp) {
                var a, b, c, p, s;
                a = this.getDistanceFrom2Points(outp, startp);
                b = this.getDistanceFrom2Points(outp, endp);
                c = this.getDistanceFrom2Points(startp, endp);
                p = (a + b + c) / 2;
                s = Math.sqrt(p * (p - a) * (p - b) * (p - c));
                return { line: 2 * s / c, start: a, end: b };
            }
        }, {
            key: "getDistanceFrom2Points",
            value: function getDistanceFrom2Points(p1, p2) {
                var dx = p2.x - p1.x;
                var dy = p2.y - p1.y;
                return Math.sqrt(dx * dx + dy * dy);
            }
        }, {
            key: "maxDistance",
            value: function maxDistance(dic) {
                var result = { key: null, value: { line: -1, start: null, end: null } };
                for (var key in dic) {
                    var val = dic[key];
                    if (val.line > result.value.line) {
                        result.value = val;
                        result.key = parseInt(key);
                    }
                }
                return result;
            }
        }], [{
            key: "byDistance",
            value: function byDistance(originalPoints, threshold1, threshold2) {
                var instance = new DouglasPeucker();
                return instance.calcUseDistance(originalPoints, threshold1, threshold2);
            }
        }]);

        return DouglasPeucker;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DouglasPeucker;
});