import { Input } from '@angular/core';

import * as moment from 'moment';

import { ISelectableComponent, Format } from '../../../base';

export class DetailComponent implements ISelectableComponent {
    private _viewModule;
    @Input()
    get viewModule(): any {
        return this._viewModule;
    }
    set viewModule(value: any) {
        this._viewModule = value;
    }

    format = Format;

    getTimeSpan(start: Date, end: Date) {

        let endTime = moment(end || new Date());
        let startTime = moment(start || new Date());

        let hourDiff = endTime.diff(startTime, "hour");

        if (hourDiff > 24)
            return Math.floor(hourDiff / 24) + "天" + hourDiff % 24 + "小时";
        else
            return hourDiff + "小时";
    }

    constructor() {
    }
}