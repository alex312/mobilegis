import { Component, Input } from '@angular/core';

import * as moment from 'moment';

import { Format } from '../../../base';

import { BerthState } from '../data/berth-state';

@Component({
    selector: 'berth-state-card-list',
    templateUrl: './berth-state-card-list.component.html'

})
export class BerthStateCardListComponent {
    @Input()
    itemSource: BerthState[]
    _format = Format;

    getTimeSpan(item: BerthState) {
        let endTime = moment(item.EndTime || new Date());
        let startTime = moment(item.BerthTime || new Date());

        let hourDiff = endTime.diff(startTime, "hour");

        if (hourDiff > 24)
            return Math.floor(hourDiff / 24) + "天" + hourDiff % 24 + "小时";
        else
            return hourDiff + "小时";
    }
}