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
define(["require", "exports", "jquery", "text!./htmls/ObjInfo.html", "knockout", "../../../../seecool/plugins/Plugins", "../../../../seecool/utils/JSTool", "../../../../seecool/utils/MapTool", "../../../../seecool/StaticLib", "./uis/Alarm", "./uis/PlotStyleSet", "./SidePanel", "./uis/PlotInfoSet", "../plot/datas/PlotDataApi"], function (require, exports, $, objInfo, ko, Plugins_1, JSTool_1, MapTool_1, StaticLib_1, Alarm_1, PlotStyleSet_1, SidePanel_1, PlotInfoSet_1, PlotDataApi_1) {
    "use strict";

    var PlotUiPlugin = function () {
        function PlotUiPlugin(config, plot, search, detailViewer, frame, setting, map) {
            var _this = this;

            _classCallCheck(this, PlotUiPlugin);

            this.frame_ = frame;
            this.config_ = config;
            this.setting_ = setting;
            this.searchPlugin_ = search;
            this.map_ = map;
            this.plot_ = plot;
            detailViewer.registerSelectFocusEvent("plotSelectFocus", this.featureSelected_.bind(this));
            var sideView = frame.sideView;
            var toolbar = frame.toolbars['right'];
            toolbar.addButton({
                text: '标绘',
                icon: 'fa fa-magic',
                click: function click() {
                    sideView.open(new SidePanel_1.default({
                        features: _this.plot_.featuresList,
                        plotToolCancel: _this.plotToolCancel_.bind(_this),
                        plotToolStart: _this.plotToolStart_.bind(_this),
                        plotItemClick: _this.plotItemClick_.bind(_this),
                        plotItemDelete: _this.plotItemDelete_.bind(_this),
                        plotItemSetting: _this.plotItemSetting_.bind(_this)
                    }));
                }
            });
            this.dataApi_ = new PlotDataApi_1.PlotDataApi(this.config_.plotInfoApi || "api/plotInfo");
            // this.status_ = new Status(this);
            // this.status_.ConditionTurn(true, "hided");//hided
            // this.switch_(null);
            this.isLayerShow_ = ko.observable(true);
            this.isLayerShow_.subscribe(function (v) {
                this.setVisible(v);
            }.bind(this));
            var switch1 = StaticLib_1.CheckBox({
                checked: this.isLayerShow_,
                view: "标绘",
                click: this.switch_.bind(this)
            });
            this.setting_.registerSettingElement("mapSwitch", switch1);
            search.addProvider({
                plot_: this.plot_,
                search: function search(keyword) {
                    var plot = this.plot_;
                    return new Promise(function (resolve, reject) {
                        var r = plot.searchDatas(keyword).map(function (v) {
                            return {
                                type: "plot",
                                id: v.target.id,
                                match: v.data,
                                tags: ['标绘'],
                                title: v.data,
                                target: v.target
                            };
                        });
                        resolve(r);
                    });
                },
                onItemClick: function onItemClick(item) {
                    if (item.type === 'plot') {
                        this.plot_.setFocus(item.Id);
                        return true;
                    }
                }
            });
        }

        _createClass(PlotUiPlugin, [{
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
                this.plot_.setVisible(isShow);
                this.isLayerShow_(isShow);
            }
        }, {
            key: "featureSelected_",
            value: function featureSelected_(feature) {
                if (!feature) return;
                var featureId = feature.id;
                if (!(typeof featureId == "string" && featureId.startsWith('plot:'))) return null;
                //var feature = this.layerEntity_.Layer.getFeatureById(featureId);
                var data = feature.data;
                var shipName = "?";
                if (data) {
                    shipName = data.name;
                    var oi = $(objInfo);
                    var viewModel = {
                        Id: data.Id,
                        Name: data.Name,
                        UserId: data.UserID
                    };
                    ko.applyBindings(viewModel, oi[0]);
                    oi.data("title", "标绘物标信息");
                    return oi;
                }
                return oi;
            }
        }, {
            key: "plotItemClick_",
            value: function plotItemClick_(data, evt) {
                this.plot_.setFocus(data.Id);
                console.log("clik");
            }
        }, {
            key: "toDTO_",
            value: function toDTO_(obj) {
                var dto = new StaticLib_1.PlotDataDTO();
                dto.Id = obj.Id;
                dto.Name = obj.Name;
                dto.UserId = obj.UserId;
                dto.Style = JSON.stringify(obj.Style);
                var tg = {};
                if (obj.Geomatics && obj.Geomatics.Points) {
                    tg.ShapeType = obj.Geomatics.ShapeType;
                    var points = obj.Geomatics.Points.map(function (v) {
                        return '' + v[0] + ',' + v[1];
                    });
                    tg.Points = points;
                }
                dto.Geomatics = JSON.stringify(tg);
                return dto;
            }
        }, {
            key: "reLoadData_",
            value: function reLoadData_() {
                this.plot_.reLoadData();
            }
        }, {
            key: "plotItemDelete_",
            value: function plotItemDelete_(data, evt) {
                evt.stopPropagation();
                var massage = new Alarm_1.default({ message: "是否要删除？" });
                massage.show().then(function () {
                    return this.dataApi_.Delete$id(data.Id);
                }.bind(this)).then(function (pdata) {
                    switch (pdata.state) {
                        case 'apiok':
                            this.reLoadData_();
                            break;
                    }
                }.bind(this)).catch(function (pdata) {
                    switch (pdata.state) {
                        case 'apierr':
                            alert("网络问题,删除失败");
                            break;
                    }
                    if (!pdata.state) throw pdata;
                });
            }
        }, {
            key: "plotItemSetting_",
            value: function plotItemSetting_(data, evt) {
                evt.stopPropagation();
                var t = null;
                //todo plot_.setFocus
                //this.map_.setFocus(this.getFeatureById_(this.featureId_(data.Id)));
                Promise.resolve().then(function () {
                    //var strokeColor=(t=f)&&(t=t.getStyle())&&(t=t.getStroke())&&(t=t.getColor())||"#000000";
                    //var fillColor=(t=f)&&(t=t.getStyle())&&(t=t.getFill())&&(t=t.getColor())||"#000000";
                    //var textColor=(t = f) && (t = t.getStyle()) && (t = t.getText()) &&(t=t.getFill())&& (t = t.getColor()) || '#000000';
                    //var shadowColor=(t = f) && (t = t.getStyle()) && (t = t.getText()) &&(t=t.getStroke())&& (t = t.getColor()) || '#000000'
                    var plotData = data;
                    var stroke = (t = plotData) && (t = t.Style) && (t = t.Stroke) || "#FF000000";
                    var fillColor = (t = plotData) && (t = t.Style) && (t = t.Fill) || "#00000000";
                    var textColor = (t = plotData) && (t = t.Style) && (t = t.TextStyle) && (t = t.Color) || '#FF000000';
                    var strokeType = (t = plotData) && (t = t.Style) && (t = t.StrokeDashArray) ? 'dash' : 'solid';
                    var strokeWidth = (t = plotData) && (t = t.Style) && (t = t.StrokeThickness) || 1;
                    fillColor = MapTool_1.MapTool.olColorParseARGB(fillColor);
                    var fill = MapTool_1.MapTool.olColorFormat(fillColor, '#HH3');
                    var diapha = '' + fillColor[3];
                    var plotStyleSet = new PlotStyleSet_1.default({
                        name: plotData.Name,
                        strokeColor: MapTool_1.MapTool.olColorFormat(MapTool_1.MapTool.olColorParseARGB(stroke), '#HH3'),
                        strokeType: strokeType,
                        strokeWidth: strokeWidth,
                        diapha: diapha,
                        fillColor: fill,
                        textColor: MapTool_1.MapTool.olColorFormat(MapTool_1.MapTool.olColorParseARGB(textColor), '#HH3')
                    });
                    return plotStyleSet.show();
                }.bind(this)).then(function (pdata) {
                    return new Promise(function (resolve, reject) {
                        switch (pdata.state) {
                            case "ok":
                                var option = pdata.data;
                                var plotData = data; //PlotDataApiSet.fromDTO(f.data);
                                plotData.Name = option.name;
                                if (!plotData.Style) plotData.Style = new StaticLib_1.DrawingStyle();
                                var c = ol.color.asArray(option.strokeColor);
                                c[3] = 1;
                                plotData.Style.Stroke = MapTool_1.MapTool.olColorFormat(c, '#AARRGGBB');
                                var diapha = parseFloat(option.diapha);
                                var c = ol.color.asArray(option.fillColor);
                                c[3] = diapha;
                                plotData.Style.Fill = MapTool_1.MapTool.olColorFormat(c, '#AARRGGBB');
                                if (option.strokeType == "dash") {
                                    var dash = plotData.Style.StrokeDashArray || [10, 10];
                                    plotData.Style.StrokeDashArray = dash.toString();
                                } else {
                                    plotData.Style.StrokeDashArray = null;
                                }
                                var c = ol.color.asArray(option.textColor);
                                c[3] = 1;
                                plotData.Style.TextStyle = plotData.Style.TextStyle || new StaticLib_1.DrawingStyle();
                                plotData.Style.TextStyle.Color = MapTool_1.MapTool.olColorFormat(c, '#AARRGGBB');
                                plotData.Style.StrokeThickness = option.strokeWidth;
                                resolve({ state: 'ok', data: plotData });
                                break;
                        }
                    }.bind(this));
                }.bind(this)).then(function (pdata) {
                    var plotData = pdata.data;
                    var dto = this.toDTO_(plotData);
                    return this.dataApi_.Put$id(dto.Id, dto).then(function (pdata) {
                        switch (pdata.state) {
                            case 'apiok':
                                this.reLoadData_();
                                break;
                        }
                    }.bind(this));
                }.bind(this)).catch(function (pdata) {
                    switch (pdata.state) {
                        case "cancel":
                            break;
                        case "close":
                            break;
                    }
                    if (!pdata.state) throw pdata;
                });
                console.log("setting");
            }
        }, {
            key: "plotToolCancel_",
            value: function plotToolCancel_() {
                this.map_.map.removeInteraction(this.interActionDraw_);
            }
        }, {
            key: "plotToolStart_",
            value: function plotToolStart_(toolInfo) {
                this.plotToolCancel_();
                this.addInteraction_(toolInfo.name);
                this.plotShapeType_ = toolInfo.name;
            }
        }, {
            key: "addInteraction_",
            value: function addInteraction_(toolType) {
                var value = toolType;
                if (value !== 'None') {
                    var geometryFunction, maxPoints;
                    if (value === 'Line') {
                        value = 'LineString';
                        maxPoints = 2;
                    }
                    if (value === 'PolyLine') {
                        value = 'LineString';
                    }
                    if (value === 'Square') {
                        value = 'Circle';
                        geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
                    } else if (value === 'Rectanlge') {
                        value = 'LineString';
                        maxPoints = 2;
                        geometryFunction = function geometryFunction(coordinates, geometry) {
                            if (!geometry) {
                                geometry = new ol.geom.Polygon(null);
                            }
                            var start = coordinates[0];
                            var end = coordinates[1];
                            geometry.setCoordinates([[start, [start[0], end[1]], end, [end[0], start[1]], start]]);
                            return geometry;
                        };
                    }
                }
                this.interActionDraw_ = new ol.interaction.Draw({
                    source: this.plot_.layerEntity_.Source,
                    style: this.plot_.layerEntity_.Layer.getStyle(),
                    type: value,
                    geometryFunction: geometryFunction,
                    maxPoints: maxPoints
                });
                this.interActionDraw_.on("drawend", this.drawendfun_.bind(this), this.interActionDraw_);
                this.map_.map.addInteraction(this.interActionDraw_);
            }
        }, {
            key: "drawendfun_",
            value: function drawendfun_(evt) {
                var f = evt.feature;
                this.addPlotInfo_(f);
            }
        }, {
            key: "addPlotInfo_",
            value: function addPlotInfo_(f) {
                var g = f.getGeometry();
                var A = g.flatCoordinates;
                var coordC = JSTool_1.JSTool.ArrayToArraysSplit(A, 2);
                var lonlats = coordC.map(function (c) {
                    return ol.proj.toLonLat(c);
                });
                switch (StaticLib_1.ShapeType[this.plotShapeType_]) {
                    case StaticLib_1.ShapeType.Point:
                        break;
                    case StaticLib_1.ShapeType.Line:
                        break;
                    case StaticLib_1.ShapeType.PolyLine:
                        break;
                    case StaticLib_1.ShapeType.Rectanlge:
                        lonlats = [lonlats[0], lonlats[2]];
                        break;
                    case StaticLib_1.ShapeType.Circle:
                        break;
                    case StaticLib_1.ShapeType.Polygon:
                        break;
                }
                var plotInfoSet = new PlotInfoSet_1.default({ lonlats: lonlats });
                plotInfoSet.show().then(function (pdata) {
                    return new Promise(function (resolve, reject) {
                        var plotData;
                        switch (pdata.state) {
                            case "ok":
                                //构建PlotDate
                                var plotData = new StaticLib_1.PlotData();
                                plotData.Name = pdata.data.name;
                                plotData.Id = 0;
                                plotData.UserId = 1; //this.user_.Id; //todo add user plugin
                                var geom = new StaticLib_1.Geomatics();
                                geom.ShapeType = StaticLib_1.ShapeType[this.plotShapeType_];
                                geom.Points = pdata.data.lonlats.map(function (c) {
                                    return [c.lon, c.lat];
                                });
                                plotData.Geomatics = geom;
                                break;
                        }
                        resolve(plotData);
                    }.bind(this));
                }.bind(this)).then(function (plotData) {
                    var plotData = plotData;
                    var plotInfo = this.toDTO_(plotData);
                    return this.dataApi_.Post(plotInfo).then(function (pdata) {
                        return new Promise(function (resolve, reject) {
                            if (pdata.state == 'apiok') {
                                resolve({ state: 'ok', data: plotData });
                            } else {
                                reject({ state: 'err', data: plotData });
                            }
                        });
                    });
                }.bind(this)).then(function (pdata) {
                    return new Promise(function (resolve, reject) {
                        var data = pdata.data;
                        if (data) {
                            // this.datas_.push(data);
                            // this.featureAppand_(f, data);
                            //this.dataDTOSet_.Add([data]);
                            //this.layer_.addPlotFeature(f);
                            //var i = this.plotListItem_(f);
                            // var plotListdata = this.sidePanlviewModel_.plotdata();
                            // plotListdata.push(i);
                            // this.sidePanlviewModel_.plotdata(plotListdata);
                            resolve({ state: "apiok", data: null });
                        }
                    }.bind(this));
                }.bind(this)).then(function (pdata) {
                    this.map_.map.removeInteraction(this.interActionDraw_);
                    this.reLoadData_();
                }.bind(this)).catch(function (pdata) {
                    switch (pdata.state) {
                        case "cancel":
                        case "close":
                            this.layerEntity_.Source.removeFeature(f);
                            break;
                    }
                    this.map_.map.removeInteraction(this.interActionDraw_);
                    if (!pdata.state) throw pdata;
                }.bind(this));
            }
        }, {
            key: "search_",
            value: function search_(key) {
                return new Promise(function (resolve, reject) {
                    var r = this.plot_.searchDatas(key).map(function (v) {
                        var data = v.data;
                        return {
                            type: "plot",
                            match: v.data,
                            tags: ['标绘'],
                            data: data,
                            target: v.target
                        };
                    }.bind(this));
                    resolve({ state: "ok", data: r });
                }.bind(this));
            }
        }]);

        return PlotUiPlugin;
    }();

    PlotUiPlugin = __decorate([__param(1, Plugins_1.inject("maps/layers/plot")), __param(2, Plugins_1.inject('maps/ui/search')), __param(3, Plugins_1.inject("maps/ui/detailViewer")), __param(4, Plugins_1.inject('maps/ui/uiFrame')), __param(5, Plugins_1.inject("maps/tools/setting")), __param(6, Plugins_1.inject("maps/map"))], PlotUiPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PlotUiPlugin;
});