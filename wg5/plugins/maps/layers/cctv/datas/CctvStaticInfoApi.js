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
        //GET api/StaticInfo/CCTVDynamic?version={version}
        BerthApi.prototype.Get_CctvDynamic$version = function (version) {
            return this.baseApi({
                url: this.url + ("/CCTVDynamic?version=" + version),
                type: 'get'
            });
        };
        //GET api/StaticInfo/CCTVStatic?version={version}
        BerthApi.prototype.Get_CctvStatic$version = function (version) {
            return this.baseApi({
                url: this.url + ("/CCTVStatic?version=" + version),
                type: 'get'
            });
        };
        //GET api/StaticInfo/CCTVPosition?version={version}
        BerthApi.prototype.Get_CctvPosition$version = function (version) {
            return this.baseApi({
                url: this.url + ("/CCTVPosition?version=" + version),
                type: 'get'
            });
        };
        //GET api/StaticInfo/CCTVHierarchy.default?version={version}
        BerthApi.prototype.Get_CctvHierarchy$$default$version = function (version) {
            return this.baseApi({
                url: this.url + ("/CCTVHierarchy.default?version=" + version),
                type: 'get'
            });
        };
        return BerthApi;
    }(StaticLib_1.WebApi));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BerthApi;
});
