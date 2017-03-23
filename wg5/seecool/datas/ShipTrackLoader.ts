import * as fecha from "fecha"
import * as utilities from 'seecool/utilities';

class ShipTrackLoader {
    ships;
    start;
    end;
    current;
    points;
    undeterminedPoints;
    ajax;
    fnLoad;
    fnError;
    context;
    token;

    constructor(ships, start, end, fnLoad, fnError, context, token) {
        var encodedShips = [];
        for (var i = 0; i < ships.length; i++) {
            encodedShips[i] = ships[i].replace(/\-/g, '-0');
        }
        this.ships = encodedShips.join("-1");
        this.start = start;
        this.end = end;
        this.current = start;
        this.points = {};
        this.undeterminedPoints = {};
        this.ajax = null;
        this.fnLoad = fnLoad || null;
        this.fnError = fnError || null;
        this.context = context || window;
        this.token = token;
        this.load.bind(this);
    };

    load(start?, end?) {
        if (arguments.length > 0) {
            this.loadbytime.apply(this, Array.prototype.slice.call(arguments))
            return;
        }
        if (this.ajax)
            return;

        var queryEndTime = new Date(this.current);
        queryEndTime.setMinutes(this.current.getMinutes() + 60);
        var queryStartTime = this.current;
        this.current = queryEndTime;
        if (queryEndTime > this.end)
            queryEndTime = this.end;

        //var url = "/api/ShipTrack/ShipTrackRawQuery/";
        //var url = "api/shiphistory/ShipTrack/ShipTrackRawQuery/"+this.ships+"/"+utilities.format(queryStartTime, 'yyyy-MM-dd HH:mm:ss')+"/"+utilities.format(queryEndTime, 'yyyy-MM-dd HH:mm:ss');
        var url = "api/shiphistory/ShipTrack/ShipTrackUnionQuery/" + this.ships
            + "/" + fecha.format(queryStartTime, 'YYYY-MM-DD HH:mm:ss')
            + "/" + fecha.format(queryEndTime, 'YYYY-MM-DD HH:mm:ss');
        this.ajax = $.ajax({
            url: url,
            //data: {
            //    ShipIds: this.ships,
            //    StartTime: utilities.format(queryStartTime, 'yyyy-MM-dd HH:mm:ss'),
            //    EndTime: utilities.format(queryEndTime, 'yyyy-MM-dd HH:mm:ss')
            //},
            dataType: 'json',
            type: 'get',
            context: this
        });

        this.ajax.done(this.onLoadDone.bind(this));
        this.ajax.fail(this.onLoadFail.bind(this));
    };

    loadbytime(startTime, endTime) {
        if (this.ajax)
            return;

        var queryEndTime = endTime;
        var queryStartTime = startTime;
        this.current = queryEndTime;
        if (queryEndTime > this.end)
            queryEndTime = this.end;

        //var url = "/api/ShipTrack/ShipTrackRawQuery/";
        //var url = "api/shiphistory/ShipTrack/ShipTrackRawQuery/"+this.ships+"/"+utilities.format(queryStartTime, 'yyyy-MM-dd HH:mm:ss')+"/"+utilities.format(queryEndTime, 'yyyy-MM-dd HH:mm:ss');
        var url = "api/shiphistory/ShipTrack/ShipTrackUnionQuery/" + this.ships
            + "/" + fecha.format(queryStartTime, 'YYYY-MM-DD HH:mm:ss')
            + "/" + fecha.format(queryEndTime, 'YYYY-MM-DD HH:mm:ss');
        this.ajax = $.ajax({
            url: url,
            //data: {
            //    ShipIds: this.ships,
            //    StartTime: utilities.format(queryStartTime, 'yyyy-MM-dd HH:mm:ss'),
            //    EndTime: utilities.format(queryEndTime, 'yyyy-MM-dd HH:mm:ss')
            //},
            dataType: 'json',
            type: 'get',
            context: this
        });

        this.ajax.done(this.onLoadDone.bind(this));
        this.ajax.fail(this.onLoadFail.bind(this));
    };

    mergeUndetermined(uid, pt) {
        var ret = [pt];

        var arr = this.undeterminedPoints[uid];
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

    onLoadDone(result) {
        //console.log(result);
        this.ajax = null;
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
                    } else if (arr.length == 0 || this.distance(arr[arr.length - 1], pt) < 0.1) {
                        arr.push(pt);
                    } else {
                        var arr = this.undeterminedPoints[uid];
                        if (!arr)
                            this.undeterminedPoints[uid] = [pt];
                        else
                            arr.push(pt);
                    }
                }
            }
            //this.current = utilities.fromWcfJson(result.End);
            //utilities.notificationCenter.send('trackLoader/update', this.current);
        }
        utilities.notificationCenter.send('trackLoader/update', this.current);
        if (this.current >= this.end) {
            this.fireLoad(true);
        } else {
            this.fireLoad(false);
        }
    };

    distance(pt0, pt1) {
        var dt = pt0.Latitude - pt1.Latitude;
        var dn = pt0.Longitude - pt1.Longitude;
        return dt * dt + dn * dn;
    };

    onLoadFail(jqXHR, textStatus) {
        this.ajax = null;
        if (textStatus === 'abort')
            return;

        this.fireError();
    };

    destroy() {
        if (this.ajax) {
            this.ajax.abort();
            this.ajax = null;
        }
        this.points = [];
        this.start = this.current = this.end = new Date(0);
    };

    fireLoad(finish) {
        if (this.fnLoad) this.fnLoad.apply(this.context, [finish]);
    };

    fireError() {
        if (this.fnError) this.fnError.apply(this.context);
    };
}
export default ShipTrackLoader;
