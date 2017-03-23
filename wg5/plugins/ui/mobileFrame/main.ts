import {Frame} from "../frame/main";
import {inject} from "../../../seecool/plugins/Plugins";

export class DefaultFrame implements Frame {
    protected items_:{[key:string]:HTMLElement} = {};

    constructor(config,
                @inject('dom/root')dom) {

        this.items_['map'] = dom;
    }

    destroy() {
    }

    get(name):HTMLElement {
        return this.items_[name] || null;
    }
}

export default DefaultFrame;
