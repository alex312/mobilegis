import { Component, Input } from '@angular/core';

import * as moment from 'moment';

import { ISelectableComponent, Format } from '../../../../base';

import { IAnchorState } from '../../data/anchor-state';

@Component({
    selector: 'anchor-state-card',
    templateUrl: './anchor-state-card.component.html'
})
export class AnchorStateCardComponent implements ISelectableComponent {
    private _viewModule;
    @Input()
    get viewModule(): any {
        return this._viewModule;
    }
    set viewModule(value: any) {
        this._viewModule = value;
    }
    _format = Format;
    constructor() {

    }

    getTimeSpan(item: IAnchorState) {

        let endTime = moment(item.EndTime || new Date());
        let startTime = moment(item.AnchorTime || new Date());

        let hourDiff = endTime.diff(startTime, "hour");

        if (hourDiff > 24)
            return Math.floor(hourDiff / 24) + "天" + hourDiff % 24 + "小时";
        else
            return hourDiff + "小时";
    }

    onClick() {
        console.log("click");
        this._viewModule.viewDetail();
    }
}