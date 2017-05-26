import { Component } from '@angular/core';

import { DetailComponent } from '../detail.component';

@Component({
    selector: 'anchor-state-detail',
    templateUrl: './anchor-state-detail.component.html'
})
export class AnchorStateDetailComponent extends DetailComponent {
    constructor() {
        super();
    }
}