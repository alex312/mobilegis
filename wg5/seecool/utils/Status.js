define(["require", "exports"], function (require, exports) {
    "use strict";
    var Status = (function () {
        function Status(owner) {
            this.status_ = "";
            this.owner_ = owner;
        }
        Object.defineProperty(Status.prototype, "Status", {
            get: function () {
                return this.status_;
            },
            enumerable: true,
            configurable: true
        });
        Status.prototype.ConditionTurn = function (condition, newStatus) {
            if (typeof (condition) == "string") {
                if (condition == this.status_)
                    this.status_ = newStatus;
            }
            else {
                if (condition)
                    this.status_ = newStatus;
            }
            return this;
        };
        Status.prototype.IfDo = function (status, callback) {
            if (status == this.status_)
                callback.bind(this.owner_)();
            return this;
        };
        Status.prototype.IfTurnDo = function (status, newStatus, callback) {
            if (status == this.status_) {
                callback.bind(this.owner_)();
                this.casestatus_ = newStatus;
            }
            return this;
        };
        Status.prototype.Turned = function () {
            this.status_ = this.casestatus_;
        };
        return Status;
    }());
    exports.Status = Status;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Status;
});
