import { Component, OnDestroy, NgZone, ElementRef, ViewChild, OnInit, AfterViewInit, Renderer } from '@angular/core';

import { NavController, NavParams, Content } from 'ionic-angular';

import { Feature, FeatureType } from '../data/feature';
import { SearchPage } from '../../search';
import { MapHolderImp } from '../service/map-holder';
import { SeecoolGISComponent } from '../component/seecool-gis.component';

@Component({
    templateUrl: './map.page.html',
})
export class MapPage implements OnInit, OnDestroy {

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
        MapHolderImp.createHolder();
        MapHolderImp.holder.then((holder) => {
            this.holder = holder;
            let selectedUid = this.navParams.get('selectedUid');
        });
        MapHolderImp.registSelectFeatureAction("mapPage", this.onSelectedObject.bind(this));

    }

    // private selectedObject(selectedUid: string) {
    //     if (selectedUid) {
    //         let index: number = selectedUid.indexOf(':');
    //         if (index !== -1) {
    //             let layer: string = selectedUid.substring(0, index);
    //             let uid: string = selectedUid.substring(index + 1);
    //             let fun = this.holder.tool[layer];
    //             if (fun) {
    //                 Promise.resolve(fun.SetFocus(uid)).then();
    //             }
    //         }
    //     }
    // }

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
        // this.webgisInteractive.unregistCallback("SelectObj", this.onSelectedObject.bind(this));
        this.holder.selectedFeature = null;
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


    @ViewChild(Content)
    private _content: Content;
    @ViewChild(SeecoolGISComponent)
    private _map: SeecoolGISComponent;
    ngOnInit() {

    }

    ngAfterViewInit() {
    }

    ionViewDidEnter() {
        if (this.holder && this.holder.selectedFeature) {
            this.holder.tool.map.UpdateSize();
            let fun = this.holder.tool[this.holder.selectedFeature.type];
            if (fun) {
                Promise.resolve(fun.SetFocusIsFully(this.holder.selectedFeature.feature.uid)).catch(() => {
                    this.holder.selectedFeature = null;
                    this.selectedFeature = null;
                });
            }
        }
    }
}