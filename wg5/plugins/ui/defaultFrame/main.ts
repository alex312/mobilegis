import "bootstrap";
import "css!fontawesome";
import {Frame} from "../frame/main";
import {inject} from "../../../seecool/plugins/Plugins";
import * as htmlLayout from "text!./layout.html";
import "css!./layout.css";

export class DefaultFrame implements Frame {
    protected items_:{[key:string]:HTMLElement} = {};

    constructor(config,
                @inject('dom/root')dom) {

        var layout = $(htmlLayout).appendTo(dom);
        this.items_['map'] = layout.find('.map')[0];
        this.items_['map-ui'] = layout.find('.map-ui')[0];
    }

    destroy() {
    }

    get(name):HTMLElement {
        return this.items_[name] || null;
    }
}

export default DefaultFrame;
