import { Component, Input } from '@angular/core';

import { ShipUtil } from '../../util/ship.util';

@Component({
    selector: 'ship-type',
    template: ` <ion-icon item-left name="boat" item-left mode="md" isActive="false" style.color={{shipTypeColor}} style="font-size:inherit"></ion-icon>`,
})
export class ShipTypeComponent {
    private _shipType: string;
    @Input()
    get shipType() {
        return this._shipType;
    }
    set shipType(value: string) {
        this._shipType = value;
    }

    get shipTypeColor() {
        return ShipUtil.GetShipTypeColor(this.shipType);
    }
}