import { Component, OnInit } from '@angular/core';
import { NavParams, Platform } from 'ionic-angular';

import { ShipSummary } from '../data/ship-summary';
// import {QDHShipInfoComponent} from '../../qdh';

@Component({
    templateUrl: './ship-detail.page.html',
})
export class ShipDetailPage implements OnInit {
    title: string = '详细信息';
    pet: string = "dynamic";
    isAndorid: boolean;
    shipDynamic: ShipSummary;
    constructor(private navParams: NavParams,
        platform: Platform) {
        this.isAndorid = platform.is("android");
    }

    ngOnInit() {
        this.shipDynamic = this.navParams.get('feature');
    }
}