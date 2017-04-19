import { Component, OnInit, NgZone } from '@angular/core';
import { AlertController, LoadingController, Loading, NavController } from 'ionic-angular';
import { SearchResultItem, ShipSearchResultItem, TrafficEnvSearchResultItem } from '../data';
import { ApiClientService } from '../../../base';
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
        this.loading = this.loadingCtrl.create({
            content: "正在查询...",
            dismissOnPageChange: true
        });
        this.loading.present(this.loading);
        // this.apiClient.get(`${this.searchUrl}?key=${this.searchKey}`).then(this.onSearchCompleted.bind(this));
        this.apiClient.get(`${Config.Plugins.Search.SearchUrl}?key=${this.searchKey}`).then(this.onSearchCompleted.bind(this));
    }
    onSearchCompleted(data) {
        this.loading.dismiss();
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
        })
    }

    onSelectFeature(item: SearchResultItem) {
        // this.webgisInteractive.callWebGISAction("SelectObj", feature.uid);
        this.mapHolder.selectedFeature = {
            feature: item,
            type: this.switchValue
        };
        this.navCtrl.pop();
    }

    ngOnInit() {
        // mapHolder.createHolder();
        MapHolderImp.createHolder();
        MapHolderImp.holder.then((holder) => {
            this.mapHolder = holder;
            // this.holder.tool.map.UpdateSize();
            // setTimeout(this.mapHolder.tool.map.UpdateSize.bind(this.mapHolder.tool.map), 300);
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
}


