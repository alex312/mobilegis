import * as Long from "long";
import * as ByteBuffer from "bytebuffer";
import * as ProtoBuf from "protobufjs";

import exprs from "./exprs";
import rtds from "./rtds";
import ShipDataSource from "./ShipDataSource";
import * as proto from "text!./ships.proto";

var PBMessages = ProtoBuf.loadProto(<any>proto).build();

class ShipSyncer {
    private local_:ShipDataSource;
    private remote_:string;
    private items_:any;
    private bounds_:number[];
    private filters_:any;
    private watchees_:any;
    private appliedFilters_:any;

    private reconnectTimerCounter_:number;
    private reconnectTimer_:number;
    private $refilter$_:Function;
    private refilterTimer_:number;
    private expireTimer_:number;

    private static DefaultFilters_ = {
        bounds: null,
        watchees: [],
        types: null,
        signals: null,
        nationcat: null,
        sog: null,
        length: null,
        ttl: Infinity
    };

    private client_:any;

    constructor(options) {
        this.items_ = {};

        this.local_ = options.local;
        this.remote_ = options.remote
            || ("ws://" + /\/\/([^\/]+)\//.exec(document.URL)[1] + ":18899");

        this.bounds_ = null;
        this.watchees_ = {};
        this.filters_ = Object.create(ShipSyncer.DefaultFilters_);
        this.appliedFilters_ = Object.create(ShipSyncer.DefaultFilters_);
        if (isFinite(options.expires))
            this.filters_.ttl = options.expires;

        this.connect_();
        this.reconnectTimerCounter_ = 0;
        this.reconnectTimer_ = window.setInterval(this.onReconnectTimer_.bind(this), 1000);

        this.$refilter$_ = this.refilter_.bind(this);
        this.refilterTimer_ =window.setInterval(this.refilter_.bind(this), 1000);

        this.expireTimer_ = window.setInterval(this.expire_.bind(this), 10000);
    }

    destroy() {
        this.filters = null;
        window.clearTimeout(this.reconnectTimer_);
        if (this.client_) {
            this.client_.close();
            this.client_.on("close", this.reset_.bind(this));
        } else {
            this.reset_();
        }
        window.clearInterval(this.expireTimer_);
    }

    watch(id:string, initial?:any) {
        var w = this.watchees_[id];
        if (!w) {
            w = this.watchees_[id] = {refs: 1, data: null};
            this.refilter_();
        } else {
            w.refs++;
        }
        if (initial && !(id in this.items_) && !w.data) {
            var d = convertItem(initial);
            w.data = this.local_.createItem("scunion", id, d);
            this.local_.add(w.data);
        }
    }

    unwatch(id:string) {
        var w = this.watchees_[id];
        if (w) {
            if (!--w.refs) {
                if (w.data)
                    this.local_.remove(w.data);
                delete this.watchees_[id];
                this.refilter_();
            }
        }
    }

    get filters() {
        return this.filters_;
    }

    set filters(value) {
        if (this.filters_ !== value) {
            if (this.filters_.un instanceof Function)
                this.filters_.un('propertychange', this.$refilter$_);
            this.filters_ = value || ShipSyncer.DefaultFilters_;
            if (this.filters_.on instanceof Function)
                this.filters_.on('propertychange', this.$refilter$_);

            this.refilter_();
        }
    }


    get bounds():number[] {
        return this.bounds_;
    }

    set bounds(value:number[]) {

        if (!areBoundsesEqual(this.bounds_, value)) {
            this.bounds_ = value;
            this.refilter_();
        }
    }

    private expire_() {
        if (isFinite(this.appliedFilters_.ttl)) {
            for (var each in this.items_) {
                var item = this.items_[each];
                var now = new Date();
                if (now.getTime() - item.dynamicTime.getTime() > this.appliedFilters_.ttl) {
                //if (now.getTime() - item.dynamicTime.getTime() > item.timeout*1000) {
                    this.onClientDataItem_("remove", {Id: item.id});
                }
            }
        }
    }

    private refilter_() {

        var thiz = this;
        if (this.refilterTimer_) {
            window.clearTimeout(this.refilterTimer_);
            this.refilterTimer_ = 0;
        }
        this.refilterTimer_ = window.setTimeout(function () {
            thiz.doRefilter_();
            thiz.refilterTimer_ = 0;
        }, 300);
    }

    private doRefilter_() {
        var watchees = Object.getOwnPropertyNames(this.watchees_);
        if (!areBoundsesEqual(this.appliedFilters_.bounds, this.bounds_)
            || !areSetEqual(this.appliedFilters_.watchees, watchees)
            || !areSetEqual(this.appliedFilters_.types, this.filters_.types)
            || !areSetEqual(this.appliedFilters_.signals, this.filters_.signals)
            || this.appliedFilters_.nationcat !== this.filters_.nationcat
            || areArrayEqual(this.appliedFilters_.sog, this.filters_.sog)
            || areArrayEqual(this.appliedFilters_.length, this.filters_.length)
            || this.appliedFilters_.ttl !== this.filters_.ttl) {

            this.appliedFilters_.bounds = this.bounds_ && this.bounds_.slice();
            this.appliedFilters_.watchees = watchees;
            this.appliedFilters_.types = this.filters_.types;
            this.appliedFilters_.signals = this.filters_.signals;
            this.appliedFilters_.nationcat = this.filters_.nationcat;
            this.appliedFilters_.sog = this.filters_.sog;
            this.appliedFilters_.length = this.filters_.length;
            this.appliedFilters_.ttl = this.filters_.ttl;
            if (this.client_)
                this.client_.setFilter(this.createRtdsFilter_());
        }
    }

    private connect_() {
        this.client_ = new rtds.RtdsClient(this.remote_);
        this.client_.addParser("ScUnion", PBMessages["ScUnion"]);
        this.client_.on("open", this.onClientOpen_.bind(this));
        this.client_.on("item", this.onClientDataItem_.bind(this));
        this.client_.on("close", this.onClientClose_.bind(this));
    }

    private onClientDataItem_(action, item) {

       // console.log("onClientDataItem_");
        var di, id = item.Id;
        if (action === "remove") {
            di = this.items_[id];
            delete this.items_[id];
            if (id in this.watchees_) {
                this.watchees_[id].data = di;
            } else {
                this.local_.remove(di);
            }
        } else if (action === "add") {
            var w = this.watchees_[id];
            di = w && w.data;
            if (di) {
                w.data = null;
                //  console.log("onClientDataItem_-move1");
                di.move(convertItem(item), true);
            } else {
                di = this.local_.createItem("scunion", id, convertItem(item));
                this.local_.add(di);
            }
            this.items_[id] = di;
        } else if (action === "update") {
            di = this.items_[item.Id];
            if(!(di&&di.move)){ //update时可能船已经被前端移除了,强制添加进来
                di = this.local_.createItem("scunion", id, convertItem(item));
                this.local_.add(di);
                this.items_[id] = di;
            }
            di.move(convertItem(item));
        }

    }

    private onClientOpen_() {
        this.reset_();
        this.doRefilter_();

    }

    private onClientClose_() {
        this.client_ = null;
    }

    private onReconnectTimer_() {
        if (!this.client_) {
            this.reconnectTimerCounter_++;
            if (this.reconnectTimerCounter_ > 10) {
                this.reconnectTimerCounter_ = 0;
                this.connect_();
            }
        }
    }

    private reset_() {
        if (this.refilterTimer_) {
            window.clearTimeout(this.refilterTimer_);
            this.refilterTimer_ = 0;
        }
        var items = [];
        for (var each in this.items_) {
            if (!this.items_.hasOwnProperty(each))
                continue;

            items.push(this.items_[each]);
        }
        this.items_ = {};
        this.local_.remove(items);
    }

    private createRtdsFilter_():exprs.Expression {
        var bounds = createLonLatRangeExpression(this.appliedFilters_.bounds);
        var watchees = createWatcheesExpression(this.appliedFilters_.watchees);
        var unfiltered;
        if (!bounds && !watchees)
            unfiltered = false;
        else if (!bounds)
            unfiltered = watchees;
        else if (!watchees)
            unfiltered = bounds;
        else
            unfiltered = new exprs.Function("||", bounds, watchees);

        if (unfiltered === false)
            return exprs.Constant.bool(false);

        var types = createShipCargoTypesExpression(this.appliedFilters_.types);
        var signals = createSignalTypesExpression(this.appliedFilters_.signals);
        var sog = createSogExpression(this.appliedFilters_.sog);
        var length = createLengthExpression(this.appliedFilters_.length);
        var nationcat = createNationCategoryExpression(this.appliedFilters_.nationcat);
        var ttl = createTtlExpression(this.appliedFilters_.ttl);
        var f = [types, signals, sog, length, nationcat, ttl].reduce(function (prev, current) {
            if (prev === false || current === false)
                return false;
            if (prev === null) return current;
            if (current === null) return prev;

            return new exprs.Function("&&", <exprs.Expression>prev, <exprs.Expression>current);
        });
        if (f === false)
            return exprs.Constant.bool(false);

        var all = (f === null) ? unfiltered : new exprs.Function("&&", unfiltered, <exprs.Expression>f);
        return new exprs.Scope("ScUnion", all, exprs.Constant.bool(false));
    }
}

function createTtlExpression(msTtl:number):exprs.Expression|boolean {
    if (!isFinite(msTtl)) return null;
    if (msTtl <= 0) return false;
    var f = new exprs.Field("DynamicTime");
    var c = exprs.Constant.duration(msTtl);
    var now = new exprs.Function("now()");
    var diff = new exprs.Function("-", now, f);
    return new exprs.Function("<", diff, c);
}
function createLonLatRangeExpression(bounds:number[]):exprs.Expression {
    if (!bounds) return null;

    var minLonValue = exprs.Constant.double(bounds[0]);
    var maxLonValue = exprs.Constant.double(bounds[2]);
    var minLatValue = exprs.Constant.double(bounds[1]);
    var maxLatValue = exprs.Constant.double(bounds[3]);
    var fLon = new exprs.Field("Longitude");
    var fLat = new exprs.Field("Latitude");
    var minLon = new exprs.Function(">=", fLon, minLonValue);
    var maxLon = new exprs.Function("<=", fLon, maxLonValue);
    var minLat = new exprs.Function(">=", fLat, minLatValue);
    var maxLat = new exprs.Function("<=", fLat, maxLatValue);
    var rangLon = new exprs.Function("&&", minLon, maxLon);
    var rangLat = new exprs.Function("&&", minLat, maxLat);
    return new exprs.Function("&&", rangLon, rangLat);
}

function createWatcheesExpression(watchees:string[]):exprs.Expression {
    if (!watchees) return null;
    var expr = null;
    var fieldId = new exprs.Field("Id");
    for (var i = 0; i < watchees.length; i++) {
        var c = exprs.Constant.string(watchees[i]);
        var t = new exprs.Function("==", fieldId, c);
        expr = expr ? new exprs.Function("||", expr, t) : expr;
    }
    return expr;
}

function createShipCargoTypesExpression(types:string[]):exprs.Expression|boolean {
    if (!types) return null;

    var ranges = [];
    for (var i = 0; i < types.length; i++) {
        var mapped = mapShipCargoTypes(types[i]);
        if (mapped)
            ranges.push.apply(ranges, mapped);
    }
    if (!ranges.length)
        return false;

    ranges = optimizeRanges(ranges);
    return createRangesExpression(ranges, "ShipCargoType", "int");
}

function createSignalTypesExpression(signals?:string[]):exprs.Expression|boolean {
    if (!signals) return null;

    if (!signals.length) return false;
    var expr = null;
    var field = new exprs.Field("Origins");
    for (var i = 0; i < signals.length; i++) {
        var c = expr.Constant.string(signals[i] + ".");
        var t = new exprs.Function("istring_array_is_any_start_with()", field, c);
        expr = expr ? new exprs.Function("||", expr, t) : expr;
    }
    return expr;
}

function createNationCategoryExpression(nation:string):exprs.Expression|boolean {
    var n = mapNationCategory(nation);
    if (n === null)
        return null;
    if (n === -1)
        return false;

    var cat = new exprs.Function("mmsi_nation_category()", new exprs.Field("MMSI"));
    return new exprs.Function("==", cat, exprs.Constant.int(n));
}

function createSogExpression(sog:number):exprs.Expression|boolean {
    if (!sog)
        return null;
    return createRangesExpression([sog], "SOG", "float");
}

function createLengthExpression(length:number):exprs.Expression|boolean {
    if (!length)
        return null;
    return createRangesExpression([length], "V_Length", "float");
}

function mapShipCargoTypes(name:string):number[][] {
    switch (name) {
        case 'cargo':
            return [[70, 80]];
        case 'passenger':
            return [[60, 70]];
        case 'tanker':
            return [[80, 90]];
        case 'fishing':
            return [[30, 40]];
        case 'government':
            return [[55, 56]];
        case 'others':
            return [[-Infinity, 30], [40 - 55], [56 - 60], [90, Infinity]];
        default:
            return [];
    }
}

function mapNationCategory(n:string):number {
    if (!n) return null;
    if (n === "domestic") return 1;
    if (n === "international") return 2;
    if (n === "unknown") return 0;
    return -1;
}

function createRangesExpression(ranges, field, type):exprs.Expression|boolean {
    if (ranges === null)
        return null;
    if (!ranges.length)
        return false;
    var const_constructor = exprs.Constant[type];
    var f:exprs.Field = new exprs.Field(field);
    var exprRanges:exprs.Expression[] = [];
    for (var i = 0; i < ranges.length; i++) {
        var r = ranges[i];
        var minmax = [];
        if (r[0] !== -Infinity) {
            minmax.push(new exprs.Function(">=", f, const_constructor(r[0])));
        }

        if (r[1] !== Infinity)
            minmax.push(new exprs.Function("<", f, const_constructor(r[1])));
        if (minmax.length === 2)
            exprRanges.push(new exprs.Function("&&", minmax[0], minmax[1]));
        else if (minmax.length === 1)
            exprRanges.push(minmax[0]);
    }
    if (!exprRanges.length)
        return null;

    return exprRanges.reduce(function (previous, current) {
        return new exprs.Function("||", previous, current);
    });
}

function optimizeRanges(ranges:number[][]) {
    var ret = [];
    for (var i = 0; i < ranges.length; i++)
        addRangeToRanges(ranges[i], ret);
    return ret;
}

function addRangeToRanges(r:number[], ranges:number[][]):void {
    var i = 0;
    while (i < ranges.length) {
        var m = mergeRanges(r, ranges[i]);
        if (m === -1) {
            break;
        } else if (m === 1) {
            i++;
        } else {
            ranges.splice(i, 1);
            r = <number[]>m;
        }
    }
    ranges.splice(i, 0, r);
}

function mergeRanges(a:number[], b:number[]):number[]|number {
    if (a[1] < b[0])
        return -1;
    if (a[0] > b[1])
        return 1;
    return [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
}


function areArrayEqual(a:any[], b:any[]):boolean {
    a = a || null;
    b = b || null;
    if (a === b)
        return true;

    if (a === null || b === null || a.length !== b.length)
        return false;

    for (var i = 0; i < a.length; i++)
        if (a[i] !== b[i])
            return false;
    return true;
}

function areSetEqual(a:any[], b:any[]):boolean {
    a = a || null;
    b = b || null;
    if (a === b)
        return true;
    if (a === null || b === null || a.length !== b.length)
        return false;
    for (var i = 0; i < a.length; i++) {
        var ai = a[i], found = false;
        for (var j = 0; j < b.length; j++) {
            if (ai === b[j]) {
                found = true;
                break;
            }
        }
        if (!found)
            return false;
    }
    return true;
}

function areBoundsesEqual(a:number[], b:number[]):boolean {
    a = a || null;
    b = b || null;
    if (a === b)
        return true;
    if (!a || !b)
        return false;
    if (a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3])
        return true;
    return false;
}

function convertItem(item) {
    var ret = {
        id: item.Id,
        mmsi: item.MMSI,
        name: (item.Name || "").replace(/(^\s+)|(\s+$)/, ""),
        lon: item.Longitude,
        lat: item.Latitude,
        cog: item.COG,
        sog: item.SOG,
        heading: item.TrueHeading,
        rot: item.ROT,
        dimensions: convertDimensions(item.Length, item.Width, item.RefToProw, item.RefToLarboard),
        type: item.ShipCargoType,
        status: item.NavStatus,
        dynamicTime: convertTime(item.DynamicTime),
        staticTime: convertTime(item.StaticTime),
        callsign: item.CallSign,
        draught: item.Draught,
        imo: item.IMO,
        eta: item.ETA,
        destination: item.Destination,
        time: null,
        origins: item.Origins,

        v_name: (item.V_Name || "").replace(/(^\s+)|(\s+$)/, ""),
        v_type: item.V_ShipCargoType,
        v_length: item.V_Length,
        v_width: item.V_Width,
        timeout:item.Timeout
    };
    if (!isNaN(ret.dynamicTime.getTime()))
        ret.time = ret.dynamicTime;
    else if (!isNaN(ret.staticTime.getTime()))
        ret.time = ret.staticTime;
    return ret;
}

function convertDimensions(length:number, width:number, prow:number, larboard:number) {
    if (length && width)
        return [
            prow,
            length - prow,
            larboard,
            width - larboard
        ];
    return null;
}

function convertTime(t:Long) {
    if (!t || t.isZero())
        return new Date(NaN);
    var epoch = Long.fromBits(0xf7b58000, 0x89f7ff5, false);
    var ms = t.subtract(epoch).div(10000).toNumber();
    return new Date(ms);
}

export default ShipSyncer;
