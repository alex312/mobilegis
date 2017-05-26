import { Component } from '@angular/core';

import { DetailComponent } from '../detail.component';

@Component({
    selector: 'port-visit-detail',
    templateUrl: './port-visit-detail.component.html'
})
export class PortVisitDetailComponent extends DetailComponent {
    constructor() {
        super();
    }
}