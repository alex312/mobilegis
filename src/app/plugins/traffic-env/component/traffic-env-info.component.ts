import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TrafficEnvSummary } from '../data/traffic-env-summary';
import { TrafficEnvDetailPage } from '../page/traffic-env-detail.page';

@Component({
    selector: 'traffic-env-info',
    templateUrl: './traffic-env-info.component.html'
})
export class TrafficEnvInfoComponent {
    @Input()
    TrafficEnv: TrafficEnvSummary;
    constructor(private _navCtrl: NavController) { }
    ShowDetail() {
        if (this.TrafficEnv)
            this._navCtrl.push(TrafficEnvDetailPage, { feature: this.TrafficEnv });
    }
}