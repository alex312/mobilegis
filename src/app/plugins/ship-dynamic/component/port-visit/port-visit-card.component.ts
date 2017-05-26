import { Component, Input } from '@angular/core';

import { Format, ISelectableComponent } from '../../../../base';

@Component({
    selector: "port-visit-card",
    templateUrl: './port-visit-card.component.html'
})
export class PortVisitCardComponent implements ISelectableComponent {
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