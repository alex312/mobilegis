import * as ol from "openlayers";
import * as objInfo from "text!plugins/maps/layers/anchorageEvent/htmls/ObjInfo.html";
import * as sidePanel from "text!plugins/maps/layers/anchorageEvent/htmls/SidePanel.html";
import * as ko from "knockout";
import * as fecha from "fecha";

import EventDealLayerEntity from "./layers/EventDealLayerEntity";
import EventDealApi from "./datas/EventDealApi";
import SidePanel from "./SidePanel";

import {inject} from "seecool/plugins/plugins";
import {CollectionLinker} from "seecool/datas/Collection";
import {CollectionA} from "seecool/datas/Collection";
import {pdata} from "seecool/Interface";
import {IDCFeature} from "seecool/Interface";
import {Status} from "seecool/utils/Status";
import {CheckBox} from "seecool/StaticLib";
import {IEventDealDTO} from "seecool/Interface";
import {Frame} from "../../ui/frame/main";

import * as Highcharts from "highcharts";
import "kendo";

class AnchorageEventPlugin {
    private config_;
    private map_;
    private layerEntity_: EventDealLayerEntity;
    //dataSet:CollectionA<IWaterDepthData>;
    private dataDTOSet_: CollectionA<IEventDealDTO>
    //link_DataSet_DataDTOSet:CollectionLinker<IWaterDepthData,IWaterDepthDataDTO>;
    //link_LayerEntity_DataSet:CollectionLinker<IDCFeature,IWaterDepthData>;
    private link_LayerEntity_DataDTOSet_: CollectionLinker<IDCFeature,IEventDealDTO>;
    private eventDealApi_;
    private status_;
    //colorWaterDepth;
    private setting_;
    private startTime_;
    private endTime_;
    private main_;
    private startPicker_;
    private endPicker_;
    private calcPicker_;
    private detailViewer_;

