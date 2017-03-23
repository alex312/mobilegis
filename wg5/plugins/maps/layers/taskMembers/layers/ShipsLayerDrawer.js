"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "openlayers", "fecha", "../../../../../seecool/utilities", '../../../../../seecool/utils/MapTool', '../../../../../seecool/utils/POINTTYPES', "./ShipsLayerLabelArranger", "../../../../../seecool/utils/DouglasPeucker", '../data/LabelRectManager'], function (require, exports, ol, fecha, utilities_1, MapTool_1, POINTTYPES_1, ShipsLayerLabelArranger_1, DouglasPeucker_1, LabelRectManager_1) {
    "use strict";

    var mapTool = MapTool_1.MapTool;

    var ShipsLayerDrawer = function ShipsLayerDrawer(shapeFactory, flagFactory) {
        _classCallCheck(this, ShipsLayerDrawer);

        this.setParameters = function (extent, resolution, size, ships) {
            //console.log(111, ships);
            this.extent_ = extent;
            this.resolution_ = resolution;
            this.size_ = size;
            this.ships_ = ships;
        };
        this.draw = function () {
            var canvas = this.canvas_;
            if (canvas.width !== this.size_[0]) canvas.width = this.size_[0];
            if (canvas.height !== this.size_[1]) canvas.height = this.size_[1];
            var context = canvas.getContext('2d');
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, this.size_[0], this.size_[1]);
            this.updateShips_();
            var ships = this.cullAndSortShips_();
            this.arrangeLabels_(context, ships);
            return this.drawShips_(context, ships);
        };
        this.getCanvas = function () {
            return this.canvas_;
        };
        this.updateShips_ = function () {
            var ships = this.ships_;
            for (var each in ships) {
                var ship = ships[each];
                this.updateShipShape_(ship);
                this.updateShipIcons_(ship);
            }
        };
        this.updateShipShape_ = function (ship) {
            var data = ship.data;
            // console.log(data.time);
            var changed = !ship.shape || !data.time || ship.shape.time !== data.time.getTime() || ship.shape.resolution !== this.resolution_;
            if (changed) {
                /** @type {ShipShapeFactoryOptions} */
                var options = {
                    data: data,
                    resolution: this.resolution_
                };
                ship.shape = this.shapeFactory_(options) || null;
                if (ship.shape) {
                    if (!data.time) {
                        console.log(data);
                    }
                    ship.shape.time = data.time.getTime();
                    ship.shape.resolution = this.resolution_;
                }
            }
        };
        this.updateShipIcons_ = function (ship) {
            var icons = ship.icons = [];
            var data = ship.data;
            if (data.device) icons.push(utilities_1.sprite.get(data.device));
        };
        this.cullAndSortShips_ = function () {
            var ships = this.ships_;
            var result = [];
            for (var each in ships) {
                var ship = ships[each];
                if (ship.isFocused() || ship.isFollowed()) result.push(ship);else if (ol.extent.containsCoordinate(this.extent_, ship.lonlat)) {
                    result.push(ship);
                }
            }
            return result;
        };
        this.drawShips_ = function (context, ships) {
            var drawn = [];
            this.labelRectManager.clear();
            this.flagRectManager.clear();
            //console.log(ships);
            for (var i = 0; i < ships.length; i++) {
                var ship = ships[i];
                var shape = ship.shape;
                if (!shape) continue;
                this.drawTrack_(context, ship);
                var x = (ship.lonlat[0] - this.extent_[0]) / this.resolution_;
                var y = (this.extent_[3] - ship.lonlat[1]) / this.resolution_;
                context.translate(x, y);
                shape.draw(context);
                var flagList = this.flagFactory && this.flagFactory(ship.id) || [];
                this.drawFlag_(context, flagList, [x, y]);
                this.drawLabel_(context, ship.label /*, ship.icons*/);
                context.setTransform(1, 0, 0, 1, 0, 0);
                drawn.push(ship);
            }
            //console.log(drawn);
            return drawn;
        };
        this.rarefyTrackPoints_ = function (feature) {
            if (!feature || !feature.data || !feature.data.TrackPoints) return;
            var trackPoints = feature.data.TrackPoints;
            if (trackPoints && trackPoints.length > 0) {
                var result = this.getActualPoints_(trackPoints, feature.data.time);
                feature.data.actualPoints = result.points;
                feature.data.currentIndex = result.index;
            } else if (feature.actualPoints && feature.data.actualPoints.length > 0) {
                feature.data.actualPoints = [];
            }
        };
        this.getActualPoints_ = function (track, stopTime) {
            var stopIndex = 0;
            if (stopTime) {
                for (var i = 0; i < track.length; i++) {
                    if (stopTime > track[i].time) stopIndex++;
                }
            }
            if (stopIndex < 0) stopIndex = 0;
            var actualPoints = [];
            var startPoint = this.convertToPoint_(track[0]);
            for (var i = 0; i < track.length; i++) {
                var point = track[i];
                var px = this.convertToPoint_(point);
                actualPoints.push({
                    heading: point.heading,
                    sog: point.sog,
                    cog: point.cog,
                    lon: point.lon,
                    lat: point.lat,
                    x: px.x - startPoint.x,
                    y: px.y - startPoint.y,
                    lonlat: { lon: point.lon, lat: point.lat },
                    type: POINTTYPES_1.default.OTHER,
                    index: i,
                    fixed: false,
                    uid: point.id,
                    getType: function getType() {
                        return 'ship';
                    },
                    //px: px,
                    time: point.time
                });
            }
            if (stopIndex < actualPoints.length) actualPoints[stopIndex].fixed = true;
            actualPoints = DouglasPeucker_1.default.byDistance(actualPoints, 5, 30);
            actualPoints[0].type = POINTTYPES_1.default.START;
            return { points: actualPoints, index: stopIndex };
        };
        this.convertToPoint_ = function (lonlat) {
            var ll = ol.proj.fromLonLat([lonlat.lon, lonlat.lat]);
            var point = {
                x: (ll[0] - this.extent_[3]) / this.resolution_,
                y: (this.extent_[0] - ll[1]) / this.resolution_
            };
            return point;
        };
        this.drawTrack_ = function (context, feature) {
            var ship = feature.data;
            if (typeof ship.ShowTrack == "undefined" || !ship.ShowTrack) return;
            this.rarefyTrackPoints_(feature);
            var TrackPoints = ship.actualPoints;
            //画航迹
            if (TrackPoints && TrackPoints.length > 0) {
                var ps = TrackPoints.map(function (v) {
                    var vv = ol.proj.fromLonLat([v.lon, v.lat]);
                    var x = (vv[0] - this.extent_[0]) / this.resolution_;
                    var y = (this.extent_[3] - vv[1]) / this.resolution_;
                    return [x, y];
                }.bind(this));
                for (var i = 1; i < ps.length; i++) {
                    var p0 = ps[i - 1];
                    var p1 = ps[i];
                    context.beginPath();
                    context.moveTo(p0[0], p0[1]);
                    context.lineTo(p1[0], p1[1]);
                    if (ship.time > TrackPoints[i - 1].time) {
                        context.strokeStyle = "#800000";
                    } else context.strokeStyle = "#EEEEEE"; //"#DDDDDD";
                    context.lineWidth = 1;
                    context.stroke();
                }
                for (var i = 0; i < ps.length; i++) {
                    var p1 = ps[i];
                    if (this.resolution_ < 600 && TrackPoints[i].time && ship.time > TrackPoints[i].time) {
                        //绘制航迹点
                        if (!(ship.lon == TrackPoints[i].lon && ship.lat == TrackPoints[i].lat)) {
                            context.beginPath();
                            context.arc(p1[0], p1[1], 5, 0, Math.PI * 2, false);
                            context.closePath();
                            context.fillStyle = '#F0F0F0'; //this.hasAssociated_ ? '#ff0000' : this.COLORS.ARPAT;
                            context.fill();
                        }
                        //绘制航迹点标签
                        if (!isNaN(TrackPoints[i].time)) if (this.labelRectManager.tryPut({ left: p1[0], top: p1[1], width: 80, height: 16 })) {
                            context.textAlign = "center";
                            context.textBaseline = "middle";
                            context.fillStyle = "rgba(255, 255, 255, 0.3)";
                            context.strokeStyle = "#000080";
                            context.fillRect(p1[0] + 16, p1[1] - 8, 80, 16);
                            var heading = TrackPoints[i].heading;
                            if (!heading || Math.round(heading) == 511) heading = "?";
                            var t = '';
                            if (new Date().getTime() - TrackPoints[i].time.getTime() > 12 * 60 * 60 * 1000) {
                                t += fecha.format(TrackPoints[i].time, "DD日HH:mm");
                            } else {
                                t += fecha.format(TrackPoints[i].time, "HH:mm:ss");
                            }
                            t += " " + Math.round(TrackPoints[i].sog * 100) / 100 + "节";
                            context.strokeText(t, p1[0] + 52, p1[1], 80);
                            context.textAlign = "start";
                            context.textBaseline = "alphabetic";
                        }
                    }
                }
            }
        };
        this.drawFlag_ = function (context, list, xy) {
            if (list && list.length > 0) {
                var width = 18 * list.length / 2;
                context.strokeStyle = "#333333";
                context.lineWidth = 0.5;
                //context.beginPath();
                //context.moveTo(0,0);
                //context.lineTo(0,-20);
                //context.moveTo(-width,-20);
                //context.lineTo(+width,-20);
                var w = width * 2 + 2,
                    h = 20,
                    x = 0,
                    y = 20,
                    r = 5,
                    u = 2;
                var zoom = mapTool.ResolutionToZoom(this.resolution_);
                var canF = zoom == 18 || this.flagRectManager.tryPut({ left: xy[0], top: xy[1], width: w, height: h });
                context.fillStyle = "rgba(255, 255, 255, 0.5)";
                context.beginPath();
                context.moveTo(0, 0);
                context.lineTo(x + u, -y);
                if (canF) {
                    context.arcTo(x + w / 2, -y, x + w / 2, -y - h, r);
                    context.arcTo(x + w / 2, -y - h, x - w / 2, -y - h, r);
                    context.arcTo(x - w / 2, -y - h, x - w / 2, -y, r);
                    context.arcTo(x - w / 2, -y, x - u, -y, r);
                }
                context.lineTo(x - u, -y);
                context.lineTo(0, 0);
                context.closePath();
                context.fill();
                context.stroke();
                if (canF) {
                    for (var i = 0, x = -width + 1; i < list.length; i++) {
                        var I = list[i];
                        context.font = "16px fontawesome";
                        context.strokeStyle = "#eeeeee";
                        context.fillStyle = I.color;
                        //context.strokeText(I.content,x, -22);
                        context.fillText(I.content, x, -24);
                        x += 18;
                    }
                }
            }
        };
        this.drawLabel_ = function (context, label /*, icons*/) {
            var line = label.line;
            if (!line) return;
            context.strokeStyle = "#333333";
            context.lineWidth = 0.5;
            context.beginPath();
            context.moveTo(line.x0 * 0.7, line.y * 0.7);
            context.lineTo(line.x0, line.y);
            context.lineTo(line.x1, line.y);
            context.stroke();
            var text = label.text;
            if (text) {
                context.font = this.fontSize + "px sans-serif";
                context.strokeStyle = "#eeeeee";
                context.fillStyle = "#000000";
                context.strokeText(text.value, text.x, text.y + 1);
                context.fillText(text.value, text.x, text.y);
            }
            var icons = label.icons;
            if (icons) {
                for (var i = 0, items = icons.value, x = icons.x; i < items.length; i++) {
                    var icon = items[i];
                    if (!icon) continue;
                    var frame = icon.frame;
                    context.drawImage(icon.image, frame.x, frame.y, frame.width, frame.height, x, icons.y, this.iconSize, this.iconSize);
                    x += this.iconSize;
                }
            }
        };
        this.arrangeLabels_ = function (context, ships) {
            if (this.resolution_ > this.labelResolution_) {
                for (var i = ships.length - 1; i >= 0; i--) {
                    var label = ships[i].label;
                    ships[i].label.text = label.icons = label.line = undefined;
                }
                return;
            }
            var labelArranger = new ShipsLayerLabelArranger_1.default(25, this.resolution_ < 1.194328566955879 ? 200 : 25, 25);
            for (var i = ships.length - 1; i >= 0; i--) {
                var ship = ships[i];
                var shape = ship.shape;
                var pos = {
                    x: (ship.lonlat[0] - this.extent_[0]) / this.resolution_,
                    y: (this.extent_[3] - ship.lonlat[1]) / this.resolution_
                };
                labelArranger.occupy(pos, shape.box());
            }
            var height_text = this.fontSize + 4;
            var height_icons = this.iconSize + 4;
            context.font = this.fontSize + "px";
            for (var i = ships.length - 1; i >= 0; i--) {
                var ship = ships[i];
                var pos = {
                    x: (ship.lonlat[0] - this.extent_[0]) / this.resolution_,
                    y: (this.extent_[3] - ship.lonlat[1]) / this.resolution_
                };
                var label = ship.label;
                var xy = null;
                //if(ship.data.id=='MMSI:235060018'){
                //    console.log(ship)
                //}
                //if(ship.data.v_name)console.log('v_name',ship.data.v_name);
                var name = ship.data.v_name || ship.data.name || ship.data.mmsi || ship.data.id;
                var textWidth = name ? context.measureText(name).width : 0;
                var iconsWidth = ship.icons ? ship.icons.length * this.iconSize : 0;
                var width = Math.max(textWidth, iconsWidth);
                if (width) {
                    var height = 0;
                    if (textWidth) height += height_text;
                    if (iconsWidth) height += height_icons;
                    xy = labelArranger.arrange(pos, width, height);
                }
                if (xy) {
                    var x = xy.x,
                        y = xy.y;
                    var x2 = x + width;
                    var iconx, textx, dir;
                    if (x2 < pos.x) {
                        iconx = x2 - iconsWidth;
                        textx = x2 - textWidth;
                    } else {
                        iconx = textx = x;
                    }
                    var liney = textWidth ? y + height_text : y;
                    var texty = liney - 2;
                    var icony = liney + 2;
                    label.text = textWidth ? { value: name, x: textx, y: texty } : undefined;
                    label.icons = iconsWidth ? { value: ship.icons, x: iconx, y: icony } : undefined;
                    label.line = { x0: x < 0 ? x2 : x, y: liney, x1: x < 0 ? x : x2 };
                } else {
                    label.text = label.icons = label.line = undefined;
                }
            }
        };
        this.shapeFactory_ = shapeFactory;
        this.flagFactory = flagFactory;
        this.canvas_ = document.createElement('canvas');
        this.fontSize = 12;
        this.iconSize = 12;
        this.labelResolution_ = 9.554628535647032;
        this.labelRectManager = new LabelRectManager_1.default();
        this.flagRectManager = new LabelRectManager_1.default();
    };

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipsLayerDrawer;
});