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
define(["require", "exports", "../../../../../seecool/StaticLib"], function (require, exports, StaticLib_1) {
    "use strict";
    var BerthApi = (function (_super) {
        __extends(BerthApi, _super);
        function BerthApi() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //GET api/Berth/GetAllPiles
        BerthApi.prototype.Get_GetAllPiles = function () {
            return this.baseApi({
                url: this.url + "/GetAllPiles",
                type: 'get'
            });
        };
        return BerthApi;
    }(StaticLib_1.WebApi));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BerthApi;
});
