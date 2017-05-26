import { Component, Input } from '@angular/core';

import { Format } from '../../../../base';

import { IPortVisit } from '../../data/port-visit';
import { ICardSelectorInfo } from '../../page/view-module';

@Component({
    selector: "port-visit-card-list",
    templateUrl: './port-visit-card-list.component.html'
})
export class PortVisitCardListComponent {
    @Input()
    itemSource: ICardSelectorInfo[];
    _format = Format;
}