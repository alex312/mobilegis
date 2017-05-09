import { Component } from '@angular/core';

import { App } from 'ionic-angular';

import { ArticleHomePage, ARTICLE_TYPES } from '../../plugins/article';
import { MapPage } from '../../plugins/map';
import { VesselGroupPage } from '../../plugins/ship';
import { AlarmPage } from "../../plugins/alarm";
import { SectionObserverPage } from '../../plugins/section-observer';
import { CCTVComponent } from '../../plugins/cctv';
import { TaskListPage } from '../../plugins/task';


@Component({
    selector: 'page-home',
    templateUrl: 'home.page.html',
})
export class HomePage {

    articleTypes = ARTICLE_TYPES;
    constructor(
        private _app: App) {
    }

    showArticle(event, category) {
        this._app.getRootNav().push(ArticleHomePage, category);
    }

    showMap() {
        this._app.getRootNav().push(MapPage);
    }

    showMyShips() {
        this._app.getRootNav().push(VesselGroupPage);
    }

    showAlarm() {
        this._app.getRootNav().push(AlarmPage);
    }

    showSection() {
        this._app.getRootNav().push(SectionObserverPage);
    }

    showCCTV() {
        this._app.getRootNav().push(CCTVComponent);
    }

    showTask() {
        this._app.getRootNav().push(TaskListPage);
    }
}


