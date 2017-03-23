import { Component, Input } from '@angular/core';

@Component({
    selector: 'traffic-env-summary',
    templateUrl: './traffic-env-summary.component.html'
})
export class TrafficEnvSummaryComponent {
    @Input()
    thhj: any;
}