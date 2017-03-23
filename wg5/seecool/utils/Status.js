"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports"], function (require, exports) {
    "use strict";

    var Status = function () {
        function Status(owner) {
            _classCallCheck(this, Status);

            this.status_ = "";
            this.owner_ = owner;
        }

        _createClass(Status, [{
            key: "ConditionTurn",
            value: function ConditionTurn(condition, newStatus) {
                if (typeof condition == "string") {
                    if (condition == this.status_) this.status_ = newStatus;
                } else {
                    if (condition) this.status_ = newStatus;
                }
                return this;
            }
        }, {
            key: "IfDo",
            value: function IfDo(status, callback) {
                if (status == this.status_) callback.bind(this.owner_)();
                return this;
            }
        }, {
            key: "IfTurnDo",
            value: function IfTurnDo(status, newStatus, callback) {
                if (status == this.status_) {
                    callback.bind(this.owner_)();
                    this.casestatus_ = newStatus;
                }
                return this;
            }
        }, {
            key: "Turned",
            value: function Turned() {
                this.status_ = this.casestatus_;
            }
        }, {
            key: "Status",
            get: function get() {
                return this.status_;
            }
        }]);

        return Status;
    }();

    exports.Status = Status;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Status;
});