import * as ko from "knockout";
import * as sidePanlDiv from "text!./htmls/SidePanel.html";

import {View} from "../../ui/frame/View";
import {ShapeTypeLabel} from "seecool/StaticLib";

import WindowView from "../../ui/frame/WindowView";

class SidePanel extends WindowView {
    protected parent_: View;
    protected element_: JQuery;
    protected fullSized_: boolean = false;

    private plotTool_;
    private plotdata_ = ko.observableArray();
    private plotToolCancel_;
    private plotToolStart_: (toolInfo)=>void;
    private plotItemClick_;
    private plotItemDelete_;
    private plotItemSetting_;

    constructor(options) {
        super();

        this.element_ = $(sidePanlDiv);
        this.title("标绘");

        var plotTooldata = [];
        for (var i in ShapeTypeLabel) {
            plotTooldata.push({name: i, label: ShapeTypeLabel[i]});
        }
        plotTooldata.splice(1, 1);//移除直线标绘按钮

        this.plotTool_ = plotTooldata;//
        this.plotdata_ = options.features;//(options.features());
        this.plotToolCancel_ = options.plotToolCancel;
        this.plotToolStart_ = options.plotToolStart;
        this.plotItemClick_ = options.plotItemClick;
        this.plotItemDelete_ = options.plotItemDelete;
        this.plotItemSetting_ = options.plotItemSetting;
    }
}
export default SidePanel
