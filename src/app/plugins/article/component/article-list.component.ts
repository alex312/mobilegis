import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { IArticleInfor } from '../data/article-info';
@Component({
    selector: "article-list",
    templateUrl: "./article-list.component.html"
})
export class ArtileListComponent {

    private _itemSource: IArticleInfor[] = [];
    @Input()
    set itemSource(value) {
        this._itemSource = value;
    }
    get itemSource() {
        return this._itemSource;
    }

    @Input()
    detailPage: any

    private _categoryName: string = "文章";
    @Input()
    set categoryName(value) {
        this._categoryName = value;
    }
    get categoryName() {
        return this._categoryName;
    }

    constructor(private _navCtrl: NavController) {

    }
    openArticle(item) {
        this._navCtrl.push(this.detailPage, { item: item, title: this.categoryName });
    }
}