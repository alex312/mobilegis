import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { ArticleService } from '../service/article.service';

import { IArticleInfor } from '../data/article-info';

import { ArticlePage } from '../page/article.component';
import { WarningPage } from '../page/warning.component';
import { ARTICLE_TYPES } from '../data/article-type';

@Component({
    selector: "article-home-page",
    templateUrl: "./article-home.component.html"
})
export class ArticleHomePage {
    articleType: string = ARTICLE_TYPES.ARTICLE_WARNING;

    articleModelDict: { [key: string]: ArticleHomePageModel } = {};

    articlePage = ArticlePage;
    warningPage = WarningPage;

    articleTypeList = ARTICLE_TYPES;

    constructor(private _articleService: ArticleService, private _navParams: NavParams) {

        this.articleType = _navParams.data;

        this.articleModelDict[ARTICLE_TYPES.ARTICLE_GG] = new ArticleHomePageModel(ARTICLE_TYPES.ARTICLE_GG, this._articleService.getArticleList.bind(this._articleService))
        this.articleModelDict[ARTICLE_TYPES.ARTICLE_JGJX] = new ArticleHomePageModel(ARTICLE_TYPES.ARTICLE_JGJX, this._articleService.getArticleList.bind(this._articleService))
        this.articleModelDict[ARTICLE_TYPES.ARTICLE_YJXX] = new ArticleHomePageModel(ARTICLE_TYPES.ARTICLE_YJXX, this._articleService.getArticleList.bind(this._articleService))
        this.articleModelDict[ARTICLE_TYPES.ARTICLE_WARNING] = new ArticleHomePageModel(ARTICLE_TYPES.ARTICLE_WARNING, this._articleService.getWarningList.bind(this._articleService))
        this.articleModelDict[ARTICLE_TYPES.ARTICLE_NOTICE] = new ArticleHomePageModel(ARTICLE_TYPES.ARTICLE_NOTICE, this._articleService.getWarningList.bind(this._articleService))


        for (let key in this.articleModelDict) {
            this.articleModelDict[key].requery().then();
        }
    }

    currentPageModel() {
        let result = this.articleModelDict[this.articleType];
        console.log(this.articleType, result);
        return result;
    }

    doRefresh(event) {
        this.articleModelDict[this.articleType].requery().then(() => {
            event.complete();
        })
    }

    doInfinite(event) {
        this.articleModelDict[this.articleType].queryMore().then(() => {
            event.complete();
        });
    }
}

class ArticleHomePageModel {
    itemSource: IArticleInfor[] = [];
    category: string;
    index: number = 0;
    total: number;
    private _queryFunc

    constructor(category: string, queryFunc: Function) {
        this.category = category;
        this._queryFunc = queryFunc;
    }

    queryMore() {
        return this._queryFunc(this.category, this.index).then((result) => {
            console.log(result);
            this.itemSource.splice(this.itemSource.length, 0, ...result.items);
            this.index = this.itemSource.length;
            this.total = result.total;
        })
    }

    requery() {
        this.itemSource.splice(0, this.itemSource.length);
        this.index = 0;
        this.total = 0;
        return this.queryMore()
    }

    hasMore() {
        return this.total > this.index;
    }
}