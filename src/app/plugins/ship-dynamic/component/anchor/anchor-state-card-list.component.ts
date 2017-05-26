import { Component, Input } from '@angular/core';

import * as moment from 'moment';

import { Format } from '../../../../base';

import { IAnchorState } from '../../data/anchor-state';
import { ICardSelectorInfo } from '../../page/view-module';


@Component({
    selector: 'anchor-state-card-list',
    templateUrl: './anchor-state-card-list.component.html'

})
export class AnchorStateCardListComponent {
    @Input()
    itemSource: ICardSelectorInfo[];
    _format = Format;

    getTimeSpan(item: IAnchorState) {

        let endTime = moment(item.EndTime || new Date());
        let startTime = moment(item.AnchorTime || new Date());

        let hourDiff = endTime.diff(startTime, "hour");

        if (hourDiff > 24)
            return Math.floor(hourDiff / 24) + "天" + hourDiff % 24 + "小时";
        else
            return hourDiff + "小时";

    }
}