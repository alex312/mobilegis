import { Component, Input } from '@angular/core';

import * as moment from 'moment';

import { ISelectableComponent, Format } from '../../../../base';

import { IBerthState } from '../../data/berth-state';

@Component({
    selector: 'berth-state-card',
    templateUrl: './berth-state-card.component.html'
})
export class BerthStateCardComponent implements ISelectableComponent {
    private _viewModule;
    @Input()
    get viewModule(): any {
        return this._viewModule;
    }
    set viewModule(value: any) {
        this._viewModule = value;
    }
    _format = Format;

    onClick() {
        this.viewModule.viewDetail();
    }
    getTimeSpan(item: IBerthState) {
        let endTime = moment(item.EndTime || new Date());
        let startTime = moment(item.BerthTime || new Date());

        let hourDiff = endTime.diff(startTime, "hour");

        if (hourDiff > 24)
            return Math.floor(hourDiff / 24) + "天" + hourDiff % 24 + "小时";
        else
            return hourDiff + "小时";
    }

}