import * as sidePanlDiv from "text!./htmls/SidePanel.html";

import {View} from "../../ui/frame/View";

import WindowView from "../../ui/frame/WindowView";

class SidePanel extends WindowView {
    protected parent_: View;
    protected element_: JQuery;
    protected fullSized_: boolean = false;

    startTime_;
    endTime_;
    query_;
    dataList_;
    calcTime_;
    calcYear_;
    calcMonth_;

    constructor(options) {
        super();
        this.element_ = $(sidePanlDiv);
        this.title("锚泊事件");

        this.startTime_ = options.startTime;
        this.endTime_ = options.endTime;
        this.query_ = options.query;
        this.dataList_ = options.dataList;
        this.calcTime_ = options.calcTime;
        this.calcYear_ = options.calcYear;
        this.calcMonth_ = options.calcMonth;
    }

}
export default SidePanel
