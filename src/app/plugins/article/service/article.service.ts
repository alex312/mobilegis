import { Injectable } from '@angular/core';
import { ApiClientService } from '../../../base';

import { IArticleInfor } from '../data/article-info';

@Injectable()
export class ArticleService {
    constructor(private _apiClient: ApiClientService) {


    }

    private _articleUrl = "api/articles/items"
    getArticleList(category: string, index: number) {
        return this._apiClient.get(this._articleUrl + "?cat=" + category + "&index=" + index + "&count=30").then(result => {
            return {
                total: result.total,
                items: result.items.map(item => {
                    return <IArticleInfor>{
                        id: item._id,
                        author: item.author,
                        title: item.title,
                        category: item.category,
                        date: new Date(item.date),
                        publish_date: new Date(item.publish_date)
                    }
                })
            }
        })
    }

    getArticle(articleId: string) {
        return this._apiClient.get(this._articleUrl + "/" + articleId).then(result => {
            return <IArticleInfor>{
                id: result._id,
                author: result.author,
                title: result.title,
                category: result.category,
                date: new Date(result.date),
                publish_date: new Date(result.publish_date),
                content: result.content,
                creator: result.creator
            }
        })
    }

    private _warningUrl = "api/warnings";
    getWarningList(category: string, index: number) {
        return this._apiClient.get("api/warnings?count=25&startIndex=" + index + "&type=" + category.toUpperCase()).then(result => {
            return {
                total: result.total,
                items: result.data.map(item => {
                    return <IArticleInfor>{
                        id: item.key,
                        date: isNaN(parseInt(item.date)) ? null : new Date(parseInt(item.date)),
                        category: item.type,
                        title: item.title,
                        publish_date: isNaN(parseInt(item.date)) ? null : new Date(parseInt(item.date))
                    }
                })
            }
        })
    }

    getWarning(id) {
        return this._apiClient.get(this._warningUrl + "/" + id).then(result => {
            return <IArticleInfor>{
                id: result._id,
                author: result.unit,
                title: result.title,
                date: isNaN(parseInt(result.date)) ? null : new Date(parseInt(result.date)),
                publish_date: isNaN(parseInt(result.date)) ? null : new Date(parseInt(result.date)),
                content: result.content,
                creator: result.unit,
                category: ""
            }
        });
    }

    getElegant() {
        return this._apiClient.get("api/elegant");
    }
}