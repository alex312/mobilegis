import { Component, Input } from '@angular/core';

import { Format } from '../../../../base';

import { IVesselDynamic } from '../../data/vessel-dynamic';
import { ICardSelectorInfo } from '../../page/view-module';

@Component({
    selector: 'vessel-dynamic-card-list',
    templateUrl: './vessel-dynamic-card-list.component.html'

})
export class VesselDynamicCardListComponent {
    @Input()
    itemSource: ICardSelectorInfo[];
    _format = Format;
}