    constructor(config,
                @inject('maps/ui/frame')frame: Frame,
                @inject("maps/map") map,
                @inject("maps/ui/detailViewer") detailViewer,
                @inject("setting?")setting) {
        var sideView = frame.sideView;
        var toolbar = frame.toolbars['right'];

        toolbar.addButton({
            text: '锚泊事件',
            click: function () {
                var source = this.layerEntity_.layer.getSource();
                var list = [];
                source.forEachFeature(function (f) {
                    if (!f.data) {
                        console.log("f", f);
                        list.push({data: "_", target: f, dataListClick: this.dataListClick.bind(this)});
                    }
                    else {
                        list.push({
                            data: f.data.RouteName || f.data.ShipName || f.data.MMSI || "_",
                            target: f,
                            dataListClick: this.dataListClick.bind(this)
                        });
                    }
                }.bind(this));
                sideView.push(new SidePanel({
                    startTime: ko.observable(),
                    endTime: ko.observable(),
                    query: this.query.bind(this),
                    dataList: list,
                    calcTime: ko.observable(),
                    calcYear: this.calcYear.bind(this),
                    calcMonth: this.calcMonth.bind(this)
                }));
                this.startPicker_ = $("#startTime1")
                    .kendoDateTimePicker({
                        format: "yyyy-MM-dd HH:mm"
                    }).data("kendoDateTimePicker");
                this.endPicker_ = $("#endTime1")
                    .kendoDateTimePicker({
                        format: "yyyy-MM-dd HH:mm"
                    }).data("kendoDateTimePicker");
                this.calcPicker_ = $("#calcTime1")
                    .kendoDatePicker({
                        depth: "year",
                        start: "year",
                        format: "yyyy-MM"
                    }).data("kendoDatePicker");

                var start = fecha.format(this.startTime_, "YYYY-MM-DD HH:mm:ss");
                var end = fecha.format(this.endTime_, "YYYY-MM-DD HH:mm:ss");
                var calc = fecha.format(this.endTime_, "YYYY-MM");

                this.startPicker_.value(start);
                this.endPicker_.value(end);
                this.calcPicker_.value(calc);
            }.bind(this)
        });
        this.config_ = config || {};
        this.map_ = map || {};
        this.detailViewer_ = detailViewer;
        // this.setting = setting || {};
        this.startTime_ = new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000);
        this.endTime_ = new Date();
        this.expose();
        this.init();
        this.load();
    }

    expose() {
        var wg6: any = window["webgis6"] || (window["webgis6"] = {});
        wg6.anchorageEvent = {};
        wg6.anchorageEvent.SetFocus = function (id) {
            var fid = "anchorageEvent:" + id;
            var feature = this.layerEntity.layer.getFeatureById(fid);
            this.map.setFocus(feature);
        }.bind(this)
    }

    init() {
        //this.dataSet=new CollectionA<IWaterDepthData>("dataSet");
        this.dataDTOSet_ = new CollectionA<IEventDealDTO>("dataDTOSet");
        this.eventDealApi_ = new EventDealApi(this.config_.EventDealApi || "api/EventDeal");
        this.layerEntity_ = new EventDealLayerEntity({});
        //this.link_DataSet_DataDTOSet=new CollectionLinker<IWaterDepthData,IWaterDepthDataDTO>(CollectionLinkerOption<IWaterDepthData,IWaterDepthDataDTO>(
        //    this.dataDTOSet,
        //    this.dataSet,
        //    function(v){return true},
        //    function(v:IWaterDepthDataDTO){return {
        //        Name: v.Depth,
        //        Lon: v.Lon,
        //        Lat: v.Lat
        //    }}
        //));
        //this.link_LayerEntity_DataSet=new CollectionLinker<IDCFeature,IWaterDepthData>({
        //    sourceCollection:this.dataSet,
        //    targetCollection:this.layerEntity.DataSet,
        //    filterFunction:function(v){return true},
        //    convertFunction:function(v:IWaterDepthData){
        //        var LL=(v.Lon>v.Lat)?[v.Lon,v.Lat]:[v.Lat,v.Lon];
        //        var lonlat=ol.proj.fromLonLat(LL);
        //        var geom = new ol.geom.Point(lonlat);
        //        var f2=new ol.Feature({
        //            geometry: geom
        //        });
        //        f2.setProperties({"name":v.Name.toString()})
        //        this.featureAppand(f2,v);
        //        return f2;
        //    }.bind(this)
        //})
        this.link_LayerEntity_DataDTOSet_ = new CollectionLinker<IDCFeature,IEventDealDTO>({
            sourceCollection: this.dataDTOSet_,
            targetCollection: this.layerEntity_.DataSet,
            filterFunction: function (v) {
                return true
            },
            convertFunction: function (v: IEventDealDTO) {
                var place: any = /\((\S*)\s+(\S*)\)/g.exec(v.Place);
                if (!place) {
                    place = [null, '0', '0']
                }
                var LL = [Number(place[1]), Number(place[2])];
                LL = this.LonLatTest(LL);
                var lonlat = ol.proj.fromLonLat(LL);
                var geom = new ol.geom.Point(lonlat);
                var f2 = new ol.Feature({
                    geometry: geom
                });
                (<any>f2).setProperties({"name": ""});
                this.featureAppand(f2, v);
                return f2;
            }.bind(this)
        })
        //this.link_DataSet_DataDTOSet.start();
        //this.link_LayerEntity_DataSet.start();
        this.link_LayerEntity_DataDTOSet_.start();

        this.status_ = new Status(this);
        this.status_.ConditionTurn(true, "displayed");//hided
        //this.Switch(switch1);
        //this.ui.RegisterShortBarButton(null,"EventSwitch","锚泊事件",this.Switch.bind(this)).click();

        var switch1 = CheckBox({
            checked: true,
            view: "锚泊事件",
            click: this.Switch.bind(this)
        });
        // this.setting.RegisterSettingElement("mapSwitch", switch1);//mapSwitch

        this.map_.map.addLayer(this.layerEntity_.layer);
        this.detailViewer_.registerSelectFocusEvent("anchorageEventSelectFocus", this.featureSelected.bind(this));
        // this.ui.RegisterMainMenu(null, "anchorageEventMenuLink", "锚泊事件", this.menuClick.bind(this), {iconFont: "fa-star"})
        //.find('a').click();
    }

    keys0 = {StatAnchorDealTypes: "锚处理方式", StatDealTypes: "处理方式"}
    keys1 = {StatAnchorDealTypes: ["起锚", "砍锚", "无处理", "电话联系"], StatDealTypes: ["直接处理", "间接处理", "无处理"]}

    private calcYear() {
        var date = fecha.parse($('#calcTime1').val() + '-01', 'YYYY-MM-DD HH:mm:ss');
        this.eventDealApi_.Get_StatDealType$year(date.getFullYear())
            .then(function (pdata: pdata) {
                var keys0 = this.keys0;
                var keys1 = this.keys1;
                var datas = {};
                for (var i in pdata.data) {
                    var I = pdata.data[i];
                    for (var J of I) {
                        if (J.Key == 0 || J.Key == 1) {
                            var value = [];
                            for (var K of J.Value) {
                                value.push(K.Value);
                            }
                            datas[i + ':' + keys1[i][J.Key]] = {name: keys0[i] + ':' + keys1[i][J.Key], data: value};
                        }
                    }
                }
                var series = [];
                for (var i in datas)series.push(datas[i]);

                $('<div></div>')
                var data = {
                    series: series,
                    xAxis: {
                        name: "月份",
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月',
                            '11月', '12月']
                    },
                    yAxis: {  //y轴
                        name: "事件数量"
                    },
                    title: "锚泊事件年分布图",
                    subtitle: date.getFullYear() + '年'
                }
                this.plot(data);
            }.bind(this))
    }

    private calcMonth() {
        var date = fecha.parse($('#calcTime1').val() + '-01', 'YYYY-MM-DD HH:mm:ss');
        //var date=/^(\d*)-(\d*)$/g.exec($('#calcTime').val()||fecha.format(new Date(),'YYYY-MM'));
        this.eventDealApi_.Get_StatDealType$year_month(date.getFullYear(), (date.getMonth() + 1))
            .then(function (pdata: pdata) {
                var keys0 = this.keys0;
                var keys1 = this.keys1;
                var datas = {};
                var dayLength;
                for (var i in pdata.data) {
                    var I = pdata.data[i];
                    for (var J of I) {
                        if (J.Key == 0 || J.Key == 1) {
                            var value = [];
                            for (var K of J.Value) {
                                value.push(K.Value);
                            }
                            datas[i + ':' + keys1[i][J.Key]] = {name: keys0[i] + ':' + keys1[i][J.Key], data: value};
                            dayLength = (dayLength > value.length) ? dayLength : value.length;
                        }
                    }
                }
                var series = [];
                for (var i in datas)series.push(datas[i]);
                var days = [];

                for (let i = 0; i < dayLength; i++) {
                    days.push('' + (i + 1) + '日')
                }

                $('<div></div>')
                var data = {
                    series: series,
                    xAxis: {
                        name: "日期",
                        data: days
                    },
                    yAxis: {  //y轴
                        name: "事件数量"
                    },
                    title: "锚泊事件月分布图",
                    subtitle: date.getFullYear() + '年' + (date.getMonth() + 1) + '月'
                }
                this.plot(data);
            }.bind(this))
    }

    public LonLatTest(lonlat) {
        if (lonlat[0] < 180 && lonlat[1] < 90)
            return lonlat
        console.error("经纬度不合理:", lonlat);
        return [0, 0];
    }

    private Switch(evt) {
        this.status_
            .IfTurnDo("hided", "displayed", function () {
                this.layerEntity.layer.setVisible(true);
                if (evt && evt.currentTarget)evt.currentTarget.className = "btn btn-success";
            })
            .IfTurnDo("displayed", "hided", function () {
                this.layerEntity.layer.setVisible(false);
                //this.mapPlugin_.Map.removeLayer(this.layer_);
                if (evt && evt.currentTarget)evt.currentTarget.className = "btn btn-danger";
            })
            .Turned();
        return true;
    }

    private featureAppand(olFeature, data) {
        olFeature.id = "anchorageEvent:" + data.Id;
        olFeature.data = data;
    }

    load() {
        this.dataDTOSet_.Clear();
        var start, end;
        if (this.startPicker_ && this.endPicker_) {
            this.startTime_ = this.startPicker_.value();
            this.endTime_ = this.endPicker_.value();
        }
        start = fecha.format(this.startTime_, "YYYY-MM-DD HH:mm:ss");
        end = fecha.format(this.endTime_, "YYYY-MM-DD HH:mm:ss");

        return this.eventDealApi_.Get$start_end(start, end)
            .then(function (pdata: pdata) {
                return new Promise(function (resolve, reject) {
                    switch (pdata.state) {
                        case "apiok":
                            this.dataDTOSet_.Add(<Array<IEventDealDTO>>pdata.data)
                            resolve();
                            break;
                        default:
                            reject()
                    }
                }.bind(this))
            }.bind(this))
            .catch(function (pdata: pdata) {
                switch (pdata.state) {
                    case "apierr":
                        console.log("apierr", pdata.data);
                        break;
                }
                if (!pdata.state)throw(pdata);
            })
    }


    showMainPanal(div) {
        if (!this.main_) {
            this.main_ = $("<div></div>")
                .css({width: '100%', height: '100%', border: 0})
                .dialog({
                    width: 'auto'
                });
        } else {
            this.main_.empty();
        }
        div .css({'min-width': '400px', height: '70%', width: '100%', 'z-index': '1', 'margin-top': '30px'})
            .appendTo(this.main_);
        if (!this.main_.dialog('isOpen')) {
            this.main_.dialog('open');
        }
    }

    plot(option) {
        var list = [];
        var chartDiv = $('<div></div>')
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: chartDiv[0], //图表放置的容器，DIV
                defaultSeriesType: 'line', //图表类型line(折线图),
                zoomType: 'x',   //x轴方向可以缩放
                width: 600,// 图表高度
                height: 500
            },
            title: {
                text: option.title || ' ' //图表标题
            },
            subtitle: {
                text: option.subtitle || ' '  //副标题
            },
            yAxis: {  //y轴
                title: {text: option.yAxis.name || '值'}, //标题
                lineWidth: 2 //基线宽度
            },
            xAxis: {  //x轴
                title: {text: option.xAxis.name || '时间'}, //标题
                categories: option.xAxis.data, //x轴标签名称
                gridLineWidth: 1, //设置网格宽度为1
                lineWidth: 2,  //基线宽度
                labels: {y: 26}  //x轴标签位置：距X轴下方26像素
            },
            series: option.series || [{  //数据列
                name: '北京',
                data: [-4.6, -2.2, 4.5, 13.1, 19.8, 24.0, 25.8, 24.4, 19.3, 12.4, 4.1, -2.7]
            },
                {
                    name: '广州',
                    data: [13.3, 14.4, 17.7, 21.9, 24.6, 27.2, 30.8, 32.1, 27.2, 23.7, 21.3, 15.6]
                }],
            plotOptions: { //绘制设置
                line: {
                    dataLabels: {//数据点的Labels//在数据点上显示对应的数据值
                        enabled: true
                    },
                    enableMouseTracking: false //取消鼠标滑向触发提示框
                }
            },
            legend: {  //图例
                //layout: 'horizontal',  //图例显示的样式：水平（horizontal）/垂直（vertical）
                //backgroundColor: '#ffc', //图例背景色
                //align: 'left',  //图例水平对齐方式
                //verticalAlign: 'top',  //图例垂直对齐方式
                //x: 100,  //相对X位移
                //y: 70,   //相对Y位移
                //floating: true, //设置可浮动
                shadow: true  //设置阴影
            },
            exporting: {
                enabled: false,  //放出后打印取消后,map会白屏
            },
            credits: {
                enabled: false   //右下角不显示LOGO
            }
        });
        this.showMainPanal(chartDiv);
    }

    private featureSelected(feature?) {
        if(!feature)return;
        var featureId=feature.id;
        if (!(typeof(featureId) == "string" && featureId.startsWith('anchorageEvent:')))return null;

        var feature = this.layerEntity_.layer.getFeatureById(featureId);
        var data: IEventDealDTO = feature.data;
        var $objInfo = $(objInfo);
        if (data) {
            //shipName = data.name;
            var viewModel = {
                MMSI: data.MMSI,
                EventTime: (<string><any>data.EventTime).replace("T", " "), //fecha.format(,"YYYY-MM-DD HH:mm:ss"),
                IsChina: data.IsChina ? "是" : "否",
                IsEscape: data.IsEscape ? "是" : "否",
                IsLiveLaw: data.IsLiveLaw ? "是" : "否",
                IsNetVessel: data.IsNetVessel ? "是" : "否",
                IsTrouble: data.IsTrouble ? "是" : "否",
                LastUpdateTime: (<string><any>data.LastUpdateTime).replace("T", " "), //fecha.format(,"YYYY-MM-DD HH:mm:ss"),
                RouteName: data.RouteName,
                ShipName: data.ShipName,
            }
            ko.applyBindings(viewModel, $objInfo[0]);
            $objInfo.data("title", "锚泊事件信息");
            return $objInfo;
        }
        return $objInfo;
    }


    // private menuClick() {
    //     var panel = $(sidePanel);
    //     // this.ui.ShowSidePanel("锚泊事件", panel);
    //     var source = this.layerEntity_.layer.getSource();
    //     var list = [];
    //     source.forEachFeature(function (f) {
    //         if (!f.data) {
    //             console.log("f", f);
    //             list.push({data: "_", target: f, dataListClick: this.dataListClick.bind(this)});
    //         }
    //         else {
    //             list.push({
    //                 data: f.data.RouteName || f.data.ShipName || f.data.MMSI || "_",
    //                 target: f,
    //                 dataListClick: this.dataListClick.bind(this)
    //             });
    //         }
    //     }.bind(this));
    //     var viewModel = {
    //         startTime: ko.observable(),
    //         endTime: ko.observable(),
    //         query: this.query.bind(this),
    //         dataList: list,
    //         calcTime: ko.observable(),
    //         calcYear: this.calcYear.bind(this),
    //         calcMonth: this.calcMonth.bind(this)
    //     };
    //     ko.applyBindings(viewModel, panel[0]);
    //
    //     this.startPicker_ = $("#startTime1")
    //         .kendoDateTimePicker({
    //             format: "yyyy-MM-dd HH:mm"
    //         }).data("kendoDateTimePicker");
    //     this.endPicker_ = $("#endTime1")
    //         .kendoDateTimePicker({
    //             format: "yyyy-MM-dd HH:mm"
    //         }).data("kendoDateTimePicker");
    //     this.calcPicker_ = $("#calcTime1")
    //         .kendoDatePicker({
    //             depth: "year",
    //             start: "year",
    //             format: "yyyy-MM"
    //         }).data("kendoDatePicker");
    //
    //     var start = fecha.format(this.startTime_, "YYYY-MM-DD HH:mm:ss");
    //     var end = fecha.format(this.endTime_, "YYYY-MM-DD HH:mm:ss");
    //     var calc = fecha.format(this.endTime_, "YYYY-MM");
    //
    //     this.startPicker_.value(start);
    //     this.endPicker_.value(end);
    //     this.calcPicker_.value(calc);
    //
    //     //this.query();
    // }

    private query() {
        Promise.resolve()
            .then(this.load.bind(this))
        //.then(this.menuClick.bind(this))
    }

    private dataListClick(data, evt) {
        //var f=this.layer.getFeatureById(data.target);
        this.map_.setFocus(data.target);
        console.log("click");
    }
}

export default AnchorageEventPlugin