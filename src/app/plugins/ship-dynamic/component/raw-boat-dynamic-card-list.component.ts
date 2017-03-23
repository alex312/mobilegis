import { Component, Input } from '@angular/core';

import { Format } from '../../../base';

import { RawBoatDynamic } from '../data/raw-boat-dynamic';

@Component({
    selector: "raw-boat-dynamic-card-list",
    templateUrl: './raw-boat-dynamic-card-list.component.html'
})
export class RawBoatDynamicCardListComponent {
    @Input()
    itemSource: RawBoatDynamic[];
    _format = Format;
}