import * as ko from "knockout";
import * as utilities from 'seecool/utilities';
import * as utils from 'seecool/geom/utils';
import {JSTool} from "seecool/utils/JSTool";
import {MapTool} from "seecool/utils/MapTool";
import {Design} from "seecool/utils/Design";
import {IWebApi} from "seecool/Interface";
import {IViewField} from "seecool/Interface";
import {IViewFieldConstructorOption} from "seecool/Interface";
import {IPlugin} from "seecool/Interface";
import {IViewCellList} from "./Interface";
import {IViewCell} from "./Interface";
import {IuiPlugin} from "./Interface";
import ShipFeature from "./datas/ShipFeature";

//类型转换集合
export class Convert {
    convertList: {[name: string]: Function;} = {};

    public this(A: string, B: string, a) {
        return this.convertList[A + B](a);
    }

    public add(A: string, B: string, fun: Function) {
        this.convertList[A + B] = fun;
    }
}

//WebApi访问的基本形式
//命名采用$分隔参数部分参数之间使用_分隔
//路径使用_分隔Get_XX
export class WebApi implements IWebApi {
    url;

    constructor(url) {
        this.url = url;
    }

    baseApi(ajax) {
        return new Promise(function (resolve, reject) {
            $.ajax(ajax)
                .done(function (data: any) {
                    resolve({state: 'apiok', data: data});
                }.bind(this))
                .fail(function (data: any) {
                    reject({state: 'apierr', data: data});
                }.bind(this))
        }.bind(this))
    }

    //GET api/PlotInfo
    public Get() {
        return this.baseApi({
            url: this.url,
            type: 'get'
        })
    }

    //GET api/PlotInfo/{id}
    public Get$id(id) {
        return this.baseApi({
            url: this.url,
            type: 'get',
            data: {id: id}
        })
    }

    //PUT api/PlotInfo/{id}
    public Put$id(id, data) {
        return this.baseApi({
            url: this.url + '/' + id,
            type: 'put',
            data: data
        })
    }

    //POST api/PlotInfo
    public Post(data) {
        return this.baseApi({
            url: this.url,
            type: 'post',
            data: data
        })
    }

    //DELETE api/PlotInfo/{id}
    public Delete$id(id) {
        return this.baseApi({
            url: this.url + '/' + id,
            type: 'delete'
        })
    }
}


var template = `
<div style="display:inline-block">
    <button class="btn btn-sm btn-default btn-white btn-round bigger dropdown-toggle" data-toggle="dropdown">
        <!--ko text:view--><!--/ko-->
        <i class="ace-icon fa fa-chevron-down icon-on-right"></i>
    </button>
    <ul id="mainMenu" data-bind="foreach:list" class="dropdown-menu dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close">
        <li><a data-bind="click:click"><span data-bind="text:view"></span></a></li>
    </ul>
</div>
`;
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
export function DropMemuButton(option: IViewCellList) {
    var r;
    var $template = $(template);
    var list = option.list.map(function (v: IViewCell) {
        if (v.event instanceof Function) {
            return {
                name: v.name,
                view: v.view,
                click: v.event
            }
        } else {
            return {
                name: v.name,
                view: v.view,
                click: v.event.click
            }
        }
    });
    var module: any = {}
    for (var i in option) {
        module[i] = option[i];
    }
    module.list = list;
    ko.applyBindings(module, $template[0])
    //var temp;
    //$template.find("[temp]").map(function(v){
    //    var n=$(v).attr("temp");
    //    if(!(n in temp)){temp[n]=v}
    //})
    return $template;
}


