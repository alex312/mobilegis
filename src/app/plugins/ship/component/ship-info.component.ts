import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { WebGISInteractiveService, Format } from '../../../base';
import { ShipSummary } from '../data/ship-summary';
import { ShipDetailPage } from '../page/ship-detail.page';

@Component({
    selector: 'ship-info',
    templateUrl: './ship-info.component.html'
})
export class ShipInfoComponent {
    @Input()
    Ship: ShipSummary;
    constructor(private _webGISService: WebGISInteractiveService, private _navCtrl: NavController) { }

    Playback(minute: number) {
        let end = Date.now();
        let start = new Date(end - minute * 60 * 1000);
        let endStr: string = Format.FormatDate(end);
        let startStr: string = Format.FormatDate(start);
        console.log(`ship=${this.Ship.mmsi},start=${startStr},end=${endStr}`);
        this._webGISService.callWebGISAction2('shipLayer', 'LoadTrack', startStr, endStr);
    }
    ShowDetail() {
        if (this.Ship)
            this._navCtrl.push(ShipDetailPage, { feature: this.Ship });
    }
}