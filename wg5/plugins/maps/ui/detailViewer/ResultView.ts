import * as ResultViewTemplate from "text!./ResultViewTemplate.html";
import WindowView from "../frame/WindowView";

export class ResultView extends WindowView {
    protected element_;

    constructor(options?) {
        super();

        this.title('详情');
        this.element_=$(ResultViewTemplate);
        this.items_['viewDom']=this.element_;
        this.items_['tabTitle'] = this.items_['viewDom'].find('[name="tabTitle"]');
        this.items_['tabContent'] = this.items_['viewDom'].find('[name="tabContent"]')
    }
}

export default ResultView;
