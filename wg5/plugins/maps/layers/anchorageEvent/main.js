"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = undefined && undefined.__param || function (paramIndex, decorator) {
    return function (target, key) {
        decorator(target, key, paramIndex);
    };
};
define(["require", "exports", "openlayers", "text!plugins/maps/layers/anchorageEvent/htmls/ObjInfo.html", "knockout", "fecha", "jquery", "./layers/EventDealLayerEntity", "./datas/EventDealApi", "./SidePanel", "../../../../seecool/plugins/Plugins", "../../../../seecool/datas/Collection", "../../../../seecool/datas/Collection", "../../../../seecool/StaticLib", "highcharts", "kendo"], function (require, exports, ol, objInfo, ko, fecha, $, EventDealLayerEntity_1, EventDealApi_1, SidePanel_1, Plugins_1, Collection_1, Collection_2, StaticLib_1) {
    "use strict";

    var AnchorageEventPlugin = function () {
        function AnchorageEventPlugin(config, root, frame, map, menu, detailViewer, setting) {
            _classCallCheck(this, AnchorageEventPlugin);

            this.setFocus_ = function (id) {
                var fid = "anchorageEvent:" + id;
                var feature = this.layerEntity.layer.getFeatureById(fid);
                this.map.setFocus(feature);
            };
            this.keys0 = { StatAnchorDealTypes: "锚处理方式", StatDealTypes: "处理方式" };
            this.keys1 = { StatAnchorDealTypes: ["起锚", "砍锚", "无处理", "电话联系"], StatDealTypes: ["直接处理", "间接处理", "无处理"] };
            var sideView = frame.sideView;
            var toolbar = frame.toolbars['right'];
            toolbar.addButton({
                text: '锚泊事件',
                icon: 'fa fa-anchor',
                click: function () {
                    var source = this.layerEntity_.layer.getSource();
                    var list = [];
                    source.forEachFeature(function (f) {
                        if (!f.data) {
                            console.log("f", f);
                            list.push({ data: "_", target: f, dataListClick: this.dataListClick.bind(this) });
                        } else {
                            list.push({
                                data: f.data.RouteName || f.data.ShipName || f.data.MMSI || "_",
                                target: f,
                                dataListClick: this.dataListClick.bind(this)
                            });
                        }
                    }.bind(this));
                    sideView.open(new SidePanel_1.default({
                        startTime: ko.observable(),
                        endTime: ko.observable(),
                        query: this.query.bind(this),
                        dataList: list,
                        calcTime: ko.observable(),
                        calcYear: this.calcYear.bind(this),
                        calcMonth: this.calcMonth.bind(this)
                    }));
                    this.startPicker_ = $(".kendo-time-picker-start").kendoDateTimePicker({
                        format: "yyyy-MM-dd HH:mm"
                    }).data("kendoDateTimePicker");
                    this.endPicker_ = $(".kendo-time-picker-end").kendoDateTimePicker({
                        format: "yyyy-MM-dd HH:mm"
                    }).data("kendoDateTimePicker");
                    this.calcPicker_ = $(".kendo-time-picker-stat").kendoDatePicker({
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
            this.root_ = root;
            this.menu_ = menu;
            this.detailViewer_ = detailViewer;
            this.setting_ = setting;
            this.startTime_ = new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000);
            this.endTime_ = new Date();
            this.expose();
            this.init();
            this.load();
        }

        _createClass(AnchorageEventPlugin, [{
            key: "setFocus",
            value: function setFocus(id) {
                return this.setFocus_(id);
            }
        }, {
            key: "expose",
            value: function expose() {
                var wg5 = window["webgis5"] || (window["webgis5"] = {});
                wg5.anchorageEvent = {};
                wg5.anchorageEvent.SetFocus = this.setFocus_.bind(this);
                wg5.dynamicEvent = wg5.anchorageEvent;
                this.root_.anchorageEvent = wg5.anchorageEvent;
                this.root_.dynamicEvent = wg5.dynamicEvent;
            }
        }, {
            key: "init",
            value: function init() {
                //this.dataSet=new CollectionA<IWaterDepthData>("dataSet");
                this.dataDTOSet_ = new Collection_2.CollectionA("dataDTOSet");
                this.eventDealApi_ = new EventDealApi_1.default(this.config_.eventDealApi || "api/eventDeal");
                this.layerEntity_ = new EventDealLayerEntity_1.default({});
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
                this.link_LayerEntity_DataDTOSet_ = new Collection_1.CollectionLinker({
                    sourceCollection: this.dataDTOSet_,
                    targetCollection: this.layerEntity_.DataSet,
                    filterFunction: function filterFunction(v) {
                        return true;
                    },
                    convertFunction: function (v) {
                        var place = /\((\S*)\s+(\S*)\)/g.exec(v.Place);
                        if (!place) {
                            place = [null, '0', '0'];
                        }
                        var LL = [Number(place[1]), Number(place[2])];
                        LL = this.LonLatTest(LL);
                        var lonlat = ol.proj.fromLonLat(LL);
                        var geom = new ol.geom.Point(lonlat);
                        var f2 = new ol.Feature({
                            geometry: geom
                        });
                        f2.setProperties({ "name": "" });
                        this.featureAppand(f2, v);
                        return f2;
                    }.bind(this)
                });
                //this.link_DataSet_DataDTOSet.start();
                //this.link_LayerEntity_DataSet.start();
                this.link_LayerEntity_DataDTOSet_.start();
                // this.status_ = new Status(this);
                // this.status_.ConditionTurn(true, "displayed");//hided
                //this.Switch(switch1);
                this.isLayerShow_ = ko.observable(true);
                this.isLayerShow_.subscribe(function (v) {
                    this.setVisible(v);
                }.bind(this));
                var switch1 = StaticLib_1.CheckBox({
                    checked: this.isLayerShow_,
                    view: "锚泊事件",
                    click: this.switch_.bind(this)
                });
                this.setting_.registerSettingElement("mapSwitch", switch1);
                this.map_.map.addLayer(this.layerEntity_.layer);
                this.detailViewer_.registerSelectFocusEvent("anchorageEventSelectFocus", this.featureSelected.bind(this));
                //this.ui.RegisterMainMenu(null, "anchorageEventMenuLink", "锚泊事件", this.menuClick.bind(this), {iconFont: "fa-star"})
                //.find('a').click();
            }
        }, {
            key: "calcYear",
            value: function calcYear() {
                var date = fecha.parse($('#calcTime1').val() + '-01', 'YYYY-MM-DD');
                this.eventDealApi_.Get_StatDealType$year(date.getFullYear()).then(function (pdata) {
                    var keys0 = this.keys0;
                    var keys1 = this.keys1;
                    var datas = {};
                    for (var i in pdata.data) {
                        var I = pdata.data[i];
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = I[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var J = _step.value;

                                if (J.Key == 0 || J.Key == 1) {
                                    var value = [];
                                    var _iteratorNormalCompletion2 = true;
                                    var _didIteratorError2 = false;
                                    var _iteratorError2 = undefined;

                                    try {
                                        for (var _iterator2 = J.Value[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                            var K = _step2.value;

                                            value.push(K.Value);
                                        }
                                    } catch (err) {
                                        _didIteratorError2 = true;
                                        _iteratorError2 = err;
                                    } finally {
                                        try {
                                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                                _iterator2.return();
                                            }
                                        } finally {
                                            if (_didIteratorError2) {
                                                throw _iteratorError2;
                                            }
                                        }
                                    }

                                    datas[i + ':' + keys1[i][J.Key]] = { name: keys0[i] + ':' + keys1[i][J.Key], data: value };
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                    }
                    var series = [];
                    for (var i in datas) {
                        series.push(datas[i]);
                    }$('<div></div>');
                    var data = {
                        series: series,
                        xAxis: {
                            name: "月份",
                            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                        },
                        yAxis: {
                            name: "事件数量"
                        },
                        title: "锚泊事件年分布图",
                        subtitle: date.getFullYear() + '年'
                    };
                    this.plot(data);
                }.bind(this));
            }
        }, {
            key: "calcMonth",
            value: function calcMonth() {
                var date = fecha.parse($('#calcTime1').val() + '-01', 'YYYY-MM-DD');
                //var date=/^(\d*)-(\d*)$/g.exec($('#calcTime').val()||fecha.format(new Date(),'YYYY-MM'));
                this.eventDealApi_.Get_StatDealType$year_month(date.getFullYear(), date.getMonth() + 1).then(function (pdata) {
                    var keys0 = this.keys0;
                    var keys1 = this.keys1;
                    var datas = {};
                    var dayLength;
                    for (var i in pdata.data) {
                        var I = pdata.data[i];
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = I[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var J = _step3.value;

                                if (J.Key == 0 || J.Key == 1) {
                                    var value = [];
                                    var _iteratorNormalCompletion4 = true;
                                    var _didIteratorError4 = false;
                                    var _iteratorError4 = undefined;

                                    try {
                                        for (var _iterator4 = J.Value[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                            var K = _step4.value;

                                            value.push(K.Value);
                                        }
                                    } catch (err) {
                                        _didIteratorError4 = true;
                                        _iteratorError4 = err;
                                    } finally {
                                        try {
                                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                                _iterator4.return();
                                            }
                                        } finally {
                                            if (_didIteratorError4) {
                                                throw _iteratorError4;
                                            }
                                        }
                                    }

                                    datas[i + ':' + keys1[i][J.Key]] = { name: keys0[i] + ':' + keys1[i][J.Key], data: value };
                                    dayLength = dayLength > value.length ? dayLength : value.length;
                                }
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }
                    }
                    var series = [];
                    for (var i in datas) {
                        series.push(datas[i]);
                    }var days = [];
                    for (var _i = 0; _i < dayLength; _i++) {
                        days.push('' + (_i + 1) + '日');
                    }
                    $('<div></div>');
                    var data = {
                        series: series,
                        xAxis: {
                            name: "日期",
                            data: days
                        },
                        yAxis: {
                            name: "事件数量"
                        },
                        title: "锚泊事件月分布图",
                        subtitle: date.getFullYear() + '年' + (date.getMonth() + 1) + '月'
                    };
                    this.plot(data);
                }.bind(this));
            }
        }, {
            key: "LonLatTest",
            value: function LonLatTest(lonlat) {
                if (lonlat[0] < 180 && lonlat[1] < 90) return lonlat;
                console.error("经纬度不合理:", lonlat);
                return [0, 0];
            }
        }, {
            key: "switch_",
            value: function switch_() {
                if (this.isLayerShow_()) {
                    this.isLayerShow_(false);
                } else {
                    this.isLayerShow_(true);
                }
            }
        }, {
            key: "setVisible",
            value: function setVisible(isShow) {
                this.layerEntity_.layer.setVisible(isShow);
                this.isLayerShow_(isShow);
            }
        }, {
            key: "featureAppand",
            value: function featureAppand(olFeature, data) {
                olFeature.id = "anchorageEvent:" + data.Id;
                olFeature.data = data;
            }
        }, {
            key: "load",
            value: function load() {
                this.dataDTOSet_.Clear();
                var start, end;
                if (this.startPicker_ && this.endPicker_) {
                    this.startTime_ = this.startPicker_.value();
                    this.endTime_ = this.endPicker_.value();
                }
                start = fecha.format(this.startTime_, "YYYY-MM-DD HH:mm:ss");
                end = fecha.format(this.endTime_, "YYYY-MM-DD HH:mm:ss");
                return this.eventDealApi_.Get$start_end(start, end).then(function (pdata) {
                    return new Promise(function (resolve, reject) {
                        switch (pdata.state) {
                            case "apiok":
                                this.dataDTOSet_.Add(pdata.data);
                                resolve();
                                break;
                            default:
                                reject();
                        }
                    }.bind(this));
                }.bind(this)).catch(function (pdata) {
                    switch (pdata.state) {
                        case "apierr":
                            console.log("apierr", pdata.data);
                            break;
                    }
                    if (!pdata.state) throw pdata;
                });
            }
        }, {
            key: "showMainPanal",
            value: function showMainPanal(div) {
                if (!this.main_) {
                    this.main_ = $("<div></div>").css({ width: '100%', height: '100%', border: 0 }).dialog({
                        width: 'auto'
                    });
                } else {
                    this.main_.empty();
                }
                div.css({ 'min-width': '400px', height: '70%', width: '100%', 'z-index': '1', 'margin-top': '30px' }).appendTo(this.main_);
                if (!this.main_.dialog('isOpen')) {
                    this.main_.dialog('open');
                }
            }
        }, {
            key: "plot",
            value: function plot(option) {
                var list = [];
                var chartDiv = $('<div></div>');
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: chartDiv[0],
                        defaultSeriesType: 'line',
                        zoomType: 'x',
                        width: 600,
                        height: 500
                    },
                    title: {
                        text: option.title || ' ' //图表标题
                    },
                    subtitle: {
                        text: option.subtitle || ' ' //副标题
                    },
                    yAxis: {
                        title: { text: option.yAxis.name || '值' },
                        lineWidth: 2 //基线宽度
                    },
                    xAxis: {
                        title: { text: option.xAxis.name || '时间' },
                        categories: option.xAxis.data,
                        gridLineWidth: 1,
                        lineWidth: 2,
                        labels: { y: 26 } //x轴标签位置：距X轴下方26像素
                    },
                    series: option.series || [{
                        name: '北京',
                        data: [-4.6, -2.2, 4.5, 13.1, 19.8, 24.0, 25.8, 24.4, 19.3, 12.4, 4.1, -2.7]
                    }, {
                        name: '广州',
                        data: [13.3, 14.4, 17.7, 21.9, 24.6, 27.2, 30.8, 32.1, 27.2, 23.7, 21.3, 15.6]
                    }],
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false //取消鼠标滑向触发提示框
                        }
                    },
                    legend: {
                        //layout: 'horizontal',  //图例显示的样式：水平（horizontal）/垂直（vertical）
                        //backgroundColor: '#ffc', //图例背景色
                        //align: 'left',  //图例水平对齐方式
                        //verticalAlign: 'top',  //图例垂直对齐方式
                        //x: 100,  //相对X位移
                        //y: 70,   //相对Y位移
                        //floating: true, //设置可浮动
                        shadow: true //设置阴影
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false //右下角不显示LOGO
                    }
                });
                this.showMainPanal(chartDiv);
            }
        }, {
            key: "featureSelected",
            value: function featureSelected(feature) {
                if (!feature) return;
                var featureId = feature.id;
                if (!(typeof featureId == "string" && featureId.startsWith('anchorageEvent:'))) return null;
                var feature = this.layerEntity_.layer.getFeatureById(featureId);
                var data = feature.data;
                var $objInfo = $(objInfo);
                if (data) {
                    //shipName = data.name;
                    var viewModel = {
                        MMSI: data.MMSI,
                        EventTime: data.EventTime.replace("T", " "),
                        IsChina: data.IsChina ? "是" : "否",
                        IsEscape: data.IsEscape ? "是" : "否",
                        IsLiveLaw: data.IsLiveLaw ? "是" : "否",
                        IsNetVessel: data.IsNetVessel ? "是" : "否",
                        IsTrouble: data.IsTrouble ? "是" : "否",
                        LastUpdateTime: data.LastUpdateTime.replace("T", " "),
                        RouteName: data.RouteName,
                        ShipName: data.ShipName
                    };
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

        }, {
            key: "query",
            value: function query() {
                Promise.resolve().then(this.load.bind(this));
                //.then(this.menuClick.bind(this))
            }
        }, {
            key: "dataListClick",
            value: function dataListClick(data, evt) {
                //var f=this.layer.getFeatureById(data.target);
                this.map_.setFocus(data.target);
                console.log("click");
            }
        }]);

        return AnchorageEventPlugin;
    }();

    AnchorageEventPlugin = __decorate([__param(1, Plugins_1.inject('root')), __param(2, Plugins_1.inject('maps/ui/uiFrame')), __param(3, Plugins_1.inject("maps/map")), __param(4, Plugins_1.inject("ui/menu")), __param(5, Plugins_1.inject("maps/ui/detailViewer")), __param(6, Plugins_1.inject("maps/tools/setting"))], AnchorageEventPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AnchorageEventPlugin;
});