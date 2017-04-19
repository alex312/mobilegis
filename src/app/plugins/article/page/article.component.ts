import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ArticleService } from '../service/article.service';
import { ArticlePageBase } from './article-base.component';

@Component({
    selector: 'article-page',
    templateUrl: './article.component.html'
})
export class ArticlePage extends ArticlePageBase {
    @ViewChild('articleContent')
    articleContentRef: ElementRef;

    constructor(private _param: NavParams, private _articleService: ArticleService) {
        super(_param);
        this.initArticle();
    }

    loadArticle(): Promise<any> {
        return this._articleService.getArticle(this._param.data.item.id);
    }

}
