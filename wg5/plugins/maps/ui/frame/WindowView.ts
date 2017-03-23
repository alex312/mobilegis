import * as ko from "knockout";
import {View} from "./View";
import * as htmlTemplate from "text!./WindowView.html";

class WindowView implements View {
    protected parent_: View;
    protected element_: JQuery;
    protected head_: JQuery;
    protected body_: JQuery;
    protected fullSized_: boolean = false;
    protected items_;

    private lastLayoutSize_: [number, number];

    title = ko.observable<string>(null);

    constructor() {
        this.lastLayoutSize_ = [0, 0];
        this.element_ = $(htmlTemplate);
        this.items_ = [];
        this.head_ = this.element_.find('.head');
        this.body_ = this.element_.find('.body');
    }

    get element() {
        return this.element_[0];
    }

    get navigationView() {
        return this.parent_ && this.parent_.navigationView || null;
    }

    get(name): HTMLElement {
        return this.items_[name] || null;
    }

    protected onCommandClose_() {
        this.doClose_();
    }

    protected doClose_() {
        this.navigationView.pop();
    }

    protected doLayout_() {
        var [width, height] = this.lastLayoutSize_;

        var ele = this.element_[0];
        var body = this.body_[0];

        ele.style.width = `${width}px`;
        ele.style.maxHeight = `${height}px`;
        ele.style.height = 'auto';
        body.style.height = 'auto';

        var diff = ele.scrollHeight - ele.offsetHeight;
        if (diff > 0) {
            let bodyHeight = body.offsetHeight - diff;
            body.style.height = `${Math.max(0, bodyHeight)}px`;
        } else if (this.fullSized_) {
            diff = height - ele.offsetHeight;
            let bodyHeight = body.offsetHeight + diff;
            body.style.height = `${Math.max(0, bodyHeight)}px`;
        }
    }

    syncLayout(left: number, top: number, width: number, height: number) {
        this.lastLayoutSize_ = [width, height];

        this.doLayout_();
    }

    attach(parent: View) {
        this.parent_ = parent;
        ko.applyBindings(this, this.element_[0]);
    }

    detach(parent: View) {
        ko.cleanNode(this.element_[0]);
        this.parent_ = null;
    }
}

export default WindowView;
