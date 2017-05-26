import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import * as moment from 'moment';

import { isBlankString, isPresent, DateUtil } from '../../../base';

import { DynamicDataService } from '../service/dynamic-data.service';
import { IQueryParam, UrlFactorys, createQueryParam } from '../service/url-factory';

import { ShipDynamicDetailPage } from './ship-dynamic-detail.component';

import { ICardSelectorInfo, CardSelectorFactorys } from './view-module';


@Component({
    selector: 'ship-dynamic-search-page',
    templateUrl: './ship-dynamic-search.component.html'
})
export class ShipDynamicSearchPage {
    searchKey: string;
    searchResult = [];

    private _showLoading: boolean;
    get showLoading(): boolean {
        return this._showLoading;
    }
    set showLoading(value: boolean) {
        this._showLoading = value;
    }

    constructor(private _navParams: NavParams,
        private _navCtrl: NavController,
        private _dataServer: DynamicDataService) {
        this.searchKey = _navParams.data;
    }


    ionViewDidLoad() {
        this.onSearch();
    }

    onSearch() {
        if (!isBlankString(this.searchKey)) {
            this.doSearch(this.searchKey);
        }
    }

    private doSearch(key) {
        this.showLoading = true;
        // let creater = new DynamicDataUrlCreater();
        let now = moment(Date.now());
        let param: IQueryParam = createQueryParam();
        param.shipKeyword = key;
        param.count = 50;
        param.start = now.format("YYYY-MM-DD");
        param.end = now.add(7, "day").format("YYYY-MM-DD");

        let anchorPromise = this._dataServer.getData(param, UrlFactorys.Anchor).then(result => {
            return result.data
                .map(item => CardSelectorFactorys.Anchor.createSelector(item))
        });

        let berthPromise = this._dataServer.getData(param, UrlFactorys.Berth).then(result => {
            return result.data
                .map(item => CardSelectorFactorys.Berth.createSelector(item))
        });

        let portVisitPromise = this._dataServer.getData(param, UrlFactorys.PortVisit).then(result => {
            return result.data
                .map(item => CardSelectorFactorys.PortVisit.createSelector(item))
        });

        let rawBostDynamicPromise = this._dataServer.getData(param, (UrlFactorys.RawBoatDyanmic)).then(result => {
            return result.data
                .map(item => CardSelectorFactorys.RawBoatDynamic.createSelector(item))
        });

        let vesselDyanmicPromise = this._dataServer.getData(param, (UrlFactorys.VesselDynamic)).then(result => {
            return result.data
                .map(item => CardSelectorFactorys.VesselDynamic.createSelector(item))
        })


        Promise.all([anchorPromise, berthPromise, portVisitPromise, rawBostDynamicPromise, vesselDyanmicPromise]).then(resultList => {
            this.searchResult.splice(
                0,
                this.searchResult.length,
                ...[]
                    .concat(...resultList)
                    .filter((item: ICardSelectorInfo) => isPresent(item) && isPresent(item.card))
                    .sort((a: ICardSelectorInfo, b: ICardSelectorInfo) => DateUtil.complare(b.sortItem, a.sortItem))
                    .map((item: ICardSelectorInfo) => {
                        item.cardViewModule.viewDetail = () => {
                            this.viewDetail(item);
                        }
                        return item;
                    })
            );
            this.showLoading = false;
        })
    }

    viewDetail(info: ICardSelectorInfo) {
        if (isPresent(info) && isPresent(info.detail) && isPresent(info.cardViewModule))
            this._navCtrl.push(ShipDynamicDetailPage, { component: info.detail, viewModule: info.cardViewModule });
    }
}

