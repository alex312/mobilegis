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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "jquery", "knockout", "./utilities", "./geom/utils", "text!./ships.proto", "protobufjs", "./utils/JSTool", "./utils/MapTool", "./utils/Design", "./datas/ShipFeature"], function (require, exports, $, ko, utilities, utils, proto, ProtoBuf, JSTool_1, MapTool_1, Design_1, ShipFeature_1) {
    "use strict";
    exports.scUnionProtoDataParser = ProtoBuf.loadProto(proto).build()["ScUnion"];
    //类型转换集合
    var Convert = (function () {
        function Convert() {
            this.convertList = {};
        }
        Convert.prototype.this = function (A, B, a) {
            return this.convertList[A + B](a);
        };
        Convert.prototype.add = function (A, B, fun) {
            this.convertList[A + B] = fun;
        };
        return Convert;
    }());
    exports.Convert = Convert;
    //WebApi访问的基本形式
    //命名采用$分隔参数部分参数之间使用_分隔
    //路径使用_分隔Get_XX
    var WebApi = (function () {
        function WebApi(url) {
            this.url = url;
        }
        WebApi.prototype.baseApi = function (ajax) {
            return new Promise(function (resolve, reject) {
                $.ajax(ajax)
                    .done(function (data) {
                    resolve({ state: 'apiok', data: data });
                }.bind(this))
                    .fail(function (data) {
                    reject({ state: 'apierr', data: data });
                }.bind(this));
            }.bind(this));
        };
        WebApi.prototype.Http = function (options) {
            options.url = this.url + '/' + options.url;
            return this.baseApi(options);
        };
        //GET api/PlotInfo
        WebApi.prototype.Get = function () {
            return this.baseApi({
                url: this.url,
                type: 'get'
            });
        };
        //GET api/PlotInfo/{id}
        WebApi.prototype.Get$id = function (id) {
            return this.baseApi({
                url: this.url,
                type: 'get',
                data: { id: id }
            });
        };
        //PUT api/PlotInfo/{id}
        WebApi.prototype.Put$id = function (id, data) {
            return this.baseApi({
                url: this.url + '/' + id,
                type: 'put',
                data: data
            });
        };
        //POST api/PlotInfo
        WebApi.prototype.Post = function (data) {
            return this.baseApi({
                url: this.url,
                type: 'post',
                data: data
            });
        };
        //DELETE api/PlotInfo/{id}
        WebApi.prototype.Delete$id = function (id) {
            return this.baseApi({
                url: this.url + '/' + id,
                type: 'delete'
            });
        };
        return WebApi;
    }());
    exports.WebApi = WebApi;
    var template = "\n<div style=\"display:inline-block\">\n    <button class=\"btn btn-sm btn-default btn-white btn-round bigger dropdown-toggle\" data-toggle=\"dropdown\">\n        <!--ko text:view--><!--/ko-->\n        <i class=\"ace-icon fa fa-chevron-down icon-on-right\"></i>\n    </button>\n    <ul id=\"mainMenu\" data-bind=\"foreach:list\" class=\"dropdown-menu dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close\">\n        <li><a data-bind=\"click:click\"><span data-bind=\"text:view\"></span></a></li>\n    </ul>\n</div>\n";
    //var r=kendo.format(template,"你好",2,3,4);
    //DropMemuButton 返回一个列表Button
    //var button=DropMemuButton({
    //    name:"test",
    //    view:"测试",
    //    list:[
    //        {name:"test1",view:"测试1",event:{click:function(){alert("测试1")}}},
    //        {name:"test2",view:"测试2",event:function(){alert("测试2")}},
    //        {name:"test3",view:"测试3",event:{}},
    //        {name:"test3",view:"测试3"}
    //        //{name:"test1",label:"测试1",event:{},style:{}}
    //    ],
    //});
    function DropMemuButton(option) {
        var r;
        var $template = $(template);
        var list = option.list.map(function (v) {
            if (v.event instanceof Function) {
                return {
                    name: v.name,
                    view: v.view,
                    click: v.event
                };
            }
            else {
                return {
                    name: v.name,
                    view: v.view,
                    click: v.event.click
                };
            }
        });
        var module = {};
        for (var i in option) {
            module[i] = option[i];
        }
        module.list = list;
        ko.applyBindings(module, $template[0]);
        //var temp;
        //$template.find("[temp]").map(function(v){
        //    var n=$(v).attr("temp");
        //    if(!(n in temp)){temp[n]=v}
        //})
        return $template;
    }
    exports.DropMemuButton = DropMemuButton;
    function CheckButton(option) {
        var rtn = $("\n    <span>\n        <label class=\"float-xs-right inline\">\n            <small class=\"muted\" data-bind=\"text:view\"></small>\n            <input data-bind=\"checked:checked\" type=\"checkbox\" class=\"ace ace-switch ace-switch-5\">\n            <span data-bind=\"click:click\" class=\"lbl middle\"></span>\n        </label>\n    </span>\n    ");
        ko.applyBindings(option, rtn[0]);
        return rtn;
    }
    exports.CheckButton = CheckButton;
    function CheckBox(option) {
        //var rtn=$(`
        //<div class="">
        //    <label>
        //        <input data-bind="click:click,checked:checked" name="form-field-checkbox" type="checkbox" class="">
        //        <span data-bind="text:view" class=""> choice 1</span>
        //    </label>
        //</div>
        //`);
        var rtn = $("\n    <div class=\"checkbox\">\n        <div>\n            <input data-bind=\"checked:checked\" name=\"form-field-checkbox\" type=\"checkbox\">\n            <label data-bind=\"click:click,text:view\" class=\"lbl\"> choice 1</label>\n        </div>\n    </div>\n    ");
        ko.applyBindings(option, rtn[0]);
        return rtn;
    }
    exports.CheckBox = CheckBox;
    var Point = (function () {
        function Point() {
        }
        Point.prototype.point = function () {
            return this.anys;
        };
        return Point;
    }());
    // Anys 使用方法
    //var p=new Point();
    //anys(function(rs){
    //    var data
    //    $.ajax({
    //        url:"www.baidu.com",
    //        type:"get"
    //    }).done(function(data){
    //        rs(data);
    //    }).fail(function(data){
    //        rs({status:data.status,readyState:data.readyState,statusText:data.statusText,responseText:data.responseText});
    //    })
    //})
    //.then(function(rs,data){
    //    rs();
    //})
    //.point(p)
    //.then(function(rs){
    //    alert("1");
    //    rs()
    //})
    //
    //p.point()
    //.then(function(rs,data){
    //    alert("2");
    //    rs()
    //})
    var Anys = (function () {
        function Anys() {
            this.next_ = [];
        }
        Anys.prototype.turn_ = function (data) {
            new Promise(function (resolve, reject) {
                this.fun_(resolve, data);
            }.bind(this)).then(function (data) {
                for (var _i = 0, _a = this.next_; _i < _a.length; _i++) {
                    var anys = _a[_i];
                    anys.turn_(data);
                }
            }.bind(this));
        };
        Anys.prototype.then = function (fun) {
            var r = new Anys();
            r.fun_ = fun;
            this.next_.push(r);
            return r;
        };
        Anys.prototype.point = function (handler) {
            handler.anys = this;
            return this;
        };
        return Anys;
    }());
    function anys(fun) {
        var r = new Anys();
        r.fun_ = fun;
        r.turn_(undefined);
        return r;
    }
    exports.anys = anys;
    /**
     * 等待异步执行 一切函数皆可异步
     * @type {function((Thenable<T>|T)=): Promise<T>}
     * @example:
     *  await(fun())
     *  .then(function(){})
     */
    exports.await = Promise.resolve;
    //todo build时把CFG的内容提取到config文件中
    //提取配置 CFG\(\S*\,\S*\)
    var Config = (function () {
        function Config(datas) {
            if (datas)
                this.datas = datas;
            else
                this.datas = {};
        }
        Config.prototype.DefaultData = function (name, value) {
            var v;
            //if(name.includes(".")){ //}
            v = utilities.DC.GV(this.datas, name);
            if (v != undefined) {
                return v;
            } //this.datas[name]//this.datas[name];
            else {
                return utilities.DC.SV(this.datas, name, value);
            } //this.datas[name]=value;
        };
        Config.prototype.data = function (name, value) {
            if (value != undefined) {
                this.datas[name] = value;
            }
            return this.datas[name];
        };
        ;
        return Config;
    }());
    exports.Config = Config;
    var God = (function () {
        function God() {
            this.ms = {};
            this.fs = {};
            this.as = {
                'click': function (v) {
                    return v.click();
                }
            };
        }
        //目标注册,调用
        God.prototype.M = function (name, obj) {
            if (obj == undefined) {
                return this.ms[name];
            }
            else {
                this.ms[name] = obj;
            }
        };
        //函数注册,调用
        God.prototype.F = function (name, fun) {
            if (fun == undefined) {
                if (this.fs[name]) {
                    var c = this.fs[name].length > 0;
                    this.fs[name].map(function (v) {
                        c = c && (v[1] in this.as);
                        c = c && (v[0] in this.ms);
                    }.bind(this));
                    if (c) {
                        this.fs[name].map(function (v) {
                            this.as[v[1]](this.ms[v[0]]);
                        }.bind(this));
                    }
                }
            }
            else {
                this.fs[name] = fun;
            }
        };
        return God;
    }());
    exports.God = God;
    var BasePlugin = (function () {
        function BasePlugin() {
        }
        BasePlugin.prototype.Init = function (option) {
            this.ui = option.ui;
            this.logic = this.logicFactory();
            this.view = this.viewFactory(this.ui.Type);
            this.logic.Init(option);
            option.uiPlugin = this.ui;
            option.viewModel = this.logic.ViewModel;
            this.view.Init(option);
        };
        return BasePlugin;
    }());
    exports.BasePlugin = BasePlugin;
    var ViewField = (function () {
        function ViewField(option) {
            this.option = option;
            this.baseDom = $((option && option.baseDom) || '<div></div>');
            this.viewTemplate = (option && option.viewTemplate) || this.defaultViewTemplate();
            this.viewDom = (option && option.viewDom) || this.defaultViewDom();
            this.viewModel = (option && option.viewModel) || this.defaultViewModel();
        }
        Object.defineProperty(ViewField.prototype, "ViewDom", {
            get: function () {
                return this.viewDom[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewField.prototype, "ViewModelStruct", {
            get: function () {
                return JSON.stringify(this.defaultViewModel());
            },
            enumerable: true,
            configurable: true
        });
        ViewField.prototype.Updata = function () {
            this.updata();
        };
        return ViewField;
    }());
    exports.ViewField = ViewField;
    var KOViewField = (function (_super) {
        __extends(KOViewField, _super);
        function KOViewField(option) {
            var _this = _super.call(this, option) || this;
            _this.isBindFlag = false;
            _this.updata();
            return _this;
        }
        KOViewField.prototype.updata = function () {
            if (this.isBindFlag === false) {
                ko.applyBindings(this.viewModel, this.viewDom[0]);
            }
        };
        KOViewField.prototype.defaultViewDom = function () {
            $(this.viewTemplate).appendTo(this.baseDom);
            return this.baseDom;
        };
        return KOViewField;
    }(ViewField));
    exports.KOViewField = KOViewField;
    var DivViewField = (function (_super) {
        __extends(DivViewField, _super);
        function DivViewField() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DivViewField.prototype.defaultViewTemplate = function () {
            return undefined;
        };
        DivViewField.prototype.defaultViewModel = function () {
            return undefined;
        };
        return DivViewField;
    }(KOViewField));
    exports.DivViewField = DivViewField;
    function chartFactory(title, div, aa) {
        return new Highcharts.Chart({
            chart: {
                renderTo: div,
                backgroundColor: "",
                plotBorderWidth: null,
                plotShadow: false
            },
            credits: {
                enabled: false
            },
            exporting: {
                filename: encodeURIComponent(title),
                enabled: false //放出后打印取消后,map会白屏
            },
            title: {
                text: title
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.point.name + '</b>: ' + this.percentage.toFixed(2) + ' %';
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return '<b>' + this.point.name + '</b>: ' + this.point.y + ' 艘';
                        }
                    },
                    showInLegend: true
                }
            },
            series: [
                {
                    type: 'pie',
                    name: '',
                    data: aa
                }
            ]
        });
    }
    exports.chartFactory = chartFactory;
    function roseFactory(id, title, categories, series) {
        return new Highcharts.Chart({
            chart: {
                renderTo: id,
                polar: true,
                type: 'column',
                width: 700,
                height: 600,
            },
            exporting: {
                filename: encodeURIComponent(title),
                buttons: {
                    contextButton: {
                        menuItems: [{
                                text: '打印',
                                onclick: function () {
                                    this.print();
                                }
                            }, {
                                //     separator: true
                                // }, {
                                text: '下载 PNG 图片',
                                onclick: function () {
                                    this.exportChartLocal();
                                }
                            }, {
                                text: '下载 JPEG 图片',
                                onclick: function () {
                                    this.exportChartLocal({
                                        type: 'image/jpeg'
                                    });
                                }
                            }, {
                                text: '下载 SVG 矢量图',
                                onclick: function () {
                                    this.exportChartLocal({
                                        type: 'image/svg+xml'
                                    });
                                }
                            }
                        ]
                    }
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: title
            },
            // subtitle: {
            //     text: 'Source: or.water.usgs.gov'
            // },
            pane: {},
            legend: {
                align: 'right',
                verticalAlign: 'top',
                y: 100,
                layout: 'vertical',
            },
            xAxis: {
                tickmarkPlacement: 'on',
                categories: categories,
            },
            yAxis: {
                allowDecimals: false,
                min: 0,
                // lineWidth:1,
                endOnTick: false,
                showLastLabel: true,
                title: {
                    text: '任务数 (个)'
                },
                labels: {
                    formatter: function () {
                        return this.value + '个';
                    }
                },
                reversedStacks: false,
            },
            tooltip: {
                valueSuffix: '个'
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    shadow: false,
                }
            },
            series: series
        });
    }
    exports.roseFactory = roseFactory;
    var NS = new Design_1.Design.ScopeManager("");
    var t = NS.getV1Enum("RitsRuleType");
    var ritsRuleType = {};
    JSTool_1.JSTool.ArraysDo(t.Names, t.Values, t.Labels, function (n, v, l) {
        ritsRuleType[n] = ritsRuleType[v] = {
            Name: n,
            Value: v,
            Label: l
        };
    });
    exports.RitsRuleType = ritsRuleType;
    var t = NS.getV1Enum("ProcessState");
    var processState = {};
    JSTool_1.JSTool.ArraysDo(t.Names, t.Values, t.Labels, function (n, v, l) {
        processState[n] = processState[v] = {
            Name: n,
            Value: v,
            Label: l
        };
    });
    exports.ProcessState = processState;
    var ritsRuleTypeColo = {
        //0: ////"Speed_Duration_Region": "red",
        //1: //    //"Overtaking_Region",
        //2: //    //"Uturn_Region",
        //3: //    //"ShipDensity_Region",
        //4: //    //"Retrograde_Region",
        //5: //    //"Berth_Region",
        //6: //    //"Speed_SlowDown_Region",
        //7: //    //"Enter_Region",
        //8: //    //"Leave_Region",
        //9: //    //"CPA_Region",
        //10: //    //"In_Region",
        //11: //    //"CPA_Ship_Id",
        //12; //    //"DraggingAnchor_Ship_Id",
        //13: //    //"Speed_Duration_Ship_Id",
        14: "#ff7700",
        15: "#ff0000",
        16: "#aa0000",
        17: "#660000",
    };
    function RitsRuleTypeColor(name) {
        return ritsRuleTypeColo[name] || "#000000";
    }
    exports.RitsRuleTypeColor = RitsRuleTypeColor;
    //var matrix=[{
    //    Name:"ShapeType",
    //    Names:["Point","Line","PolyLine","Rectanlge","Circle","Polygon"],
    //    Values:[0,1,2,3,4,5],
    //    Labels:["点","直线","折线","矩形","圆","多边形"]
    //},{
    //    Name:"TrafficEnvType",
    //    Names:["Obstruction","Berth","Lane","LaneCenterLine","Anchorage","Reportingline","Jurisdiction","OnBoardArea","NavigateAssist","ShallowArea","PortArea","ShippingLine","RefPoint","Bridge","ShipGate","Harbor","Basin","RestrictedArea","ResponsibilityArea","AttentionArea","InWaterWorkArea","Cable","CoreProtectArea","FirstWarningArea","SecondWarningArea","ThirdWarningArea","SecondWarningContactArea"],
    //    Values:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]
    //}]
    //
    //var trafficEnvType={};
    //export var TrafficEnvType =JSTool.ArraysDo(t.Values,t.Names,function(i,n){
    //    trafficEnvType[i]={name:n};
    //})
    //{value:'solid',text:'────'},
    //{value:'dash',text:'-------'}
    var thhJSToolyle = {
        Infinity: { fillColor: "#000000", strokeColor: "#000000", strokeType: "solid", strokeThickness: "1" },
        //0: {fillColor:"",strokeColor:"",fillType:"",strokeType:""},
        //1:,
        //2:,
        //3:,
        //4:,
        //5:,
        //6:,
        //7:,
        //8:,
        //9:,
        //10:,
        //11:,
        //12:,
        //13:,
        //14:,
        //15:,
        //16:,
        17: { fillColor: "rgba(0,0,0,0.3)", strokeColor: "#0000aa", strokeType: "solid", strokeThickness: 1 },
        18: { fillColor: "#000000", strokeColor: "#0000ff", strokeType: "solid", StrokeThickness: 1 },
        19: { fillColor: "#000000", strokeColor: "#002200", strokeType: "solid", StrokeThickness: 1 },
        20: { fillColor: "#000000", strokeColor: "#006600", strokeType: "solid", StrokeThickness: 1 },
        21: { fillColor: "#000000", strokeColor: "#00aa00", strokeType: "solid", StrokeThickness: 1 },
        22: { fillColor: "rgba(0,0,0,0.1)", strokeColor: "#ff0000", strokeType: "solid", StrokeThickness: 1 },
        23: { fillColor: "rgba(0,0,0,0.1)", strokeColor: "#ff2200", strokeType: "solid", StrokeThickness: 1 },
        24: { fillColor: "rgba(0,0,0,0.1)", strokeColor: "#aa6600", strokeType: "solid", StrokeThickness: 1 },
        25: { fillColor: "rgba(0,0,0,0.1)", strokeColor: "#66aa00", strokeType: "solid", StrokeThickness: 1 },
        26: { fillColor: "rgba(0,0,0,0.1)", strokeColor: "#cc8800", strokeType: "solid", StrokeThickness: 1 }
    };
    function ThhJSToolyle(id) {
        return thhJSToolyle[id] || thhJSToolyle[Infinity];
    }
    exports.ThhJSToolyle = ThhJSToolyle;
    var trafficEnvStyle = {
        Infinity: {
            "TrafficEnvType": Infinity,
            "Stroke": "#FF000000",
            "Fill": null,
            "FillImage": null,
            "StrokeThickness": 1.0,
            "StrokeDashArray": "",
            "TextStyle": {
                "FontFamily": null,
                "FontSize": 12.0,
                "RotateAngle": 0.0,
                "Color": "#FF000000",
                "IsVisible": true,
                "IsBold": false,
                "IsItalic": false,
                "HasUnderLine": false,
                "Placement": 3
            },
            "VisibleScaleRate": 0.0
        }
    };
    function TrafficEnvStyle(id, style) {
        if (style) {
            trafficEnvStyle[id] = style;
        }
        return trafficEnvStyle[id] || trafficEnvStyle[Infinity];
    }
    exports.TrafficEnvStyle = TrafficEnvStyle;
    exports.legendShipType = {
        Names: ['PASSENGER', 'CARGO', 'TANKER', 'FISHING', 'GOVERNMENT', 'WORK', 'OTHER'],
        Labels: ['客船', '货船', '危险品船', '渔船', '公务船', '作业船', '其它'],
        Colors: ['#FFCC00', '#00CC00', '#FF3399', '#666666', '#0066CC', '#CC9933', '#999999'],
        LocalShipTypeCode: [6, 7, 8, 3, 55, 5, 100, 200, 300, 400, 500, 600, Infinity]
    };
    exports.ShipType = {
        Names: ['PASSENGER', 'CARGO', 'TANKER', 'FISHING', 'GOVERNMENT', 'WORK', 'VPASSENGER', 'VCARGO', 'VTANKER', 'VPROJSHIP', 'VWORKSHIP', 'VTUGBOAT', 'OTHER'],
        Labels: ['客船', '货船', '危险品船', '渔船', '公务船', '作业船', '客船', '货船', '危险品船', '作业船', '作业船', '作业船', '其它'],
        Colors: ['#FFCC00', '#00CC00', '#FF3399', '#666666', '#0066CC', '#CC9933', '#FFCC00', '#00CC00', '#FF3399', '#CC9933', '#CC9933', '#CC9933', '#999999'],
        LocalShipTypeCode: [6, 7, 8, 3, 55, 5, 100, 200, 300, 400, 500, 600, Infinity]
    };
    function getAisSimpleShipTypeLocalCode(code) {
        if (false) {
        }
        else if (code >= 30 && code <= 39) {
            return 3;
        }
        else if (code >= 60 && code <= 69) {
            return 6;
        }
        else if (code >= 70 && code <= 79) {
            return 7;
        }
        else if (code >= 80 && code <= 89) {
            return 8;
        }
        else if (code == 55) {
            return 55;
        }
        else if (code >= 50 && code <= 59) {
            return 5;
        }
        else {
            return Infinity;
        }
    }
    exports.getAisSimpleShipTypeLocalCode = getAisSimpleShipTypeLocalCode;
    function getShipTypeLocalCode(shipType, shipVType) {
        var b = Infinity;
        if (shipVType)
            b = getVShipTypeLocalCode(shipVType);
        else
            b = getAisSimpleShipTypeLocalCode(shipType);
        return b;
    }
    exports.getShipTypeLocalCode = getShipTypeLocalCode;
    function getShipTypeInfo(shipType, shipVType, what) {
        var LocalCode = getShipTypeLocalCode(shipType, shipVType) || Infinity;
        var typeCode_crossId2 = JSTool_1.JSTool.CrossId2(exports.ShipType.LocalShipTypeCode);
        var r = exports.ShipType[what][typeCode_crossId2.i[Infinity]];
        if (LocalCode in typeCode_crossId2.i)
            r = exports.ShipType[what][typeCode_crossId2.i[LocalCode]];
        return r;
        //if (code >= 30 && code <= 39) {
        //    return '渔船';
        //} else if (code >= 60 && code <= 69) {
        //    return '客船';
        //} else if (code >= 70 && code <= 79) {
        //    return '货船';
        //} else if (code >= 80 && code <= 89) {
        //    return '油船';
        //} else if (code == 55) {
        //    return '公务船';
        //} else if (code >= 50 && code <= 59) {
        //    return '作业船';
        //} else {
        //    return '其它';
        //}
    }
    exports.getShipTypeInfo = getShipTypeInfo;
    exports.AISShipTypeCode = {
        Name: "AISShipTypeCode",
        Values: [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 300, 301, 302, 303, 304, 305, 306, 307, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 500, 501, 502, 503, 504, 505, 506, 600, 601, 602, 900, 901, 902, 903, 904, 905, 906, 907, 908, 909, 910, 911, 912, 913, 914],
        Labels: ["客船类", "普通客船", "客货船", "客渡船", "车客渡船", "旅游客船", "高速客船", "客驳船", "滚装客船", "客箱船", "火车渡船（客）", "地效翼船", "普通货船类", "干货船", "杂货船", "散货船", "散装水泥运输船", "集装箱船", "滚装船", "多用途船", "木材船", "水产品运输船", "重大件运输船", "驳船", "汽车渡船", "挂桨机船", "冷藏船", "火车渡船", "矿/散/油船", "半潜船", "液货船类", "油船", "散装化学品船", "散装化学品船/油船", "液化气船", "散装沥青船", "油驳", "一般液货船", "工程船类", "工程船", "测量船", "采沙船", "挖泥船", "疏浚船", "打捞船", "打桩船", "起重船", "搅拌船", "布缆船", "钻井船", "打桩起重船", "吹泥船", "起重驳", "工作船类", "工作船", "破冰船", "航标船", "油污水处理船", "供给船", "垃圾处理船", "拖船类", "拖船", "推轮", "其它类", "交通艇", "引航船", "救助船", "浮船坞", "公务船", "摩托艇", "帆船", "趸船", "游艇", "特种用途船", "水上平台", "水下观光船", "科学调查船", "勘探船"],
    };
    function getVShipTypeLocalCode(code) {
        if (false) {
        }
        else if (code >= 100 && code <= 199) {
            return 100;
        }
        else if (code >= 200 && code <= 299) {
            return 200;
        }
        else if (code >= 300 && code <= 399) {
            return 300;
        }
        else if (code >= 400 && code <= 499) {
            return 400;
        }
        else if (code >= 500 && code <= 599) {
            return 500;
        }
        else if (code >= 600 && code <= 699) {
            return 600;
        }
        else {
            return Infinity;
        }
    }
    exports.getVShipTypeLocalCode = getVShipTypeLocalCode;
    //根据填充,边框画三角船 生成Icon
    function shipIconsGenerate(list) {
        var r = [];
        var canvas = document.createElement('canvas');
        canvas.width = 35;
        canvas.height = 35;
        var canvasCtx = canvas.getContext('2d');
        canvasCtx.translate(canvas.width / 2, canvas.height / 2);
        trianglePath(canvasCtx);
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var I = list_1[_i];
            canvasCtx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
            canvasCtx.fillStyle = I.fillColor;
            canvasCtx.fill();
            canvasCtx.strokeStyle = I.strokeColor;
            canvasCtx.stroke();
            r.push(canvas.toDataURL());
        }
        return r;
    }
    exports.shipIconsGenerate = shipIconsGenerate;
    function trianglePath0(canvasCtx) {
        var height = 7 * 0.039370 * 96;
        var op1x = height / 2;
        var op1y = 0;
        var op2x = -height / 2 * Math.sin(60 * Math.PI / 180);
        var op2y = height / 2 * Math.sin(30 * Math.PI / 180);
        var op3x = -height / 2 * Math.sin(60 * Math.PI / 180);
        var op3y = -height / 2 * Math.sin(30 * Math.PI / 180);
        canvasCtx.beginPath();
        canvasCtx.moveTo(op1x, op1y);
        canvasCtx.lineTo(op2x, op2y);
        canvasCtx.lineTo(op3x, op3y);
        canvasCtx.closePath();
    }
    exports.trianglePath0 = trianglePath0;
    function trianglePath(context) {
        context.moveTo(10, 0);
        context.lineTo(-9, 4);
        context.lineTo(-9, -4);
        context.closePath();
    }
    exports.trianglePath = trianglePath;
    //distinctPath(context,30,10)
    function distinctPath0(context, l, w) {
        var dl = l / 2, dw = w / 2, t = 5;
        context.moveTo(dl, 0);
        context.lineTo(dl - t, dw);
        context.lineTo(-dl + t, dw);
        context.lineTo(-dl, 0);
        context.lineTo(-dl + t, -dw);
        context.lineTo(dl - t, -dw);
        context.closePath();
    }
    exports.distinctPath0 = distinctPath0;
    function distinctPath(context, t, l, b, r) {
        var w = (l + r) / 2;
        var tl = (t + b) / 3;
        context.moveTo(t, l - w);
        context.lineTo(t - tl, -r);
        context.lineTo(-b + tl / 2, -r);
        context.lineTo(-b, -r + w / 2);
        context.lineTo(-b, l - w / 2);
        context.lineTo(-b + tl / 2, l);
        context.lineTo(t - tl, l);
        context.closePath();
    }
    exports.distinctPath = distinctPath;
    //var name;
    //var id;
    //name[id["A"]=1]="A"
    //id[name[1]="A"]=1;
    //switch (b){
    //    case 6:  //客船
    //        color = this.COLORS.BLUE;
    //        break;
    //    case 7:  //货船
    //        color = this.COLORS.ARPAT;
    //        break;
    //    case 8:  //油船
    //        color = this.COLORS.RED;
    //        break;
    //    case 3:  //渔船
    //        color = this.COLORS.GREEN;
    //        break;
    //    case 5:  //作业
    //        color = this.COLORS.PURPLE_RED;
    //        break;
    //    default:
    //        break;
    //}
    var trafficEnvImageSources = {
        0: 'resources/sprites/images/icon/icon_berth.png',
        1: 'resources/sprites/images/icon/icon_berth.png',
        2: 'resources/sprites/images/icon/icon_berth.png',
        3: 'resources/sprites/images/icon/icon_berth.png',
        4: 'resources/sprites/images/icon/icon_anchor.png',
        5: 'resources/sprites/images/icon/icon_berth.png',
        6: 'resources/sprites/images/icon/icon_berth.png',
        7: 'resources/sprites/images/icon/icon_berth.png',
        8: 'resources/sprites/images/icons/icon_light.png',
        9: 'resources/sprites/images/icon/icon_berth.png',
        10: 'resources/sprites/images/icon/icon_berth.png',
        11: 'resources/sprites/images/icon/icon_berth.png',
        12: 'resources/sprites/images/icon/icon_ais_aton.png',
        13: 'resources/sprites/images/icon/icon_berth.png',
        14: 'resources/sprites/images/icon/icon_berth.png',
        15: 'resources/sprites/images/icon/icon_berth.png',
        16: 'resources/sprites/images/icon/icon_berth.png',
        17: 'resources/sprites/images/icon/icon_berth.png',
        18: 'resources/sprites/images/icon/icon_berth.png',
        19: 'resources/sprites/images/icon/icon_berth.png',
        20: 'resources/sprites/images/icon/icon_berth.png',
        21: 'resources/sprites/images/icon/icon_berth.png',
        22: 'resources/sprites/images/icon/icon_berth.png',
        23: 'resources/sprites/images/icon/icon_berth.png',
        24: 'resources/sprites/images/icon/icon_berth.png',
        25: 'resources/sprites/images/icon/icon_berth.png',
        26: 'resources/sprites/images/icon/icon_berth.png',
        27: 'resources/sprites/images/icon/icon_berth.png',
        28: 'resources/sprites/images/icon/icon_berth.png',
    };
    function olStyleFromStyle(style, name, trafficEnvType) {
        style = style || new DrawingStyle();
        var fillColor = style.Fill ? MapTool_1.MapTool.olColorParseARGB(style.Fill) : null; //fillColor[3]
        fillColor = (fillColor && fillColor[3]) != 0 ? fillColor : null;
        var strokeColor = style.Stroke ? MapTool_1.MapTool.olColorParseARGB(style.Stroke) : "#000000";
        var strokeWidth = style.StrokeThickness ? parseInt(style.StrokeThickness) : 1;
        var lineDash = style.StrokeDashArray ? style.StrokeDashArray : '';
        lineDash = JSON.parse('[' + lineDash + ']');
        var font = 'arial';
        var textStyle = style.TextStyle || {};
        var textfill = textStyle.Color ? MapTool_1.MapTool.olColorParseARGB(textStyle.Color) : '#000000';
        var textStroke = '#000000';
        return new ol.style.Style({
            fill: fillColor ? new ol.style.Fill({ color: fillColor }) : null,
            stroke: new ol.style.Stroke({
                color: strokeColor,
                width: strokeWidth,
                lineDash: lineDash
            }),
            image: new ol.style.Icon({
                src: require.toUrl(trafficEnvImageSources[trafficEnvType]),
                anchor: [0.45, 0.48],
                size: [22, 22]
            }),
            //image: new ol.style.Circle({ //todo Style 的 Image未解析
            //    radius: 5,
            //    stroke: new ol.style.Stroke({color: [100, 255, 255, 1], width: 1}),
            //    fill: new ol.style.Fill({
            //        color: [100, 100, 10, 1]
            //    })
            //}),
            text: new ol.style.Text({
                textAlign: 'center',
                textBaseline: 'middle',
                font: font,
                text: name,
                fill: textfill ? new ol.style.Fill({ color: textfill }) : null,
                //stroke: new ol.style.Stroke({color: textStroke, width: 1}),
                offsetX: 0,
                offsetY: 15,
                rotation: 0
            })
        });
    }
    exports.olStyleFromStyle = olStyleFromStyle;
    function olGeomFromGeomatics(g) {
        var list = g.Points.map(function (v) {
            return ol.proj.fromLonLat(v);
        });
        var geom;
        if (g.ShapeType) {
            switch (g.ShapeType) {
                case 0:
                    geom = new ol.geom.Point(list[0]);
                    break;
                case 1:
                    geom = new ol.geom.LineString(list);
                    break;
                case 2:
                    geom = new ol.geom.LineString(list);
                    break;
                case 3:
                    geom = new ol.geom.Polygon([[list[0], [list[0][0], list[1][1]], list[1], [list[1][0], list[0][1]]]]); //([list]);
                    break;
                case 4:
                    geom = new ol.geom.Circle(list[0], Math.sqrt(utils.squaredDistance(list[0][0], list[0][1], list[1][0], list[1][1])));
                    break;
                case 5:
                    geom = new ol.geom.Polygon([list]);
                    break;
            }
        }
        else {
            if (list.length === 1) {
                geom = new ol.geom.Point(list[0]);
            }
            else {
                geom = new ol.geom.Polygon([list]);
            }
        }
        return geom;
    }
    exports.olGeomFromGeomatics = olGeomFromGeomatics;
    function BerthExportToLocation() {
        $.ajax({
            url: "api/berth",
            type: "get"
        })
            .done(function (data, state) {
            //attributes: "{"common.名称":"G1","berth.所属公司":"一公司","common.吨级":"50000","common.长度":"201"}"
            //fid: 2061
            //name: "G1"
            //shape: "Point,117.731999018113,38.9877716626353"
            //type: "BERTH"
            //uid: 2061
            //uname: "G1"
            var index = 0;
            var list = data.map(function (v) {
                var r = /(Point)\,([0-9,\.]*?)\,([0-9,\.]*?)$/g.exec(v.shape);
                var geom = '{"Points":["' + r[2] + ',' + r[3] + '"]}';
                var a = JSON.parse(v.attributes);
                var comm = "所属公司:" + a["berth.所属公司"] + "; 吨级:" + a["common.吨级"] + "; 长度:" + a["common.长度"];
                var loca = {
                    AliasName1: null,
                    AliasName2: null,
                    AttachmentGroupKey: null,
                    Comments: comm,
                    DrawingStyle: null,
                    FullName: v.name || "",
                    Geomatics: geom,
                    Id: 0,
                    Name: v.name || "",
                    OrganizationId: 0,
                    PortAreaId: 1,
                    TrafficEnvType: 1,
                };
                $.ajax({
                    url: "api/location",
                    type: "post",
                    data: loca
                })
                    .done(function (evt, data) {
                    console.log(index++);
                });
            });
        });
    }
    exports.BerthExportToLocation = BerthExportToLocation;
    var Geomatics = (function () {
        function Geomatics() {
        }
        return Geomatics;
    }());
    exports.Geomatics = Geomatics;
    var TextStyle = (function () {
        function TextStyle() {
        }
        return TextStyle;
    }());
    exports.TextStyle = TextStyle;
    var DrawingStyle = (function () {
        function DrawingStyle() {
        }
        return DrawingStyle;
    }());
    exports.DrawingStyle = DrawingStyle;
    var ShapeType;
    (function (ShapeType) {
        ShapeType[ShapeType["Point"] = 0] = "Point";
        ShapeType[ShapeType["Line"] = 1] = "Line";
        ShapeType[ShapeType["PolyLine"] = 2] = "PolyLine";
        ShapeType[ShapeType["Rectanlge"] = 3] = "Rectanlge";
        ShapeType[ShapeType["Circle"] = 4] = "Circle";
        ShapeType[ShapeType["Polygon"] = 5] = "Polygon";
    })(ShapeType = exports.ShapeType || (exports.ShapeType = {}));
    exports.ShapeTypeLabel = {
        Point: '点',
        Line: '直线',
        PolyLine: '折线',
        Rectanlge: '矩形',
        Circle: '圆',
        Polygon: '多边形'
    };
    var TrafficEnvType;
    (function (TrafficEnvType) {
        TrafficEnvType[TrafficEnvType["Obstruction"] = 0] = "Obstruction";
        TrafficEnvType[TrafficEnvType["Berth"] = 1] = "Berth";
        TrafficEnvType[TrafficEnvType["Lane"] = 2] = "Lane";
        TrafficEnvType[TrafficEnvType["LaneCenterLine"] = 3] = "LaneCenterLine";
        TrafficEnvType[TrafficEnvType["Anchorage"] = 4] = "Anchorage";
        TrafficEnvType[TrafficEnvType["Reportingline"] = 5] = "Reportingline";
        TrafficEnvType[TrafficEnvType["Jurisdiction"] = 6] = "Jurisdiction";
        TrafficEnvType[TrafficEnvType["OnBoardArea"] = 7] = "OnBoardArea";
        TrafficEnvType[TrafficEnvType["NavigateAssist"] = 8] = "NavigateAssist";
        TrafficEnvType[TrafficEnvType["ShallowArea"] = 9] = "ShallowArea";
        TrafficEnvType[TrafficEnvType["PortArea"] = 10] = "PortArea";
        TrafficEnvType[TrafficEnvType["ShippingLine"] = 11] = "ShippingLine";
        TrafficEnvType[TrafficEnvType["RefPoint"] = 12] = "RefPoint";
        TrafficEnvType[TrafficEnvType["Bridge"] = 13] = "Bridge";
        TrafficEnvType[TrafficEnvType["ShipGate"] = 14] = "ShipGate";
        TrafficEnvType[TrafficEnvType["Harbor"] = 15] = "Harbor";
        TrafficEnvType[TrafficEnvType["Basin"] = 16] = "Basin";
        TrafficEnvType[TrafficEnvType["RestrictedArea"] = 17] = "RestrictedArea";
        TrafficEnvType[TrafficEnvType["ResponsibilityArea"] = 18] = "ResponsibilityArea";
        TrafficEnvType[TrafficEnvType["AttentionArea"] = 19] = "AttentionArea";
        TrafficEnvType[TrafficEnvType["InWaterWorkArea"] = 20] = "InWaterWorkArea";
        TrafficEnvType[TrafficEnvType["Cable"] = 21] = "Cable";
        TrafficEnvType[TrafficEnvType["CoreProtectArea"] = 22] = "CoreProtectArea";
        TrafficEnvType[TrafficEnvType["FirstWarningArea"] = 23] = "FirstWarningArea";
        TrafficEnvType[TrafficEnvType["SecondWarningArea"] = 24] = "SecondWarningArea";
        TrafficEnvType[TrafficEnvType["ThirdWarningArea"] = 25] = "ThirdWarningArea";
        TrafficEnvType[TrafficEnvType["SecondWarningContactArea"] = 26] = "SecondWarningContactArea";
        TrafficEnvType[TrafficEnvType["zengbuqu"] = 27] = "zengbuqu";
        TrafficEnvType[TrafficEnvType["birangqu"] = 28] = "birangqu";
    })(TrafficEnvType = exports.TrafficEnvType || (exports.TrafficEnvType = {}));
    var TrafficEnvTypeLabel = (function () {
        function TrafficEnvTypeLabel() {
            this.Obstruction = '碍航物';
            this.Berth = '泊位';
            this.Lane = '航道';
            this.LaneCenterLine = '航道中心线';
            this.Anchorage = '锚地';
            this.Reportingline = 'VTS报告线';
            this.Jurisdiction = 'VTS管辖区';
            this.OnBoardArea = '引航员登船区';
            this.NavigateAssist = '航标'; //'助航设施';
            this.ShallowArea = '浅水区';
            this.PortArea = '港区';
            this.ShippingLine = '推荐航线';
            this.RefPoint = '参考点';
            this.Bridge = '桥梁';
            this.ShipGate = '船闸';
            this.Harbor = '港口';
            this.Basin = '港池';
            this.RestrictedArea = '限制区';
            this.ResponsibilityArea = '责任区';
            this.AttentionArea = '关注区域';
            this.InWaterWorkArea = '水工作业区';
            this.Cable = '海缆';
            this.CoreProtectArea = '核心保护区';
            this.FirstWarningArea = '一级预警区';
            this.SecondWarningArea = '二级预警区';
            this.ThirdWarningArea = '三级预警区';
            this.SecondWarningContactArea = '二级预警联络区';
            this.zengbuqu = '增补区';
            this.birangqu = '避让区';
        }
        return TrafficEnvTypeLabel;
    }());
    exports.TrafficEnvTypeLabel = TrafficEnvTypeLabel;
    var LocationLabel = (function () {
        function LocationLabel() {
            this.Id = "ID";
            this.TrafficEnvType = "类型";
            this.Name = "名称";
            this.PortAreaId = "港区";
            this.Geomatics = "空间信息";
            this.DrawingStyle = "样式";
            this.Comments = "备注";
            this.FullName = "全称";
            this.AliasName1 = "别名1";
            this.AliasName2 = "别名2";
            this.AttachmentGroupKey = "附件";
            this.OrganizationId = "组织结构Id";
        }
        return LocationLabel;
    }());
    exports.LocationLabel = LocationLabel;
    var PlotDataDTO = (function () {
        function PlotDataDTO() {
        }
        return PlotDataDTO;
    }());
    exports.PlotDataDTO = PlotDataDTO;
    var PlotData = (function () {
        function PlotData() {
        }
        return PlotData;
    }());
    exports.PlotData = PlotData;
    var ExtendFeature = (function (_super) {
        __extends(ExtendFeature, _super);
        function ExtendFeature() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ExtendFeature;
    }(ShipFeature_1.default));
    exports.ExtendFeature = ExtendFeature;
    var TaskDataDTO = (function () {
        function TaskDataDTO() {
        }
        return TaskDataDTO;
    }());
    exports.TaskDataDTO = TaskDataDTO;
    var TaskData = (function () {
        function TaskData() {
        }
        return TaskData;
    }());
    exports.TaskData = TaskData;
    var Member = (function () {
        function Member() {
        }
        return Member;
    }());
    exports.Member = Member;
    var Vehicle = (function () {
        function Vehicle() {
        }
        return Vehicle;
    }());
    exports.Vehicle = Vehicle;
    var Equipment = (function () {
        function Equipment() {
        }
        return Equipment;
    }());
    exports.Equipment = Equipment;
    var Department = (function () {
        function Department() {
        }
        return Department;
    }());
    exports.Department = Department;
    var SectionObserverDTO = (function () {
        function SectionObserverDTO() {
        }
        return SectionObserverDTO;
    }());
    exports.SectionObserverDTO = SectionObserverDTO;
    var SectionObserver = (function () {
        function SectionObserver() {
        }
        return SectionObserver;
    }());
    exports.SectionObserver = SectionObserver;
    /**
     * 关于key的命名规范
     * promise/ 形式,由提供方确定
     * api/ 形式,由config里的配置确定
     */
    var DataAspect = (function () {
        function DataAspect() {
            this.list_ = {};
        }
        DataAspect.prototype.tokey = function (key, args) {
            return '' + key + JSON.stringify(args);
        };
        DataAspect.prototype.updata = function (key, args) {
            return this.loadData_(key, args).then(function (data) {
                return data;
            });
        };
        DataAspect.prototype.getData = function (key, timenew_or_args, timenew, timeout) {
            return __awaiter(this, void 0, void 0, function () {
                var args, getStat;
                return __generator(this, function (_a) {
                    args = [];
                    if (typeof (timenew_or_args) == "number") {
                        timenew = timenew_or_args;
                        timeout = timenew;
                    }
                    else {
                        key = this.tokey(key, timenew_or_args);
                        args = timenew_or_args;
                    }
                    getStat = function (key, timenew) {
                        if (!(key in this.list_)) {
                            if (timeout === Infinity) {
                                return "wait";
                            }
                            else {
                                return "err";
                            }
                        }
                        if (this.list_[key].time) {
                            var time = this.list_[key].time;
                            if (!timenew) {
                                return "get";
                            }
                            else if ((time.getTime() + timenew) > (new Date()).getTime()) {
                                return "get";
                            }
                            else {
                                return "load";
                            }
                        }
                        return "load";
                    }.bind(this);
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            switch (getStat(key, timenew)) {
                                case "get":
                                    resolve(this.list_[key].value);
                                    break;
                                case "load":
                                    this.loadDataTimeout_(key, args, timeout || 1 * 60 * 1000)
                                        .then(function (data) {
                                        resolve(data);
                                    });
                                    break;
                                case "wait":
                                    this.initDataAspectItem_(key);
                                    this.list_[key].args = args;
                                    this.list_[key].wait.push(resolve);
                                    break;
                                case "err":
                                    reject("can't get the data,please set the dataFunction by setDataFunction");
                            }
                        }.bind(this))];
                });
            });
        };
        /**
         * @param key string(api/..|promise/..)
         */
        DataAspect.prototype.setDataFunction = function (key, dataFunction) {
            if (!(key in this.list_)) {
                this.initDataAspectItem_(key);
            }
            this.list_[key].dataFunction = dataFunction;
            if (this.list_[key].list.length > 0 || this.list_[key].wait.length > 0) {
                this.updata(key, this.list_[key].args);
            }
        };
        DataAspect.prototype.subscribeData = function (key, fun) {
            if (!(key in this.list_)) {
                this.initDataAspectItem_(key);
            }
            this.list_[key].list.push(fun);
            fun(this.list_[key].value);
        };
        DataAspect.prototype.unsubscribeData = function (key, fun) {
            if (!(key in this.list_))
                return;
            var list = this.list_[key].list;
            list.splice(list.indexOf(fun), 1);
        };
        DataAspect.prototype.loadDataTimeout_ = function (key, args, timeout) {
            var pf = this.loadData_(key, args);
            var pt = new Promise(function (resolve, reject) {
                setTimeout(function (data) {
                    resolve(this.list_[key].value);
                }.bind(this), timeout);
            }.bind(this));
            return Promise.race([pf, pt])
                .then(function (data) {
                return data;
            });
        };
        DataAspect.prototype.loadData_ = function (key, args) {
            var fun = this.list_[key].dataFunction;
            return new Promise(function (resolve, reject) {
                function done(data) {
                    resolve(data);
                }
                function fail(data) {
                    reject(data);
                }
                fun({ done: done, fail: fail }, args);
            }).then(function (data) {
                this.list_[key].value = data;
                this.list_[key].time = new Date();
                for (var i in this.list_[key].list) {
                    var f = this.list_[key].list[i];
                    f(data);
                }
                for (var i in this.list_[key].wait) {
                    var f = this.list_[key].wait[i];
                    f(data);
                }
                this.list_[key].wait.splice(0, this.list_[key].wait.length);
                return data;
            }.bind(this));
        };
        DataAspect.prototype.initDataAspectItem_ = function (key) {
            this.list_[key] = {
                value: undefined,
                args: undefined,
                list: [],
                wait: [],
                dataFunction: undefined,
                time: undefined
            };
        };
        return DataAspect;
    }());
    exports.AOP = { dataAspect: new DataAspect() };
    // export class fujianWaterWorkPointsDTO {
    //     public Coordinate: string;
    //     public PointName: string;
    //     public pId: number;
    //     public wId: number;
    // }
    var fujianWaterWorkWorkingShipsDTO = (function () {
        function fujianWaterWorkWorkingShipsDTO() {
        }
        return fujianWaterWorkWorkingShipsDTO;
    }());
    exports.fujianWaterWorkWorkingShipsDTO = fujianWaterWorkWorkingShipsDTO;
    var fujianWaterWorkRecordDTO = (function () {
        function fujianWaterWorkRecordDTO() {
        }
        return fujianWaterWorkRecordDTO;
    }());
    exports.fujianWaterWorkRecordDTO = fujianWaterWorkRecordDTO;
    var Coordinate = (function () {
        function Coordinate() {
        }
        return Coordinate;
    }());
    exports.Coordinate = Coordinate;
    // export class fujianWaterWorkPoints {
    //     public Coordinate: Coordinate[];
    //     public PointName: string;
    //     public pId: number;
    //     public wId: number;
    // }
    var fujianWaterWorkWorkingShips = (function () {
        function fujianWaterWorkWorkingShips() {
        }
        return fujianWaterWorkWorkingShips;
    }());
    exports.fujianWaterWorkWorkingShips = fujianWaterWorkWorkingShips;
    var fujianWaterWorkRecord = (function () {
        function fujianWaterWorkRecord() {
        }
        return fujianWaterWorkRecord;
    }());
    exports.fujianWaterWorkRecord = fujianWaterWorkRecord;
    //只用于ui展示用户
    function shipNameToString(ship) {
        return ship.v_name || ship.name || ship.mmsi || ship.id;
    }
    exports.shipNameToString = shipNameToString;
});
