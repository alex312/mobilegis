import { IArticleInfor } from '../data/article-info';

export class ArticleListPageModel {
    itemSource: IArticleInfor[] = [];
    category: string;
    index: number = 0;
    total: number;
    private _queryFunc

    constructor(category: string, queryFunc: Function) {
        this.category = category;
        this._queryFunc = queryFunc;
    }

    queryMore() {
        return this._queryFunc(this.category, this.index).then((result) => {
            console.log(result);
            this.itemSource.splice(this.itemSource.length, 0, ...result.items);
            this.index = this.itemSource.length;
            this.total = result.total;
        })
    }

    requery() {
        this.itemSource.splice(0, this.itemSource.length);
        this.index = 0;
        this.total = 0;
        return this.queryMore()
    }

    hasMore() {
        return this.total > this.index;
    }
}