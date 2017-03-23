import { Component, Input } from '@angular/core';

import * as moment from 'moment';

import { Format } from '../../../base';

import { AnchorState } from '../data/anchor-state';


@Component({
    selector: 'anchor-state-card-list',
    templateUrl: './anchor-state-card-list.component.html'

})
export class AnchorStateCardListComponent {
    @Input()
    itemSource: AnchorState[];
    _format = Format;

    getTimeSpan(item: AnchorState) {
        let endTime = moment(item.EndTime || new Date());
        let startTime = moment(item.AnchorTime || new Date());

        let hourDiff = endTime.diff(startTime, "hour");

        if (hourDiff > 24)
            return Math.floor(hourDiff / 24) + "天" + hourDiff % 24 + "小时";
        else
            return hourDiff + "小时";
    }
}