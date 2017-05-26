import { Component, Input } from '@angular/core';

import { Format, ISelectableComponent } from '../../../../base';

@Component({
    selector: "raw-boat-dynamic-card",
    templateUrl: './raw-boat-dynamic-card.component.html'
})
export class RawBoatDynamicCardComponent implements ISelectableComponent {
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