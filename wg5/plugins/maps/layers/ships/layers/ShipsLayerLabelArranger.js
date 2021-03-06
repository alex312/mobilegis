define(["require", "exports", "../../../../../seecool/utilities", "../../../../../seecool/utilities"], function (require, exports, utilities_1, utilities_2) {
    "use strict";
    var ShipsLayerLabelArranger = (function () {
        function ShipsLayerLabelArranger(nearest, farthest, step) {
            this.occupy = function (pos, box) {
                var r = utilities_2.rect.create(pos.x + box.x, pos.y + box.y, box.width, box.height);
                this.boxes_.push(r);
            };
            this.arrange = function (pos, width, height) {
                var r = utilities_2.rect.create(0, 0, width, height);
                for (var dist = this.nearest_; dist <= this.farthest_; dist += this.step_) {
                    for (var a = Math.PI / 4; a < Math.PI * 2; a += Math.PI / 2) {
                        var dx = dist * Math.cos(a);
                        var dy = dist * Math.sin(a);
                        var cx = pos.x + dx;
                        var cy = pos.y + dy;
                        r.x = dx < 0 ? cx - width : cx;
                        r.y = cy - height / 2;
                        if (!this.isOverlap_(r)) {
                            this.boxes_.push(r);
                            return utilities_1.position.create(r.x - pos.x, r.y - pos.y);
                        }
                    }
                }
                return null;
            };
            this.isOverlap_ = function (box) {
                var boxes = this.boxes_;
                for (var i = 0; i < boxes.length; i++) {
                    if (this.isRectsOverlap_(boxes[i], box))
                        return true;
                }
                return false;
            };
            this.isRectsOverlap_ = function (box1, box2) {
                var right1 = box1.x + box1.width;
                var right2 = box2.x + box2.width;
                var bottom1 = box1.y + box1.height;
                var bottom2 = box2.y + box2.height;
                return box1.x < right2
                    && right1 > box2.x
                    && box1.y < bottom2
                    && bottom1 > box2.y;
            };
            this.nearest_ = nearest;
            this.farthest_ = farthest;
            this.step_ = step;
            this.boxes_ = [];
        }
        return ShipsLayerLabelArranger;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipsLayerLabelArranger;
});
