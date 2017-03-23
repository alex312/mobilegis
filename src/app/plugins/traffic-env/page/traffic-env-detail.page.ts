import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { TrafficEnvSummary } from '../data/traffic-env-summary';


@Component({
    templateUrl: './traffic-env-detail.page.html',
})
export class TrafficEnvDetailPage implements OnInit {
    title: string = '详细信息';
    thhjSummary: TrafficEnvSummary;
    constructor(private navParams: NavParams) {
    }

    ngOnInit() {
        this.thhjSummary = this.navParams.get('feature');
    }
}