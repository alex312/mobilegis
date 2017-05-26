import { Component, ViewChild, Renderer } from '@angular/core';

import { Content, NavController } from 'ionic-angular';

import * as moment from 'moment';

import { isPresent, isFunction, DateUtil } from '../../../base';



import { DynamicDataService } from '../service/dynamic-data.service';
import { IQueryParam, createQueryParam, IUrlFactory, UrlFactorys } from '../service/url-factory';

import { QueryParamComponent } from '../component/condition/query-param.component';

import { ICardSelectorFactory, ICardSelectorInfo, CardSelectorFactorys } from './view-module';
import { ShipDynamicDetailPage } from './ship-dynamic-detail.component';

@Component({
    selector: 'ship-dynamic-page',
    templateUrl: './ship-dynamic.component.html'
})

export class ShipDynamicPage {
    _enableRefresher: boolean = true;
    dynamicType: string = "yqb";
    _dataQueryPromiseDict: { [key: string]: DynamicPageModel };

    constructor(
        _dataService: DynamicDataService,
        private _renderer: Renderer,
        private _navCtrl: NavController
    ) {
        let getDataFunc = _dataService.getData.bind(_dataService);
        this._dataQueryPromiseDict = {
            "yqb": new DynamicPageModel(getDataFunc, CardSelectorFactorys.PortVisit, UrlFactorys.PortVisit),
            "sycb": new DynamicPageModel(getDataFunc, CardSelectorFactorys.VesselDynamic, UrlFactorys.VesselDynamic),
            "xc": new DynamicPageModel(getDataFunc, CardSelectorFactorys.RawBoatDynamic, UrlFactorys.RawBoatDyanmic),
            "kb": new DynamicPageModel(getDataFunc, CardSelectorFactorys.Berth, UrlFactorys.Berth),
            "mb": new DynamicPageModel(getDataFunc, CardSelectorFactorys.Anchor, UrlFactorys.Anchor)
        }

        for (let key in this._dataQueryPromiseDict) {
            // this._dataQueryPromiseDict[this.dynamicType].requery().then(this.setViewDetailAction.bind(this));
            this.query(this._dataQueryPromiseDict[key], true, true).then(() => this.completeLoading(null));
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
        this.query(this._dataQueryPromiseDict[this.dynamicType], false, true).then(() => this.completeLoading(event));
    }
    canInfinite() {
        return this._dataQueryPromiseDict[this.dynamicType].hasMore()
    }
    doInfinite(event) {
        this._isDoingRefresh = true;
        this.query(this._dataQueryPromiseDict[this.dynamicType], false, false).then(() => this.completeLoading(event));
    }

    private completeLoading(event) {
        if (isPresent(event) && isPresent(event.complete) && isFunction(event.complete))
            event.complete()
        this._isDoingRefresh = false;
    }


    @ViewChild(QueryParamComponent)
    _queryParamPanel: QueryParamComponent;
    private _queryParamShowing: boolean = false;
    @ViewChild(Content)
    _content: Content;

    showOrHideConditionPanel(event) {
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
        this.showOrHideConditionPanel(null);
        // this._dataQueryPromiseDict[this.dynamicType].resetParam();
        // this._dataQueryPromiseDict[this.dynamicType].requery().then(this.setViewDetailAction.bind(this));
        this.query(this._dataQueryPromiseDict[this.dynamicType], true, true).then();
    }

    setParam() {
        this.showOrHideConditionPanel(null);
        this.query(this._dataQueryPromiseDict[this.dynamicType], false, true).then();
    }

    private viewDetail(info: ICardSelectorInfo) {
        if (isPresent(info) && isPresent(info.detail) && isPresent(info.cardViewModule))
            this._navCtrl.push(ShipDynamicDetailPage, { component: info.detail, viewModule: info.cardViewModule });
    }

    query(pageModule: DynamicPageModel, isResetParam: boolean, isRequery: boolean) {
        if (isResetParam === true)
            pageModule.resetParam();
        if (isRequery === true)
            pageModule.clear();

        return pageModule.queryMore().then(() => this.setViewDetailAction(pageModule));
    }


    private setViewDetailAction(pageModel: DynamicPageModel) {
        pageModel.itemSource.forEach((item: ICardSelectorInfo) => {
            item.cardViewModule.viewDetail = item.cardViewModule.viewDetail || (() => this.viewDetail(item));
        })
    }
}

class DynamicPageModel {
    itemSource: any[];
    queryParam: IQueryParam;


    totalCount;


    private _cardSelectorFactory: ICardSelectorFactory;
    private _urlFactory: IUrlFactory;
    private _queryFunc: (IQueryParam, IUrlFactory) => Promise<any>;

    constructor(queryFunc: (IQueryParam, IUrlFactory) => Promise<any>, cardSelectorFactory: ICardSelectorFactory, urlFactory: IUrlFactory) {
        this.itemSource = [];
        this.totalCount = 0
        this.resetParam();
        this._cardSelectorFactory = cardSelectorFactory;
        this._urlFactory = urlFactory;
        this._queryFunc = queryFunc;
    }

    resetParam() {
        let startDate = moment(new Date());
        let endDate = moment(new Date()).day(startDate.day() + 1);

        this.queryParam = createQueryParam();
        this.queryParam.count = 50;
        this.queryParam.start = startDate.format("YYYY-MM-DD");
        this.queryParam.end = endDate.format("YYYY-MM-DD");
    }

    // requery(): Promise<any> {
    //     return this.queryMore();
    // }

    clear() {
        this.itemSource.splice(0, this.itemSource.length);
        this.queryParam.startIndex = 0;
    }

    queryMore(): Promise<any> {
        this.isLoading = true;
        return this._queryFunc(this.queryParam, this._urlFactory).then(result => {
            this.itemSource.splice(
                this.itemSource.length,
                0,
                ...result.data.map(item => this._cardSelectorFactory.createSelector(item)))
                .filter((item: ICardSelectorInfo) => isPresent(item) && isPresent(item.card))
                .sort((a: ICardSelectorInfo, b: ICardSelectorInfo) => DateUtil.complare(b.sortItem, a.sortItem));
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