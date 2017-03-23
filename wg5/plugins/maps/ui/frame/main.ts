import * as $ from "jquery";
import * as htmlTemplate from "text!./layout.html";

import {inject} from "seecool/plugins/Plugins";
import {Frame as OuterFrame} from "../../../ui/frame/main";

import Toolbar from "./Toolbar";
import SideView from "./SideView";

import "css!./style.css";

export class Frame {
    private element_: HTMLElement;
    private toolbarLeft_: Toolbar;
    private toolbarRight_: Toolbar;
    private sideView_: SideView;

    private layoutTimer_: number;
    private layoutSpySideView_: HTMLElement;
    private layoutSideView_: [number,number,number,number];

    constructor(config,
                @inject("ui/frame")frame: OuterFrame) {
        this.element_ = frame.get("map-ui");
        var element = $(htmlTemplate);
        element.children().appendTo(this.element_);
        $(this.element_).addClass(element[0].className);

        var toolbarLeft = $('.map-toolbar.map-toolbar-left', this.element_);
        var toolbarRight = $('.map-toolbar.map-toolbar-right', this.element_);
        this.toolbarLeft_ = new Toolbar(toolbarLeft[0]);
        this.toolbarRight_ = new Toolbar(toolbarRight[0]);

        var sideView = $('.map-side-view', this.element_);
        this.sideView_ = new SideView(sideView[0]);

        this.startConstraintMapUiElements_(this.element_);
    }

    destroy() {
        this.stopConstraintMapUiElements_();
    }

    get sideView() {
        return this.sideView_;
    }

    get toolbars(): {[key: string]: Toolbar} {
        return {
            left: this.toolbarLeft_,
            right: this.toolbarRight_
        };
    }

    private startConstraintMapUiElements_(mapUi: HTMLElement) {
        var toolbarLeft = $('.map-toolbar.map-toolbar-left', this.element_);
        var toolbarRight = $('.map-toolbar.map-toolbar-right', this.element_);
        var sideView = $('.map-side-view', mapUi);

        window['toolbarLeft'] = toolbarLeft;
        window['toolbarRight'] = toolbarRight;
        window['sideView'] = sideView;

        this.layoutSpySideView_ = $('.map-side-view-layout-spy', mapUi)[0];
        this.layoutSideView_ = [0, 0, 0, 0];

        if (!this.layoutTimer_)
            this.layoutTimer_ = requestAnimationFrame(this.doRelayout_.bind(this));
    }

    private stopConstraintMapUiElements_() {
        if (this.layoutTimer_)
            cancelAnimationFrame(this.layoutTimer_);
    }

    private doRelayout_() {
        this.layoutTimer_ = null;

        var element = this.layoutSpySideView_;
        var previous = this.layoutSideView_;
        var current: [number,number,number,number] = [element.offsetLeft, element.offsetTop, element.offsetWidth, element.offsetHeight];
        if (current[0] !== previous[0] || current[1] !== previous[1] || current[2] !== previous[2] || current[3] !== previous[3]) {
            this.layoutSideView_ = current;
            this.sideView_.syncLayout(current[0], current[1], current[2], current[3]);
        }

        this.layoutTimer_ = requestAnimationFrame(this.doRelayout_.bind(this));
    }
}

export default Frame;
