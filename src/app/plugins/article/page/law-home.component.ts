import { Component } from '@angular/core';

import { NavParams, App } from "ionic-angular";


import { ArticleListPageModel } from './article-list-page-model';

import { ArticleService } from "../service/article.service";

import { LawPage } from './law-page.component';
import { ArticlePage } from './article.component';

@Component({
    selector: 'law-home-page',
    templateUrl: './law-home.component.html'
})
export class LawHomePage {
    hsfgPageModel: ArticleListPageModel;
    fwcnPageModel: ArticleListPageModel;
    vtsznPageModel: ArticleListPageModel;

    articlePage = ArticlePage;

    constructor(private _articleService: ArticleService, private _navParams: NavParams, private _app: App) {
        this.hsfgPageModel = new ArticleListPageModel('hsfg', _articleService.getArticleList.bind(_articleService), 5);
        this.hsfgPageModel.requery();
        this.fwcnPageModel = new ArticleListPageModel('fwcn', _articleService.getArticleList.bind(_articleService), 5);
        this.fwcnPageModel.requery();
        this.vtsznPageModel = new ArticleListPageModel('vtszn', _articleService.getArticleList.bind(_articleService), 5);
        this.vtsznPageModel.requery();
    }

    seeMore(cat) {
        this._app.getRootNav().push(LawPage, cat);
    }
}