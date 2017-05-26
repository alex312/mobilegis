import { Component } from '@angular/core';

import { DetailComponent } from '../detail.component';

@Component({
    selector: 'berth-state-detail',
    templateUrl: './berth-state-detail.component.html'
})
export class BerthStateDetailComponent extends DetailComponent {
    constructor() {
        super();
    }
}