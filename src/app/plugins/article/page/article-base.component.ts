import { ElementRef } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { Format } from '../../../base';
import { IArticleInfor } from '../data/article-info';
import { Config } from '../../../config';

export abstract class ArticlePageBase {
    title: string;
    article: IArticleInfor;
    articleContentRef: ElementRef;
    constructor(private _navParams: NavParams) {
        this.title = _navParams.data.title;
        this.article = {
            id: "",
            title: "",
            date: null,
            publish_date: null,
            author: "",
            category: ""
        };
    }

    initArticle() {
        this.isLoading = true;
        this.loadArticle().then(result => {
            this.article = <IArticleInfor>result;
            let content = this.articleContentRef.nativeElement
            content.innerHTML = this.article.content;
            // 手机中运行时需要访问绝对的图片地址
            let imgs = content.getElementsByTagName("img");
            let baseURI = content.baseURI;
            for (let i = 0; i < imgs.length; i++) {
                imgs[i].src = imgs[i].src.replace("file:///", Config.proxy);
            }
            this.isLoading = false;
        });
    }

    private _isLoading = false;
    get isLoading() {
        return this._isLoading;
    }
    set isLoading(value) {
        this._isLoading = value;
    }

    getDateString(date: Date) {
        return Format.FormatDate(date);
    }

    abstract loadArticle(): Promise<any>;
}