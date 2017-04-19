define(["require", "exports", "jquery", "fecha", "seecool/utilities"], function (require, exports, $, fecha, utilities) {
    "use strict";
    var AreaTrackLoader = (function () {
        function AreaTrackLoader(url, area, start, end, fnLoad, fnError, context, token) {
            this.url = url;
            this.start_ = start;
            this.end_ = end;
            this.area_ = area;
            this.current_ = start;
            this.points = {};
            this.undeterminedPoints_ = {};
            this.ajax_ = null;
            this.fnLoad_ = fnLoad || null;
            this.fnError_ = fnError || null;
            this.context_ = context || window;
            this.token_ = token;
        }
        ;
        AreaTrackLoader.prototype.load = function () {
            console.log("area track loader loading");
            if (this.ajax_)
                return;
            var queryEndTime = new Date(this.current_);
            queryEndTime.setMinutes(this.current_.getMinutes() + 60);
            var queryStartTime = this.current_;
            this.current_ = queryEndTime;
            if (queryEndTime > this.end_)
                queryEndTime = this.end_;
            //var url = "api/shiphistory/ShipRegion/ShipRegionRawQuery/Rectangle("+this.area_.join(",")+")/"+utilities.format(queryStartTime, 'yyyy-MM-dd HH:mm:ss')
            //    +"/" +utilities.format(queryEndTime, 'yyyy-MM-dd HH:mm:ss');
            var area = [this.area_[0], this.area_[2], this.area_[1], this.area_[3]];
            var url = this.url
                + "/ShipRegion/ShipRegionUnionQuery/Rectangle(" + area.join(",") + ")/"
                + fecha.format(queryStartTime, 'YYYY-MM-DD HH:mm:ss')
                + "/" + fecha.format(queryEndTime, 'YYYY-MM-DD HH:mm:ss');
            this.ajax_ = $.ajax({
                url: url,
                dataType: 'json',
                type: 'GET',
                context: this
            });
            this.ajax_.done(this.onLoadDone.bind(this));
            this.ajax_.fail(this.onLoadFail.bind(this));
        };
        ;
        AreaTrackLoader.prototype.mergeUndetermined = function (uid, pt) {
            var ret = [pt];
            var arr = this.undeterminedPoints_[uid];
            if (!arr)
                return ret;
            var last = pt;
            for (var i = arr.length - 1; i >= 0; i--) {
                var pti = arr[i];
                if (this.distance(pti, pt) < 0.0001) {
                    ret.unshift(pti);
                    last = pti;
                }
            }
            return ret;
        };
        ;
        AreaTrackLoader.prototype.onLoadDone = function (result) {
            //console.log(result);
            this.ajax_ = null;
            if (result && result.length > 0) {
                for (var j = 0; j < result.length; j++) {
                    if (!result[j].ShipTrackSignals)
                        continue;
                    if (!this.points[result[j].ShipID])
                        this.points[result[j].ShipID] = [];
                    for (var i = 0; i < result[j].ShipTrackSignals.length; i++) {
                        var pt = result[j].ShipTrackSignals[i];
                        var uid = pt.ID;
                        var arr = this.points[uid];
                        if (!arr) {
                            this.points[uid] = this.mergeUndetermined(uid, pt);
                        }
                        else if (arr.length == 0 || this.distance(arr[arr.length - 1], pt) < 0.1) {
                            arr.push(pt);
                        }
                        else {
                            var arr = this.undeterminedPoints_[uid];
                            if (!arr)
                                this.undeterminedPoints_[uid] = [pt];
                            else
                                arr.push(pt);
                        }
                    }
                }
            }
            utilities.notificationCenter.send('trackLoader/update', this.current_);
            if (this.current_ >= this.end_) {
                this.fireLoad(true);
            }
            else {
                this.fireLoad(false);
            }
        };
        ;
        AreaTrackLoader.prototype.distance = function (pt0, pt1) {
            var dt = pt0.Latitude - pt1.Latitude;
            var dn = pt0.Longitude - pt1.Longitude;
            return dt * dt + dn * dn;
        };
        ;
        AreaTrackLoader.prototype.onLoadFail = function (jqXHR, textStatus) {
            this.ajax_ = null;
            if (textStatus === 'abort')
                return;
            this.fireError();
        };
        ;
        AreaTrackLoader.prototype.destroy = function () {
            if (this.ajax_) {
                this.ajax_.abort();
                this.ajax_ = null;
            }
            this.points = [];
            this.start_ = this.current_ = this.end_ = new Date(0);
        };
        ;
        AreaTrackLoader.prototype.fireLoad = function (finish) {
            if (this.fnLoad_)
                this.fnLoad_.apply(this.context_, [finish]);
        };
        ;
        AreaTrackLoader.prototype.fireError = function () {
            if (this.fnError_)
                this.fnError_.apply(this.context_);
        };
        ;
        return AreaTrackLoader;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AreaTrackLoader;
});
