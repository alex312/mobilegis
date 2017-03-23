import {inject} from "../../../../seecool/plugins/Plugins";
import Frame from "../frame/main";
import ResultView from "./ResultView";

export class Search {
    constructor(config,
                @inject('maps/ui/frame')frame:Frame) {

        var toolbar = frame.toolbars['left'];
        var toolbarRight = frame.toolbars['right'];
        var sideView = frame.sideView;

        var input = <HTMLInputElement>toolbar.addInput({
            type: 'search',
            placeholder: '搜索',
            flex: 1
        });
        toolbar.addButton({
            icon: 'icon-toolbar-search',
            css: 'search',
            click: ()=> {
                var value = input.value.trim();
                sideView.push(new ResultView(value));
            }
        });
        toolbarRight.addButton({
            icon: 'icon-toolbar-measure',
            text: '测量'
        });
        toolbarRight.addButton({
            icon: 'icon-toolbar-measure',
            text: '测量',
            items: [{
                text: '距离'
            }, {
                text: '面积'
            }]
        });
        toolbarRight.addButton({
            text: '测量',
            items: [{
                text: '距离'
            }, {
                text: '面积'
            }]
        });

    }
}

export default Search;
