import { Component, Input } from '@angular/core';

import { ShipSummary } from '../data/ship-summary';
import { WebGISInteractiveService, Format } from '../../../base';

@Component({
    selector: 'ship-summary',
    templateUrl: './ship-summary.component.html'
})
export class ShipSummaryComponent {
    @Input()
    ship: ShipSummary;
    constructor(private _webGISService: WebGISInteractiveService) {
    }

    Playback(minute: number) {
        let end = Date.now();
        let start = new Date(end - minute * 60 * 1000);
        let endStr: string = Format.FormatDate(end);
        let startStr: string = Format.FormatDate(start);
        console.log(`ship=${this.ship.mmsi},start=${startStr},end=${endStr}`);
        this._webGISService.callWebGISAction2('shipLayer', 'LoadTrack', startStr, endStr);
    }
}