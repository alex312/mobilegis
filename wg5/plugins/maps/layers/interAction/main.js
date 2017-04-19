var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "knockout", "../../../../seecool/plugins/Plugins"], function (require, exports, ko, Plugins_1) {
    "use strict";
    /**
     * 临时Feature绘制|展现使用
     * 绘制一个xxx图形
     * 显示一个xxx图形
     */
    var InterActionPlugin = (function () {
        function InterActionPlugin(config, map) {
            var _this = this;
            this.sharps_ = {
                Point: {
                    type: 'Point',
                },
                Line: {
                    type: 'LineString',
                    maxPoints: 2
                },
                LineString: {
                    type: 'LineString',
                },
                PolyLine: {
                    type: 'LineString',
                },
                Circle: {
                    type: 'Circle',
                },
                Square: {
                    type: 'Circle',
                    maxPoints: 2,
                    geometryFunction: ol.interaction.Draw.createRegularPolygon(4)
                },
                Polygon: {
                    type: 'Polygon',
                },
                Rectanlge: {
                    type: 'LineString',
                    maxPoints: 2,
                    geometryFunction: function (coordinates, geometry) {
                        if (!geometry) {
                            geometry = new ol.geom.Polygon(null);
                        }
                        var start = coordinates[0];
                        var end = coordinates[1];
                        geometry.setCoordinates([
                            [start, [start[0], end[1]], end, [end[0], start[1]], start]
                        ]);
                        return geometry;
                    }
                }
            };
            this.rejectFunList_ = [];
            this.map_ = map;
            var drawSource = new ol.source.Vector({ wrapX: false });
            var drawLayer = new ol.layer.Vector({
                source: drawSource,
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
            this.map_.map.addLayer(drawLayer);
            this.drawSource_ = drawSource;
            this.drawLayer_ = drawLayer;
            this.interactionMode_ = ko.observable('free');
            this.interactionMode_.subscribe(function (data) {
                _this.map_.trigger('setInteractionMode', data);
            });
        }
        Object.defineProperty(InterActionPlugin.prototype, "interactionMode", {
            get: function () {
                var _this = this;
                return ko.computed(function () {
                    return _this.interactionMode_();
                });
            },
            enumerable: true,
            configurable: true
        });
        InterActionPlugin.prototype.getRectangle = function () {
            return this.getSharp('Rectanlge');
        };
        InterActionPlugin.prototype.showFeature = function (feature) {
            return this.showFeature_(feature);
        };
        InterActionPlugin.prototype.getSharp = function (sharp, options) {
            return this.getSharp_(sharp, options);
        };
        InterActionPlugin.prototype.cancel = function () {
            return this.cancel_();
        };
        InterActionPlugin.prototype.cancel_ = function () {
            this.rejectFunList_.map(function (reject) {
                reject("取消绘制");
            });
            this.rejectFunList_.splice(0, this.rejectFunList_.length);
            this.removeDrawAreaInteraction_();
        };
        Object.defineProperty(InterActionPlugin.prototype, "sharps", {
            // private getRectangle_() {
            //     return new Promise(function (resolve, reject) {
            //         this.interactionMode_('busy');
            //         this.addDrawAreaInteraction_((evt)=> {
            //             this.removeDrawAreaInteraction_();
            //             resolve({
            //                 layer: this.drawLayer_,
            //                 feature: evt.feature,
            //                 dispose: function () {
            //                     var s = this.layer.getSource();
            //                     s.removeFeature(this.feature);
            //                 }
            //             });
            //             this.interactionMode_('free');
            //         })
            //     }.bind(this))
            // }
            //
            // private addDrawAreaInteraction_(drawend) {
            //     //this.commitAreaFeature_ = onCommit;
            //     var value = 'LineString';
            //     var geometryFunction, maxPoints;
            //     maxPoints = 2;
            //     geometryFunction = function (coordinates, geometry) {
            //         if (!geometry) {
            //             geometry = new ol.geom.Polygon(null);
            //         }
            //         var start = coordinates[0];
            //         var end = coordinates[1];
            //         geometry.setCoordinates([
            //             [start, [start[0], end[1]], end, [end[0], start[1]], start]
            //         ]);
            //         return geometry;
            //     };
            //
            //     this.drawer_ = new ol.interaction.Draw({
            //         source: this.drawSource_,
            //         type: /** @type {ol.geom.GeometryType} */ (value),
            //         geometryFunction: geometryFunction,
            //         maxPoints: maxPoints
            //     });
            //
            //     this.drawer_.on('drawend', drawend);
            //
            //     this.map_.map.addInteraction(this.drawer_);
            // }
            get: function () {
                var r = [];
                for (var i in this.sharps_) {
                    r.push(i);
                }
                return r;
            },
            enumerable: true,
            configurable: true
        });
        InterActionPlugin.prototype.showFeature_ = function (feature) {
            if (this.interactionMode_() == 'busy') {
                this.cancel_();
            }
            return new Promise(function (resolve, reject) {
                if (!(feature instanceof ol.Feature)) {
                    reject("不支持所给定的物标");
                }
                this.rejectFunList_.push(function (msg) {
                    reject(msg);
                });
                this.interactionMode_('busy');
                this.drawSource_.addFeature(feature);
                resolve({
                    layer: this.drawLayer_,
                    feature: feature,
                    dispose: function () {
                        var s = this.layer.getSource();
                        s.removeFeature(this.feature);
                    }
                });
            }.bind(this));
        };
        InterActionPlugin.prototype.getSharp_ = function (sharp, options) {
            if (this.interactionMode_() == 'busy') {
                this.cancel_();
            }
            return new Promise(function (resolve, reject) {
                var _this = this;
                if (!(sharp in this.sharps_)) {
                    reject("不支持所给定的形状");
                }
                this.rejectFunList_.push(function (msg) {
                    //this.removeDrawAreaInteraction_();
                    reject(msg);
                });
                this.interactionMode_('busy');
                this.addDrawSharpInteraction_(sharp, options && options.drawstart, function (evt) {
                    options && options.drawend(evt);
                    _this.removeDrawAreaInteraction_();
                    resolve({
                        layer: _this.drawLayer_,
                        feature: evt.feature,
                        dispose: function () {
                            var s = this.layer.getSource();
                            s.removeFeature(this.feature);
                        }
                    });
                });
            }.bind(this));
        };
        InterActionPlugin.prototype.addDrawSharpInteraction_ = function (toolType, drawstart, drawend) {
            if (!(toolType in this.sharps_))
                return;
            var value = this.sharps_[toolType];
            this.drawer_ = new ol.interaction.Draw({
                source: this.drawSource_,
                type: value.type,
                geometryFunction: value.geometryFunction,
                maxPoints: value.maxPoints,
            });
            drawend && this.drawer_.on("drawend", drawend, this.drawer_);
            drawstart && this.drawer_.on('drawstart', drawstart, this.drawer_);
            this.map_.map.addInteraction(this.drawer_);
        };
        InterActionPlugin.prototype.removeDrawAreaInteraction_ = function () {
            if (this.drawer_) {
                this.map_.map.removeInteraction(this.drawer_);
                this.drawer_.dispose();
                delete this.drawer_;
            }
            this.interactionMode_('free');
        };
        return InterActionPlugin;
    }());
    InterActionPlugin = __decorate([
        __param(1, Plugins_1.inject("map"))
    ], InterActionPlugin);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = InterActionPlugin;
});
