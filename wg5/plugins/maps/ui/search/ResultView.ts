import * as ko from "knockout";
import WindowView from "../frame/WindowView";

export class ResultView extends WindowView {
    private from_:ResultView;
    private keyword_:string;

    buttonTitle:ko.Observable<string>;

    constructor(keyword:string, from?:ResultView) {
        super();

        this.keyword_ = keyword;
        this.from_ = from;

        this.title('搜索' + (this.from_ ? 2 : 1));
        this.buttonTitle = ko.observable(this.from_ ? 'POP' : 'PUSH');
    }

    get element() {
        return this.element_[0];
    }

    get navigationView() {
        return this.parent_ && this.parent_.navigationView || null;
    }

    onButtonClick(data, evt) {
        if (this.from_)
            this.navigationView.pop();
        else
            this.navigationView.push(new ResultView(this.keyword_, this))
    }
}

export default ResultView;
