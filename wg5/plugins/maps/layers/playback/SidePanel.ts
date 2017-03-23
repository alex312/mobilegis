import * as sidePanlDiv from "text!./htmls/PlaybackSetting.html";

import {View} from "../../ui/frame/View";

import WindowView from "../../ui/frame/WindowView";

class SidePanel extends WindowView {
    protected parent_: View;
    protected element_: JQuery;
    protected fullSized_: boolean = false;

    startTime_;
    endTime_;
    ships_;
    startPlayback_;
    selectShip_;
    selectArea_;
    showTrackPath_;
    focusShip_;

    constructor(options) {
        super();
        this.element_ = $(sidePanlDiv);
        this.title("回放");

        this.startTime_ = options.startTime;
        this.endTime_ = options.endTime;
        this.ships_ = options.ships;
        this.startPlayback_ = options.startPlayback;
        this.selectShip_ = options.selectShip;
        this.selectArea_ = options.selectArea;
        this.showTrackPath_ = options.showTrackPath;
        this.focusShip_ = options.focusShip;
    }

}
export default SidePanel
