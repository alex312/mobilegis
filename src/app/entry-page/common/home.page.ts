import { Component } from '@angular/core';

import { App } from 'ionic-angular';

import { ArticleHomePage, WeatherPage, ARTICLE_TYPES, ArticleListPageModel, ArticleService, ArticlePage, } from '../../plugins/article';
import { MapPage } from '../../plugins/map';
import { VesselGroupPage } from '../../plugins/ship';
import { AlarmPage } from "../../plugins/alarm";
import { SectionObserverPage } from '../../plugins/section-observer';
import { CCTVComponent } from '../../plugins/cctv';
import { TaskListPage } from '../../plugins/task';
import { UserService, UserLoginPage } from '../../plugins/user';
import { ShipDynamicSearchPage } from '../../plugins/ship-dynamic';


@Component({
    selector: 'page-home',
    templateUrl: 'home.page.html',
})
export class HomePage {

    articleTypes = ARTICLE_TYPES;
    articleModelDict: { [key: string]: ArticleListPageModel } = {};
    articlePage = ArticlePage;
    articleTypeList = ARTICLE_TYPES;

    weather = {};
    ggItems = [];
    constructor(
        private _app: App,
        private user: UserService,
        private _articleService: ArticleService) {
        this.articleModelDict[ARTICLE_TYPES.ARTICLE_YJXX] = new ArticleListPageModel(ARTICLE_TYPES.ARTICLE_YJXX, this._articleService.getArticleList.bind(this._articleService), 3)
        this.articleModelDict[ARTICLE_TYPES.ARTICLE_YJXX].requery().then();

        this._articleService.getLastWeather().then(result => {
            this.weather = result;
        })

        this._articleService.getArticleList("gg", 0, 3).then(result => {
            this.ggItems.splice(0, this.ggItems.length, ...result.items);
        })
    }

    get showLoading() {
        let result = this.articleModelDict[ARTICLE_TYPES.ARTICLE_YJXX].isLoading === true;
        return result;
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
        this.user.autoLogin().then((result) => {
            this.user.runLoginAction();
            if (!result)
                this._app.getRootNav().push(UserLoginPage, { loginSuccess: () => { this._app.getRootNav().push(TaskListPage) } });
            else
                this._app.getRootNav().push(TaskListPage);
        }).catch(error => {
            console.log(error)
        });
    }

    searchKey: string = "";
    openSearchPage() {
        this._app.getRootNav().push(ShipDynamicSearchPage, this.searchKey);
    }

    viewWether() {
        this._app.getRootNav().push(WeatherPage, { item: this.weather, title: "气象信息" });
    }

}