export function CheckButton(option) {
    var rtn = $(`
    <span>
        <label class="pull-left inline">
            <small class="muted" data-bind="text:view"></small>
            <input data-bind="checked:checked" type="checkbox" class="ace ace-switch ace-switch-5">
            <span data-bind="click:click" class="lbl middle"></span>
        </label>
    </span>
    `);
    ko.applyBindings(option, rtn[0]);
    return rtn;
}
export function CheckBox(option) {
    //var rtn=$(`
    //<div class="">
    //    <label>
    //        <input data-bind="click:click,checked:checked" name="form-field-checkbox" type="checkbox" class="">
    //        <span data-bind="text:view" class=""> choice 1</span>
    //    </label>
    //</div>
    //`);
    var rtn = $(`
    <div class="checkbox">
        <label>
            <input data-bind="checked:checked" name="form-field-checkbox" type="checkbox" class="ace">
            <span data-bind="click:click,text:view" class="lbl"> choice 1</span>
        </label>
    </div>
    `);
    ko.applyBindings(option, rtn[0]);
    return rtn;
}

class Point {
    anys;

    point() {
        return this.anys;
    }
}

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
class Anys {
    turn_(data) {
        new Promise(function (resolve, reject) {
            this.fun_(resolve, data);
        }.bind(this)).then(function (data) {
            for (var anys of this.next_) {
                anys.turn_(data);
            }
        }.bind(this))
    }

    fun_;
    next_: Array<Anys> = [];

    then(fun: Function) {
        var r = new Anys();
        r.fun_ = fun;
        this.next_.push(r);
        return r;
    }

    point(handler) {
        handler.anys = this;
        return this;
    }
}
export function anys(fun: Function): Anys {
    var r = new Anys();
    r.fun_ = fun;
    r.turn_(undefined);
    return r;
}

/**
 * 等待异步执行 一切函数皆可异步
 * @type {function((Thenable<T>|T)=): Promise<T>}
 * @example:
 *  await(fun())
 *  .then(function(){})
 */
export var await = Promise.resolve;


//todo build时把CFG的内容提取到config文件中
//提取配置 CFG\(\S*\,\S*\)
export class Config {
    datas;

    constructor(datas?) {
        if (datas)this.datas = datas;
        else this.datas = {};
    }

    DefaultData(name, value?) {
        var v;
        //if(name.includes(".")){ //}
        v = utilities.DC.GV(this.datas, name);
        if (v != undefined) {
            return v;
        } //this.datas[name]//this.datas[name];
        else {
            return utilities.DC.SV(this.datas, name, value)
        } //this.datas[name]=value;

    }

    data(name, value?) {
        if (value != undefined) {
            this.datas[name] = value;
        }
        return this.datas[name];
    };
}

export class God {
    ms = {};
    //目标注册,调用
    M(name, obj?) {
        if (obj == undefined) {
            return this.ms[name];
        } else {
            this.ms[name] = obj;
        }
    }

    fs = {};
    as = {
        'click': function (v) {
            return v.click()
        }
    };
    //函数注册,调用
    F(name, fun: Array<Array<string>>) {
        if (fun == undefined) {
            if (this.fs[name]) {
                var c = this.fs[name].length > 0;
                this.fs[name].map(function (v) {
                    c = c && (v[1] in this.as);
                    c = c && (v[0] in this.ms);
                }.bind(this))
                if (c) {
                    this.fs[name].map(function (v) {
                        this.as[v[1]](this.ms[v[0]])
                    }.bind(this))
                }
            }
        } else {
            this.fs[name] = fun;
        }
    }
}

export abstract class BasePlugin implements IPlugin {
    ui: IuiPlugin
    logic;
    view;

    public Init(option) {
        this.ui = option.ui;
        this.logic = this.logicFactory();
        this.view = this.viewFactory(this.ui.Type);
        this.logic.Init(option);
        option.uiPlugin = this.ui;
        option.viewModel = this.logic.ViewModel;
        this.view.Init(option);
    }

    abstract logicFactory();

    //{
    //    return {};
    //}
    abstract viewFactory(type: string);

