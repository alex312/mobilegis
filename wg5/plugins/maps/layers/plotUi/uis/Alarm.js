"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "jquery", "knockout"], function (require, exports, $, ko) {
    "use strict";

    var template = "\n<div class=\"modal fade\" role=\"dialog\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" data-bind=\"click:cancel_\" aria-label=\"Close\">\n                    <span aria-hidden=\"true\">&times;</span>\n                </button>\n                <h4 class=\"modal-title\" data-bind=\"title_\">\u63D0\u793A</h4>\n            </div>\n            <div class=\"modal-body\">\n                <div data-bind='text:message_'>\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-primary\" data-bind=\"click:ok_\">\u786E\u5B9A</button>\n                <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\" data-bind=\"click:cancel_\">\u53D6\u6D88</button>\n            </div>\n        </div>\n    </div>\n</div>\n";

    var Alarm = function () {
        function Alarm(options) {
            _classCallCheck(this, Alarm);

            this.template_ = template;
            this.viewDom_ = $(this.template_);
            this.title_ = options && options.title || '';
            this.message_ = options && options.message || '';
            this.viewDom_.modal({ keyboard: false, show: false });
            this.viewDom_.on('hidden.bs.modal', this.destroy.bind(this));
            this.viewDom_.on('shown.bs.modal', this.shown.bind(this));
            this.promise_ = new Promise(function (resolve, reject) {
                this.cancel_ = function () {
                    reject({ state: "cancel", data: null });
                    this.viewDom_.modal('hide');
                };
                this.ok_ = function () {
                    resolve({ state: "ok", data: null });
                    this.viewDom_.modal('hide');
                };
            }.bind(this));
            ko.applyBindings(this, this.viewDom_[0]);
        }

        _createClass(Alarm, [{
            key: "show",
            value: function show() {
                this.viewDom_.modal('show');
                return this.promise_;
            }
        }, {
            key: "destroy",
            value: function destroy() {
                this.viewDom_.remove();
            }
        }, {
            key: "shown",
            value: function shown() {
                var t = this.viewDom_.find("[data-dismiss='modal']");
                if (t.length == 0) t = this.viewDom_.find("button");
                t.focus();
            }
        }]);

        return Alarm;
    }();

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Alarm;
});