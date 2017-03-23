import * as ol from "openlayers";

class ShipsTileDataSource extends ol.Observable{
    tileUrl_;
    versionUrl_;
    checkInterval_;
    xhr_;
    timer_;
    version_;

    constructor(option?){
        super();
        option = option || {};
        this.tileUrl_ = option.tileUrl || null;
        this.versionUrl_ = option.versionUrl || null;
        this.checkInterval_ = option.checkInterval || 1000 * 60;
        this.xhr_ = null;
        this.timer_ = null;
        this.version_ = null;

        if (this.tileUrl_ && this.versionUrl_ && this.checkInterval_){
            this.check_();
        }
    }
    getData = function () {
        return { url: this.tileUrl_, version: this.version_ };
    };

    dispose = function () {
        if (this.timer_) {
            window.clearTimeout(this.timer_);
            this.timer_ = null;
        }
        if (this.xhr_) {
            this.xhr_.abort();
            this.xhr_ = null;
        }
    };

    check_ = function () {
        this.xhr_ = new XMLHttpRequest();
        this.xhr_.open("get", this.versionUrl_, true);
        this.xhr_.onload = this.checkComplete_.bind(this, false);
        this.xhr_.onerror = this.checkComplete_.bind(this, true);
        this.xhr_.send();
    };

    checkComplete_ = function (failed, evt) {
        var xhr = evt.target;
        if (!failed && xhr.status === 200) {
            var version = JSON.parse(xhr.responseText);
            if (version !== this.version_) {
                this.version_ = version;
                this.changed();
            }
        }

        this.timer_ = window.setTimeout(this.check_.bind(this), this.checkInterval_);
    };
}
export default ShipsTileDataSource;