    //{
    //    switch(type){
    //        default: throw console.error("Can't find this view");
    //    }
    //}
    // System.import(path)
    //.then(function (data) {}
    //if(this.uis[uiData.typeName+':'+uiData.name])return;
    //var ui={
    //vm:uiData.vm,
    //view: undefined
    //}
    //this.uis[uiData.typeName+':'+uiData.name] = ui;
    //
    //System.import(this.uisPath(uiData.typeName))
    //.then(function (data) {
    //var view = $(data);
    //if(uiData.vm){
    //    ko.applyBindings(uiData.vm,view[0]);
    //}
    //ui.view=view;
    //this.registerInfoPanel(uiData.groupName,uiData.name,view);
    //}.bind(this))

    //uisPath(typeName){
    //    return "plugins/aceMainUI/plugins/"+typeName;
    //}
}

export abstract class ViewField implements IViewField {
    option: IViewFieldConstructorOption;
    baseDom: JQuery;
    viewDom: JQuery;
    viewTemplate: string;
    viewModel: any;

    constructor(option?: IViewFieldConstructorOption) {
        this.option = option;
        this.baseDom = $((option && option.baseDom) || '<div></div>');
        this.viewTemplate = (option && option.viewTemplate) || this.defaultViewTemplate();
        this.viewDom = (option && option.viewDom) || this.defaultViewDom();
        this.viewModel = (option && option.viewModel) || this.defaultViewModel();
    }

    get ViewDom() {
        return this.viewDom[0];
    }

    get ViewModelStruct() {
        return JSON.stringify(this.defaultViewModel());
    }

    Updata() {
        this.updata();
    }

    abstract defaultViewTemplate(): string

    abstract defaultViewModel()

    abstract defaultViewDom()

    abstract updata()
}

export abstract class KOViewField extends ViewField {
    constructor(option?: IViewFieldConstructorOption) {
        super(option);
        this.updata();
    }

    isBindFlag = false;

    updata() {
        if (this.isBindFlag === false) {
            ko.applyBindings(this.viewModel, this.viewDom[0]);
        }
    }

    defaultViewDom() {
        $(this.viewTemplate).appendTo(this.baseDom);
        return this.baseDom;
    }
}

export class DivViewField extends KOViewField {
    defaultViewTemplate() {
        return undefined
    }

    defaultViewModel() {
        return undefined
    }
}
//
// export function chartFactory(title,div,aa){
//     return new Highcharts.Chart({
//         chart: {
//             renderTo:div,
//             backgroundColor: "",
//             plotBorderWidth: null,
//             plotShadow: false
//         },
//         credits: {
//             enabled: false
//         },
//         exporting: {
//             filename: encodeURIComponent(title),
//             enabled: false //放出后打印取消后,map会白屏
//         },
//         title: {
//             text: title
//         },
//         tooltip: {
//             formatter: function () {
//                 return '<b>' + this.point.name + '</b>: ' + this.percentage.toFixed(2) + ' %';
//             }
//         },
//         plotOptions: {
//             pie: {
//                 allowPointSelect: true,
//                 cursor: 'pointer',
//                 dataLabels: {
//                     enabled: true,
//                     formatter: function () {
//                         return '<b>' + this.point.name + '</b>: ' + this.point.y + ' 艘';
//                     }
//                 },
//                 showInLegend: true
//             }
//         },
//         series: [
//             {
//                 type: 'pie',
//                 name: '',
//                 data: aa
//             }
//         ]
//     });
// }
//


var NS = new Design.ScopeManager("");
var t = NS.getV1Enum("RitsRuleType")
var ritsRuleType = {};
JSTool.ArraysDo(t.Names, t.Values, t.Labels, function (n, v, l) {
    ritsRuleType[n] = ritsRuleType[v] = {
        Name: n,
        Value: v,
        Label: l
    }
})
export var RitsRuleType = ritsRuleType;

