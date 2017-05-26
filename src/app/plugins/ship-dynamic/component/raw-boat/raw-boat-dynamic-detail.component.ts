import { Component } from '@angular/core';

import { DetailComponent } from '../detail.component';

@Component({
    selector: 'raw-boat-dynamic-detail',
    templateUrl: './raw-boat-dynamic-detail.component.html'
})
export class RawBoatDynamicDetailComponent extends DetailComponent {
    constructor() {
        super();
    }
}