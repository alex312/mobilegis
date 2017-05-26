import { Component, OnInit, NgZone } from '@angular/core';
import { AlertController, LoadingController, Loading, NavController } from 'ionic-angular';

import { ApiClientService, ShipUtil, THHJUtil } from '../../../base';

import { SearchResultItem, ShipSearchResultItem, TrafficEnvSearchResultItem } from '../data';

import { MapHolderImp } from '../../map';
import { Config } from '../../../config';

@Component({
    selector: "search-page",
    templateUrl: './search.page.html'
})
export class SearchPage implements OnInit {

    shipFeatures: SearchResultItem[] = [];
    thhjFeatures: SearchResultItem[] = [];
    searchKey: string;
    loading: Loading;
    itemIndex: number;
    switchValue: string = "shipLayer";
    mapHolder = null;

    constructor(private navCtrl: NavController,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private zone: NgZone,
        private apiClient: ApiClientService) {
    }

    onInput(event) {
        this.searchKey = event.target.value.toString();
    }

    goBack() {
        this.navCtrl.pop();
    }

    onSearch() {
        this.showLoading = true;
        this.apiClient.get(`${Config.Plugins.Search.SearchUrl}?key=${this.searchKey}`).then(this.onSearchCompleted.bind(this));
    }
    onSearchCompleted(data) {
        this.zone.run(() => {
            if (data) {
                console.log(data);
                let dict: { [key: string]: any[] } = {};
                data.forEach((item) => {
                    dict[item.Type] = item.Datas;
                })
                this.shipFeatures = this.createFeatures('ship', dict['ship']);
                this.thhjFeatures = this.createFeatures('thhj', dict['thhj']);
            }
            this.showLoading = false;
        })
    }

    onSelectFeature(item: SearchResultItem) {
        this.mapHolder.selectedFeature = {
            feature: item,
            type: this.switchValue
        };
        this.navCtrl.pop();
    }

    ngOnInit() {
        MapHolderImp.createHolder();
        MapHolderImp.holder.then((holder) => {
            this.mapHolder = holder;
        })

    }

    createFeatures(type, data) {
        if (!data)
            return []
        if (type === "ship")
            return data.map((item) => {
                return new ShipSearchResultItem(item);
            });
        if (type == "thhj")
            return data.map((item) => {
                return new TrafficEnvSearchResultItem(item);
                // return new ThhjSearchResultItem(item);
            })
        return [];
    }

    onHaveSelectedObj(haveSelectedObj: boolean) {
        if (haveSelectedObj)
            this.goBack();
        else
            this.doAlert("无法定位物标");
    }

    doAlert(msg: string) {
        let alert = this.alertCtrl.create({
            title: '提示',
            message: msg,
            buttons: ['确认']
        });
        alert.present(alert);
    }

    private _showLoading = false;
    get showLoading() {
        return this._showLoading;
    }
    set showLoading(value) {
        this._showLoading = value;
    }

    shipType(ship) {
        return ShipUtil.GetShipTypeName(ship.type);
    }

    shipTypeColor(ship) {
        return ShipUtil.GetShipTypeColor(ship.type);
    }

    thhjType(thhj) {
        return THHJUtil.GetTypeDiscribByCode(thhj.type);
    }
}