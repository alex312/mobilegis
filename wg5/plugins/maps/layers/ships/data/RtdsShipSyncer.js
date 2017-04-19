define(["require", "exports", "long", "./exprs", "./rtds", "../../../../../seecool/StaticLib"], function (require, exports, Long, exprs_1, rtds_1, StaticLib_1) {
    "use strict";
    //var PBMessages = ProtoBuf.loadProto(<any>proto).build();
    var ShipSyncer = (function () {
        function ShipSyncer(options) {
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
            this.refilterTimer_ = window.setInterval(this.refilter_.bind(this), 1000);
            this.expireTimer_ = window.setInterval(this.expire_.bind(this), 10000);
        }
        ShipSyncer.prototype.destroy = function () {
            this.filters = null;
            window.clearTimeout(this.reconnectTimer_);
            if (this.client_) {
                this.client_.close();
                this.client_.on("close", this.reset_.bind(this));
            }
            else {
                this.reset_();
            }
            window.clearInterval(this.expireTimer_);
        };
        ShipSyncer.prototype.watch = function (id, initial) {
            var w = this.watchees_[id];
            if (!w) {
                w = this.watchees_[id] = { refs: 1, data: null };
                this.refilter_();
            }
            else {
                w.refs++;
            }
            if (initial && !(id in this.items_) && !w.data) {
                var d = convertItem(initial);
                w.data = this.local_.createItem("scunion", id, d);
                this.local_.add(w.data);
            }
        };
        ShipSyncer.prototype.unwatch = function (id) {
            var w = this.watchees_[id];
            if (w) {
                if (!--w.refs) {
                    if (w.data)
                        this.local_.remove(w.data);
                    delete this.watchees_[id];
                    this.refilter_();
                }
            }
        };
        Object.defineProperty(ShipSyncer.prototype, "filters", {
            get: function () {
                return this.filters_;
            },
            set: function (value) {
                if (this.filters_ !== value) {
                    if (this.filters_.un instanceof Function)
                        this.filters_.un('propertychange', this.$refilter$_);
                    this.filters_ = value || ShipSyncer.DefaultFilters_;
                    if (this.filters_.on instanceof Function)
                        this.filters_.on('propertychange', this.$refilter$_);
                    this.refilter_();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShipSyncer.prototype, "bounds", {
            get: function () {
                return this.bounds_;
            },
            set: function (value) {
                if (!areBoundsesEqual(this.bounds_, value)) {
                    this.bounds_ = value;
                    this.refilter_();
                }
            },
            enumerable: true,
            configurable: true
        });
        ShipSyncer.prototype.setFilt = function (name, values) {
            if (!values) {
                this.filters_[name] = null;
            }
            else {
                this.filters_[name] = values;
            }
            this.refilter_();
        };
        ShipSyncer.prototype.expire_ = function () {
            if (isFinite(this.appliedFilters_.ttl)) {
                for (var each in this.items_) {
                    var item = this.items_[each];
                    var now = new Date();
                    if (now.getTime() - item.dynamicTime.getTime() > this.appliedFilters_.ttl) {
                        //if (now.getTime() - item.dynamicTime.getTime() > item.timeout*1000) {
                        this.onClientDataItem_("remove", { Id: item.id });
                    }
                }
            }
        };
        ShipSyncer.prototype.refilter_ = function () {
            var thiz = this;
            if (this.refilterTimer_) {
                window.clearTimeout(this.refilterTimer_);
                this.refilterTimer_ = 0;
            }
            this.refilterTimer_ = window.setTimeout(function () {
                thiz.doRefilter_();
                thiz.refilterTimer_ = 0;
            }, 300);
        };
        ShipSyncer.prototype.doRefilter_ = function () {
            var watchees = Object.getOwnPropertyNames(this.watchees_);
            if (!areBoundsesEqual(this.appliedFilters_.bounds, this.bounds_)
                || !areSetEqual(this.appliedFilters_.watchees, watchees)
                || !areSetEqual(this.appliedFilters_.types, this.filters_.types)
                || !areSetEqual(this.appliedFilters_.v_types, this.filters_.v_types)
                || !areSetEqual(this.appliedFilters_.vesselTag, this.filters_.vesselTag)
                || !areSetEqual(this.appliedFilters_.signals, this.filters_.signals)
                || this.appliedFilters_.nationcat !== this.filters_.nationcat
                || areArrayEqual(this.appliedFilters_.sog, this.filters_.sog)
                || areArrayEqual(this.appliedFilters_.length, this.filters_.length)
                || this.appliedFilters_.ttl !== this.filters_.ttl) {
                this.appliedFilters_.bounds = this.bounds_ && this.bounds_.slice();
                this.appliedFilters_.watchees = watchees;
                this.appliedFilters_.types = this.filters_.types;
                this.appliedFilters_.v_types = this.filters_.v_types;
                this.appliedFilters_.vesselTag = this.filters_.vesselTag;
                this.appliedFilters_.signals = this.filters_.signals;
                this.appliedFilters_.nationcat = this.filters_.nationcat;
                this.appliedFilters_.sog = this.filters_.sog;
                this.appliedFilters_.length = this.filters_.length;
                this.appliedFilters_.ttl = this.filters_.ttl;
                if (this.client_)
                    this.client_.setFilter(this.createRtdsFilter_());
            }
        };
        ShipSyncer.prototype.connect_ = function () {
            this.client_ = new rtds_1.default.RtdsClient(this.remote_);
            this.client_.addParser("ScUnion", StaticLib_1.scUnionProtoDataParser); //PBMessages["ScUnion"]);
            this.client_.on("open", this.onClientOpen_.bind(this));
            this.client_.on("item", this.onClientDataItem_.bind(this));
            this.client_.on("close", this.onClientClose_.bind(this));
        };
        ShipSyncer.prototype.onClientDataItem_ = function (action, item) {
            // console.log("onClientDataItem_");
            var di, id = item.Id;
            if (action === "remove") {
                di = this.items_[id];
                delete this.items_[id];
                if (id in this.watchees_) {
                    this.watchees_[id].data = di;
                }
                else {
                    this.local_.remove(di);
                }
            }
            else if (action === "add") {
                var w = this.watchees_[id];
                di = w && w.data;
                if (di) {
                    w.data = null;
                    //  console.log("onClientDataItem_-move1");
                    di.move(convertItem(item), true);
                }
                else {
                    di = this.local_.createItem("scunion", id, convertItem(item));
                    this.local_.add(di);
                }
                this.items_[id] = di;
            }
            else if (action === "update") {
                di = this.items_[item.Id];
                if (!(di && di.move)) {
                    di = this.local_.createItem("scunion", id, convertItem(item));
                    this.local_.add(di);
                    this.items_[id] = di;
                }
                di.move(convertItem(item));
            }
        };
        ShipSyncer.prototype.onClientOpen_ = function () {
            this.reset_();
            this.doRefilter_();
        };
        ShipSyncer.prototype.onClientClose_ = function () {
            this.client_ = null;
        };
        ShipSyncer.prototype.onReconnectTimer_ = function () {
            if (!this.client_) {
                this.reconnectTimerCounter_++;
                if (this.reconnectTimerCounter_ > 10) {
                    this.reconnectTimerCounter_ = 0;
                    this.connect_();
                }
            }
        };
        ShipSyncer.prototype.reset_ = function () {
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
        };
        ShipSyncer.prototype.createRtdsFilter_ = function () {
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
                unfiltered = new exprs_1.default.Function("||", bounds, watchees);
            if (unfiltered === false)
                return exprs_1.default.Constant.bool(false);
            var types = createShipCargoTypesExpression(this.appliedFilters_.types);
            var v_types = createV_ShipCargoTypesExpression(this.appliedFilters_.v_types);
            var vesselTag = createVesselTagExpression(this.appliedFilters_.vesselTag);
            var signals = createSignalTypesExpression(this.appliedFilters_.signals);
            var sog = createSogExpression(this.appliedFilters_.sog);
            var length = createLengthExpression(this.appliedFilters_.length);
            var nationcat = createNationCategoryExpression(this.appliedFilters_.nationcat);
            var ttl = createTtlExpression(this.appliedFilters_.ttl);
            var f = [types, v_types, vesselTag, signals, sog, length, nationcat, ttl].reduce(function (prev, current) {
                if (prev === false || current === false)
                    return false;
                if (prev === null)
                    return current;
                if (current === null)
                    return prev;
                return new exprs_1.default.Function("&&", prev, current);
            });
            if (f === false)
                return exprs_1.default.Constant.bool(false);
            var all = (f === null) ? unfiltered : new exprs_1.default.Function("&&", unfiltered, f);
            return new exprs_1.default.Scope("ScUnion", all, exprs_1.default.Constant.bool(false));
        };
        return ShipSyncer;
    }());
    ShipSyncer.DefaultFilters_ = {
        bounds: null,
        watchees: [],
        types: null,
        v_types: null,
        vesselTag: null,
        signals: null,
        nationcat: null,
        sog: null,
        length: null,
        ttl: Infinity
    };
    function createTtlExpression(msTtl) {
        if (!isFinite(msTtl))
            return null;
        if (msTtl <= 0)
            return false;
        var f = new exprs_1.default.Field("DynamicTime");
        var c = exprs_1.default.Constant.duration(msTtl);
        var now = new exprs_1.default.Function("now()");
        var diff = new exprs_1.default.Function("-", now, f);
        return new exprs_1.default.Function("<", diff, c);
    }
    function createLonLatRangeExpression(bounds) {
        if (!bounds)
            return null;
        var minLonValue = exprs_1.default.Constant.double(bounds[0]);
        var maxLonValue = exprs_1.default.Constant.double(bounds[2]);
        var minLatValue = exprs_1.default.Constant.double(bounds[1]);
        var maxLatValue = exprs_1.default.Constant.double(bounds[3]);
        var fLon = new exprs_1.default.Field("Longitude");
        var fLat = new exprs_1.default.Field("Latitude");
        var minLon = new exprs_1.default.Function(">=", fLon, minLonValue);
        var maxLon = new exprs_1.default.Function("<=", fLon, maxLonValue);
        var minLat = new exprs_1.default.Function(">=", fLat, minLatValue);
        var maxLat = new exprs_1.default.Function("<=", fLat, maxLatValue);
        var rangLon = new exprs_1.default.Function("&&", minLon, maxLon);
        var rangLat = new exprs_1.default.Function("&&", minLat, maxLat);
        return new exprs_1.default.Function("&&", rangLon, rangLat);
    }
    function createWatcheesExpression(watchees) {
        if (!watchees)
            return null;
        var expr = null;
        var fieldId = new exprs_1.default.Field("Id");
        for (var i = 0; i < watchees.length; i++) {
            var c = exprs_1.default.Constant.string(watchees[i]);
            var t = new exprs_1.default.Function("==", fieldId, c);
            expr = expr ? new exprs_1.default.Function("||", expr, t) : t;
        }
        return expr;
    }
    function createShipCargoTypesExpression(types) {
        if (!types)
            return null;
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
    function createV_ShipCargoTypesExpression(v_types) {
        if (!v_types)
            return null;
        var ranges = [];
        for (var i = 0; i < v_types.length; i++) {
            var mapped = mapV_ShipCargoTypes(v_types[i]);
            if (mapped)
                ranges.push.apply(ranges, mapped);
        }
        if (!ranges.length)
            return false;
        ranges = optimizeRanges(ranges);
        return createRangesExpression(ranges, "V_ShipCargoType", "int");
    }
    function createVesselTagExpression(vesselTag) {
        if (!vesselTag)
            return null;
        var expr = null;
        var fieldId = new exprs_1.default.Field("VesselTag");
        for (var i = 0; i < vesselTag.length; i++) {
            var c = exprs_1.default.Constant.int(vesselTag[i]);
            var t = new exprs_1.default.Function("&", fieldId, c);
            var t = new exprs_1.default.Function("==", t, c);
            expr = expr ? new exprs_1.default.Function("||", expr, t) : t;
        }
        return expr;
    }
    function createSignalTypesExpression(signals) {
        if (!signals)
            return null;
        if (!signals.length)
            return false;
        var expr = null;
        var field = new exprs_1.default.Field("Origins");
        for (var i = 0; i < signals.length; i++) {
            var c = expr.Constant.string(signals[i] + ".");
            var t = new exprs_1.default.Function("istring_array_is_any_start_with()", field, c);
            expr = expr ? new exprs_1.default.Function("||", expr, t) : expr;
        }
        return expr;
    }
    function createNationCategoryExpression(nation) {
        var n = mapNationCategory(nation);
        if (n === null)
            return null;
        if (n === -1)
            return false;
        var cat = new exprs_1.default.Function("mmsi_nation_category()", new exprs_1.default.Field("MMSI"));
        return new exprs_1.default.Function("==", cat, exprs_1.default.Constant.int(n));
    }
    function createSogExpression(sog) {
        if (!sog)
            return null;
        return createRangesExpression([sog], "SOG", "float");
    }
    function createLengthExpression(length) {
        if (!length)
            return null;
        return createRangesExpression([length], "V_Length", "float");
    }
    function mapShipCargoTypes(name) {
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
    function mapV_ShipCargoTypes(name) {
        switch (name) {
            case 'vpassenger':
                return [[100, 200]];
            case 'vcargo':
                return [[200, 300]];
            case 'vtanker':
                return [[300, 400]];
            case 'vprojship':
                return [[400, 500]];
            case 'vworkship':
                return [[500, 600]];
            case 'vtugboat':
                return [[600, 700]];
            case 'other':
                return [[-Infinity, 100], [600, Infinity]];
            default:
                return [];
        }
    }
    function mapNationCategory(n) {
        if (!n)
            return null;
        if (n === "domestic")
            return 1;
        if (n === "international")
            return 2;
        if (n === "unknown")
            return 0;
        return -1;
    }
    function createRangesExpression(ranges, field, type) {
        if (ranges === null)
            return null;
        if (!ranges.length)
            return false;
        var const_constructor = exprs_1.default.Constant[type];
        var f = new exprs_1.default.Field(field);
        var exprRanges = [];
        for (var i = 0; i < ranges.length; i++) {
            var r = ranges[i];
            var minmax = [];
            if (r[0] !== -Infinity) {
                minmax.push(new exprs_1.default.Function(">=", f, const_constructor(r[0])));
            }
            if (r[1] !== Infinity)
                minmax.push(new exprs_1.default.Function("<", f, const_constructor(r[1])));
            if (minmax.length === 2)
                exprRanges.push(new exprs_1.default.Function("&&", minmax[0], minmax[1]));
            else if (minmax.length === 1)
                exprRanges.push(minmax[0]);
        }
        if (!exprRanges.length)
            return null;
        return exprRanges.reduce(function (previous, current) {
            return new exprs_1.default.Function("||", previous, current);
        });
    }
    function optimizeRanges(ranges) {
        var ret = [];
        for (var i = 0; i < ranges.length; i++)
            addRangeToRanges(ranges[i], ret);
        return ret;
    }
    function addRangeToRanges(r, ranges) {
        var i = 0;
        while (i < ranges.length) {
            var m = mergeRanges(r, ranges[i]);
            if (m === -1) {
                break;
            }
            else if (m === 1) {
                i++;
            }
            else {
                ranges.splice(i, 1);
                r = m;
            }
        }
        ranges.splice(i, 0, r);
    }
    function mergeRanges(a, b) {
        if (a[1] < b[0])
            return -1;
        if (a[0] > b[1])
            return 1;
        return [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
    }
    function areArrayEqual(a, b) {
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
    function areSetEqual(a, b) {
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
    function areBoundsesEqual(a, b) {
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
            vesselGroup: item.VesselGroups,
            vesselTag: item.VesselTag,
            timeout: item.Timeout
        };
        if (!isNaN(ret.dynamicTime.getTime()))
            ret.time = ret.dynamicTime;
        else if (!isNaN(ret.staticTime.getTime()))
            ret.time = ret.staticTime;
        return ret;
    }
    exports.convertItem = convertItem;
    function convertDimensions(length, width, prow, larboard) {
        if (length && width)
            return [
                prow,
                length - prow,
                larboard,
                width - larboard
            ];
        return null;
    }
    function convertTime(t) {
        if (!t || t.isZero())
            return new Date(NaN);
        var epoch = Long.fromBits(0xf7b58000, 0x89f7ff5, false);
        var ms = t.subtract(epoch).div(10000).toNumber();
        return new Date(ms);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipSyncer;
});
