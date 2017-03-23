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
define(["require", "exports", "jquery", "openlayers", "../../../../seecool/plugins/Plugins"], function (require, exports, $, ol, Plugins_1) {
    "use strict";

    var MeasurePlugin = function () {
        function MeasurePlugin(config, frame, map) {
            _classCallCheck(this, MeasurePlugin);

            this.typeSelect_ = { value: "area" };
            this.geodesicCheckbox_ = { checked: true };
            this.measureTooltipList_ = [];
            this.continuePolygonMsg_ = '面积测量';
            this.continueLineMsg_ = '长度测量';
            this.frame_ = frame;
            this.map_ = map;
            frame.toolbars["right"].addButton({
                icon: 'fa fa-clone',
                text: "测量",
                items: [{
                    text: "距离",
                    icon: 'fa fa-ellipsis-v',
                    click: this.measureLengthInit_.bind(this)
                }, {
                    text: "面积",
                    icon: 'fa fa-square-o',
                    click: this.measureAreaInit_.bind(this)
                }, {
                    text: "取消",
                    icon: 'fa fa-close',
                    click: this.measureToolsCancal_.bind(this)
                }]
            });
            // //var button=DropMemuButton({
            // //    name:"test",
            // //    view:"量算",
            // //    list:[
            // //        {name:"test1",view:"距离量算",event:this.measureLengthInit.bind(this)},
            // //        {name:"test2",view:"面积量算",event:this.measureAreaInit.bind(this)},
            // //        {name:"test2",view:"取消",event:this.measureToolsCancal.bind(this)},
            // //        {name:"test1",view:"测试1",event:function(){alert("OK")}}
            // //    ],
            // //});
            // //ui.RegisterToolElementRight("menureTool",button);
            //
            // //ui.RegisterToolButton("menureTool","menureCancal","取消",this.measureToolsCancal.bind(this));
            // //ui.RegisterToolButton("menureTool","menureLength","测长度",this.measureLengthInit.bind(this));
            // //ui.RegisterToolButton("menureTool","menureArea","测面积",this.measureAreaInit.bind(this));
            // this.ui.RegisterToolButton("menureTool","menure","量算",this.measureLengthInit.bind(this));
            this.init_();
        }

        _createClass(MeasurePlugin, [{
            key: "init_",
            value: function init_() {
                this.wgs84Sphere_ = new ol.Sphere(6378137);
                this.source_ = new ol.source.Vector();
                this.vector_ = new ol.layer.Vector({
                    source: this.source_,
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ffcc33',
                            width: 2
                        }),
                        image: new ol.style.Circle({
                            radius: 7,
                            fill: new ol.style.Fill({
                                color: '#ffcc33'
                            })
                        })
                    })
                });
                this.map_.map.addLayer(this.vector_);
            }
        }, {
            key: "measureToolsCancalClick_",
            value: function measureToolsCancalClick_() {
                this.measureToolsCancal_();
                this.takeToolPanalClose_();
            }
        }, {
            key: "measureLengthInitClick_",
            value: function measureLengthInitClick_() {
                this.measureLengthInit_();
                this.takeToolPanalOpen_();
            }
        }, {
            key: "measureAreaInitClick_",
            value: function measureAreaInitClick_() {
                this.measureAreaInit_();
                this.takeToolPanalOpen_();
            }
        }, {
            key: "takeToolPanalOpen_",
            value: function takeToolPanalOpen_() {
                if (!this.toolPanal_) {
                    this.toolPanal_ = $("\n            <div>\n                <span>\u70B9\u51FB\u5F00\u59CB\u7ED8\u5236,\u53CC\u51FB\u7ED3\u675F\u7ED8\u5236</span>\n            </div>\n            ").bind("click", this.measureToolsCancal_.bind(this));
                    this.toolPanal_.dialog({
                        width: 100,
                        height: "auto",
                        position: {
                            of: $("#container_"),
                            my: "right top",
                            at: "right top",
                            collision: "flip flip"
                        },
                        close: this.measureToolsCancal_.bind(this),
                        buttons: {
                            "距离量算": this.measureLengthInit_.bind(this),
                            "面积量算": this.measureAreaInit_.bind(this),
                            "结束量算": this.takeToolPanalClose_.bind(this)
                        },
                        autoOpen: false
                    });
                }
                if (!this.toolPanal_.dialog('isOpen')) {
                    this.toolPanal_.dialog('open');
                }
            }
        }, {
            key: "takeToolPanalClose_",
            value: function takeToolPanalClose_() {
                if (this.toolPanal_.dialog('isOpen')) {
                    this.toolPanal_.dialog('close');
                }
            }
        }, {
            key: "measureLengthInit_",
            value: function measureLengthInit_() {
                this.typeSelect_.value = "length";
                this.map_.map.unByKey(this.pointermoveLisenerKey_);
                $(this.map_.map.getViewport()).off('mouseout');
                this.InteractionInit_();
            }
        }, {
            key: "measureAreaInit_",
            value: function measureAreaInit_() {
                this.typeSelect_.value = "area";
                this.map_.map.unByKey(this.pointermoveLisenerKey_);
                $(this.map_.map.getViewport()).off('mouseout');
                this.InteractionInit_();
            }
        }, {
            key: "measureToolsCancal_",
            value: function measureToolsCancal_() {
                this.InteractionDestr_();
            }
        }, {
            key: "InteractionInit_",
            value: function InteractionInit_() {
                this.map_.map.removeInteraction(this.draw_);
                this.pointermoveLisenerKey_ = this.map_.map.on('pointermove', this.pointerMoveHandler_.bind(this));
                $(this.map_.map.getViewport()).on('mouseout', function () {
                    $(this.helpTooltipElement_).addClass('hidden');
                }.bind(this));
                this.addInteraction_();
                //this.map_.map.addInteraction();
            }
        }, {
            key: "InteractionDestr_",
            value: function InteractionDestr_() {
                this.map_.map.removeInteraction(this.draw_);
                this.map_.map.unByKey(this.pointermoveLisenerKey_);
                $(this.map_.map.getViewport()).off('mouseout');
                //this.measureTooltipElement_=null;
                $(this.measureTooltipElement_).addClass('hidden');
                $(this.helpTooltipElement_).addClass('hidden');
                this.map_.map.removeOverlay(this.helpTooltip_);
                this.map_.map.removeOverlay(this.measureTooltip_);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.measureTooltipList_[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var i = _step.value;

                        this.map_.map.removeOverlay(i);
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

                this.source_.clear();
            }
        }, {
            key: "pointerMoveHandler_",
            value: function pointerMoveHandler_(evt) {
                if (evt.dragging) {
                    return;
                }
                /** @type {string} */
                var helpMsg = '点击绘制';
                if (this.sketch_) {
                    var geom = this.sketch_.getGeometry();
                    if (geom instanceof ol.geom.Polygon) {
                        helpMsg = this.continuePolygonMsg_;
                    } else if (geom instanceof ol.geom.LineString) {
                        helpMsg = this.continueLineMsg_;
                    }
                }
                this.helpTooltipElement_.innerHTML = helpMsg;
                this.helpTooltip_.setPosition(evt.coordinate);
                $(this.helpTooltipElement_).removeClass('hidden');
            }
        }, {
            key: "addInteraction_",
            value: function addInteraction_() {
                var type = this.typeSelect_.value == 'area' ? 'Polygon' : 'LineString';
                this.draw_ = new ol.interaction.Draw({
                    source: this.source_,
                    type: /** @type {ol.geom.GeometryType} */type,
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0, 1)',
                            lineDash: [10, 10],
                            width: 2
                        }),
                        image: new ol.style.Circle({
                            radius: 3,
                            stroke: new ol.style.Stroke({
                                color: 'rgba(0, 0, 0, 0.7)'
                            }),
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 255, 255, 0.2)'
                            })
                        })
                    })
                });
                this.map_.map.addInteraction(this.draw_);
                this.createMeasureTooltip_(); //提示框
                this.createHelpTooltip_(); //右边的提示
                var listener;
                this.draw_.on('drawstart', function (evt) {
                    // set sketch
                    this.sketch_ = evt.feature; //获取当前正在画的feature
                    /** @type {ol.Coordinate|undefined} */
                    var tooltipCoord = evt.coordinate;
                    listener = this.sketch_.getGeometry().on('change', function (evt) {
                        var geom = evt.target;
                        var output;
                        if (geom instanceof ol.geom.Polygon) {
                            output = this.formatArea_( /** @type {ol.geom.Polygon} */geom);
                            tooltipCoord = geom.getInteriorPoint().getCoordinates();
                        } else if (geom instanceof ol.geom.LineString) {
                            output = this.formatLength_( /** @type {ol.geom.LineString} */geom);
                            tooltipCoord = geom.getLastCoordinate();
                        }
                        this.measureTooltipElement_.innerHTML = output;
                        this.measureTooltip_.setPosition(tooltipCoord);
                    }.bind(this));
                }, this);
                this.draw_.on('drawend', function (evt) {
                    this.measureTooltipElement_.className = 'tooltip tooltip-static';
                    this.measureTooltip_.setOffset([0, -7]);
                    // unset sketch
                    this.sketch_ = null;
                    // unset tooltip so that a new one can be created
                    this.measureTooltipElement_ = null;
                    this.createMeasureTooltip_();
                    ol.Observable.unByKey(listener);
                }, this);
            }
        }, {
            key: "createHelpTooltip_",
            value: function createHelpTooltip_() {
                if (this.helpTooltipElement_) {
                    this.helpTooltipElement_.parentNode.removeChild(this.helpTooltipElement_);
                }
                this.helpTooltipElement_ = document.createElement('div');
                this.helpTooltipElement_.className = 'tooltip hidden';
                this.helpTooltip_ = new ol.Overlay({
                    element: this.helpTooltipElement_,
                    offset: [15, 0],
                    positioning: 'center-left'
                });
                this.map_.map.addOverlay(this.helpTooltip_);
            }
        }, {
            key: "createMeasureTooltip_",
            value: function createMeasureTooltip_() {
                if (this.measureTooltipElement_) {
                    this.measureTooltipElement_.parentNode.removeChild(this.measureTooltipElement_);
                }
                this.measureTooltipElement_ = document.createElement('div');
                this.measureTooltipElement_.className = 'tooltip tooltip-measure';
                this.measureTooltipList_.push(this.measureTooltip_);
                this.measureTooltip_ = new ol.Overlay({
                    element: this.measureTooltipElement_,
                    offset: [0, -15],
                    positioning: 'bottom-center'
                });
                this.map_.map.addOverlay(this.measureTooltip_);
            }
        }, {
            key: "formatLength_",
            value: function formatLength_(line) {
                var length;
                if (this.geodesicCheckbox_.checked) {
                    var coordinates = line.getCoordinates();
                    length = 0;
                    var sourceProj = this.map_.map.getView().getProjection();
                    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
                        var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
                        var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
                        length += this.wgs84Sphere_.haversineDistance(c1, c2);
                    }
                } else {
                    length = Math.round(line.getLength() * 100) / 100;
                }
                var output;
                if (length > 1000) {
                    output = Math.round(length / 1000 * 100) / 100 + ' ' + 'km';
                } else {
                    output = Math.round(length * 100) / 100 + ' ' + 'm';
                }
                return output;
            }
        }, {
            key: "formatArea_",
            value: function formatArea_(polygon) {
                var area;
                if (this.geodesicCheckbox_.checked) {
                    var sourceProj = this.map_.map.getView().getProjection();
                    var geom = polygon.clone().transform(sourceProj, 'EPSG:4326');
                    var coordinates = geom.getLinearRing(0).getCoordinates();
                    area = Math.abs(this.wgs84Sphere_.geodesicArea(coordinates));
                } else {
                    area = polygon.getArea();
                }
                var output;
                if (area > 10000) {
                    output = Math.round(area / 1000000 * 100) / 100 + ' ' + 'km<sup>2</sup>';
                } else {
                    output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
                }
                return output;
            }
        }]);

        return MeasurePlugin;
    }();

    MeasurePlugin = __decorate([__param(1, Plugins_1.inject('maps/ui/uiFrame')), __param(2, Plugins_1.inject("maps/map"))], MeasurePlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MeasurePlugin;
});