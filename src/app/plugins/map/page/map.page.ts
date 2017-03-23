import { Component, OnDestroy, NgZone } from '@angular/core';

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

    constructor(private navCtrl: NavController,
        private navParams: NavParams,
        private zone: NgZone) {
        // this.webgisInteractive.registCallback("SelectObj", this.onSelectedObject.bind(this));
        MapHolderImp.createHolder();
        MapHolderImp.holder.then((holder) => {
            this.holder = holder;
            let selectedUid = this.navParams.get('selectedUid');
            this.selectedObject(selectedUid);
        });
        MapHolderImp.registSelectFeatureAction("mapPage", this.onSelectedObject.bind(this));

    }

    private selectedObject(selectedUid: string) {
        if (selectedUid) {
            let index: number = selectedUid.indexOf(':');
            if (index !== -1) {
                let layer: string = selectedUid.substring(0, index);
                let uid: string = selectedUid.substring(index + 1);
                let fun = this.holder.tool[layer];
                if (fun) {
                    fun.SetFocus(uid);
                }
            }
        }
    }

    onStartSearch() {
        this.navCtrl.push(SearchPage)
    }

    ngOnDestroy() {
        // this.webgisInteractive.unregistCallback("SelectObj", this.onSelectedObject.bind(this));
    }

    onSelectedObject(env: any, selectObject) {
        this.zone.run(() => {
            console.log();
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
            setTimeout(() => { this.holder.tool.map.UpdateSize(); }, 300);
        });
    }

    hideSummaryPanel() {
        this.selectedFeature = null;
    }


    // showDetail(featureSummary) {
    //     let page = null;
    //     if (featureSummary.type === FeatureType.Ship)
    //         page = ShipDetailPage;
    //     if (featureSummary.type === FeatureType.TrafficEnv)
    //         page = TrafficEnvDetailPage;
    //     if (page)
    //         this.navCtrl.push(page, { feature: featureSummary.summary });
    // }
}