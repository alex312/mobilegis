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
define(["require", "exports", "bytebuffer", "../../../../../seecool/StaticLib"], function (require, exports, ByteBuffer, StaticLib_1) {
    "use strict";
    var ShipSignalApi = (function (_super) {
        __extends(ShipSignalApi, _super);
        function ShipSignalApi() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //GET signal?id={id}
        ShipSignalApi.prototype.Get_signal$id = function (id) {
            return this.get_signal$id1_(id);
        };
        ShipSignalApi.prototype.get_signal$id1_ = function (id) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', this.url + '?id=' + id, true);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function (e) {
                    if (this.status == 200) {
                        var buffer = new ByteBuffer(0, true, true);
                        buffer.append(this.response);
                        var msg = buffer.slice(0, buffer.offset); //.slice(offset, offset + size);
                        var data = StaticLib_1.scUnionProtoDataParser.decode(msg);
                        resolve({ state: 'apiok', data: data });
                    }
                    else {
                        reject({ state: 'apierr', data: data });
                    }
                };
                xhr.send();
            }.bind(this));
        };
        ShipSignalApi.prototype.get_signal$id2_ = function (id) {
            return this.baseApi({
                url: this.url + ("/signal?id=" + id),
                type: 'get'
            });
        };
        return ShipSignalApi;
    }(StaticLib_1.WebApi));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipSignalApi;
});
