import { Component, Input } from '@angular/core';

import { Format, ISelectableComponent } from '../../../../base';


@Component({
    selector: 'vessel-dynamic-card',
    templateUrl: './vessel-dynamic-card.component.html'

})
export class VesselDynamicCardComponent implements ISelectableComponent {
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
}