var t = NS.getV1Enum("ProcessState")
var processState = {};
JSTool.ArraysDo(t.Names, t.Values, t.Labels, function (n, v, l) {
    processState[n] = processState[v] = {
        Name: n,
        Value: v,
        Label: l
    }
})
export var ProcessState = processState;

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
    14: "#ff7700", //    "Speed_Duration_Region_Berth_ZhouShan":,
    15: "#ff0000", //    "Speed_Duration_Region_First_ZhouShan":,
    16: "#aa0000", //     //"Speed_Duration_Region_Second_ZhouShan",
    17: "#660000", //    //"Speed_Duration_Region_Third_ZhouShan"]
}
export function RitsRuleTypeColor(name) {
    return ritsRuleTypeColo[name] || "#000000";
}

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
    Infinity: {fillColor: "#000000", strokeColor: "#000000", strokeType: "solid", strokeThickness: "1"},//,StrokeDashArray:"10,10"
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
    17: {fillColor: "rgba(0,0,0,0.3)", strokeColor: "#0000aa", strokeType: "solid", strokeThickness: 1},
    18: {fillColor: "#000000", strokeColor: "#0000ff", strokeType: "solid", StrokeThickness: 1},
    19: {fillColor: "#000000", strokeColor: "#002200", strokeType: "solid", StrokeThickness: 1},
    20: {fillColor: "#000000", strokeColor: "#006600", strokeType: "solid", StrokeThickness: 1},
    21: {fillColor: "#000000", strokeColor: "#00aa00", strokeType: "solid", StrokeThickness: 1},
    22: {fillColor: "rgba(0,0,0,0.1)", strokeColor: "#ff0000", strokeType: "solid", StrokeThickness: 1},
    23: {fillColor: "rgba(0,0,0,0.1)", strokeColor: "#ff2200", strokeType: "solid", StrokeThickness: 1},
    24: {fillColor: "rgba(0,0,0,0.1)", strokeColor: "#aa6600", strokeType: "solid", StrokeThickness: 1},
    25: {fillColor: "rgba(0,0,0,0.1)", strokeColor: "#66aa00", strokeType: "solid", StrokeThickness: 1},
    26: {fillColor: "rgba(0,0,0,0.1)", strokeColor: "#cc8800", strokeType: "solid", StrokeThickness: 1}
}
export function ThhJSToolyle(id) {
    return thhJSToolyle[id] || thhJSToolyle[Infinity];
}

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
export function TrafficEnvStyle(id: string|number, style?: DrawingStyle) {
    if (style) {
        trafficEnvStyle[id] = style;
    }
    return trafficEnvStyle[id] || trafficEnvStyle[Infinity]
}


export var ShipType = {
    Names: ['PASSENGER', 'CARGO', 'TANKER', 'FISHING', 'GOVERNMENT', 'WORK', 'VPASSENGER', 'VCARGO', 'VTANKER', 'VPROJSHIP', 'VWORKSHIP', 'VTUGBOAT', 'OTHER'],
    Labels: ['客船', '货船', '油船', '渔船', '公务船', '作业船', 'V客船', 'V货船', 'V液货船', 'V工程船', 'V工作船', 'V拖船', '其它'],
    Colors: ['#0000FF', '#E73ADA', '#FF0000', '#008000', '#A52A2A', '#805050', '#0000FF', '#E73ADA', '#FF0000', '#805050', '#805050', '#805050', '#999999'],
    LocalShipTypeCode: [6, 7, 8, 3, 55, 5, 100, 200, 300, 400, 500, 600, Infinity]
}

export function getAisSimpleShipTypeLocalCode(code) {
    if (false) {
    } else if (code >= 30 && code <= 39) {
        return 3;
    } else if (code >= 60 && code <= 69) {
        return 6;
    } else if (code >= 70 && code <= 79) {
        return 7;
    } else if (code >= 80 && code <= 89) {
        return 8;
    } else if (code == 55) {
        return 55;
    } else if (code >= 50 && code <= 59) {
        return 5;
    } else {
        return Infinity;
    }
};

export function getShipTypeLocalCode(shipType, shipVType) {
    var b = Infinity;
    if (shipVType)b = getVShipTypeLocalCode(shipVType);
    else b = getAisSimpleShipTypeLocalCode(shipType);
    return b;
}

