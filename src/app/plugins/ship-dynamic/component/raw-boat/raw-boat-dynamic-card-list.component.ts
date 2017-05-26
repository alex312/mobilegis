import { Component, Input } from '@angular/core';

import { Format } from '../../../../base';

import { IRawBoatDynamic } from '../../data/raw-boat-dynamic';
import { ICardSelectorInfo } from '../../page/view-module';

@Component({
    selector: "raw-boat-dynamic-card-list",
    templateUrl: './raw-boat-dynamic-card-list.component.html'
})
export class RawBoatDynamicCardListComponent {
    @Input()
    itemSource: ICardSelectorInfo[];
    _format = Format;
}