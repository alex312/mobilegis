import * as ol from "openlayers";
import * as playerDiv from 'text!../htmls/Player.html';
import * as fecha from "fecha";
// import * as utilities from 'seecool/utilities';

import {notificationCenter} from "seecool/utilities";
//import {format} from "seecool/utilities";

import 'jquery';
import 'jquery-ui';

class ShipTrackPlayer extends ol.control.Control {
    layer;
    startTime;
    endTime;
    loadedTime;
    maxMinutes;
    minMinutes;
    isEnd;
    playerContainer;
    CLASS_NAME;
    element;
    tooltip;
    tooltipValue;
    progress;
    progressbar;
    loadedProgressbar;
    progressTag;
    content;
    start;
    subBtn;
    rate;
    addBtn;
    playBtn;
    cancelBtn;
    end;
    progressTagBox;
    barLeft;
    barWidth;
    interval;
    current_;
    rate_;
    dragging_;

    constructor(options) {
        options = options || {};
        var player = $(playerDiv);
        super({
            element: player[0],
            target: options.target
        });

        console.log("track player draw");
        this.tooltip = player.find("#player-tooltip");
        this.tooltipValue = player.find("#player-tooltipValue");
        this.progress = player.find("#player-progress");
        this.progressbar = player.find("#player-progressbar");
        this.loadedProgressbar = player.find("#player-loadedProgressbar");
        this.progressTagBox = player.find("#player-progressTagBox");
        this.progressTag = player.find("#player-progressTag");
        this.content = player.find("#player-content");
        this.start = player.find("#player-start");
        this.subBtn = player.find("#player-subBtn");
        this.rate = player.find("#player-rate");
        this.addBtn = player.find("#player-addBtn");
        this.playBtn = player.find("#player-playBtn");
        this.cancelBtn = player.find("#player-cancelBtn");
        this.end = player.find("#player-end");

        this.progressbar.progressbar({value: 0, max: 0});
        this.loadedProgressbar.progressbar({value: 0, max: 0});

        this.rate.keydown(function (event) {
            if (!(event.keyCode == 46) && !(event.keyCode == 8) && !(event.keyCode == 37) && !(event.keyCode == 39))
                if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)))
                    event.returnValue = false;
        });
        this.rate.keyup($.proxy(this.rateKeyUp_, this));
        this.addBtn.click($.proxy(this.addRate_, this));
        this.subBtn.click($.proxy(this.subRate_, this));
        this.playBtn.click($.proxy(this.togglePlay_, this));
        this.cancelBtn.click($.proxy(this.cancelPlay_, this));

        this.progressTag.draggable({
            containment: "#player-progressTagBox",
            scroll: false,
            drag: $.proxy(this.drag_, this),
            start: $.proxy(this.startDrag_, this),
            stop: $.proxy(this.stopDrag_, this)
        });

        player.mousedown(function (evt) {
            evt.stopPropagation();
        });

        player.dblclick(function (evt) {
            evt.stopPropagation();
        });

        player.draggable();

        this.element = player[0];
        this.element.style.display = 'none';


        this.layer = null;
        this.startTime = null;
        this.endTime = null;
        this.loadedTime = null;
        this.current_ = null;
        this.rate_ = 60;
        this.maxMinutes = 1200;
        this.minMinutes = 1;
        this.isEnd = false;
        this.playerContainer = options.target;
        this.CLASS_NAME = "seecool.controls.ShipTrackPlayer";
        console.log("track player contructor");

    }

    createElement() {

    }

    activate() {
        console.log("track player activate");
        //OpenLayers.Control.prototype.activate.apply(this, arguments);
        //this.element.style.display = this.active ? '' : 'none';
        this.element.style.display = '';
        this.barLeft = this.progressbar.position().left;
        this.barWidth = this.progressbar.width();
        this.progressTagBox.css('left', this.barLeft - 60);
        this.progressTagBox.width(this.barWidth);
    }

    deactivate() {
        //OpenLayers.Control.prototype.deactivate.apply(this, arguments);
        //this.element.style.display = this.active ? '' : 'none';
        this.stopPlay();
        this.element.style.display = 'none';
    }

    setTime(start, end) {
        console.log("track player setTime");
        this.startTime = new Date(start);
        this.endTime = new Date(end);
        this.loadedTime = new Date(this.startTime);
        this.progressbar.progressbar({
            value: 0,
            max: (this.endTime - this.startTime)
        });
        this.loadedProgressbar.progressbar({
            value: 0,
            max: (this.endTime - this.startTime)
        });
        this.start.text(fecha.format(this.startTime, 'YYYY-MM-dd HH:mm'));
        this.end.text(fecha.format(this.endTime, 'YYYY-MM-dd HH:mm'));
        this.setCurrent_(this.startTime);
        this.startPlay();

        notificationCenter.listen('trackLoader/update', $.proxy(function (type, date) {
            this.setLoadedTime(date);
        }, this));
    }

    setLoadedTime(loadedTime) {
        this.loadedTime = loadedTime;
        this.loadedProgressbar.progressbar("value", this.loadedTime - this.startTime);
    }

    addRate_() {
        var value = parseInt(this.rate.val());
        if (value < this.maxMinutes) {
            this.rate_ = value + 1;
            this.rate.val(this.rate_);
        }
    }

    subRate_() {
        var value = parseInt(this.rate.val());
        if (value > this.minMinutes) {
            this.rate_ = value - 1;
            this.rate.val(this.rate_);
        }
    }

    rateKeyUp_() {
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

    togglePlay_() {
        if (!this.interval) {
            this.startPlay();
        } else {
            this.stopPlay();
        }
    }

    startPlay() {
        console.log("track player startPlay");
        if (!this.interval) {
            if (this.isEnd)
                this.cancelPlay_();

            this.playBtn.removeClass('player-play');
            this.playBtn.addClass('player-stop');
            this.interval = window.setInterval($.proxy(this.play_, this), 1000);
        }
    }

    stopPlay() {
        console.log("track player stopPlay");
        if (this.interval) {
            this.playBtn.removeClass('player-stop');
            this.playBtn.addClass('player-play');
            window.clearInterval(this.interval);
            this.interval = null;
        }
    }

    cancelPlay_() {
        this.stopPlay();
        this.setCurrent_(this.startTime);
    }

    addSeconds(date, minites) {
        var dt = new Date(date);
        dt.setSeconds(dt.getSeconds() + minites);
        return dt;
    }

    play_() {
        if (this.dragging_)
            return;

        var current = this.addSeconds(this.current_, this.rate_);
        if (current > this.loadedTime)
            current = this.loadedTime;
        this.setCurrent_(current);
    }

    setCurrent_(current) {
        this.current_ = new Date(current);

        var scale = (this.current_ - this.startTime) / (this.endTime - this.startTime);
        var width = this.barWidth - this.progressTag.width();
        var newLeft = width * scale;
        this.progressTag.css('left', newLeft + 2);
        this.tooltip.css('left', newLeft + 8);
        this.tooltipValue.text(fecha.format(this.current_, 'YYYY-MM-dd HH:mm'));
        this.progressbar.progressbar("value", this.current_ - this.startTime);
        this.syncUpWithLayer_(this.current_);

        if (this.current_ >= this.endTime) {
            this.isEnd = true;
            this.stopPlay();
        } else {
            this.isEnd = false;
        }
    }

    drag_() {
        var length = this.progressTag.position().left;
        var newValue = length / (this.barWidth - 5) * (this.endTime - this.startTime);
        var current = new Date(this.startTime.getTime() + newValue);
        this.setCurrent_(current);
    }

    startDrag_() {
        this.dragging_ = true;
    }

    stopDrag_(evt) {
        if (this.current_ > this.loadedTime)
            this.setCurrent_(this.loadedTime);
        this.dragging_ = false;
    }

    syncUpWithLayer_(end) {
        if (end > this.loadedTime)
            end = new Date(this.loadedTime);
        else
            end = new Date(end);
        notificationCenter.send('player/update', end);
    }

    isCanceled() {
        return (this.current_ - this.startTime) === 0 || (this.current_ - this.endTime) === 0;
    }
}
export default ShipTrackPlayer