export function getShipTypeInfo(shipType, shipVType, what: string) {

    var LocalCode = getShipTypeLocalCode(shipType, shipVType) || Infinity;
    var typeCode_crossId2 = JSTool.CrossId2(ShipType.LocalShipTypeCode);
    var r = ShipType[what][typeCode_crossId2.i[Infinity]];
    if (LocalCode in typeCode_crossId2.i)
        r = ShipType[what][typeCode_crossId2.i[LocalCode]];
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

export var AISShipTypeCode = {
    Name: "AISShipTypeCode",
    Values: [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 300, 301, 302, 303, 304, 305, 306, 307, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 500, 501, 502, 503, 504, 505, 506, 600, 601, 602, 900, 901, 902, 903, 904, 905, 906, 907, 908, 909, 910, 911, 912, 913, 914],
    Labels: ["客船类", "普通客船", "客货船", "客渡船", "车客渡船", "旅游客船", "高速客船", "客驳船", "滚装客船", "客箱船", "火车渡船（客）", "地效翼船", "普通货船类", "干货船", "杂货船", "散货船", "散装水泥运输船", "集装箱船", "滚装船", "多用途船", "木材船", "水产品运输船", "重大件运输船", "驳船", "汽车渡船", "挂桨机船", "冷藏船", "火车渡船", "矿/散/油船", "半潜船", "液货船类", "油船", "散装化学品船", "散装化学品船/油船", "液化气船", "散装沥青船", "油驳", "一般液货船", "工程船类", "工程船", "测量船", "采沙船", "挖泥船", "疏浚船", "打捞船", "打桩船", "起重船", "搅拌船", "布缆船", "钻井船", "打桩起重船", "吹泥船", "起重驳", "工作船类", "工作船", "破冰船", "航标船", "油污水处理船", "供给船", "垃圾处理船", "拖船类", "拖船", "推轮", "其它类", "交通艇", "引航船", "救助船", "浮船坞", "公务船", "摩托艇", "帆船", "趸船", "游艇", "特种用途船", "水上平台", "水下观光船", "科学调查船", "勘探船"],
}

export function getVShipTypeLocalCode(code) {
    if (false) {
    } else if (code >= 100 && code <= 199) {
        return 100;
    } else if (code >= 200 && code <= 299) {
        return 200;
    } else if (code >= 300 && code <= 399) {
        return 300;
    } else if (code >= 400 && code <= 499) {
        return 400;
    } else if (code >= 500 && code <= 599) {
        return 500;
    } else if (code >= 600 && code <= 699) {
        return 600;
    } else {
        return Infinity;
    }
}

//根据填充,边框画三角船 生成Icon
export function shipIconsGenerate(list: Array<{fillColor: string,strokeColor: string}>): Array<any> {
    var r = [];
    var canvas = document.createElement('canvas');
    canvas.width = 35;
    canvas.height = 35;
    var canvasCtx = canvas.getContext('2d');
    canvasCtx.translate(canvas.width / 2, canvas.height / 2);
    trianglePath(canvasCtx);
    for (var I of list) {
        canvasCtx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        canvasCtx.fillStyle = I.fillColor;
        canvasCtx.fill();
        canvasCtx.strokeStyle = I.strokeColor;
        canvasCtx.stroke();
        r.push(canvas.toDataURL());
    }
    return r;
}

export function trianglePath0(canvasCtx) {
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
export function trianglePath(context) {
    context.moveTo(10, 0);
    context.lineTo(-9, 4);
    context.lineTo(-9, -4);
    context.closePath();
}
//distinctPath(context,30,10)
export function distinctPath0(context, l, w) {
    var dl = l / 2, dw = w / 2, t = 5;

    context.moveTo(dl, 0);
    context.lineTo(dl - t, dw);
    context.lineTo(-dl + t, dw);
    context.lineTo(-dl, 0);
    context.lineTo(-dl + t, -dw);
    context.lineTo(dl - t, -dw);
    context.closePath();
}

export function distinctPath(context, t, l, b, r) {
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


export function olStyleFromStyle(style: DrawingStyle, name) {
    style = style || new DrawingStyle();
    var fillColor = style.Fill ? MapTool.olColorParseARGB(style.Fill) : null;//fillColor[3]
    fillColor = (fillColor && fillColor[3]) != 0 ? fillColor : null;
    var strokeColor = style.Stroke ? MapTool.olColorParseARGB(style.Stroke) : "#000000";
    var strokeWidth = style.StrokeThickness ? parseInt((<string><any>style.StrokeThickness)) : 1;
    var lineDash: any = style.StrokeDashArray ? style.StrokeDashArray : '';
    lineDash = JSON.parse('[' + lineDash + ']');
    var font = 'arial';
    var textStyle: any = style.TextStyle || {};
    var textfill = textStyle.Color ? MapTool.olColorParseARGB(textStyle.Color) : '#000000';
    var textStroke = '#000000';

    return new ol.style.Style({
        fill: fillColor ? new ol.style.Fill({color: fillColor}) : null,
        stroke: new ol.style.Stroke({
            color: strokeColor,
            width: strokeWidth,
            lineDash: lineDash
        }),
        image: new ol.style.Icon({
            src: 'resource/sprites/images/icon/icon_berth.png',
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
            fill: textfill ? new ol.style.Fill({color: textfill}) : null,
            //stroke: new ol.style.Stroke({color: textStroke, width: 1}),
            offsetX: 0,
            offsetY: 15,
            rotation: 0
        })
    })
}

export function olGeomFromGeomatics(g: Geomatics) {
    var list = g.Points.map(function (v) {
        return ol.proj.fromLonLat(v);
    });
    var geom;
    if (g.ShapeType) {
        switch ((<number><any>g.ShapeType)) {
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
                geom = new ol.geom.Polygon([[list[0], [list[0][0], list[1][1]], list[1], [list[1][0], list[0][1]]]]);//([list]);
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

export function BerthExportToLocation() {
    $.ajax({
        url: "api/Berth",
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
                }

                $.ajax({
                    url: "api/Location",
                    type: "post",
                    data: loca
                })
                    .done(function (evt, data) {
                        console.log(index++);
                    })

            })


        })
}

export class Geomatics {
    public Points: Array<Array<number>>;
    public ShapeType: ShapeType;
}

export class TextStyle {
    public Color: string;
    public FontFamily: any;
    public FontSize: number;
    public HasUnderLine: boolean;
    public IsBold: boolean;
    public IsItalic: boolean;
    public IsVisible: boolean;
    public Placement: number;
    public RotateAngle: number;
}

export class DrawingStyle {
    public Fill: string;
    public FillImage: string;
    public Stroke: string|any;
    public StrokeDashArray: string|number[];
    public StrokeThickness: number;
    public TextStyle: TextStyle;
    public VisibleScaleRate: number;
}

export enum ShapeType{
    Point = 0, //点
    Line = 1, //直线
    PolyLine = 2, //折线
    Rectanlge = 3, //矩形
    Circle = 4, //圆
    Polygon = 5, //多边形
}
export var ShapeTypeLabel = {
    Point: '点',
    Line: '直线',
    PolyLine: '折线',
    Rectanlge: '矩形',
    Circle: '圆',
    Polygon: '多边形'
}
export enum TrafficEnvType{
    Obstruction = 0, //碍航物
    Berth = 1, //泊位
    Lane = 2, //航道
    LaneCenterLine = 3, //航道中心线
    Anchorage = 4, //锚地
    Reportingline = 5, //VTS报告线
    Jurisdiction = 6, //VTS管辖区
    OnBoardArea = 7, //引航员登船区
    NavigateAssist = 8, //助航设施
    ShallowArea = 9, //浅水区
    PortArea = 10, //港区
    ShippingLine = 11, //推荐航线
    RefPoint = 12, //参考点
    Bridge = 13, //桥梁
    ShipGate = 14, //船闸
    Harbor = 15, //港口
    Basin = 16, //港池
    RestrictedArea = 17, //限制区
    ResponsibilityArea = 18, //责任区
    AttentionArea = 19, //关注区域
    InWaterWorkArea = 20, //水工作业区
    Cable = 21, //海缆
    CoreProtectArea = 22, //核心保护区
    FirstWarningArea = 23, //一级预警区
    SecondWarningArea = 24, //二级预警区
    ThirdWarningArea = 25, //三级预警区
    SecondWarningContactArea = 26, //二级预警联络区
    zengbuqu = 27, //增补区
    birangqu = 28, //避让区
}
export class TrafficEnvTypeLabel {
    Obstruction = '碍航物';
    Berth = '泊位';
    Lane = '航道';
    LaneCenterLine = '航道中心线';
    Anchorage = '锚地';
    Reportingline = 'VTS报告线';
    Jurisdiction = 'VTS管辖区';
    OnBoardArea = '引航员登船区';
    NavigateAssist = '助航设施';
    ShallowArea = '浅水区';
    PortArea = '港区';
    ShippingLine = '推荐航线';
    RefPoint = '参考点';
    Bridge = '桥梁';
    ShipGate = '船闸';
    Harbor = '港口';
    Basin = '港池';
    RestrictedArea = '限制区';
    ResponsibilityArea = '责任区';
    AttentionArea = '关注区域';
    InWaterWorkArea = '水工作业区';
    Cable = '海缆';
    CoreProtectArea = '核心保护区';
    FirstWarningArea = '一级预警区';
    SecondWarningArea = '二级预警区';
    ThirdWarningArea = '三级预警区';
    SecondWarningContactArea = '二级预警联络区';
    zengbuqu = '增补区';
    birangqu = '避让区';
}
export interface LocationDTO {
    Id: number;
    TrafficEnvType: TrafficEnvType;
    Name: string; //[Display(Name = "名称")] //[NotNull]
    PortAreaId?: number; //[Display(Name = "港区")] //[RelatedToDataSource(DataSourceCategory.PortArea)]
    Geomatics?: string; //[Display(Name = "空间信息")]
    DrawingStyle?: string; //[Display(Name = "样式")]
    Comments?: string; //[Display(Name = "备注")]
    FullName?: string; //[Display(Name = "全称")]
    AliasName1?: string; //[Display(Name = "别名1")]
    AliasName2?: string; //[Display(Name = "别名2")]
    AttachmentGroupKey?: string; //附件
    OrganizationId: number; //[Display(Name = "组织结构Id")]
}
export interface Location {
    Id: string;
    TrafficEnvType: TrafficEnvType;
    Name: string; //[Display(Name = "名称")] //[NotNull]
    PortAreaId?: number; //[Display(Name = "港区")] //[RelatedToDataSource(DataSourceCategory.PortArea)]
    Geomatics?: Geomatics; //[Display(Name = "空间信息")]
    DrawingStyle?: DrawingStyle; //[Display(Name = "样式")]
    Comments?: string; //[Display(Name = "备注")]
    FullName?: string; //[Display(Name = "全称")]
    AliasName1?: string; //[Display(Name = "别名1")]
    AliasName2?: string; //[Display(Name = "别名2")]
    AttachmentGroupKey?: string; //附件
    OrganizationId: string; //[Display(Name = "组织结构Id")]
}
export class LocationLabel {
    public Id = "ID";
    public TrafficEnvType = "类型";
    Name = "名称";
    PortAreaId = "港区";
    Geomatics = "空间信息";
    DrawingStyle = "样式";
    Comments = "备注";
    FullName = "全称";
    AliasName1 = "别名1";
    AliasName2 = "别名2";
    AttachmentGroupKey = "附件";
    OrganizationId = "组织结构Id";
}

export class PlotDataDTO {
    public Id;
    public Name;
    public Geomatics: string;
    public Style: string;
    public UserId: string;
}

export class PlotData {
    public Id: string;
    public Name: string;
    public Geomatics: Geomatics;
    public Style: DrawingStyle;
    public UserId: string;
}

export class ExtendFeature extends ShipFeature{
    id:string;
    data:any;
}