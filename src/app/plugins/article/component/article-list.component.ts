import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ArticlePageBase } from '../page/article-base.component';
import { IArticleInfor } from '../data/article-info';
@Component({
    selector: "article-list",
    templateUrl: "./article-list.component.html"
})
export class ArtileListComponent {

    private _itemSource: IArticleInfor[] = [];
    @Input()
    set itemSource(value) {
        console.log(value);
        this._itemSource = value;
    }
    get itemSource() {
        return this._itemSource;
    }

    @Input()
    detailPage: any

    constructor(private _navCtrl: NavController) {

    }
    openArticle(item) {
        this._navCtrl.push(this.detailPage, item);
    }
}