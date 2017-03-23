"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", "openlayers", 'text!./Player.html', "fecha", "jquery", "../../../../../seecool/utilities", "jquery-ui", "css!./Player.css"], function (require, exports, ol, playerDiv, fecha, $, utilities_1) {
    "use strict";

    var ShipTrackPlayer = function (_ol$control$Control) {
        _inherits(ShipTrackPlayer, _ol$control$Control);

        function ShipTrackPlayer(options) {
            _classCallCheck(this, ShipTrackPlayer);

            options = options || {};
            var player = $(playerDiv);

            var _this = _possibleConstructorReturn(this, (ShipTrackPlayer.__proto__ || Object.getPrototypeOf(ShipTrackPlayer)).call(this, {
                element: player[0],
                target: options.target
            }));

            console.log("track player draw");
            _this.tooltip = player.find("#player-tooltip");
            _this.tooltipValue = player.find("#player-tooltipValue");
            _this.progress = player.find("#player-progress");
            _this.progressbar = player.find("#player-progressbar");
            _this.loadedProgressbar = player.find("#player-loadedProgressbar");
            _this.progressTagBox = player.find("#player-progressTagBox");
            _this.progressTag = player.find("#player-progressTag");
            _this.content = player.find("#player-content");
            _this.start = player.find("#player-start");
            _this.subBtn = player.find("#player-subBtn");
            _this.rate = player.find("#player-rate");
            _this.addBtn = player.find("#player-addBtn");
            _this.playBtn = player.find("#player-playBtn");
            _this.cancelBtn = player.find("#player-cancelBtn");
            _this.end = player.find("#player-end");
            _this.progressbar.progressbar({ value: 0, max: 0 });
            _this.loadedProgressbar.progressbar({ value: 0, max: 0 });
            _this.rate.keydown(function (event) {
                if (!(event.keyCode == 46) && !(event.keyCode == 8) && !(event.keyCode == 37) && !(event.keyCode == 39)) if (!(event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 96 && event.keyCode <= 105)) event.returnValue = false;
            });
            _this.rate.keyup($.proxy(_this.rateKeyUp_, _this));
            _this.addBtn.click($.proxy(_this.addRate_, _this));
            _this.subBtn.click($.proxy(_this.subRate_, _this));
            _this.playBtn.click($.proxy(_this.togglePlay_, _this));
            _this.cancelBtn.click($.proxy(_this.cancelPlay_, _this));
            _this.progressTag.draggable({
                containment: "#player-progressTagBox",
                scroll: false,
                drag: $.proxy(_this.drag_, _this),
                start: $.proxy(_this.startDrag_, _this),
                stop: $.proxy(_this.stopDrag_, _this)
            });
            player.mousedown(function (evt) {
                evt.stopPropagation();
            });
            player.dblclick(function (evt) {
                evt.stopPropagation();
            });
            player.draggable();
            _this.element = player[0];
            _this.element.style.display = 'none';
            _this.layer = null;
            _this.startTime = null;
            _this.endTime = null;
            _this.loadedTime = null;
            _this.current_ = null;
            _this.rate_ = 60;
            _this.maxMinutes = 1200;
            _this.minMinutes = 1;
            _this.isEnd = false;
            _this.playerContainer = options.target;
            _this.CLASS_NAME = "seecool.controls.ShipTrackPlayer";
            console.log("track player contructor");
            return _this;
        }

        _createClass(ShipTrackPlayer, [{
            key: "createElement",
            value: function createElement() {}
        }, {
            key: "activate",
            value: function activate() {
                console.log("track player activate");
                //OpenLayers.Control.prototype.activate.apply(this, arguments);
                //this.element.style.display = this.active ? '' : 'none';
                this.element.style.display = '';
                this.barLeft = this.progressbar.position().left;
                this.barWidth = this.progressbar.width();
                this.progressTagBox.css('left', this.barLeft - 60);
                this.progressTagBox.width(this.barWidth);
            }
        }, {
            key: "deactivate",
            value: function deactivate() {
                //OpenLayers.Control.prototype.deactivate.apply(this, arguments);
                //this.element.style.display = this.active ? '' : 'none';
                this.stopPlay();
                this.element.style.display = 'none';
            }
        }, {
            key: "setTime",
            value: function setTime(start, end) {
                console.log("track player setTime");
                this.startTime = new Date(start);
                this.endTime = new Date(end);
                this.loadedTime = new Date(this.startTime);
                this.progressbar.progressbar({
                    value: 0,
                    max: this.endTime - this.startTime
                });
                this.loadedProgressbar.progressbar({
                    value: 0,
                    max: this.endTime - this.startTime
                });
                this.start.text(fecha.format(this.startTime, 'YYYY-MM-DD HH:mm'));
                this.end.text(fecha.format(this.endTime, 'YYYY-MM-DD HH:mm'));
                this.setCurrent_(this.startTime);
                this.startPlay();
                utilities_1.notificationCenter.listen('trackLoader/update', $.proxy(function (type, date) {
                    this.setLoadedTime(date);
                }, this));
            }
        }, {
            key: "setLoadedTime",
            value: function setLoadedTime(loadedTime) {
                this.loadedTime = loadedTime;
                this.loadedProgressbar.progressbar("value", this.loadedTime - this.startTime);
            }
        }, {
            key: "addRate_",
            value: function addRate_() {
                var value = parseInt(this.rate.val());
                if (value < this.maxMinutes) {
                    this.rate_ = value + 1;
                    this.rate.val(this.rate_);
                }
            }
        }, {
            key: "subRate_",
            value: function subRate_() {
                var value = parseInt(this.rate.val());
                if (value > this.minMinutes) {
                    this.rate_ = value - 1;
                    this.rate.val(this.rate_);
                }
            }
        }, {
            key: "rateKeyUp_",
            value: function rateKeyUp_() {
                console.log("track player rateKeyUp_");
                var val = this.rate.val().trim();
                if (val.length === 0) {
                    val = this.minMinutes;
                }
                var value = parseInt(val);
                if (value > this.maxMinutes) {
                    value = this.maxMinutes;
                }
                this.rate_ = value;
                this.rate.val(value);
            }
        }, {
            key: "togglePlay_",
            value: function togglePlay_() {
                if (!this.interval) {
                    this.startPlay();
                } else {
                    this.stopPlay();
                }
            }
        }, {
            key: "startPlay",
            value: function startPlay() {
                console.log("track player startPlay");
                if (!this.interval) {
                    if (this.isEnd) this.cancelPlay_();
                    this.playBtn.removeClass('player-play');
                    this.playBtn.addClass('player-stop');
                    this.interval = window.setInterval($.proxy(this.play_, this), 1000);
                }
            }
        }, {
            key: "stopPlay",
            value: function stopPlay() {
                console.log("track player stopPlay");
                if (this.interval) {
                    this.playBtn.removeClass('player-stop');
                    this.playBtn.addClass('player-play');
                    window.clearInterval(this.interval);
                    this.interval = null;
                }
            }
        }, {
            key: "cancelPlay_",
            value: function cancelPlay_() {
                this.stopPlay();
                this.setCurrent_(this.startTime);
            }
        }, {
            key: "addSeconds",
            value: function addSeconds(date, minites) {
                var dt = new Date(date);
                dt.setSeconds(dt.getSeconds() + minites);
                return dt;
            }
        }, {
            key: "play_",
            value: function play_() {
                if (this.dragging_) return;
                var current = this.addSeconds(this.current_, this.rate_);
                if (current > this.loadedTime) current = this.loadedTime;
                this.setCurrent_(current);
            }
        }, {
            key: "setCurrent_",
            value: function setCurrent_(current) {
                this.current_ = new Date(current);
                var scale = (this.current_ - this.startTime) / (this.endTime - this.startTime);
                var width = this.barWidth - this.progressTag.width();
                var newLeft = width * scale;
                this.progressTag.css('left', newLeft + 2);
                this.tooltip.css('left', newLeft + 1); // + 8
                this.tooltipValue.text(fecha.format(this.current_, 'YYYY-MM-DD HH:mm'));
                this.progressbar.progressbar("value", this.current_ - this.startTime);
                this.syncUpWithLayer_(this.current_);
                if (this.current_ >= this.endTime) {
                    this.isEnd = true;
                    this.stopPlay();
                } else {
                    this.isEnd = false;
                }
            }
        }, {
            key: "drag_",
            value: function drag_() {
                var length = this.progressTag.position().left;
                var newValue = length / (this.barWidth - 5) * (this.endTime - this.startTime);
                var current = new Date(this.startTime.getTime() + newValue);
                this.setCurrent_(current);
            }
        }, {
            key: "startDrag_",
            value: function startDrag_() {
                this.dragging_ = true;
            }
        }, {
            key: "stopDrag_",
            value: function stopDrag_(evt) {
                if (this.current_ > this.loadedTime) this.setCurrent_(this.loadedTime);
                this.dragging_ = false;
            }
        }, {
            key: "syncUpWithLayer_",
            value: function syncUpWithLayer_(end) {
                if (end > this.loadedTime) end = new Date(this.loadedTime);else end = new Date(end);
                utilities_1.notificationCenter.send('player/update', end);
            }
        }, {
            key: "isCanceled",
            value: function isCanceled() {
                return this.current_ - this.startTime === 0 || this.current_ - this.endTime === 0;
            }
        }]);

        return ShipTrackPlayer;
    }(ol.control.Control);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipTrackPlayer;
});