import { Component, ViewChild, Renderer } from '@angular/core';

import { Content } from 'ionic-angular';

import * as moment from 'moment';

import { DynamicDataService, DynamicDataUrlCreater, IQueryParam } from '../service/dynamic-data.service';

import { QueryParamComponent } from '../component/query-param.component';

@Component({
    selector: 'ship-dynamic-page',
    templateUrl: './ship-dynamic.component.html'
})
export class ShipDynamicPage {
    _enableRefresher: boolean = true;
    dynamicType: string = "yqb";
    _dataQueryPromiseDict: { [key: string]: DynamicPageModel };

    constructor(_dataService: DynamicDataService, private _renderer: Renderer) {
        let _urlCreater = new DynamicDataUrlCreater();

        this._dataQueryPromiseDict = {
            "yqb": new DynamicPageModel(_urlCreater.portVisitUrl.bind(_urlCreater), _dataService.getData.bind(_dataService)),
            "sycb": new DynamicPageModel(_urlCreater.vessDynamicUrl.bind(_urlCreater), _dataService.getData.bind(_dataService)),
            "xc": new DynamicPageModel(_urlCreater.rawBoatDynamicUrl.bind(_urlCreater), _dataService.getData.bind(_dataService)),
            "kb": new DynamicPageModel(_urlCreater.berthStateUrl.bind(_urlCreater), _dataService.getData.bind(_dataService)),
            "mb": new DynamicPageModel(_urlCreater.anchorStateUrl.bind(_urlCreater), _dataService.getData.bind(_dataService))
        }

        for (let key in this._dataQueryPromiseDict) {
            this._dataQueryPromiseDict[key].requery().then();
        }
    }

    dynamicTypeChanged(event) {
    }

    get showLoading() {
        return this._dataQueryPromiseDict[this.dynamicType].isLoading === true && this._isDoingRefresh === false;
    }

    private _isDoingRefresh = false;
    doRefresh(event) {
        this._isDoingRefresh = true;
        this._dataQueryPromiseDict[this.dynamicType].requery().then(() => {
            event.complete();
            this._isDoingRefresh = false;
        });
    }

    canInfinite() {
        return this._dataQueryPromiseDict[this.dynamicType].hasMore()
    }

    doInfinite(event) {
        this._isDoingRefresh = true;
        this._dataQueryPromiseDict[this.dynamicType].queryMore().then(() => {
            event.complete();
            this._isDoingRefresh = false;
        });
    }


    @ViewChild(QueryParamComponent)
    _queryParamPanel: QueryParamComponent;
    private _queryParamShowing: boolean = false;
    @ViewChild(Content)
    _content: Content;

    queryParamClick(event) {
        if (this._queryParamShowing) {
            this._queryParamPanel.moveOut();
            this._content.setScrollElementStyle("overflow-y", "auto");
        }
        else {
            this._queryParamPanel.moveIn();
            this._content.setScrollElementStyle("overflow-y", "hidden");

        }
        this._queryParamShowing = !this._queryParamShowing;
        this._enableRefresher = !this._queryParamShowing;
    }

    resetParam() {
        this.queryParamClick(null);
        this._dataQueryPromiseDict[this.dynamicType].requery().then();
    }

    setParam() {
        this.queryParamClick(null);
        this._dataQueryPromiseDict[this.dynamicType].requery().then();
    }
}

class DynamicPageModel {
    itemSource: any[];
    queryParam: IQueryParam;
    totalCount;


    private _urlCreater;
    get url() {
        return this._urlCreater(this.queryParam);
    }

    private _queryFunc;

    constructor(urlCreater, queryFunc) {
        this.itemSource = [];
        this.totalCount = 0
        this.reset();
        this._urlCreater = urlCreater;
        this._queryFunc = queryFunc;
    }

    reset() {
        let startDate = moment(new Date());
        let endDate = moment(new Date()).day(startDate.day() + 1);

        this.queryParam = {
            shipKeyword: "",
            startIndex: 0,
            count: 50,
            shipTypeCode: "",
            start: startDate.format("YYYY-MM-DD"),
            end: endDate.format("YYYY-MM-DD"),
            source: "",
            companyId: ""
        }
    }

    requery() {
        this.itemSource.splice(0, this.itemSource.length);
        this.queryParam.startIndex = 0;
        return this.queryMore();

    }

    queryMore() {
        this.isLoading = true;
        return this._queryFunc(this.url).then(result => {
            this.itemSource.splice(this.itemSource.length, 0, ...result.data);
            this.totalCount = result.total;
            this.queryParam.startIndex += result.data.length;
            this.isLoading = false;
        });

    }

    hasMore() {
        return this.totalCount > this.itemSource.length;
    }

    get isEmpty() {
        return this.isLoading === false && (this.itemSource === undefined || this.itemSource === null || this.itemSource.length === 0);
    }

    private _isLoading: boolean = false;
    get isLoading() {
        return this._isLoading;
    }

    set isLoading(value) {
        this._isLoading = value;
    }
}