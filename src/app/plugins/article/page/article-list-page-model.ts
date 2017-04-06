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
        this.isLoading = true;
        return this._queryFunc(this.category, this.index).then((result) => {

            // this.isLoading = false;
            this.itemSource.splice(this.itemSource.length, 0, ...result.items);
            this.index = this.itemSource.length;
            this.total = result.total;
            this.isLoading = false;
        }).catch(error => {
            this.isLoading = false;
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

    private _isLoading = false;
    get isLoading() {
        return this._isLoading;
    }
    set isLoading(value) {
        this._isLoading = value;
    }

    get isEmpty() {
        return this.isLoading === false && (this.itemSource === undefined || this.itemSource === null || this.itemSource.length === 0);
    }
}