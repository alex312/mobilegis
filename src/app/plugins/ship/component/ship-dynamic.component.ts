import { Component, OnInit, Input } from '@angular/core';
import { ShipSummary } from '../data/ship-summary';

@Component({
    selector: 'ship-dynamic',
    templateUrl: './ship-dynamic.component.html',
})
export class ShipDynamicComponent implements OnInit {
    @Input()
    ship: ShipSummary;
    constructor() {
    }

    ngOnInit() {

    }
}