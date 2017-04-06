import { Component, Input } from '@angular/core';

import { NavController } from 'ionic-angular';

import { IArticleInfor } from '../data/article-info';

@Component({
    selector: "article-card-list",
    templateUrl: "./article-card-list.component.html"
})
export class ArticleCardListComponent {
    @Input()
    itemSource: IArticleInfor[] = [];
    @Input()
    detailPage: any

    constructor(private _navCtrl: NavController) {

    }

    openArticle(item) {
        this._navCtrl.push(this.detailPage, item);
    }

}