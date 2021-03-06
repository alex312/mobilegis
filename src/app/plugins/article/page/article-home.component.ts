import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { ArticleService } from '../service/article.service';

import { ArticlePage } from '../page/article.component';
import { WarningPage } from '../page/warning.component';
import { ARTICLE_TYPES } from '../data/article-type';
import { ArticleListPageModel } from './article-list-page-model';

@Component({
    selector: "article-home-page",
    templateUrl: "./article-home.component.html"
})
export class ArticleHomePage {
    articleType: string = ARTICLE_TYPES.ARTICLE_WARNING;

    articleModelDict: { [key: string]: ArticleListPageModel } = {};

    articlePage = ArticlePage;
    warningPage = WarningPage;

    articleTypeList = ARTICLE_TYPES;

    constructor(private _articleService: ArticleService, private _navParams: NavParams) {

        this.articleType = _navParams.data;

        this.articleModelDict[ARTICLE_TYPES.ARTICLE_GG] = new ArticleListPageModel(ARTICLE_TYPES.ARTICLE_GG, this._articleService.getArticleList.bind(this._articleService))
        this.articleModelDict[ARTICLE_TYPES.ARTICLE_JGZX] = new ArticleListPageModel(ARTICLE_TYPES.ARTICLE_JGZX, this._articleService.getArticleList.bind(this._articleService))
        this.articleModelDict[ARTICLE_TYPES.ARTICLE_JGJX] = new ArticleListPageModel(ARTICLE_TYPES.ARTICLE_JGJX, this._articleService.getArticleList.bind(this._articleService))
        this.articleModelDict[ARTICLE_TYPES.ARTICLE_YJXX] = new ArticleListPageModel(ARTICLE_TYPES.ARTICLE_YJXX, this._articleService.getArticleList.bind(this._articleService))
        this.articleModelDict[ARTICLE_TYPES.ARTICLE_WARNING] = new ArticleListPageModel(ARTICLE_TYPES.ARTICLE_WARNING, this._articleService.getWarningList.bind(this._articleService))
        this.articleModelDict[ARTICLE_TYPES.ARTICLE_NOTICE] = new ArticleListPageModel(ARTICLE_TYPES.ARTICLE_NOTICE, this._articleService.getWarningList.bind(this._articleService))



        for (let key in this.articleModelDict) {
            this.articleModelDict[key].requery().then();
        }
    }

    currentPageModel() {
        let result = this.articleModelDict[this.articleType];
        return result;
    }

    private _isDoingRefresh = false;
    get showLoading() {
        let result = this.currentPageModel().isLoading === true && this._isDoingRefresh !== true;
        return result;
    }

    doRefresh(event) {
        this._isDoingRefresh = true;
        this.articleModelDict[this.articleType].requery().then(() => {
            this._isDoingRefresh = false;
            event.complete();
        })
    }

    doInfinite(event) {
        this._isDoingRefresh = true;
        this.articleModelDict[this.articleType].queryMore().then(() => {
            this._isDoingRefresh = false;
            event.complete();
        });
    }
}

