import { Component, OnDestroy, NgZone, Renderer } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Feature, FeatureType } from '../data/feature';
import { SearchPage } from '../../search';
import { MapHolderImp } from '../service/map-holder';

@Component({
    templateUrl: './map.page.html',
})
export class MapPage implements OnDestroy {

    selectedFeature: Feature;
    FeatureType = FeatureType;

    holder;
    get showLoading() {
        return !this.holder || this.holder.isLoading();
    }

    constructor(private navCtrl: NavController,
        private navParams: NavParams,
        private zone: NgZone,
        private _renderer: Renderer) {
        this.selectedFeature = null;
        MapHolderImp.createHolder();
        MapHolderImp.holder.then((holder) => {
            this.holder = holder;
            this.holder.shipLayerReady().then(() => {
                if (this.navParams.data === null || this.navParams.data === undefined)
                    return;
                let uid = this.navParams.data.selectedUid;
                let type = this.navParams.data.type;
                this.selectFeature(type, uid)
            });

        });
        MapHolderImp.registSelectFeatureAction("mapPage", this.onSelectedObject.bind(this));

    }

    onStartSearch() {
        this.holder.selectedFeature = null;
        if (this.selectedFeature !== null && this.selectedFeature !== undefined) {
            let fun = this.holder.tool[this.selectedFeature.layerType];
            if (fun)
                fun.SetFocus("");
        }
        this.selectedFeature = null;

        this.navCtrl.push(SearchPage)
    }

    ngOnDestroy() {
        this.holder.selectedFeature = null;
        if (this.selectedFeature !== null && this.selectedFeature !== undefined) {
            let fun = this.holder.tool[this.selectedFeature.layerType];
            if (fun)
                fun.SetFocus("");
        }
        this.selectedFeature = null;
    }

    onSelectedObject(env: any, selectObject) {
        console.log(selectObject);
        this.zone.run(() => {
            this.holder.selectedFeature = null;
            if (selectObject && selectObject.data) {
                this.selectedFeature = new Feature(selectObject.type, selectObject.data);
                let fun = this.holder.tool[selectObject.type];
                if (fun) {
                    if (this.selectedFeature.type === FeatureType.Ship)
                        fun.SetFocusIsFully(this.selectedFeature.id, false);
                }
            }
            else {
                this.hideSummaryPanel();
            }
        });
    }

    hideSummaryPanel() {
        this.selectedFeature = null;
    }

    ngAfterViewInit() {
    }

    _canNotFocuseShip = "none";
    get canNotFocuseShip() {
        return this._canNotFocuseShip;
    }
    set canNotFocuseShip(value) {
        this._canNotFocuseShip = value;
    }
    ionViewDidEnter() {
        if (this.holder && this.holder.tool && this.holder.tool.map)
            this.holder.tool.map.UpdateSize();
        if (this.holder && this.holder.selectedFeature) {
            this.selectFeature(this.holder.selectedFeature.type, this.holder.selectedFeature.feature.uid)
        }
    }

    selectFeature(featureType: string, uid: string) {
        let fun = this.holder.tool[featureType];
        if (fun) {
            Promise.resolve(fun.SetFocus(uid)).catch(() => {
                this.holder.selectedFeature = null;
                this.selectedFeature = null;
                this.canNotFocuseShip = "block";
                setTimeout(() => {
                    this.canNotFocuseShip = "none";
                }, 3000);
            });
        }
    }
}