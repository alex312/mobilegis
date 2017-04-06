import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { ArticleService } from '../service/article.service';

import { ArticlePage } from '../page/article.component';

import { ArticleListPageModel } from './article-list-page-model';

@Component({
    selector: 'law-page',
    templateUrl: "./law-page.component.html"
})
export class LawPage {
    articlePage = ArticlePage;
    pageModel: ArticleListPageModel;
    constructor(private _articleService: ArticleService, private _navParams: NavParams) {
        this.pageModel = new ArticleListPageModel('hsfg', _articleService.getArticleList.bind(_articleService));
        this.pageModel.requery();
    }

    private _isDoingRefresh = false;
    get showLoading() {
        return this.pageModel.isLoading === true && this._isDoingRefresh === false;
    }

    doRefresh(event) {
        this._isDoingRefresh = true;
        this.pageModel.requery().then(() => {
            event.complete();
            this._isDoingRefresh = false;
        })
    }

    doInfinite(event) {
        this._isDoingRefresh = true;
        this.pageModel.queryMore().then(() => {
            event.complete();
            this._isDoingRefresh = false;
        });
    }
}