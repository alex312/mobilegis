import { Component, ElementRef } from '@angular/core';
import { ArticleService } from '../service/article.service';
import { IArticleInfor } from '../data/article-info';
import { Config } from '../../../config';

export abstract class ArticlePageBase {
    article: IArticleInfor;
    articleContentRef: ElementRef;
    constructor() {
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
        this.loadArticle().then(result => {
            this.article = <IArticleInfor>result;
            let content = this.articleContentRef.nativeElement
            content.innerHTML = this.article.content;
            // 手机中运行时需要访问绝对的图片地址
            let imgs = content.getElementsByTagName("img");
            let baseURI = content.baseURI;
            for (let i = 0; i < imgs.length; i++) {
                if (imgs[i].src.indexOf(baseURI) === 0)
                    imgs[i].src = imgs[i].src.replace(baseURI, Config.proxy);
            }
        });
    }
    abstract loadArticle(): Promise<any>;
}