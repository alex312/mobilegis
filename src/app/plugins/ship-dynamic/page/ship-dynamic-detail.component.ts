import { Component, Input, Type } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { isObject } from '../../../base';

@Component({
    selector: 'ship-dynamic-detail-page',
    templateUrl: './ship-dynamic-detail.component.html'
})
export class ShipDynamicDetailPage {
    private _viewModule;
    @Input()
    get viewModule(): any {
        return this._viewModule;
    }
    set viewModule(value: any) {
        this._viewModule = value;
    }

    private _component: Type<any>
    get component(): Type<any> {
        return this._component;
    }
    set component(value: Type<any>) {
        this._component = value;
    }
    constructor(private _navParams: NavParams) {
        if (isObject(_navParams.data)) {
            this.component = _navParams.data.component;
            this.viewModule = _navParams.data.viewModule;
        }
    }
}