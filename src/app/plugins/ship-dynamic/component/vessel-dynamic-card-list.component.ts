import { Component, Input } from '@angular/core';

import { Format } from '../../../base';

import { VesselDynamic } from '../data/vessel-dynamic';

@Component({
    selector: 'vessel-dynamic-card-list',
    templateUrl: './vessel-dynamic-card-list.component.html'

})
export class VesselDyanmicCardListComponent {
    @Input()
    itemSource: VesselDynamic[];
    _format = Format;
}