import * as ol from "openlayers";

import {inject} from "seecool/plugins/Plugins";
import {Frame} from "../../ui/frame/main";
//import {Config} from "seecool/StaticLib";
//import {DropMemuButton} from "seecool/StaticLib";

class MeasurePlugin {
    private map_;
    private typeSelect_ = {value: "area"};
    private geodesicCheckbox_ = {checked: true};
    private vector_;
    private source_;
    private wgs84Sphere_;
    private sketch_;
    private helpTooltipElement_;
    private helpTooltip_;
    private measureTooltipElement_;
    private measureTooltip_;
    private measureTooltipList_ = [];
    private continuePolygonMsg_ = '面积测量';
    private continueLineMsg_ = '长度测量';
    private pointermoveLisenerKey_;
    private draw_; // global so we can remove it later
    private toolPanal_;
    private frame_;

    constructor(config,
                @inject('maps/ui/frame')frame: Frame,
                @inject("maps/map") map) {
        this.frame_ = frame;
        this.map_ = map;

        frame.toolbars["right"].addButton({
            text: "测量",
            items: [{
                text: "距离",
                click: this.measureLengthInit_.bind(this)
            }, {
                text: "面积",
                click: this.measureAreaInit_.bind(this)
            }, {
                text: "取消",
                click: this.measureToolsCancal_.bind(this)
            }]
        })

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

    private init_() {
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

    private measureToolsCancalClick_() {
        this.measureToolsCancal_();
        this.takeToolPanalClose_();
    }

    private measureLengthInitClick_() {
        this.measureLengthInit_();
        this.takeToolPanalOpen_();
    }

    private measureAreaInitClick_() {
        this.measureAreaInit_();
        this.takeToolPanalOpen_();
    }

    private takeToolPanalOpen_() {
        if (!this.toolPanal_) {
            this.toolPanal_ = $(`
            <div>
                <span>点击开始绘制,双击结束绘制</span>
            </div>
            `).bind("click", this.measureToolsCancal_.bind(this));
            this.toolPanal_.dialog({
                width: 100,
                height: "auto",
                position: {//['right','top'],
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
                autoOpen: false,
            })
        }
        if (!this.toolPanal_.dialog('isOpen')) {
            this.toolPanal_.dialog('open');
        }
    }

    private takeToolPanalClose_() {
        if (this.toolPanal_.dialog('isOpen')) {
            this.toolPanal_.dialog('close');
        }
    }

    private measureLengthInit_() {
        this.typeSelect_.value = "length";
        this.map_.map.unByKey(this.pointermoveLisenerKey_);
        $(this.map_.map.getViewport()).off('mouseout');
        this.InteractionInit_();
    }

    private measureAreaInit_() {
        this.typeSelect_.value = "area";
        this.map_.map.unByKey(this.pointermoveLisenerKey_);
        $(this.map_.map.getViewport()).off('mouseout');
        this.InteractionInit_();
    }

    private measureToolsCancal_() {
        this.InteractionDestr_();
    }

    private InteractionInit_() {
        this.map_.map.removeInteraction(this.draw_);
        this.pointermoveLisenerKey_ = this.map_.map.on('pointermove', this.pointerMoveHandler_.bind(this));
        $(this.map_.map.getViewport()).on('mouseout', function () {
            $(this.helpTooltipElement_).addClass('hidden');
        }.bind(this));
        this.addInteraction_();
        //this.map_.map.addInteraction();
    }

    private InteractionDestr_() {
        this.map_.map.removeInteraction(this.draw_);
        this.map_.map.unByKey(this.pointermoveLisenerKey_);
        $(this.map_.map.getViewport()).off('mouseout');
        //this.measureTooltipElement_=null;
        $(this.measureTooltipElement_).addClass('hidden');
        $(this.helpTooltipElement_).addClass('hidden');
        this.map_.map.removeOverlay(this.helpTooltip_);
        this.map_.map.removeOverlay(this.measureTooltip_);
        for (var i of this.measureTooltipList_) {
            this.map_.map.removeOverlay(i);
        }
        this.source_.clear();
    }

    private pointerMoveHandler_(evt) {
        if (evt.dragging) {
            return;
        }
        /** @type {string} */
        var helpMsg = '点击绘制';

        if (this.sketch_) {
            var geom = (this.sketch_.getGeometry());
            if (geom instanceof ol.geom.Polygon) {
                helpMsg = this.continuePolygonMsg_;
            } else if (geom instanceof ol.geom.LineString) {
                helpMsg = this.continueLineMsg_;
            }
        }

        this.helpTooltipElement_.innerHTML = helpMsg;
        this.helpTooltip_.setPosition(evt.coordinate);

        $(this.helpTooltipElement_).removeClass('hidden');
    };

    private addInteraction_() {
        var type = (this.typeSelect_.value == 'area' ? 'Polygon' : 'LineString');
        this.draw_ = new ol.interaction.Draw({
            source: this.source_,
            type: /** @type {ol.geom.GeometryType} */ (type),
            style: new ol.style.Style({
                fill: new ol.style.Fill({ //使用自己的style 绘制模式下
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({//线
                    color: 'rgba(0, 0, 0, 1)',
                    lineDash: [10, 10],//虚线 实虚交替
                    width: 2
                }),
                image: new ol.style.Circle({ //光标
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
        this.draw_.on('drawstart',
            function (evt) {
                // set sketch
                this.sketch_ = evt.feature;//获取当前正在画的feature

                /** @type {ol.Coordinate|undefined} */
                var tooltipCoord = evt.coordinate;

                listener = this.sketch_.getGeometry().on('change', function (evt) {
                    var geom = evt.target;
                    var output;
                    if (geom instanceof ol.geom.Polygon) {
                        output = this.formatArea_(/** @type {ol.geom.Polygon} */ (geom));
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof ol.geom.LineString) {
                        output = this.formatLength_(/** @type {ol.geom.LineString} */ (geom));
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    this.measureTooltipElement_.innerHTML = output;
                    this.measureTooltip_.setPosition(tooltipCoord);
                }.bind(this));
            }, this);

        this.draw_.on('drawend',
            function (evt) {
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

    private createHelpTooltip_() {
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

    private createMeasureTooltip_() {
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

    private formatLength_(line) {
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
            output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km';
        } else {
            output = (Math.round(length * 100) / 100) +
                ' ' + 'm';
        }
        return output;
    };

    private formatArea_(polygon) {
        var area;
        if (this.geodesicCheckbox_.checked) {
            var sourceProj = this.map_.map.getView().getProjection();
            var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
                sourceProj, 'EPSG:4326'));
            var coordinates = geom.getLinearRing(0).getCoordinates();
            area = Math.abs(this.wgs84Sphere_.geodesicArea(coordinates));
        } else {
            area = polygon.getArea();
        }
        var output;
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
                ' ' + 'km<sup>2</sup>';
        } else {
            output = (Math.round(area * 100) / 100) +
                ' ' + 'm<sup>2</sup>';
        }
        return output;
    };
}

export default MeasurePlugin;