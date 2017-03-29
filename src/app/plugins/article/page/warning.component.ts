import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ArticleService } from '../service/article.service';
import { ArticlePageBase } from './article-base.component';

@Component({
    selector: 'warning-page',
    templateUrl: './article.component.html'
})
export class WarningPage extends ArticlePageBase {
    @ViewChild('articleContent')
    articleContentRef: ElementRef;

    constructor(private _param: NavParams, private _articleService: ArticleService) {
        super();
        this.initArticle();
    }

    loadArticle(): Promise<any> {
        return this._articleService.getWarning(this._param.data.id)
    }
}