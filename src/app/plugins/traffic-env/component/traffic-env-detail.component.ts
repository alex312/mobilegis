import { Component, OnInit, Input } from '@angular/core';
import { TrafficEnvSummary } from '../data/traffic-env-summary'

@Component({
    selector: 'traffic-env-detail',
    templateUrl: './traffic-env-detail.component.html',
})
export class TrafficEnvDetailComponent implements OnInit {
    @Input()
    thhj: TrafficEnvSummary;
    constructor() {
    }

    ngOnInit() {
        console.log(this.thhj);
    }
}