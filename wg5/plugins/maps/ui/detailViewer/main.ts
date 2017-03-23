import {inject} from "seecool/plugins/Plugins";
import {ResultView} from "./ResultView";
import Frame from "../frame/main";

export class DetailViewer {
    frame_;
    map_;

    constructor(config,
                @inject("maps/map") map,
                @inject('maps/ui/frame')frame: Frame) {

        this.map_ = map;
        this.frame_ = frame;
        this.map_.bind("selectFeatureChange", this.showSelectedObjInfo.bind(this))
    }

    private handleSelectFocusCallBackList_: {[key: string]: Function;} = {};

    public registerSelectFocusEvent(name, callback) {
        this.handleSelectFocusCallBackList_[name] = callback;
    }

    public removeSelectFocusEvent(name) {
        if (name in this.handleSelectFocusCallBackList_) {
            delete this.handleSelectFocusCallBackList_[name];
        }
    }

    public showSelectedObjInfo(target, feature) {
        var resultView = new ResultView();
        var tabTitle = $(resultView.get('tabTitle'));
        tabTitle.empty();
        var tabContent = $(resultView.get('tabContent'));
        tabContent.empty();

        for (var i in this.handleSelectFocusCallBackList_) {
            var func = this.handleSelectFocusCallBackList_[i];
            Promise.resolve(func(feature))
                .then(function (domElement) {
                    if (domElement) {
                        var title = domElement.data('title');
                        var count = tabTitle[0].children.length;
                        var ti = $('<li></li>');
                        if (count == 0)
                            ti.addClass('active');
                        ti.appendTo(tabTitle);
                        var tit = $('<a data-toggle="tab"> </a>');
                        var tid = 'objInfo' + count;
                        tit.attr('href', '[name=""]' + tid);
                        tit.text(title);
                        tit.appendTo(ti);
                        var tc = $('<div class="tab-pane"></div>');
                        if (count == 0)
                            tc.addClass('fade in active');
                        tc.attr('id', tid);
                        tc.appendTo(tabContent);
                        domElement.appendTo(tc);
                    }
                })
        }
        if (feature) {
            this.frame_.sideView.push(resultView);
        }
    }
}
export default DetailViewer