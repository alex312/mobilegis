import { Component, Input } from '@angular/core';

import { Format } from '../../../base';

import { PortVisit } from '../data/port-visit';
@Component({
    selector: "port-visit-card-list",
    templateUrl: './port-visit-card-list.component.html'
})
export class PortVisitCardListComponent {
    @Input()
    itemSource: PortVisit[];
    _format = Format;
}